
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Document {
  id: string;
  title: string;
  file_name: string;
  file_size: number;
  file_type: string;
  category: string;
  vendor: string;
  upload_date: string;
  processed: boolean;
  processing_error?: string | null;
  file_url: string | null;
  user_id: string;
}

export const useDocuments = () => {
  return useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .order("upload_date", { ascending: false });

      if (error) {
        throw error;
      }

      return data as Document[];
    },
  });
};

export const useUploadDocument = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      file,
      category,
      vendor,
    }: {
      file: File;
      category: string;
      vendor: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Insert document record
      const { data, error } = await supabase
        .from("documents")
        .insert({
          title: file.name,
          file_name: file.name,
          file_size: file.size,
          file_type: file.type,
          category,
          vendor,
          file_url: filePath,
          user_id: user.id,
          processed: false, // Explicitly set to false
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Trigger document processing with better error handling
      try {
        console.log('Triggering document processing for:', data.id);
        const { data: processResult, error: processError } = await supabase.functions.invoke('process-document', {
          body: { documentId: data.id }
        });

        if (processError) {
          console.error('Failed to trigger document processing:', processError);
          // Update document with processing error
          await supabase
            .from('documents')
            .update({ 
              processed: true,
              processing_error: `Processing failed: ${processError.message}` 
            })
            .eq('id', data.id);
        } else {
          console.log('Document processing triggered successfully:', processResult);
        }
      } catch (processError) {
        console.error('Failed to trigger document processing:', processError);
        // Update document with processing error but don't throw
        await supabase
          .from('documents')
          .update({ 
            processed: true,
            processing_error: `Processing failed: ${processError instanceof Error ? processError.message : 'Unknown error'}` 
          })
          .eq('id', data.id);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      toast({
        title: "Upload successful",
        description: "Your document has been uploaded and is being processed for data extraction.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
