"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Eye, 
  Smartphone, 
  Tablet, 
  Monitor, 
  Share, 
  Download, 
  QrCode,
  ExternalLink,
  Settings,
  Palette,
  Type,
  Layout,
  Image,
  Star,
  Clock,
  MapPin,
  Phone,
  Globe,
  Copy,
  Check
} from "lucide-react";
import NextImage from "next/image";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  isPopular?: boolean;
  isNew?: boolean;
  rating?: number;
  preparationTime?: string;
  allergens?: string[];
  tags?: string[];
}

interface Category {
  id: string;
  name: string;
  description?: string;
  items: MenuItem[];
}

export default function PreviewPage() {
  const [viewMode, setViewMode] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState<'fa' | 'en'>('fa');
  const [showPrices, setShowPrices] = useState(true);
  const [showImages, setShowImages] = useState(true);
  const [showRatings, setShowRatings] = useState(true);
  const [layoutStyle, setLayoutStyle] = useState<'grid' | 'list' | 'card'>('card');
  const [copied, setCopied] = useState(false);

  const menuData: Category[] = [
    {
      id: '1',
      name: 'پیتزا',
      description: 'پیتزاهای تازه و خوشمزه با بهترین مواد اولیه',
      items: [
        {
          id: '1',
          name: 'پیتزا مارگاریتا',
          description: 'پیتزا کلاسیک با پنیر موزارلا، گوجه فرنگی و ریحان تازه',
          price: 180000,
          image: '/images/pizza-margherita.jpg',
          category: 'پیتزا',
          isPopular: true,
          rating: 4.8,
          preparationTime: '15-20 دقیقه',
          allergens: ['لبنیات', 'گلوتن'],
          tags: ['وگان', 'کلاسیک']
        },
        {
          id: '2',
          name: 'پیتزا پپرونی',
          description: 'پیتزا با پپرونی، پنیر موزارلا و سس گوجه',
          price: 220000,
          image: '/images/pizza-pepperoni.jpg',
          category: 'پیتزا',
          rating: 4.6,
          preparationTime: '15-20 دقیقه',
          allergens: ['لبنیات', 'گلوتن', 'گوشت'],
          tags: ['محبوب']
        }
      ]
    },
    {
      id: '2',
      name: 'برگر',
      description: 'برگرهای تازه با گوشت درجه یک',
      items: [
        {
          id: '3',
          name: 'برگر کلاسیک',
          description: 'برگر با گوشت گاو، کاهو، گوجه، پیاز و سس مخصوص',
          price: 150000,
          image: '/images/burger-classic.jpg',
          category: 'برگر',
          isNew: true,
          rating: 4.7,
          preparationTime: '10-15 دقیقه',
          allergens: ['گلوتن', 'گوشت'],
          tags: ['جدید', 'پرطرفدار']
        }
      ]
    },
    {
      id: '3',
      name: 'نوشیدنی',
      description: 'نوشیدنی‌های سرد و گرم',
      items: [
        {
          id: '4',
          name: 'قهوه اسپرسو',
          description: 'قهوه تازه دم با دانه‌های برشته شده',
          price: 45000,
          category: 'نوشیدنی',
          rating: 4.5,
          preparationTime: '5 دقیقه',
          tags: ['گرم', 'کافئین']
        },
        {
          id: '5',
          name: 'آب پرتقال تازه',
          description: 'آب پرتقال طبیعی و تازه',
          price: 35000,
          category: 'نوشیدنی',
          rating: 4.3,
          preparationTime: '2 دقیقه',
          tags: ['سرد', 'طبیعی', 'ویتامین C']
        }
      ]
    }
  ];

  const businessInfo = {
    name: 'رستوران بهترین منو',
    description: 'بهترین غذاهای ایرانی و بین‌المللی',
    address: 'تهران، خیابان ولیعصر، پلاک 123',
    phone: '021-12345678',
    website: 'www.bestmenu.ir',
    workingHours: 'روزانه 10:00 تا 23:00',
    rating: 4.7,
    reviewCount: 1250
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getDeviceClass = () => {
    switch (viewMode) {
      case 'mobile':
        return 'max-w-sm mx-auto';
      case 'tablet':
        return 'max-w-2xl mx-auto';
      case 'desktop':
        return 'max-w-6xl mx-auto';
      default:
        return 'max-w-sm mx-auto';
    }
  };

  const previewUrl = `https://bestmenu.ir/menu/preview/${businessInfo.name}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Eye className="h-8 w-8" />
            پیش‌نمایش منو
          </h1>
          <p className="text-muted-foreground">
            مشاهده منو در حالت‌های مختلف
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <QrCode className="ml-2 h-4 w-4" />
            QR Code
          </Button>
          <Button variant="outline">
            <Download className="ml-2 h-4 w-4" />
            دانلود PDF
          </Button>
          <Button>
            <Share className="ml-2 h-4 w-4" />
            اشتراک‌گذاری
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                تنظیمات پیش‌نمایش
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>نمایش دستگاه</Label>
                <div className="flex gap-1">
                  <Button
                    variant={viewMode === 'mobile' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('mobile')}
                  >
                    <Smartphone className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'tablet' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('tablet')}
                  >
                    <Tablet className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'desktop' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('desktop')}
                  >
                    <Monitor className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="theme">تم تیره</Label>
                  <Switch
                    id="theme"
                    checked={theme === 'dark'}
                    onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="prices">نمایش قیمت‌ها</Label>
                  <Switch
                    id="prices"
                    checked={showPrices}
                    onCheckedChange={setShowPrices}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="images">نمایش تصاویر</Label>
                  <Switch
                    id="images"
                    checked={showImages}
                    onCheckedChange={setShowImages}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="ratings">نمایش امتیازها</Label>
                  <Switch
                    id="ratings"
                    checked={showRatings}
                    onCheckedChange={setShowRatings}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>زبان</Label>
                <Select value={language} onValueChange={(value: 'fa' | 'en') => setLanguage(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fa">فارسی</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>نوع چیدمان</Label>
                <Select value={layoutStyle} onValueChange={(value: 'grid' | 'list' | 'card') => setLayoutStyle(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="card">کارتی</SelectItem>
                    <SelectItem value="list">لیستی</SelectItem>
                    <SelectItem value="grid">شبکه‌ای</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>اطلاعات اشتراک‌گذاری</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label className="text-sm">لینک منو</Label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs bg-muted p-2 rounded truncate">
                    {previewUrl}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(previewUrl)}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">کد QR</Label>
                <div className="w-32 h-32 bg-muted rounded flex items-center justify-center mx-auto">
                  <QrCode className="h-16 w-16 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>پیش‌نمایش منو</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>نمایش:</span>
                  <Badge variant="outline">
                    {viewMode === 'mobile' ? 'موبایل' : viewMode === 'tablet' ? 'تبلت' : 'دسکتاپ'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className={`${getDeviceClass()} ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white'} border rounded-lg overflow-hidden`}>
                {/* Header */}
                <div className="p-6 border-b">
                  <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold">{businessInfo.name}</h1>
                    <p className="text-muted-foreground">{businessInfo.description}</p>
                    
                    <div className="flex items-center justify-center gap-4 text-sm">
                      {showRatings && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{businessInfo.rating}</span>
                          <span className="text-muted-foreground">({businessInfo.reviewCount} نظر)</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{businessInfo.workingHours}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{businessInfo.address}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        <span>{businessInfo.phone}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Globe className="h-4 w-4" />
                        <span>{businessInfo.website}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Menu Content */}
                <div className="p-6 space-y-8">
                  {menuData.map((category) => (
                    <div key={category.id} className="space-y-4">
                      <div className="text-center">
                        <h2 className="text-xl font-bold">{category.name}</h2>
                        {category.description && (
                          <p className="text-muted-foreground text-sm">{category.description}</p>
                        )}
                      </div>

                      <div className={
                        layoutStyle === 'grid' ? 'grid gap-4 md:grid-cols-2' :
                        layoutStyle === 'list' ? 'space-y-3' :
                        'grid gap-4 md:grid-cols-2 lg:grid-cols-1'
                      }>
                        {category.items.map((item) => (
                          <div
                            key={item.id}
                            className={`border rounded-lg p-4 ${
                              layoutStyle === 'list' ? 'flex items-center gap-4' : 'space-y-3'
                            }`}
                          >
                            {showImages && item.image && (
                              <div className={
                                layoutStyle === 'list' ? 'w-16 h-16 flex-shrink-0' : 'w-full h-32'
                              }>
                                <div className="w-full h-full bg-muted rounded flex items-center justify-center">
                                  <NextImage src={item.image} alt={item.name} width={32} height={32} className="h-8 w-8 object-cover rounded" />
                                </div>
                              </div>
                            )}

                            <div className={layoutStyle === 'list' ? 'flex-1 min-w-0' : 'space-y-2'}>
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-medium">{item.name}</h3>
                                    {item.isPopular && (
                                      <Badge variant="secondary" className="text-xs">محبوب</Badge>
                                    )}
                                    {item.isNew && (
                                      <Badge variant="default" className="text-xs">جدید</Badge>
                                    )}
                                  </div>
                                  
                                  {showRatings && item.rating && (
                                    <div className="flex items-center gap-1 text-sm">
                                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                      <span>{item.rating}</span>
                                    </div>
                                  )}
                                </div>

                                {showPrices && (
                                  <div className="text-left">
                                    <span className="font-bold text-primary">
                                      {formatPrice(item.price)}
                                    </span>
                                  </div>
                                )}
                              </div>

                              <p className="text-sm text-muted-foreground">{item.description}</p>

                              {item.preparationTime && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  <span>{item.preparationTime}</span>
                                </div>
                              )}

                              {item.tags && item.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {item.tags.map((tag, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}

                              {item.allergens && item.allergens.length > 0 && (
                                <div className="text-xs text-muted-foreground">
                                  <span>آلرژن‌ها: {item.allergens.join('، ')}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="p-6 border-t text-center text-sm text-muted-foreground">
                  <p>منو ایجاد شده با BestMenu</p>
                  <p>برای ایجاد منوی خود به {businessInfo.website} مراجعه کنید</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}