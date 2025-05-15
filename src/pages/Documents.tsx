
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
  
  const documents: Document[] = [
    {
      id: "1",
      title: "Electric Bill - May 2025",
      category: "bills",
      date: "May 10, 2025",
      vendor: "Power Company Inc.",
      fileType: "PDF",
      fileSize: "1.2 MB",
      processed: true
    },
    {
      id: "2",
      title: "Bank Statement - April 2025",
      category: "bank",
      date: "May 2, 2025",
      vendor: "National Bank",
      fileType: "PDF",
      fileSize: "2.4 MB",
      processed: true
    },
    {
      id: "3",
      title: "Home Insurance Renewal",
      category: "insurance",
      date: "April 28, 2025",
      vendor: "Safe Insurance Co.",
      fileType: "PDF",
      fileSize: "0.8 MB",
      processed: true
    },
    {
      id: "4",
      title: "Tax Notice",
      category: "notices",
      date: "April 15, 2025",
      vendor: "Revenue Department",
      fileType: "PDF",
      fileSize: "1.5 MB",
      processed: false
    },
    {
      id: "5",
      title: "Internet Bill - April 2025",
      category: "bills",
      date: "April 8, 2025",
      vendor: "Connect ISP",
      fileType: "PDF",
      fileSize: "0.5 MB",
      processed: true
    },
    {
      id: "6",
      title: "Car Insurance Policy",
      category: "insurance",
      date: "March 20, 2025",
      vendor: "Auto Protect Inc.",
      fileType: "PDF",
      fileSize: "1.7 MB",
      processed: true
    },
    {
      id: "7",
      title: "Credit Card Statement",
      category: "bank",
      date: "March 15, 2025",
      vendor: "Global Bank",
      fileType: "PDF",
      fileSize: "1.1 MB",
      processed: false
    },
    {
      id: "8",
      title: "Software Subscription Renewal",
      category: "renewal",
      date: "March 5, 2025",
      vendor: "Tech Solutions Ltd.",
      fileType: "PDF",
      fileSize: "0.3 MB",
      processed: true
    }
  ];

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
                  {filteredDocuments.length > 0 ? (
                    filteredDocuments.map((doc) => (
                      <Card key={doc.id} className="overflow-hidden">
                        <CardHeader className="pb-2 pt-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-base">{doc.title}</CardTitle>
                              <CardDescription>{doc.vendor}</CardDescription>
                            </div>
                            <div className={cn("px-2 py-1 rounded-full text-xs font-medium", 
                              getCategoryBadgeColor(doc.category)
                            )}>
                              {categories.find(c => c.value === doc.category)?.label.replace(" Statements", "").replace(" Documents", "")}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <File className="mr-1 h-3 w-3" />
                              <span>{doc.fileType} · {doc.fileSize}</span>
                            </div>
                            <div>{doc.date}</div>
                          </div>
                        </CardContent>
                        <CardFooter className="pt-0">
                          <div className="flex justify-between w-full">
                            <Button size="sm" variant="ghost">View</Button>
                            <Button size="sm" variant="outline">Download</Button>
                          </div>
                        </CardFooter>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
                      <File className="h-10 w-10 text-muted-foreground mb-2" />
                      <h3 className="text-lg font-medium">No documents found</h3>
                      <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
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
