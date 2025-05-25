
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Search, File, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

type DocumentCategory = "all" | "bills" | "bank" | "insurance" | "notices" | "renewal";

interface Document {
  id: string;
  title: string;
  category: DocumentCategory;
  date: string;
  vendor: string;
  fileType: string;
  fileSize: string;
  processed: boolean;
}

const Documents = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory>("all");
  
  const documents: Document[] = []; // Empty array - no test data

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

  const getCategoryBadgeColor = (category: DocumentCategory) => {
    switch(category) {
      case "bills": return "bg-blue-100 text-blue-800";
      case "bank": return "bg-green-100 text-green-800";
      case "insurance": return "bg-purple-100 text-purple-800";
      case "notices": return "bg-amber-100 text-amber-800";
      case "renewal": return "bg-pink-100 text-pink-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground">Upload, organize and search your documents</p>
        </div>
        <Button>
          <Upload className="mr-2 h-4 w-4" /> Upload Document
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
            <div className="space-y-1">
              <CardTitle>Document Library</CardTitle>
              <CardDescription>Manage and organize all your uploaded documents</CardDescription>
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
                  <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
                    <Upload className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium mb-2">No documents yet</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Upload your first document to get started with organizing your finances
                    </p>
                    <Button>
                      <Upload className="mr-2 h-4 w-4" /> Upload Document
                    </Button>
                  </div>
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
