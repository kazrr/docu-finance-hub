
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useDocumentActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const viewDocument = async (fileUrl: string, fileName: string) => {
    if (!fileUrl) {
      toast({
        title: "Error",
        description: "File URL not found",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .download(fileUrl);

      if (error) {
        throw error;
      }

      // Create blob URL and open in new tab
      const blob = new Blob([data], { type: data.type });
      const url = URL.createObjectURL(blob);
      
      // Open in new tab for viewing
      const newWindow = window.open(url, '_blank');
      if (!newWindow) {
        toast({
          title: "Popup blocked",
          description: "Please allow popups to view the document",
          variant: "destructive",
        });
      }

      // Clean up the URL after a delay
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error('Error viewing document:', error);
      toast({
        title: "View failed",
        description: "Failed to open document for viewing",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadDocument = async (fileUrl: string, fileName: string) => {
    if (!fileUrl) {
      toast({
        title: "Error",
        description: "File URL not found",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .download(fileUrl);

      if (error) {
        throw error;
      }

      // Create blob and download
      const blob = new Blob([data], { type: data.type });
      const url = URL.createObjectURL(blob);
      
      // Create temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      URL.revokeObjectURL(url);

      toast({
        title: "Download started",
        description: `${fileName} is being downloaded`,
      });
    } catch (error) {
      console.error('Error downloading document:', error);
      toast({
        title: "Download failed",
        description: "Failed to download document",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    viewDocument,
    downloadDocument,
    isLoading
  };
};
