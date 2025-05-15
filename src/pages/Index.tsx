
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, File, PieChart, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const StatCard = ({ title, value, description, icon }: { 
  title: string; 
  value: string; 
  description?: string;
  icon: React.ReactNode;
}) => (
  <Card className="overflow-hidden">
    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="text-muted-foreground">{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const Index = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your Document & Finance Manager</p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link to="/documents">
              <Upload className="mr-2 h-4 w-4" /> Upload Document
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Documents" 
          value="12" 
          description="3 uploaded this month"
          icon={<File className="h-4 w-4" />} 
        />
        <StatCard 
          title="Upcoming Payments" 
          value="4" 
          description="Next: Internet Bill (May 18)"
          icon={<Calendar className="h-4 w-4" />} 
        />
        <StatCard 
          title="Monthly Expenses" 
          value="$2,156.40" 
          description="15% less than last month"
          icon={<PieChart className="h-4 w-4" />} 
        />
        <StatCard 
          title="Pending Documents" 
          value="3" 
          description="Awaiting categorization"
          icon={<File className="h-4 w-4" />} 
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your recent document and finance activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  title: "Electric Bill - April",
                  description: "Uploaded and categorized as Bill Statement",
                  date: "May 5, 2025",
                  type: "document",
                },
                {
                  title: "Rent Payment",
                  description: "Extracted transaction of $1,200",
                  date: "May 3, 2025",
                  type: "finance",
                },
                {
                  title: "Insurance Policy",
                  description: "Classified as Insurance Document",
                  date: "May 1, 2025",
                  type: "document",
                },
                {
                  title: "Bank Statement - April",
                  description: "Extracted 24 transactions",
                  date: "Apr 30, 2025",
                  type: "finance",
                }
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-4 p-3 rounded-md hover:bg-muted">
                  <div className={cn(
                    "p-2 rounded-full flex items-center justify-center",
                    activity.type === "document" ? "bg-blue-100" : "bg-green-100"
                  )}>
                    {activity.type === "document" ? (
                      <File className="h-4 w-4 text-blue-600" />
                    ) : (
                      <PieChart className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">{activity.date}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link to="/documents">
                <Upload className="mr-2 h-4 w-4" /> Upload a document
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link to="/documents">
                <File className="mr-2 h-4 w-4" /> Review pending documents
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link to="/finance">
                <PieChart className="mr-2 h-4 w-4" /> View financial summary
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link to="/calendar">
                <Calendar className="mr-2 h-4 w-4" /> Check upcoming payments
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
