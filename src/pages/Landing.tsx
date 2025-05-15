
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { File, PieChart, Calendar, CheckCircle, Shield } from "lucide-react";

export default function Landing() {
  const { session } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <header className="bg-background border-b">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <File className="h-6 w-6" />
            <span className="text-xl font-bold">FinanceDocs</span>
          </div>
          <nav>
            {session ? (
              <Button asChild>
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <Button asChild>
                <Link to="/auth">Sign In / Sign Up</Link>
              </Button>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Document & Finance Management Made Simple
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              Streamline your document organization, financial tracking, and payment reminders all in one powerful platform.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" asChild>
                <Link to="/auth">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#features">Learn More</a>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Everything You Need in One Place</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-sm">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <File className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Document Management</h3>
                <p className="text-muted-foreground">
                  Upload, categorize, and search your important financial documents without the hassle.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-sm">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <PieChart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Financial Analytics</h3>
                <p className="text-muted-foreground">
                  Track your spending patterns, categorize expenses, and get valuable insights into your finances.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-sm">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Payment Reminders</h3>
                <p className="text-muted-foreground">
                  Never miss a payment deadline with automatic calendar reminders and notifications.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Why Choose FinanceDocs?</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Streamlined Organization</h3>
                  <p className="text-muted-foreground">
                    Keep all your financial documents and data organized in one centralized location.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Save Time</h3>
                  <p className="text-muted-foreground">
                    Automate document categorization and financial tracking to free up your valuable time.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Enhanced Insights</h3>
                  <p className="text-muted-foreground">
                    Get clear visualizations of your financial data to make better financial decisions.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
                  <p className="text-muted-foreground">
                    Your financial data is protected with state-of-the-art security measures.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Join thousands of users who have already simplified their document and finance management.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/auth">Create Your Account</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-card py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <File className="h-5 w-5" />
              <span className="font-medium">FinanceDocs</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} FinanceDocs. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
