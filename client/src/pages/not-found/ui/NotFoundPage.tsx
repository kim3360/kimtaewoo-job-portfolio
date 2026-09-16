import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { AlertCircle, Home } from "lucide-react";
import { useLocation } from "wouter";

export function NotFoundPage() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <Card className="w-full max-w-lg mx-4 border border-border bg-pearl-surface/50 backdrop-blur-sm">
        <CardContent className="pt-8 pb-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-pearl-accent/20 rounded-full animate-pulse" />
              <AlertCircle className="relative h-16 w-16 text-pearl-accent" />
            </div>
          </div>

          <h1 className="text-4xl font-bold mb-2">404</h1>
          <h2 className="text-xl font-semibold text-muted-foreground mb-4">
            Page Not Found
          </h2>

          <p className="text-muted-foreground mb-8 leading-relaxed">
            요청하신 페이지를 찾을 수 없습니다.
          </p>

          <Button
            onClick={() => setLocation("/")}
            className="contact-btn-glow"
          >
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
