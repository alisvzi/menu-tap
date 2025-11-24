"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Check, Copy, QrCode, Share2 } from "lucide-react";
import Image from "next/image";
import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ShareModalProps {
  businessName: string;
  url: string;
}

export default function ShareModal({ businessName, url }: ShareModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

  useEffect(() => {
    if (isOpen && url) {
      QRCode.toDataURL(url, {
        width: 200,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      })
        .then((dataUrl) => {
          setQrCodeUrl(dataUrl);
        })
        .catch((error) => {
          console.error("Error generating QR code:", error);
        });
    }
  }, [isOpen, url]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("لینک کپی شد!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("خطا در کپی کردن لینک");
    }
  };

  const shareToSocial = (platform: string) => {
    const text = `منوی ${businessName} را ببینید:`;
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(url);

    let shareUrl = "";

    switch (platform) {
      case "telegram":
        shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodedText} ${encodedUrl}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  const downloadQRCode = () => {
    if (qrCodeUrl) {
      const link = document.createElement("a");
      link.download = `${businessName}-qr-code.png`;
      link.href = qrCodeUrl;
      link.click();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="bg-white/25 backdrop-blur-sm p-2.5 rounded-full border border-white/30 active:scale-95 transition-all">
          <Share2 className="text-white w-5 h-5" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">اشتراک‌گذاری منو</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* QR Code */}
          <div className="flex flex-col items-center space-y-3">
            <div className="bg-white p-4 rounded-lg border">
              {qrCodeUrl ? (
                <Image src={qrCodeUrl} alt="QR Code" width={192} height={192} className="w-48 h-48" unoptimized />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center bg-gray-100 rounded">
                  <QrCode className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={downloadQRCode}
              disabled={!qrCodeUrl}
            >
              دانلود QR Code
            </Button>
          </div>

          {/* Copy Link */}
          <div className="space-y-2">
            <label className="text-sm font-medium">لینک منو:</label>
            <div className="flex space-x-2 items-center">
              <Input type="text" value={url} readOnly />
              <Button
                size="icon"
                onClick={copyToClipboard}
                className="shrink-0"
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Social Share Buttons */}
          <div className="space-y-3">
            <label className="text-sm font-medium">
              اشتراک در شبکه‌های اجتماعی:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => shareToSocial("telegram")}
                className="flex items-center justify-center space-x-2"
              >
                <span className="text-xs">تلگرام</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => shareToSocial("whatsapp")}
                className="flex items-center justify-center space-x-2"
              >
                <span className="text-xs">واتساپ</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => shareToSocial("twitter")}
                className="flex items-center justify-center space-x-2"
              >
                <span className="text-xs">توییتر</span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
