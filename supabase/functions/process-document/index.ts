
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { documentId } = await req.json();
    
    if (!documentId) {
      throw new Error('Document ID is required');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openaiKey = Deno.env.get('OPENAI_API_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Processing document:', documentId);

    // Get document details
    const { data: document, error: docError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single();

    if (docError || !document) {
      throw new Error('Document not found');
    }

    console.log('Document found:', document.title, 'File path:', document.file_url);

    // Get file from storage - fix the file path issue
    const { data: fileData, error: fileError } = await supabase.storage
      .from('documents')
      .download(document.file_url);

    if (fileError || !fileData) {
      console.error('Storage download error:', fileError);
      throw new Error(`Failed to download file: ${fileError?.message || 'Unknown error'}`);
    }

    // Convert file to base64 for OpenAI
    const buffer = await fileData.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
    const mimeType = document.file_type;

    console.log('File converted to base64, size:', buffer.byteLength);

    // Call OpenAI Vision API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analyze this ${document.category} document from ${document.vendor} and extract financial information. Return a JSON object with these fields:
                - amount: number (total amount or bill amount)
                - due_date: string (YYYY-MM-DD format, if any)
                - transaction_date: string (YYYY-MM-DD format, if any)
                - description: string (brief description of the document/transaction)
                - account_number: string (if visible, last 4 digits only)
                - raw_text: string (key text content from the document)
                - confidence_score: number (0-1, how confident you are in the extraction)

                If this is a bill or invoice, prioritize finding the due date and amount. If it's a bank statement, extract transaction details. Return only valid JSON.`
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:${mimeType};base64,${base64}`
                }
              }
            ]
          }
        ],
        max_tokens: 1000,
        temperature: 0.1
      }),
    });

    const openaiData = await openaiResponse.json();
    
    if (!openaiData.choices || !openaiData.choices[0]) {
      throw new Error('No response from OpenAI');
    }

    console.log('OpenAI response received');

    let extractedData;
    try {
      const content = openaiData.choices[0].message.content;
      // Try to parse JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        extractedData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      // Create a basic extracted data object
      extractedData = {
        raw_text: openaiData.choices[0].message.content,
        confidence_score: 0.5,
        description: `${document.category} from ${document.vendor}`
      };
    }

    console.log('Extracted data:', extractedData);

    // Save extracted data to database
    const { error: extractError } = await supabase
      .from('extracted_data')
      .insert({
        document_id: documentId,
        amount: extractedData.amount || null,
        due_date: extractedData.due_date || null,
        transaction_date: extractedData.transaction_date || null,
        description: extractedData.description || null,
        account_number: extractedData.account_number || null,
        raw_text: extractedData.raw_text || null,
        confidence_score: extractedData.confidence_score || 0.5
      });

    if (extractError) {
      console.error('Error saving extracted data:', extractError);
      throw extractError;
    }

    // Create payment reminder if due date is found
    if (extractedData.due_date && extractedData.amount && document.user_id) {
      const { error: reminderError } = await supabase
        .from('payment_reminders')
        .insert({
          user_id: document.user_id,
          document_id: documentId,
          title: `${document.vendor} - ${document.category}`,
          amount: extractedData.amount,
          due_date: extractedData.due_date,
          category: document.category,
          vendor: document.vendor
        });

      if (reminderError) {
        console.error('Error creating payment reminder:', reminderError);
      } else {
        console.log('Payment reminder created for due date:', extractedData.due_date);
      }
    }

    // Mark document as processed
    const { error: updateError } = await supabase
      .from('documents')
      .update({ processed: true })
      .eq('id', documentId);

    if (updateError) {
      console.error('Error updating document status:', updateError);
    }

    console.log('Document processing completed successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        extractedData,
        message: 'Document processed successfully' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing document:', error);
    
    // Try to mark document as processed with error
    try {
      const { documentId } = await req.json();
      if (documentId) {
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        await supabase
          .from('documents')
          .update({ 
            processed: true,
            processing_error: error.message 
          })
          .eq('id', documentId);
      }
    } catch (updateError) {
      console.error('Failed to update document with error:', updateError);
    }
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
