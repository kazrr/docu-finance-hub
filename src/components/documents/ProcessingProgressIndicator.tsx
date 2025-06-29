
import { useEffect, useState } from "react";
import { Loader2, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface ProcessingProgressIndicatorProps {
  processed: boolean;
  processingError?: string | null;
  className?: string;
  uploadDate: string;
}

export const ProcessingProgressIndicator = ({ 
  processed, 
  processingError, 
  className,
  uploadDate 
}: ProcessingProgressIndicatorProps) => {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("Initializing...");

  useEffect(() => {
    if (processingError || processed) {
      return;
    }

    // Simulate processing stages with progress
    const stages = [
      { text: "Uploading file...", duration: 1000 },
      { text: "Preparing OCR...", duration: 2000 },
      { text: "Extracting text...", duration: 4000 },
      { text: "Analyzing data...", duration: 2000 },
      { text: "Finalizing...", duration: 1000 }
    ];

    let currentStage = 0;
    let currentProgress = 0;
    
    const interval = setInterval(() => {
      if (currentStage < stages.length) {
        setStage(stages[currentStage].text);
        
        // Calculate progress based on current stage
        const stageProgress = (currentStage + 1) / stages.length * 100;
        currentProgress = Math.min(currentProgress + 5, stageProgress);
        setProgress(currentProgress);
        
        // Move to next stage when current stage time is up
        if (currentProgress >= stageProgress) {
          currentStage++;
        }
      } else {
        // If still processing after all stages, show waiting state
        setStage("Processing...");
        setProgress(95); // Don't go to 100% until actually done
      }
    }, 200);

    return () => clearInterval(interval);
  }, [processed, processingError]);

  if (processingError) {
    return (
      <div className={className}>
        <Badge variant="destructive" title={processingError}>
          <AlertCircle className="h-3 w-3 mr-1" />
          Processing Failed
        </Badge>
      </div>
    );
  }

  if (processed) {
    return (
      <div className={className}>
        <Badge variant="secondary">
          <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
          Processed
        </Badge>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <Badge variant="outline">
        <Loader2 className="h-3 w-3 mr-1 animate-spin text-blue-600" />
        Processing...
      </Badge>
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{stage}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-1" />
      </div>
    </div>
  );
};
