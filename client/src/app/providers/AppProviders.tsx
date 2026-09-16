import { TooltipProvider } from "@/shared/ui/tooltip";
import { Toaster } from "@/shared/ui/sonner";
import { ThemeProvider } from "@/shared/providers/ThemeProvider";

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider defaultTheme="dark">
      <TooltipProvider>
        <Toaster />
        {children}
      </TooltipProvider>
    </ThemeProvider>
  );
}
