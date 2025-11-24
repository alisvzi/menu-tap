"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  CreditCard, 
  Calendar, 
  Download, 
  Receipt, 
  Crown,
  Star,
  Check,
  X,
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  DollarSign,
  TrendingUp,
  Users,
  Zap,
  Shield,
  Headphones,
  Globe,
  BarChart3
} from "lucide-react";

interface Subscription {
  id: string;
  plan: string;
  status: 'active' | 'cancelled' | 'expired';
  price: number;
  billingCycle: 'monthly' | 'yearly';
  nextBilling: string;
  features: string[];
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank';
  last4: string;
  brand: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
}

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  description: string;
  downloadUrl?: string;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  features: string[];
  isPopular?: boolean;
  maxBusinesses: number;
  maxMenuItems: number;
  customDomain: boolean;
  analytics: boolean;
  support: string;
}

export default function BillingPage() {
  const [currentSubscription] = useState<Subscription>({
    id: '1',
    plan: 'حرفه‌ای',
    status: 'active',
    price: 299000,
    billingCycle: 'monthly',
    nextBilling: '1402/09/15',
    features: ['تا 5 کسب‌وکار', 'منوی نامحدود', 'دامنه سفارشی', 'آنالیتیکس پیشرفته', 'پشتیبانی اولویت‌دار']
  });

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      last4: '1234',
      brand: 'Visa',
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true
    },
    {
      id: '2',
      type: 'card',
      last4: '5678',
      brand: 'Mastercard',
      expiryMonth: 8,
      expiryYear: 2026,
      isDefault: false
    }
  ]);

  const [invoices] = useState<Invoice[]>([
    {
      id: '1',
      date: '1402/08/15',
      amount: 299000,
      status: 'paid',
      description: 'اشتراک ماهانه - پلن حرفه‌ای',
      downloadUrl: '/invoices/invoice-1.pdf'
    },
    {
      id: '2',
      date: '1402/07/15',
      amount: 299000,
      status: 'paid',
      description: 'اشتراک ماهانه - پلن حرفه‌ای',
      downloadUrl: '/invoices/invoice-2.pdf'
    },
    {
      id: '3',
      date: '1402/06/15',
      amount: 299000,
      status: 'paid',
      description: 'اشتراک ماهانه - پلن حرفه‌ای',
      downloadUrl: '/invoices/invoice-3.pdf'
    }
  ]);

  const [plans] = useState<Plan[]>([
    {
      id: '1',
      name: 'رایگان',
      price: 0,
      billingCycle: 'monthly',
      maxBusinesses: 1,
      maxMenuItems: 10,
      customDomain: false,
      analytics: false,
      support: 'ایمیل',
      features: [
        '1 کسب‌وکار',
        'تا 10 آیتم منو',
        'قالب‌های پایه',
        'پشتیبانی ایمیل',
        'آپلود تصویر محدود'
      ]
    },
    {
      id: '2',
      name: 'پایه',
      price: 99000,
      billingCycle: 'monthly',
      maxBusinesses: 2,
      maxMenuItems: 50,
      customDomain: false,
      analytics: true,
      support: 'ایمیل و چت',
      features: [
        'تا 2 کسب‌وکار',
        'تا 50 آیتم منو',
        'قالب‌های پیشرفته',
        'آنالیتیکس پایه',
        'پشتیبانی چت',
        'آپلود تصویر نامحدود'
      ]
    },
    {
      id: '3',
      name: 'حرفه‌ای',
      price: 299000,
      billingCycle: 'monthly',
      maxBusinesses: 5,
      maxMenuItems: -1,
      customDomain: true,
      analytics: true,
      support: 'اولویت‌دار',
      isPopular: true,
      features: [
        'تا 5 کسب‌وکار',
        'منوی نامحدود',
        'دامنه سفارشی',
        'آنالیتیکس پیشرفته',
        'پشتیبانی اولویت‌دار',
        'سفارشی‌سازی کامل',
        'API دسترسی'
      ]
    },
    {
      id: '4',
      name: 'سازمانی',
      price: 599000,
      billingCycle: 'monthly',
      maxBusinesses: -1,
      maxMenuItems: -1,
      customDomain: true,
      analytics: true,
      support: 'اختصاصی',
      features: [
        'کسب‌وکار نامحدود',
        'منوی نامحدود',
        'چندین دامنه سفارشی',
        'آنالیتیکس پیشرفته',
        'پشتیبانی اختصاصی',
        'مدیریت تیم',
        'گزارش‌های سفارشی',
        'یکپارچه‌سازی سازمانی'
      ]
    }
  ]);

  const [showAddPaymentDialog, setShowAddPaymentDialog] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const formatPrice = (price: number) => {
    if (price === 0) return 'رایگان';
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      cancelled: 'destructive',
      expired: 'secondary',
      paid: 'default',
      pending: 'secondary',
      failed: 'destructive'
    };

    const labels = {
      active: 'فعال',
      cancelled: 'لغو شده',
      expired: 'منقضی شده',
      paid: 'پرداخت شده',
      pending: 'در انتظار',
      failed: 'ناموفق'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] as any}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const getPaymentMethodIcon = (brand: string) => {
    return <CreditCard className="h-4 w-4" />;
  };

  const setDefaultPaymentMethod = (methodId: string) => {
    setPaymentMethods(prev => 
      prev.map(method => ({
        ...method,
        isDefault: method.id === methodId
      }))
    );
  };

  const deletePaymentMethod = (methodId: string) => {
    setPaymentMethods(prev => prev.filter(method => method.id !== methodId));
  };

  const usagePercentage = {
    businesses: (3 / (currentSubscription.plan === 'حرفه‌ای' ? 5 : 1)) * 100,
    menuItems: (45 / (currentSubscription.plan === 'حرفه‌ای' ? 1000 : 50)) * 100,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <CreditCard className="h-8 w-8" />
            صورتحساب و اشتراک
          </h1>
          <p className="text-muted-foreground">
            مدیریت اشتراک، روش‌های پرداخت و صورتحساب‌ها
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="ml-2 h-4 w-4" />
            دانلود صورتحساب
          </Button>
          <Button onClick={() => setShowUpgradeDialog(true)}>
            <Crown className="ml-2 h-4 w-4" />
            ارتقاء پلن
          </Button>
        </div>
      </div>

      <Tabs defaultValue="subscription" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="subscription">اشتراک فعلی</TabsTrigger>
          <TabsTrigger value="payment-methods">روش‌های پرداخت</TabsTrigger>
          <TabsTrigger value="invoices">صورتحساب‌ها</TabsTrigger>
          <TabsTrigger value="plans">پلن‌ها</TabsTrigger>
        </TabsList>

        <TabsContent value="subscription" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Crown className="h-5 w-5" />
                    اشتراک فعلی
                  </span>
                  {getStatusBadge(currentSubscription.status)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">پلن</span>
                    <span className="font-medium">{currentSubscription.plan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">قیمت</span>
                    <span className="font-medium">{formatPrice(currentSubscription.price)}/ماه</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">تاریخ تجدید</span>
                    <span className="font-medium">{currentSubscription.nextBilling}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-medium">ویژگی‌های شامل:</h4>
                  <ul className="space-y-1">
                    {currentSubscription.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <Edit className="ml-2 h-4 w-4" />
                    تغییر پلن
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="flex-1">
                        <X className="ml-2 h-4 w-4" />
                        لغو اشتراک
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>لغو اشتراک</AlertDialogTitle>
                        <AlertDialogDescription>
                          آیا مطمئن هستید که می‌خواهید اشتراک خود را لغو کنید؟ این عمل در پایان دوره فعلی اعمال خواهد شد.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>انصراف</AlertDialogCancel>
                        <AlertDialogAction>لغو اشتراک</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  میزان استفاده
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>کسب‌وکارها</span>
                    <span>3 از 5</span>
                  </div>
                  <Progress value={usagePercentage.businesses} className="w-full" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>آیتم‌های منو</span>
                    <span>45 از نامحدود</span>
                  </div>
                  <Progress value={4.5} className="w-full" />
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-primary">1,250</div>
                    <div className="text-xs text-muted-foreground">بازدید ماهانه</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-primary">89</div>
                    <div className="text-xs text-muted-foreground">سفارش ماهانه</div>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  <TrendingUp className="ml-2 h-4 w-4" />
                  مشاهده آمار کامل
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payment-methods" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">روش‌های پرداخت</h2>
            <Button onClick={() => setShowAddPaymentDialog(true)}>
              <Plus className="ml-2 h-4 w-4" />
              افزودن کارت
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {paymentMethods.map((method) => (
              <Card key={method.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getPaymentMethodIcon(method.brand)}
                      <div>
                        <div className="font-medium">
                          {method.brand} •••• {method.last4}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          انقضا: {method.expiryMonth}/{method.expiryYear}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {method.isDefault && (
                        <Badge variant="default">پیش‌فرض</Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDefaultPaymentMethod(method.id)}
                        disabled={method.isDefault}
                      >
                        <Star className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>حذف کارت</AlertDialogTitle>
                            <AlertDialogDescription>
                              آیا مطمئن هستید که می‌خواهید این کارت را حذف کنید؟
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>انصراف</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deletePaymentMethod(method.id)}>
                              حذف
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">تاریخچه صورتحساب‌ها</h2>
            <Button variant="outline">
              <Download className="ml-2 h-4 w-4" />
              دانلود همه
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Receipt className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{invoice.description}</div>
                        <div className="text-sm text-muted-foreground">{invoice.date}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-left">
                        <div className="font-medium">{formatPrice(invoice.amount)}</div>
                        {getStatusBadge(invoice.status)}
                      </div>
                      
                      {invoice.downloadUrl && (
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans" className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">انتخاب پلن مناسب</h2>
            <p className="text-muted-foreground">
              پلن مناسب کسب‌وکار خود را انتخاب کنید
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => (
              <Card key={plan.id} className={`relative ${plan.isPopular ? 'border-primary shadow-lg' : ''}`}>
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">محبوب‌ترین</Badge>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <CardTitle>{plan.name}</CardTitle>
                  <div className="space-y-1">
                    <div className="text-3xl font-bold">
                      {formatPrice(plan.price)}
                    </div>
                    {plan.price > 0 && (
                      <div className="text-sm text-muted-foreground">در ماه</div>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className="w-full" 
                    variant={plan.isPopular ? 'default' : 'outline'}
                    onClick={() => {
                      setSelectedPlan(plan);
                      setShowUpgradeDialog(true);
                    }}
                    disabled={plan.name === currentSubscription.plan}
                  >
                    {plan.name === currentSubscription.plan ? 'پلن فعلی' : 'انتخاب پلن'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Payment Method Dialog */}
      <Dialog open={showAddPaymentDialog} onOpenChange={setShowAddPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>افزودن کارت جدید</DialogTitle>
            <DialogDescription>
              اطلاعات کارت بانکی خود را وارد کنید
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="card-number">شماره کارت</Label>
              <Input id="card-number" placeholder="1234 5678 9012 3456" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">تاریخ انقضا</Label>
                <Input id="expiry" placeholder="MM/YY" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input id="cvv" placeholder="123" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cardholder">نام دارنده کارت</Label>
              <Input id="cardholder" placeholder="نام و نام خانوادگی" />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddPaymentDialog(false)}>
              انصراف
            </Button>
            <Button onClick={() => setShowAddPaymentDialog(false)}>
              افزودن کارت
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upgrade Plan Dialog */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ارتقاء پلن</DialogTitle>
            <DialogDescription>
              {selectedPlan ? `ارتقاء به پلن ${selectedPlan.name}` : 'انتخاب پلن جدید'}
            </DialogDescription>
          </DialogHeader>
          
          {selectedPlan && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">پلن فعلی: {currentSubscription.plan}</span>
                  <span>{formatPrice(currentSubscription.price)}/ماه</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">پلن جدید: {selectedPlan.name}</span>
                  <span>{formatPrice(selectedPlan.price)}/ماه</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between items-center font-bold">
                  <span>تفاوت قیمت:</span>
                  <span className="text-primary">
                    {formatPrice(selectedPlan.price - currentSubscription.price)}/ماه
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">ویژگی‌های جدید:</h4>
                <ul className="space-y-1">
                  {selectedPlan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUpgradeDialog(false)}>
              انصراف
            </Button>
            <Button onClick={() => setShowUpgradeDialog(false)}>
              تایید ارتقاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}