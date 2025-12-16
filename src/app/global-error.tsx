"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error caught:", error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="text-center space-y-6 max-w-md">
                <h1 className="text-4xl font-extrabold text-gray-900">500</h1>
                <h2 className="text-2xl font-bold text-gray-700">Errore del Server</h2>
                <p className="text-gray-500">
                    Siamo spiacenti, si è verificato un errore critico. Il nostro team è stato notificato.
                </p>
                <div className="flex justify-center gap-4">
                    <Button onClick={() => reset()}>Riprova</Button>
                    <Button variant="outline" onClick={() => window.location.href = "/"}>
                        Torna alla Home
                    </Button>
                </div>
            </div>
        </div>
      </body>
    </html>
  );
}
