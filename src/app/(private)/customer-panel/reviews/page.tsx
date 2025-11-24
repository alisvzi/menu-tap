"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel, FieldDescription, FieldError, FieldContent } from "@/components/ui/field";
import { MessageSquare, Star, Check, X, Flag, Reply } from "lucide-react";
import { replySchema, type ReplyFormData } from "./_types/review-schema";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/forms/field";

interface Review {
  id: string;
  customer: string;
  item: string;
  rating: number; // 1-5
  comment: string;
  date: string;
  status: "pending" | "approved" | "rejected" | "flagged";
}

const demoReviews: Review[] = [
  {
    id: "r1",
    customer: "علی رضایی",
    item: "پیتزا مخصوص",
    rating: 5,
    comment: "عالی بود! طعم بی‌نظیر و سرویس سریع.",
    date: "2025-10-10",
    status: "approved",
  },
  {
    id: "r2",
    customer: "نگین موسوی",
    item: "چیزبرگر دوبل",
    rating: 3,
    comment: "خوب بود ولی کمی سرد رسید.",
    date: "2025-10-12",
    status: "pending",
  },
  {
    id: "r3",
    customer: "مهدی احمدی",
    item: "سالاد سزار",
    rating: 4,
    comment: "سالم و خوش‌طعم، پیشنهاد می‌کنم.",
    date: "2025-10-14",
    status: "approved",
  },
  {
    id: "r4",
    customer: "زهرا ملکی",
    item: "لازانیا",
    rating: 2,
    comment: "نمک زیاد بود.",
    date: "2025-10-15",
    status: "flagged",
  },
];

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(demoReviews);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [minRating, setMinRating] = useState<number>(0);
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyReview, setReplyReview] = useState<Review | null>(null);

  // فرم پاسخ به نظرات
  const replyForm = useForm<ReplyFormData>({
    resolver: zodResolver(replySchema),
    defaultValues: {
      replyText: "",
    },
  });

  const filtered = useMemo(() => {
    return reviews.filter((r) => {
      const matchesQuery =
        r.customer.includes(query) ||
        r.item.includes(query) ||
        r.comment.includes(query);
      const matchesStatus =
        statusFilter === "all" || r.status === statusFilter;
      const matchesRating = r.rating >= minRating;
      return matchesQuery && matchesStatus && matchesRating;
    });
  }, [reviews, query, statusFilter, minRating]);

  const approve = (id: string) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status: "approved" } : r)));
  };
  const reject = (id: string) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status: "rejected" } : r)));
  };
  const flag = (id: string) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status: "flagged" } : r)));
  };
  const openReply = (review: Review) => {
    setReplyReview(review);
    replyForm.reset({ replyText: "" });
    setReplyOpen(true);
  };
  
  const submitReply = (data: ReplyFormData) => {
    // اینجا منطق ارسال پاسخ به سرور پیاده‌سازی می‌شود
    console.log("پاسخ ارسال شد:", data.replyText, "برای نظر:", replyReview?.id);
    setReplyOpen(false);
    replyForm.reset();
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">نظرات مشتریان</h1>
            <p className="text-sm text-muted-foreground">مدیریت و پاسخ به بازخوردها</p>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <Input
              placeholder="جستجو در نام مشتری، آیتم یا متن نظر"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="وضعیت" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                <SelectItem value="pending">در انتظار بررسی</SelectItem>
                <SelectItem value="approved">تأیید شده</SelectItem>
                <SelectItem value="rejected">رد شده</SelectItem>
                <SelectItem value="flagged">گزارش شده</SelectItem>
              </SelectContent>
            </Select>
            <Select value={String(minRating)} onValueChange={(v) => setMinRating(Number(v))}>
              <SelectTrigger>
                <SelectValue placeholder="حداقل امتیاز" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">بدون محدودیت</SelectItem>
                <SelectItem value="1">۱+</SelectItem>
                <SelectItem value="2">۲+</SelectItem>
                <SelectItem value="3">۳+</SelectItem>
                <SelectItem value="4">۴+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground">
        {filtered.length} نتیجه از {reviews.length} نظر
      </div>

      <Separator />

      <div className="space-y-4">
        {filtered.map((r) => (
          <Card key={r.id} className="overflow-hidden">
            <CardHeader className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="ml-2 size-4 text-muted-foreground" />
                  <CardTitle className="text-base">{r.customer}</CardTitle>
                  <Badge variant="secondary" className="text-xs">{r.item}</Badge>
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`size-4 ${i < r.rating ? "text-yellow-500" : "text-muted-foreground"}`}
                      fill={i < r.rating ? "currentColor" : "none"}
                    />
                  ))}
                </div>
              </div>
              <CardDescription className="text-xs">تاریخ: {r.date}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-6">{r.comment}</p>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    r.status === "approved"
                      ? "default"
                      : r.status === "pending"
                      ? "secondary"
                      : r.status === "rejected"
                      ? "destructive"
                      : "secondary"
                  }
                  className="text-xs"
                >
                  {r.status === "approved"
                    ? "تأیید شده"
                    : r.status === "pending"
                    ? "در انتظار"
                    : r.status === "rejected"
                    ? "رد شده"
                    : "گزارش شده"}
                </Badge>
              </div>
            </CardContent>
            <CardContent className="flex items-center gap-2 pt-0">
              <Button variant="outline" size="sm" onClick={() => approve(r.id)}>
                <Check className="ml-2 size-4" /> تأیید
              </Button>
              <Button variant="outline" size="sm" onClick={() => reject(r.id)}>
                <X className="ml-2 size-4" /> رد
              </Button>
              <Button variant="outline" size="sm" onClick={() => flag(r.id)}>
                <Flag className="ml-2 size-4" /> گزارش
              </Button>
              <Button variant="ghost" size="sm" onClick={() => openReply(r)}>
                <Reply className="ml-2 size-4" /> پاسخ
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={replyOpen} onOpenChange={setReplyOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>پاسخ به نظر</DialogTitle>
          </DialogHeader>
          <Form {...replyForm}>
            <form onSubmit={replyForm.handleSubmit(submitReply)} className="space-y-4">
              {replyReview && (
                <div className="text-sm text-muted-foreground">
                  پاسخ به نظر مشتری: <span className="font-medium">{replyReview.customer}</span>
                </div>
              )}
              <FormField
                control={replyForm.control}
                name="replyText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>متن پاسخ</FormLabel>
                    <FormDescription>پاسخ شما برای مشتری ارسال می‌شود.</FormDescription>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="نوشتن پاسخ..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-end gap-2">
                <Button variant="outline" onClick={() => setReplyOpen(false)}>انصراف</Button>
                <Button type="submit">ارسال پاسخ</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}