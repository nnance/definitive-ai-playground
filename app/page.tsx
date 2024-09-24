import { Dashboard } from "@/components/llm-playground";
import { TooltipProvider } from "@radix-ui/react-tooltip";

export default function Page() {
  return (
    <TooltipProvider>
      <Dashboard />
    </TooltipProvider>
  );
}
