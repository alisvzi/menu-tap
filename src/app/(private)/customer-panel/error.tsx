"use client";

import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import LogoBox from "../../(public)/(web-site)/_components/layout/Footer/LogoBox";

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
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-xl rounded-2xl">
        <CardHeader className="items-center">
          <LogoBox />
          <CardTitle className="text-center w-full mt-2">
            خطا در بخش مدیریت
          </CardTitle>
          <CardDescription className="text-center w-full">
            در بارگذاری این صفحه مشکلی رخ داد
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center gap-3">
            <Button className="w-full md:w-auto h-11" onClick={() => reset()}>
              تلاش مجدد
            </Button>
            <Link href="/customer-panel" className="w-full md:w-auto">
              <Button variant="outline" className="w-full md:w-auto h-11">
                بازگشت به داشبورد
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
