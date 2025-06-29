
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

    // Convert file to array buffer for processing
    const buffer = await fileData.arrayBuffer();
    const uint8Array = new Uint8Array(buffer);

    console.log('File converted to buffer, starting OCR processing...');

    // Use Tesseract.js for OCR (we'll import it dynamically)
    const { createWorker } = await import('https://esm.sh/tesseract.js@5.0.4');
    
    const worker = await createWorker('eng');
    
    try {
      const { data: { text } } = await worker.recognize(uint8Array);
      console.log('OCR processing completed, text length:', text.length);
      
      // Parse extracted text to find financial information
      const extractedData = parseFinancialData(text, document);
      
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
          raw_text: text,
          confidence_score: extractedData.confidence_score || 0.7
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

      // Mark document as processed successfully
      const { error: updateError } = await supabase
        .from('documents')
        .update({ 
          processed: true,
          processing_error: null
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
          message: 'Document processed successfully with local OCR' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } finally {
      await worker.terminate();
    }

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

// Helper function to parse financial data from OCR text
function parseFinancialData(text: string, document: any) {
  const lowerText = text.toLowerCase();
  
  // Extract amount using various patterns
  const amountPatterns = [
    /\$[\d,]+\.?\d*/g,
    /total[:\s]*\$?[\d,]+\.?\d*/gi,
    /amount[:\s]*\$?[\d,]+\.?\d*/gi,
    /balance[:\s]*\$?[\d,]+\.?\d*/gi,
    /due[:\s]*\$?[\d,]+\.?\d*/gi
  ];
  
  let amount = null;
  for (const pattern of amountPatterns) {
    const matches = text.match(pattern);
    if (matches) {
      const numericValue = matches[0].replace(/[^\d.]/g, '');
      if (numericValue && !isNaN(parseFloat(numericValue))) {
        amount = parseFloat(numericValue);
        break;
      }
    }
  }

  // Extract dates
  const datePatterns = [
    /\d{1,2}\/\d{1,2}\/\d{2,4}/g,
    /\d{1,2}-\d{1,2}-\d{2,4}/g,
    /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{1,2},?\s+\d{2,4}/gi
  ];
  
  let due_date = null;
  let transaction_date = null;
  
  for (const pattern of datePatterns) {
    const matches = text.match(pattern);
    if (matches && matches.length > 0) {
      // Try to parse the first date found
      const dateStr = matches[0];
      const parsedDate = new Date(dateStr);
      if (!isNaN(parsedDate.getTime())) {
        if (lowerText.includes('due') && !due_date) {
          due_date = parsedDate.toISOString().split('T')[0];
        } else if (!transaction_date) {
          transaction_date = parsedDate.toISOString().split('T')[0];
        }
      }
    }
  }

  // Extract account number (last 4 digits pattern)
  const accountPattern = /(?:account|acct).*?(\d{4})/gi;
  const accountMatch = text.match(accountPattern);
  let account_number = null;
  if (accountMatch) {
    const digits = accountMatch[0].match(/\d{4}/);
    if (digits) {
      account_number = `****${digits[0]}`;
    }
  }

  // Create description based on document type and content
  let description = `${document.category} from ${document.vendor}`;
  if (amount) {
    description += ` - $${amount}`;
  }

  return {
    amount,
    due_date,
    transaction_date,
    description,
    account_number,
    confidence_score: 0.7 // Default confidence for local OCR
  };
}
