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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/40 px-4">
      <Card className="w-[92%] max-w-[420px] rounded-2xl shadow-xl border border-muted/50">
        <CardContent className="px-6 py-8">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-primary">
              خطا
            </div>
            <p className="text-base text-muted-foreground">
              در بارگذاری صفحه مشکلی رخ داد
            </p>
            <div className="flex flex-col gap-3 w-full mt-2">
              <Button className="w-full h-11" onClick={() => reset()}>
                تلاش مجدد
              </Button>
              <Link href="/providers" className="w-full">
                <Button variant="outline" className="w-full h-11">
                  بازگشت به فهرست مجموعه‌ها
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
