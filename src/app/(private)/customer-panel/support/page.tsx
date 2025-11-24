"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/forms/field";
import { ticketSchema, contactSchema, type TicketFormData, type ContactFormData } from "./_types/support-schema";
import { 
  HelpCircle, 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Send,
  Search,
  Book,
  Video,
  FileText,
  ExternalLink,
  Star,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";

interface Ticket {
  id: string;
  subject: string;
  status: 'open' | 'pending' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  lastUpdate: string;
  category: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
  notHelpful: number;
}

export default function SupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: 'T-001',
      subject: 'مشکل در آپلود تصاویر منو',
      status: 'open',
      priority: 'medium',
      createdAt: '1402/08/20',
      lastUpdate: '1402/08/22',
      category: 'فنی'
    },
    {
      id: 'T-002',
      subject: 'سوال درباره قیمت‌گذاری',
      status: 'resolved',
      priority: 'low',
      createdAt: '1402/08/15',
      lastUpdate: '1402/08/16',
      category: 'مالی'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const ticketForm = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      subject: '',
      category: '',
      priority: 'medium',
      description: ''
    }
  });

  const contactForm = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: ''
    }
  });

  const faqs: FAQ[] = [
    {
      id: '1',
      question: 'چگونه منوی جدید ایجاد کنم؟',
      answer: 'برای ایجاد منوی جدید، به بخش "مدیریت منو" بروید و روی دکمه "افزودن آیتم جدید" کلیک کنید. سپس اطلاعات مورد نیاز را تکمیل کنید.',
      category: 'منو',
      helpful: 25,
      notHelpful: 2
    },
    {
      id: '2',
      question: 'آیا می‌توانم چندین کسب‌وکار داشته باشم؟',
      answer: 'بله، شما می‌توانید چندین کسب‌وکار را در یک حساب کاربری مدیریت کنید. هر کسب‌وکار منوی جداگانه‌ای خواهد داشت.',
      category: 'حساب کاربری',
      helpful: 18,
      notHelpful: 1
    },
    {
      id: '3',
      question: 'چگونه QR کد منو را دریافت کنم؟',
      answer: 'پس از تکمیل منو، در بخش "پیش‌نمایش" می‌توانید QR کد منوی خود را مشاهده و دانلود کنید.',
      category: 'QR کد',
      helpful: 32,
      notHelpful: 0
    },
    {
      id: '4',
      question: 'آیا امکان تغییر قالب منو وجود دارد؟',
      answer: 'بله، در بخش "ظاهر و قالب" می‌توانید از قالب‌های مختلف استفاده کنید و ظاهر منوی خود را شخصی‌سازی کنید.',
      category: 'ظاهر',
      helpful: 22,
      notHelpful: 3
    }
  ];

  const submitTicket = async (data: TicketFormData) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const ticket: Ticket = {
        id: `T-${String(tickets.length + 1).padStart(3, '0')}`,
        subject: data.subject,
        status: 'open',
        priority: data.priority,
        createdAt: new Date().toLocaleDateString('fa-IR'),
        lastUpdate: new Date().toLocaleDateString('fa-IR'),
        category: data.category
      };

      setTickets(prev => [ticket, ...prev]);
      ticketForm.reset();
    } catch (error) {
      console.error('Error submitting ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitContact = async (data: ContactFormData) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("پیام ارسال شد:", data);
      contactForm.reset();
      
      // Show success message
      alert("پیام شما با موفقیت ارسال شد. در کمتر از ۲۴ ساعت پاسخ خواهید گرفت.");
    } catch (error) {
      console.error('Error submitting contact message:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      open: 'default',
      pending: 'secondary',
      resolved: 'outline',
      closed: 'destructive'
    };
    
    const labels = {
      open: 'باز',
      pending: 'در انتظار',
      resolved: 'حل شده',
      closed: 'بسته'
    };

    return <Badge variant={variants[status as keyof typeof variants] as any}>{labels[status as keyof typeof labels]}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      low: 'outline',
      medium: 'secondary',
      high: 'default',
      urgent: 'destructive'
    };
    
    const labels = {
      low: 'کم',
      medium: 'متوسط',
      high: 'بالا',
      urgent: 'فوری'
    };

    return <Badge variant={variants[priority as keyof typeof variants] as any}>{labels[priority as keyof typeof labels]}</Badge>;
  };

  const filteredFAQs = faqs.filter(faq => 
    faq.question.includes(searchQuery) || faq.answer.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <HelpCircle className="h-8 w-8" />
            پشتیبانی و راهنمایی
          </h1>
          <p className="text-muted-foreground">
            راهنمایی دریافت کنید یا با تیم پشتیبانی ارتباط برقرار کنید
          </p>
        </div>
      </div>

      <Tabs defaultValue="faq" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="faq" className="flex items-center gap-2">
            <Book className="h-4 w-4" />
            سوالات متداول
          </TabsTrigger>
          <TabsTrigger value="tickets" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            تیکت‌های من
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            تماس با ما
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            منابع آموزشی
          </TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>سوالات متداول</CardTitle>
              <CardDescription>
                پاسخ سوالات رایج کاربران را اینجا بیابید
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="جستجو در سوالات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
              </div>

              <Accordion type="single" collapsible className="w-full">
                {filteredFAQs.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id}>
                    <AccordionTrigger className="text-right">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {faq.category}
                        </Badge>
                        {faq.question}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <p className="text-muted-foreground">{faq.answer}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground">آیا این پاسخ مفید بود؟</span>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm">
                                <ThumbsUp className="h-4 w-4 ml-1" />
                                {faq.helpful}
                              </Button>
                              <Button variant="outline" size="sm">
                                <ThumbsDown className="h-4 w-4 ml-1" />
                                {faq.notHelpful}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              {filteredFAQs.length === 0 && (
                <div className="text-center py-8">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">نتیجه‌ای یافت نشد</h3>
                  <p className="text-sm text-muted-foreground">
                    سوال مورد نظر خود را پیدا نکردید؟ تیکت جدید ایجاد کنید
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tickets" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>تیکت‌های پشتیبانی</CardTitle>
                  <CardDescription>
                    تاریخچه درخواست‌های پشتیبانی شما
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {tickets.length > 0 ? (
                    <div className="space-y-4">
                      {tickets.map((ticket) => (
                        <div key={ticket.id} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">#{ticket.id}</span>
                              {getStatusBadge(ticket.status)}
                              {getPriorityBadge(ticket.priority)}
                            </div>
                            <Badge variant="outline">{ticket.category}</Badge>
                          </div>
                          
                          <h4 className="font-medium">{ticket.subject}</h4>
                          
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>ایجاد شده: {ticket.createdAt}</span>
                            <span>آخرین بروزرسانی: {ticket.lastUpdate}</span>
                          </div>
                          
                          <Button variant="outline" size="sm">
                            مشاهده جزئیات
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-medium mb-2">هیچ تیکتی وجود ندارد</h3>
                      <p className="text-sm text-muted-foreground">
                        شما هنوز هیچ تیکت پشتیبانی ایجاد نکرده‌اید
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>تیکت جدید</CardTitle>
                  <CardDescription>
                    درخواست پشتیبانی جدید ایجاد کنید
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Form {...ticketForm}>
                    <form onSubmit={ticketForm.handleSubmit(submitTicket)} className="space-y-4">
                      <FormField
                        control={ticketForm.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>موضوع</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="خلاصه‌ای از مشکل یا سوال شما"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={ticketForm.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>دسته‌بندی</FormLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="انتخاب دسته‌بندی" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="فنی">مشکل فنی</SelectItem>
                                <SelectItem value="حساب کاربری">حساب کاربری</SelectItem>
                                <SelectItem value="مالی">مسائل مالی</SelectItem>
                                <SelectItem value="منو">مدیریت منو</SelectItem>
                                <SelectItem value="عمومی">سوال عمومی</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={ticketForm.control}
                        name="priority"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>اولویت</FormLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="low">کم</SelectItem>
                                <SelectItem value="medium">متوسط</SelectItem>
                                <SelectItem value="high">بالا</SelectItem>
                                <SelectItem value="urgent">فوری</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={ticketForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>توضیحات</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder="توضیح کاملی از مشکل یا سوال خود ارائه دهید..."
                                rows={4}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit"
                        disabled={loading}
                        className="w-full"
                      >
                        {loading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent ml-2" />
                        ) : (
                          <Send className="ml-2 h-4 w-4" />
                        )}
                        ارسال تیکت
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>اطلاعات تماس</CardTitle>
                <CardDescription>
                  راه‌های مختلف ارتباط با تیم پشتیبانی
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">تلفن پشتیبانی</h4>
                    <p className="text-sm text-muted-foreground">021-12345678</p>
                    <p className="text-xs text-muted-foreground">شنبه تا پنج‌شنبه، 9 تا 18</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">ایمیل پشتیبانی</h4>
                    <p className="text-sm text-muted-foreground">support@bestmenu.ir</p>
                    <p className="text-xs text-muted-foreground">پاسخ در کمتر از 24 ساعت</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <MessageCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">چت آنلاین</h4>
                    <p className="text-sm text-muted-foreground">پشتیبانی زنده</p>
                    <p className="text-xs text-muted-foreground">شنبه تا پنج‌شنبه، 9 تا 18</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    ساعات کاری پشتیبانی
                  </h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>شنبه - چهارشنبه</span>
                      <span>9:00 - 18:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>پنج‌شنبه</span>
                      <span>9:00 - 14:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>جمعه</span>
                      <span className="text-muted-foreground">تعطیل</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>پیام مستقیم</CardTitle>
                <CardDescription>
                  پیام خود را مستقیماً برای ما ارسال کنید
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Form {...contactForm}>
                  <form onSubmit={contactForm.handleSubmit(submitContact)} className="space-y-4">
                    <FormField
                      control={contactForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>نام</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="نام و نام خانوادگی"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={contactForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ایمیل</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              placeholder="your@email.com"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={contactForm.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>موضوع</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="موضوع پیام"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={contactForm.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>پیام</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field}
                              placeholder="پیام خود را اینجا بنویسید..."
                              rows={5}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="w-full"
                    >
                      <Send className="ml-2 h-4 w-4" />
                      ارسال پیام
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  ویدیوهای آموزشی
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">شروع کار با بست منو</h4>
                  <p className="text-xs text-muted-foreground">آموزش کامل راه‌اندازی اولین منو</p>
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink className="ml-2 h-4 w-4" />
                    مشاهده ویدیو
                  </Button>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">مدیریت دسته‌بندی‌ها</h4>
                  <p className="text-xs text-muted-foreground">نحوه ایجاد و مدیریت دسته‌بندی‌های منو</p>
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink className="ml-2 h-4 w-4" />
                    مشاهده ویدیو
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  راهنمای کاربری
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">راهنمای کامل</h4>
                  <p className="text-xs text-muted-foreground">مستندات کامل استفاده از سیستم</p>
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink className="ml-2 h-4 w-4" />
                    مطالعه راهنما
                  </Button>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">نکات و ترفندها</h4>
                  <p className="text-xs text-muted-foreground">بهترین شیوه‌های استفاده از سیستم</p>
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink className="ml-2 h-4 w-4" />
                    مطالعه نکات
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  منابع مفید
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">وبلاگ</h4>
                  <p className="text-xs text-muted-foreground">مقالات و اخبار مرتبط با رستوران‌داری</p>
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink className="ml-2 h-4 w-4" />
                    مطالعه وبلاگ
                  </Button>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">انجمن کاربران</h4>
                  <p className="text-xs text-muted-foreground">تبادل تجربه با سایر کاربران</p>
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink className="ml-2 h-4 w-4" />
                    ورود به انجمن
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>به‌روزرسانی‌ها و اخبار</CardTitle>
              <CardDescription>
                آخرین اخبار و به‌روزرسانی‌های سیستم
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-r-4 border-primary pr-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">نسخه 2.1.0 منتشر شد</h4>
                    <Badge variant="outline">جدید</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    امکانات جدید شامل قالب‌های بیشتر، بهبود عملکرد و رفع باگ‌ها
                  </p>
                  <p className="text-xs text-muted-foreground">1402/08/20</p>
                </div>

                <div className="border-r-4 border-muted pr-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">بهبود سرعت بارگذاری</h4>
                    <Badge variant="secondary">بهبود</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    سرعت بارگذاری منوها تا 40% بهبود یافته است
                  </p>
                  <p className="text-xs text-muted-foreground">1402/08/15</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}