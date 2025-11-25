"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-b from-background to-muted/40 px-4">
      <div className="w-full max-w-3xl">
        <Card className="rounded-2xl shadow-xl border border-muted/50">
          <CardContent className="px-8 py-10">
            <div className="flex flex-col md:flex-row items-center md:items-start md:justify-between gap-6">
              <div className="text-center md:text-left">
                <div className="text-6xl md:text-7xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-primary">
                  خطا
                </div>
                <p className="mt-3 text-base md:text-lg text-muted-foreground">
                  در بارگذاری صفحه مشکلی رخ داد. لطفاً دوباره تلاش کنید.
                </p>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-3">
                <Button
                  className="w-full md:w-auto h-11"
                  onClick={() => reset()}
                >
                  تلاش مجدد
                </Button>
                <Link href="/" className="w-full md:w-auto">
                  <Button variant="outline" className="w-full md:w-auto h-11">
                    بازگشت به صفحه اصلی
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
