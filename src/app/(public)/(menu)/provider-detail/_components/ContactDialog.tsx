"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Phone } from "lucide-react";
import { useState } from "react";

export default function ContactDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="bg-white/20 backdrop-blur-sm p-2 rounded-full">
          <Phone className="text-white w-5 h-5" />
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>اطلاعات تماس</DialogTitle>
          <DialogDescription>
            لطفا برای رزرو و پشتیبانی از اطلاعات زیر استفاده کنید.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-3">
          <p className="flex justify-between px-2 py-4 border border-border rounded-lg">
            <strong>رزرو:</strong> ۱۲۳-۴۵۶-۷۸۹۰
          </p>
          <p className="flex justify-between px-2 py-4 border border-border rounded-lg">
            <strong>پشتیبانی:</strong> support@example.com
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
