
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProcessingIndicatorProps {
  processed: boolean;
  className?: string;
}

export const ProcessingIndicator = ({ processed, className }: ProcessingIndicatorProps) => {
  if (processed) {
    return (
      <Badge variant="secondary" className={className}>
        <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
        Processed
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className={className}>
      <Loader2 className="h-3 w-3 mr-1 animate-spin text-blue-600" />
      Processing...
    </Badge>
  );
};
