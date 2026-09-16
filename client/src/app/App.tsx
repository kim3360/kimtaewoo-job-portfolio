import { AppProviders } from "@/app/providers/AppProviders";
import { AppRouter } from "@/app/router/AppRouter";
import ErrorBoundary from "@/app/ui/ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary>
      <AppProviders>
        <AppRouter />
      </AppProviders>
    </ErrorBoundary>
  );
}
