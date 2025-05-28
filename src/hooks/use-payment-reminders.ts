
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PaymentReminder {
  id: string;
  title: string;
  amount: number | null;
  due_date: string;
  category: string;
  vendor: string;
  is_completed: boolean;
  document_id: string | null;
}

export const usePaymentReminders = () => {
  return useQuery({
    queryKey: ["payment-reminders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payment_reminders")
        .select("*")
        .order("due_date", { ascending: true });

      if (error) {
        throw error;
      }

      return data as PaymentReminder[];
    },
  });
};
