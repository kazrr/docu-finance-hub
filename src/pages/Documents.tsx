import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Search, File, Eye, Download, RefreshCw, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { UploadDialog } from "@/components/documents/UploadDialog";
import { ProcessingProgressIndicator } from "@/components/documents/ProcessingProgressIndicator";
import { useDocuments, Document } from "@/hooks/use-documents";
import { useProcessDocument, useDeleteDocument } from "@/hooks/use-document-processing";
import { useDocumentActions } from "@/hooks/use-document-actions";

type DocumentCategory = "all" | "bills" | "bank" | "insurance" | "notices" | "renewal";

const Documents = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory>("all");
  
  const { data: documents = [], isLoading } = useDocuments();
  const processDocument = useProcessDocument();
  const deleteDocument = useDeleteDocument();
  const { viewDocument, downloadDocument, isLoading: actionLoading } = useDocumentActions();

  const filteredDocuments = documents
    .filter(doc => selectedCategory === "all" || doc.category === selectedCategory)
    .filter(doc => 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.vendor.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const categories: { value: DocumentCategory, label: string }[] = [
    { value: "all", label: "All Documents" },
    { value: "bills", label: "Bill Statements" },
    { value: "bank", label: "Bank Statements" },
    { value: "insurance", label: "Insurance" },
    { value: "notices", label: "Notices" },
    { value: "renewal", label: "Renewals" },
  ];

  const getCategoryBadgeColor = (category: string) => {
    switch(category) {
      case "bills": return "bg-blue-100 text-blue-800";
      case "bank": return "bg-green-100 text-green-800";
      case "insurance": return "bg-purple-100 text-purple-800";
      case "notices": return "bg-amber-100 text-amber-800";
      case "renewal": return "bg-pink-100 text-pink-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleRetryProcessing = async (documentId: string) => {
    try {
      await processDocument.mutateAsync(documentId);
    } catch (error) {
      console.error('Failed to retry processing:', error);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    if (window.confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      try {
        await deleteDocument.mutateAsync(documentId);
      } catch (error) {
        console.error('Failed to delete document:', error);
      }
    }
  };

  const handleViewDocument = async (document: Document) => {
    if (!document.file_url) {
      return;
    }
    await viewDocument(document.file_url, document.file_name);
  };

  const handleDownloadDocument = async (document: Document) => {
    if (!document.file_url) {
      return;
    }
    await downloadDocument(document.file_url, document.file_name);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
            <p className="text-muted-foreground">Upload, organize and search your documents</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <p>Loading documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground">Upload, organize and search your documents with automatic OCR processing</p>
        </div>
        <UploadDialog>
          <Button>
            <Upload className="mr-2 h-4 w-4" /> Upload Document
          </Button>
        </UploadDialog>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
            <div className="space-y-1">
              <CardTitle>Document Library</CardTitle>
              <CardDescription>Manage and organize all your uploaded documents with AI-powered data extraction</CardDescription>
            </div>
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search documents..."
                className="pl-8 w-full sm:w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" onValueChange={(value) => setSelectedCategory(value as DocumentCategory)}>
            <TabsList className="mb-4 w-full overflow-auto">
              {categories.map((category) => (
                <TabsTrigger key={category.value} value={category.value}>
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {categories.map((category) => (
              <TabsContent key={category.value} value={category.value}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredDocuments.length > 0 ? (
                    filteredDocuments.map((document) => (
                      <Card key={document.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1 flex-1">
                              <CardTitle className="text-sm font-medium truncate">
                                {document.title}
                              </CardTitle>
                              <div className="flex items-center space-x-2 flex-wrap gap-1">
                                <span className={cn(
                                  "px-2 py-1 text-xs rounded-full font-medium",
                                  getCategoryBadgeColor(document.category)
                                )}>
                                  {document.category}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1">
                              <File className="h-4 w-4 text-muted-foreground" />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteDocument(document.id)}
                                disabled={deleteDocument.isPending}
                                className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-3">
                            <ProcessingProgressIndicator 
                              processed={document.processed} 
                              processingError={document.processing_error}
                              uploadDate={document.upload_date}
                            />
                            <div className="space-y-2 text-sm text-muted-foreground">
                              <div className="flex justify-between">
                                <span>Vendor:</span>
                                <span className="font-medium truncate">{document.vendor}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Size:</span>
                                <span>{formatFileSize(document.file_size)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Uploaded:</span>
                                <span>{new Date(document.upload_date).toLocaleDateString()}</span>
                              </div>
                            </div>
                            {document.processing_error && (
                              <div className="text-xs text-red-600 mt-2 p-2 bg-red-50 rounded">
                                <strong>Processing Error:</strong> {document.processing_error}
                              </div>
                            )}
                          </div>
                        </CardContent>
                        <CardFooter className="pt-0">
                          <div className="flex space-x-2 w-full">
                            {document.processing_error ? (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1"
                                onClick={() => handleRetryProcessing(document.id)}
                                disabled={processDocument.isPending}
                              >
                                <RefreshCw className="h-3 w-3 mr-1" />
                                Retry OCR
                              </Button>
                            ) : (
                              <>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="flex-1"
                                  onClick={() => handleViewDocument(document)}
                                  disabled={actionLoading || !document.file_url}
                                >
                                  <Eye className="h-3 w-3 mr-1" />
                                  View
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="flex-1"
                                  onClick={() => handleDownloadDocument(document)}
                                  disabled={actionLoading || !document.file_url}
                                >
                                  <Download className="h-3 w-3 mr-1" />
                                  Download
                                </Button>
                              </>
                            )}
                          </div>
                        </CardFooter>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
                      <Upload className="h-16 w-16 text-muted-foreground mb-4" />
                      <h3 className="text-xl font-medium mb-2">
                        {searchQuery ? "No documents found" : "No documents yet"}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {searchQuery 
                          ? "Try adjusting your search terms"
                          : "Upload your first document to get started with AI-powered financial data extraction"
                        }
                      </p>
                      {!searchQuery && (
                        <UploadDialog>
                          <Button>
                            <Upload className="mr-2 h-4 w-4" /> Upload Document
                          </Button>
                        </UploadDialog>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Documents;
