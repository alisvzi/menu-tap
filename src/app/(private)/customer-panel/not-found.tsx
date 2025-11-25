import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/40 px-4">
      <Card className="w-full max-w-xl rounded-2xl shadow-xl border border-muted/50">
        <CardContent className="px-8 py-10">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="text-6xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-rose-500">
              404
            </div>
            <p className="text-base text-muted-foreground">
              این مسیر در بخش مدیریت وجود ندارد
            </p>
            <Link href="/customer-panel" className="w-full">
              <Button className="w-full h-11 mt-2">بازگشت به داشبورد</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
