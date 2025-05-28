
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, File, PieChart, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { UploadDialog } from "@/components/documents/UploadDialog";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";

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
  const { data: stats, isLoading } = useDashboardStats();
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your Document & Finance Manager</p>
        </div>
        <div className="flex gap-2">
          <UploadDialog>
            <Button>
              <Upload className="mr-2 h-4 w-4" /> Upload Document
            </Button>
          </UploadDialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Documents" 
          value={isLoading ? "..." : stats?.totalDocuments.toString() || "0"} 
          description={
            isLoading 
              ? "Loading..." 
              : stats?.totalDocuments === 0 
                ? "No documents uploaded yet" 
                : `${stats?.totalDocuments} document${(stats?.totalDocuments || 0) > 1 ? 's' : ''} stored`
          }
          icon={<File className="h-4 w-4" />} 
        />
        <StatCard 
          title="Upcoming Payments" 
          value={isLoading ? "..." : stats?.upcomingPayments.toString() || "0"} 
          description={
            isLoading 
              ? "Loading..." 
              : stats?.upcomingPayments === 0 
                ? "No payments scheduled" 
                : `${stats?.upcomingPayments} payment${(stats?.upcomingPayments || 0) > 1 ? 's' : ''} due soon`
          }
          icon={<Calendar className="h-4 w-4" />} 
        />
        <StatCard 
          title="Monthly Expenses" 
          value={isLoading ? "..." : `$${(stats?.monthlyExpenses || 0).toFixed(2)}`} 
          description={
            isLoading 
              ? "Loading..." 
              : stats?.monthlyExpenses === 0 
                ? "No expenses tracked yet" 
                : "From uploaded documents"
          }
          icon={<PieChart className="h-4 w-4" />} 
        />
        <StatCard 
          title="Pending Documents" 
          value={isLoading ? "..." : stats?.pendingDocuments.toString() || "0"} 
          description={
            isLoading 
              ? "Loading..." 
              : stats?.pendingDocuments === 0 
                ? "All documents processed" 
                : `${stats?.pendingDocuments} document${(stats?.pendingDocuments || 0) > 1 ? 's' : ''} awaiting processing`
          }
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
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <File className="h-10 w-10 text-muted-foreground mb-2" />
              <h3 className="text-lg font-medium">No activity yet</h3>
              <p className="text-sm text-muted-foreground">
                Upload your first document to get started
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <UploadDialog>
              <Button className="w-full justify-start" variant="outline">
                <Upload className="mr-2 h-4 w-4" /> Upload a document
              </Button>
            </UploadDialog>
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
