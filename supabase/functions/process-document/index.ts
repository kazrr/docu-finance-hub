import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper to convert Blob to base64 (for OCR.space API)
async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = (reader.result as string).split(',')[1];
      resolve(base64data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// Helper to extract fields from OCR text
function extractFieldsFromText(text: string) {
  // Simple regex-based extraction (customize as needed)
  const amountMatch = text.match(/\$([0-9,.]+)/) || text.match(/Amount[:\s]*([0-9,.]+)/i);
  const dueDateMatch = text.match(/Due Date[:\s]*([0-9\/-]+)/i);
  const transactionDateMatch = text.match(/Date[:\s]*([0-9\/-]+)/i);
  const accountNumberMatch = text.match(/Account(?: Number)?[:\s]*([0-9*]+)/i);
  return {
    amount: amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : null,
    due_date: dueDateMatch ? dueDateMatch[1] : null,
    transaction_date: transactionDateMatch ? transactionDateMatch[1] : null,
    description: text.slice(0, 100), // First 100 chars as description
    account_number: accountNumberMatch ? accountNumberMatch[1] : null,
    raw_text: text,
    confidence_score: 0.8 // Assume higher confidence for real OCR
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  
  const supabase = createClient(supabaseUrl, supabaseKey);

  let documentId: string | null = null;

  try {
    const requestBody = await req.json();
    documentId = requestBody.documentId;
    
    if (!documentId) {
      throw new Error('Document ID is required');
    }

    console.log('Processing document:', documentId);

    // Get document details
    const { data: document, error: docError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single();

    if (docError || !document) {
      throw new Error(`Document not found: ${docError?.message || 'Unknown error'}`);
    }

    console.log('Document found:', document.title, 'File path:', document.file_url);

    if (!document.file_url) {
      throw new Error('Document file URL is missing');
    }

    // Get file from storage
    const { data: fileData, error: fileError } = await supabase.storage
      .from('documents')
      .download(document.file_url);

    if (fileError || !fileData) {
      console.error('Storage download error:', fileError);
      throw new Error(`Failed to download file from storage: ${fileError?.message || 'File not found'}`);
    }

    console.log('File downloaded successfully, size:', fileData.size, 'type:', document.file_type);

    // --- Real OCR Implementation ---
    // Convert fileData (Blob) to base64
    const base64File = await blobToBase64(fileData);
    const ocrApiKey = Deno.env.get('OCR_SPACE_API_KEY');
    if (!ocrApiKey) throw new Error('OCR_SPACE_API_KEY is not set in environment');

    // Send to OCR.space API
    const ocrRes = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      headers: {
        'apikey': ocrApiKey,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        base64Image: `data:${document.file_type};base64,${base64File}`,
        isTable: 'false',
        OCREngine: '2',
        language: 'eng',
      }),
    });
    const ocrJson = await ocrRes.json();
    if (!ocrJson.ParsedResults || !ocrJson.ParsedResults[0]) {
      throw new Error('OCR failed: No parsed results');
    }
    const ocrText = ocrJson.ParsedResults[0].ParsedText;
    console.log('OCR text:', ocrText);

    // Extract fields from OCR text
    const extractedData = extractFieldsFromText(ocrText);
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
        raw_text: extractedData.raw_text,
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

    // Mark document as processed successfully and set status to 'complete'
    const { error: updateError } = await supabase
      .from('documents')
      .update({ 
        processed: true,
        processing_error: null,
        status: 'complete'
      })
      .eq('id', documentId);

    if (updateError) {
      console.error('Error updating document status:', updateError);
    }

    console.log('Document processing completed successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        extractedData,
        message: 'Document processed successfully with OCR' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing document:', error);
    
    // Mark document as processed with error if we have a documentId
    if (documentId) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        await supabase
          .from('documents')
          .update({ 
            processed: true,
            processing_error: error.message 
          })
          .eq('id', documentId);
        
        console.log('Document marked as processed with error:', error.message);
      } catch (updateError) {
        console.error('Failed to update document with error:', updateError);
      }
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
