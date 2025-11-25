import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-b from-background to-muted/40 px-4">
      <div className="w-full max-w-3xl">
        <Card className="rounded-2xl shadow-xl border border-muted/50">
          <CardContent className="px-8 py-10">
            <div className="flex flex-col items-center text-center gap-5">
              <div className="text-6xl md:text-7xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-rose-500">
                404
              </div>
              <p className="text-base md:text-lg text-muted-foreground">
                صفحه مورد نظر یافت نشد. ممکن است آدرس تغییر کرده باشد یا حذف شده
                باشد.
              </p>
              <div className="flex flex-col md:flex-row items-center gap-3 mt-2">
                <Link href="/" className="w-full md:w-auto">
                  <Button className="w-full md:w-auto h-11">
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
