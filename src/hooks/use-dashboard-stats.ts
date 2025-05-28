
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      // Get total documents count
      const { count: documentsCount } = await supabase
        .from("documents")
        .select("*", { count: "exact", head: true });

      // Get upcoming payments count
      const { count: paymentsCount } = await supabase
        .from("payment_reminders")
        .select("*", { count: "exact", head: true })
        .eq("is_completed", false)
        .gte("due_date", new Date().toISOString().split('T')[0]);

      // Get total expenses from extracted data
      const { data: expensesData } = await supabase
        .from("extracted_data")
        .select("amount")
        .not("amount", "is", null);

      const totalExpenses = expensesData?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;

      // Get pending documents count
      const { count: pendingCount } = await supabase
        .from("documents")
        .select("*", { count: "exact", head: true })
        .eq("processed", false);

      return {
        totalDocuments: documentsCount || 0,
        upcomingPayments: paymentsCount || 0,
        monthlyExpenses: totalExpenses,
        pendingDocuments: pendingCount || 0,
      };
    },
  });
};
