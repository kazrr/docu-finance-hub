
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProcessingIndicatorProps {
  processed: boolean;
  processingError?: string | null;
  className?: string;
}

export const ProcessingIndicator = ({ processed, processingError, className }: ProcessingIndicatorProps) => {
  if (processingError) {
    return (
      <Badge variant="destructive" className={className} title={processingError}>
        <AlertCircle className="h-3 w-3 mr-1" />
        Processing Failed
      </Badge>
    );
  }

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
