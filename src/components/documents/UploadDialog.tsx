
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type DocumentCategory = "bills" | "bank" | "insurance" | "notices" | "renewal";

interface UploadDialogProps {
  children: React.ReactNode;
  onUploadSuccess?: () => void;
}

export const UploadDialog = ({ children, onUploadSuccess }: UploadDialogProps) => {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [category, setCategory] = useState<DocumentCategory>("bills");
  const [vendor, setVendor] = useState("");
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }

    if (!vendor.trim()) {
      toast({
        title: "Vendor required",
        description: "Please enter a vendor name.",
        variant: "destructive",
      });
      return;
    }

    // Simulate upload process
    toast({
      title: "Upload started",
      description: `Uploading ${selectedFile.name}...`,
    });

    // Reset form and close dialog
    setSelectedFile(null);
    setVendor("");
    setCategory("bills");
    setOpen(false);

    // Show success message after a delay and trigger callback
    setTimeout(() => {
      toast({
        title: "Upload successful",
        description: "Your document has been uploaded successfully.",
      });
      
      // Trigger any callback for dashboard updates
      if (onUploadSuccess) {
        onUploadSuccess();
      }
      
      // Force a page refresh to update dashboard statistics
      window.location.reload();
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Select a document to upload and categorize it for better organization.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="file">Document File</Label>
            <Input
              id="file"
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleFileChange}
            />
            {selectedFile && (
              <p className="text-sm text-muted-foreground">
                Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="vendor">Vendor/Company</Label>
            <Input
              id="vendor"
              placeholder="e.g., Electric Company, Bank of America"
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={(value) => setCategory(value as DocumentCategory)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bills">Bill Statements</SelectItem>
                <SelectItem value="bank">Bank Statements</SelectItem>
                <SelectItem value="insurance">Insurance</SelectItem>
                <SelectItem value="notices">Notices</SelectItem>
                <SelectItem value="renewal">Renewals</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpload}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
