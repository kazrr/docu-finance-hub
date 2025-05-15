
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { cn } from "@/lib/utils";

const categoryColors: Record<string, string> = {
  "Rent": "#8B5CF6",
  "Groceries": "#10B981",
  "Utilities": "#3B82F6",
  "Internet": "#6366F1", 
  "Transportation": "#EC4899",
  "Entertainment": "#F59E0B",
  "Insurance": "#8B5CF6",
  "Other": "#6B7280",
};

const monthlyData = [
  { name: "Jan", amount: 1800 },
  { name: "Feb", amount: 1750 },
  { name: "Mar", amount: 1950 },
  { name: "Apr", amount: 2200 },
  { name: "May", amount: 2150 },
];

const categoryData = [
  { name: "Rent", amount: 1200 },
  { name: "Groceries", amount: 400 },
  { name: "Utilities", amount: 180 },
  { name: "Internet", amount: 70 },
  { name: "Transportation", amount: 150 },
  { name: "Entertainment", amount: 100 },
  { name: "Insurance", amount: 50 },
];

const transactionData = [
  { 
    id: 1,
    date: "May 10, 2025",
    description: "Monthly Rent",
    category: "Rent",
    amount: 1200.00,
    documentId: "rent-may-2025"
  },
  { 
    id: 2,
    date: "May 5, 2025",
    description: "Grocery Shopping",
    category: "Groceries",
    amount: 85.75,
    documentId: "grocery-receipt-2025-05-05"
  },
  { 
    id: 3,
    date: "May 3, 2025",
    description: "Electricity Bill",
    category: "Utilities",
    amount: 120.50,
    documentId: "electric-bill-may-2025"
  },
  { 
    id: 4,
    date: "May 2, 2025",
    description: "Internet Service",
    category: "Internet",
    amount: 70.00,
    documentId: "internet-bill-may-2025"
  },
  { 
    id: 5,
    date: "April 28, 2025",
    description: "Gas Station",
    category: "Transportation",
    amount: 45.30,
    documentId: null
  },
  { 
    id: 6,
    date: "April 25, 2025",
    description: "Movie Tickets",
    category: "Entertainment",
    amount: 32.50,
    documentId: null
  },
  { 
    id: 7,
    date: "April 20, 2025",
    description: "Car Insurance",
    category: "Insurance",
    amount: 95.00,
    documentId: "car-insurance-apr-2025"
  },
  { 
    id: 8,
    date: "April 18, 2025",
    description: "Restaurant Dinner",
    category: "Entertainment",
    amount: 68.35,
    documentId: null
  }
];

const Finance = () => {
  const [timeRange, setTimeRange] = useState("month");
  const [chartType, setChartType] = useState<"overview" | "category">("overview");
  
  const totalMonthlySpending = monthlyData[monthlyData.length - 1].amount;
  const previousMonthSpending = monthlyData[monthlyData.length - 2].amount;
  const percentageChange = ((totalMonthlySpending - previousMonthSpending) / previousMonthSpending) * 100;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Finance</h1>
          <p className="text-muted-foreground">Track and analyze your financial data</p>
        </div>
        <Select defaultValue={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">Last Month</SelectItem>
            <SelectItem value="quarter">Last Quarter</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Spending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalMonthlySpending.toFixed(2)}</div>
            <p className={cn(
              "text-xs", 
              percentageChange > 0 ? "text-finance-expense" : "text-finance-income"
            )}>
              {percentageChange > 0 ? "+" : ""}{percentageChange.toFixed(1)}% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Largest Expense</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rent</div>
            <p className="text-xs text-muted-foreground">
              ${categoryData[0].amount} (
              {((categoryData[0].amount / totalMonthlySpending) * 100).toFixed(0)}% of total)
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactionData.length}</div>
            <p className="text-xs text-muted-foreground">
              {transactionData.filter(t => t.documentId).length} linked to documents
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categoryData.length}</div>
            <p className="text-xs text-muted-foreground">
              Most spending in {categoryData[0].name}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
            <div className="space-y-1">
              <CardTitle>Spending Analytics</CardTitle>
              <CardDescription>Visualize your spending patterns</CardDescription>
            </div>
            <Tabs 
              defaultValue="overview" 
              value={chartType} 
              onValueChange={(value) => setChartType(value as "overview" | "category")}
              className="w-full sm:w-auto"
            >
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="category">By Category</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            {chartType === "overview" ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => [`$${value}`, "Amount"]}
                    contentStyle={{ border: "1px solid #e5e7eb", borderRadius: "6px" }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#3B82F6" 
                    fillOpacity={1} 
                    fill="url(#colorAmount)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => [`$${value}`, "Amount"]}
                    contentStyle={{ border: "1px solid #e5e7eb", borderRadius: "6px" }}
                  />
                  <Bar dataKey="amount">
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={categoryColors[entry.name] || "#6B7280"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Financial transactions extracted from your documents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="pb-2 font-medium">Date</th>
                  <th className="pb-2 font-medium">Description</th>
                  <th className="pb-2 font-medium">Category</th>
                  <th className="pb-2 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactionData.map((transaction) => (
                  <tr key={transaction.id} className="border-b hover:bg-muted/50">
                    <td className="py-3">{transaction.date}</td>
                    <td className="py-3">
                      <div className="font-medium">{transaction.description}</div>
                      {transaction.documentId && (
                        <div className="text-xs text-muted-foreground">
                          Linked to document
                        </div>
                      )}
                    </td>
                    <td className="py-3">
                      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {transaction.category}
                      </div>
                    </td>
                    <td className="py-3 text-right font-medium">${transaction.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Finance;
