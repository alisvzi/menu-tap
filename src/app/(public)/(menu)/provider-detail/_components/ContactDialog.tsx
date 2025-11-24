"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Mail, Phone } from "lucide-react";
import { useState } from "react";

interface ContactDialogProps {
  contact: {
    email?: string;
    phone: string;
    reservationPhone?: string;
  };
}

export default function ContactDialog({ contact }: ContactDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="bg-white/25 backdrop-blur-sm p-2.5 rounded-full border border-white/30 active:scale-95 transition-all">
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
          <div className="flex justify-between items-center px-2 py-4 border border-border rounded-lg">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <strong>تلفن:</strong>
            </div>
            <a
              href={`tel:${contact.phone}`}
              className="text-blue-600 hover:underline"
            >
              {contact.phone}
            </a>
          </div>

          {contact.reservationPhone && (
            <div className="flex justify-between items-center px-2 py-4 border border-border rounded-lg">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <strong>رزرو:</strong>
              </div>
              <a
                href={`tel:${contact.reservationPhone}`}
                className="text-blue-600 hover:underline"
              >
                {contact.reservationPhone}
              </a>
            </div>
          )}

          {contact.email && (
            <div className="flex justify-between items-center px-2 py-4 border border-border rounded-lg">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <strong>ایمیل:</strong>
              </div>
              <a
                href={`mailto:${contact.email}`}
                className="text-blue-600 hover:underline"
              >
                {contact.email}
              </a>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
