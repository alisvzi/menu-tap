"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import LogoBox from "../../(web-site)/_components/layout/Footer/LogoBox";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-[90%] max-w-[360px] rounded-2xl shadow-2xl border border-muted/40">
        <CardHeader className="flex flex-col ga-2 items-center">
          <LogoBox />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4 py-2">
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full w-1/3 bg-primary animate-[shimmer_1.4s_ease-in-out_infinite]" />
            </div>
            <div className="text-xs text-muted-foreground">
              در حال آماده‌سازی منو و اطلاعات مجموعه
            </div>
          </div>
        </CardContent>
      </Card>
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(20%);
          }
          100% {
            transform: translateX(120%);
          }
        }
      `}</style>
    </div>
  );
}
