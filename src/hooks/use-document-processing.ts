
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
