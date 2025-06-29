
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useProcessDocument = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (documentId: string) => {
      console.log('Starting document processing for:', documentId);
      
      const { data, error } = await supabase.functions.invoke('process-document', {
        body: { documentId }
      });

      if (error) {
        console.error('Processing error:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      console.log('Document processing completed:', data);
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["payment-reminders"] });
      
      toast({
        title: "Document processed",
        description: "Financial data has been extracted and calendar updated.",
      });
    },
    onError: (error: Error) => {
      console.error('Document processing failed:', error);
      toast({
        title: "Processing failed",
        description: error.message || "Failed to process document.",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (documentId: string) => {
      console.log('Deleting document:', documentId);
      
      // Get document details first to delete the file from storage
      const { data: document, error: docError } = await supabase
        .from("documents")
        .select("file_url")
        .eq("id", documentId)
        .single();

      if (docError) {
        throw new Error(`Failed to fetch document: ${docError.message}`);
      }

      // Delete file from storage if it exists
      if (document?.file_url) {
        const { error: storageError } = await supabase.storage
          .from("documents")
          .remove([document.file_url]);

        if (storageError) {
          console.warn('Failed to delete file from storage:', storageError);
          // Don't throw here - continue with database deletion
        }
      }

      // Delete extracted data first (foreign key dependency)
      const { error: extractedDataError } = await supabase
        .from("extracted_data")
        .delete()
        .eq("document_id", documentId);

      if (extractedDataError) {
        console.warn('Failed to delete extracted data:', extractedDataError);
        // Don't throw here - continue with other deletions
      }

      // Delete payment reminders
      const { error: remindersError } = await supabase
        .from("payment_reminders")
        .delete()
        .eq("document_id", documentId);

      if (remindersError) {
        console.warn('Failed to delete payment reminders:', remindersError);
        // Don't throw here - continue with document deletion
      }

      // Finally delete the document record
      const { error: deleteError } = await supabase
        .from("documents")
        .delete()
        .eq("id", documentId);

      if (deleteError) {
        throw new Error(`Failed to delete document: ${deleteError.message}`);
      }

      return { documentId };
    },
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["payment-reminders"] });
      
      toast({
        title: "Document deleted",
        description: "Document and all associated data have been removed.",
      });
    },
    onError: (error: Error) => {
      console.error('Document deletion failed:', error);
      toast({
        title: "Deletion failed",
        description: error.message || "Failed to delete document.",
        variant: "destructive",
      });
    },
  });
};
