"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Palette, 
  Eye, 
  Monitor, 
  Smartphone, 
  Tablet, 
  Save, 
  RotateCcw, 
  Upload,
  Download,
  Settings,
  Image as ImageIcon,
  Type,
  Layout,
  Brush,
  Zap
} from "lucide-react";

interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  fontSize: string;
  borderRadius: string;
  logoUrl: string;
  backgroundImage: string;
  darkMode: boolean;
  compactMode: boolean;
  animations: boolean;
}

interface LayoutSettings {
  headerStyle: 'classic' | 'modern' | 'minimal';
  menuLayout: 'grid' | 'list' | 'cards';
  showPrices: boolean;
  showDescriptions: boolean;
  showImages: boolean;
  showCategories: boolean;
  itemsPerRow: number;
  categoryStyle: 'tabs' | 'sidebar' | 'dropdown';
}

export default function AppearancePage() {
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>({
    primaryColor: '#3b82f6',
    secondaryColor: '#64748b',
    accentColor: '#f59e0b',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    fontFamily: 'vazirmatn',
    fontSize: 'medium',
    borderRadius: 'medium',
    logoUrl: '',
    backgroundImage: '',
    darkMode: false,
    compactMode: false,
    animations: true,
  });

  const [layoutSettings, setLayoutSettings] = useState<LayoutSettings>({
    headerStyle: 'modern',
    menuLayout: 'cards',
    showPrices: true,
    showDescriptions: true,
    showImages: true,
    showCategories: true,
    itemsPerRow: 3,
    categoryStyle: 'tabs',
  });

  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const colorPresets = [
    { name: 'آبی کلاسیک', primary: '#3b82f6', secondary: '#64748b', accent: '#f59e0b' },
    { name: 'سبز طبیعی', primary: '#10b981', secondary: '#6b7280', accent: '#f59e0b' },
    { name: 'بنفش مدرن', primary: '#8b5cf6', secondary: '#64748b', accent: '#f59e0b' },
    { name: 'قرمز گرم', primary: '#ef4444', secondary: '#64748b', accent: '#f59e0b' },
    { name: 'نارنجی پویا', primary: '#f97316', secondary: '#64748b', accent: '#3b82f6' },
    { name: 'صورتی شیک', primary: '#ec4899', secondary: '#64748b', accent: '#10b981' },
  ];

  const fontOptions = [
    { value: 'vazirmatn', label: 'وزیر متن' },
    { value: 'iran-sans', label: 'ایران سنس' },
    { value: 'shabnam', label: 'شبنم' },
    { value: 'dana', label: 'دانا' },
    { value: 'yekan', label: 'یکان' },
  ];

  const updateThemeSettings = (key: keyof ThemeSettings, value: any) => {
    setThemeSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const updateLayoutSettings = (key: keyof LayoutSettings, value: any) => {
    setLayoutSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const applyColorPreset = (preset: typeof colorPresets[0]) => {
    setThemeSettings(prev => ({
      ...prev,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      accentColor: preset.accent,
    }));
    setHasChanges(true);
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setHasChanges(false);
      // Show success message
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetToDefaults = () => {
    setThemeSettings({
      primaryColor: '#3b82f6',
      secondaryColor: '#64748b',
      accentColor: '#f59e0b',
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      fontFamily: 'vazirmatn',
      fontSize: 'medium',
      borderRadius: 'medium',
      logoUrl: '',
      backgroundImage: '',
      darkMode: false,
      compactMode: false,
      animations: true,
    });
    setLayoutSettings({
      headerStyle: 'modern',
      menuLayout: 'cards',
      showPrices: true,
      showDescriptions: true,
      showImages: true,
      showCategories: true,
      itemsPerRow: 3,
      categoryStyle: 'tabs',
    });
    setHasChanges(true);
  };

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'desktop': return <Monitor className="h-4 w-4" />;
      case 'tablet': return <Tablet className="h-4 w-4" />;
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Palette className="h-8 w-8" />
            ظاهر و قالب
          </h1>
          <p className="text-muted-foreground">
            ظاهر و طراحی منوی خود را شخصی‌سازی کنید
          </p>
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <Badge variant="secondary" className="animate-pulse">
              تغییرات ذخیره نشده
            </Badge>
          )}
          <Button variant="outline" onClick={resetToDefaults}>
            <RotateCcw className="ml-2 h-4 w-4" />
            بازگردانی پیش‌فرض
          </Button>
          <Button onClick={saveSettings} disabled={loading || !hasChanges}>
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent ml-2" />
            ) : (
              <Save className="ml-2 h-4 w-4" />
            )}
            ذخیره تغییرات
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Settings Panel */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="colors" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="colors" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                رنگ‌ها
              </TabsTrigger>
              <TabsTrigger value="typography" className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                تایپوگرافی
              </TabsTrigger>
              <TabsTrigger value="layout" className="flex items-center gap-2">
                <Layout className="h-4 w-4" />
                چیدمان
              </TabsTrigger>
              <TabsTrigger value="branding" className="flex items-center gap-2">
                <Brush className="h-4 w-4" />
                برندینگ
              </TabsTrigger>
            </TabsList>

            <TabsContent value="colors" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>رنگ‌های اصلی</CardTitle>
                  <CardDescription>
                    رنگ‌های اصلی قالب خود را انتخاب کنید
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Color Presets */}
                  <div className="space-y-3">
                    <Label>پالت‌های رنگی آماده</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {colorPresets.map((preset, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="h-auto p-3 flex flex-col items-center gap-2"
                          onClick={() => applyColorPreset(preset)}
                        >
                          <div className="flex gap-1">
                            <div 
                              className="w-4 h-4 rounded-full border" 
                              style={{ backgroundColor: preset.primary }}
                            />
                            <div 
                              className="w-4 h-4 rounded-full border" 
                              style={{ backgroundColor: preset.secondary }}
                            />
                            <div 
                              className="w-4 h-4 rounded-full border" 
                              style={{ backgroundColor: preset.accent }}
                            />
                          </div>
                          <span className="text-xs">{preset.name}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Custom Colors */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="primary-color">رنگ اصلی</Label>
                      <div className="flex gap-2">
                        <Input
                          id="primary-color"
                          type="color"
                          value={themeSettings.primaryColor}
                          onChange={(e) => updateThemeSettings('primaryColor', e.target.value)}
                          className="w-16 h-10 p-1 border rounded"
                        />
                        <Input
                          value={themeSettings.primaryColor}
                          onChange={(e) => updateThemeSettings('primaryColor', e.target.value)}
                          placeholder="#3b82f6"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="secondary-color">رنگ ثانویه</Label>
                      <div className="flex gap-2">
                        <Input
                          id="secondary-color"
                          type="color"
                          value={themeSettings.secondaryColor}
                          onChange={(e) => updateThemeSettings('secondaryColor', e.target.value)}
                          className="w-16 h-10 p-1 border rounded"
                        />
                        <Input
                          value={themeSettings.secondaryColor}
                          onChange={(e) => updateThemeSettings('secondaryColor', e.target.value)}
                          placeholder="#64748b"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="accent-color">رنگ تاکیدی</Label>
                      <div className="flex gap-2">
                        <Input
                          id="accent-color"
                          type="color"
                          value={themeSettings.accentColor}
                          onChange={(e) => updateThemeSettings('accentColor', e.target.value)}
                          className="w-16 h-10 p-1 border rounded"
                        />
                        <Input
                          value={themeSettings.accentColor}
                          onChange={(e) => updateThemeSettings('accentColor', e.target.value)}
                          placeholder="#f59e0b"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="background-color">رنگ پس‌زمینه</Label>
                      <div className="flex gap-2">
                        <Input
                          id="background-color"
                          type="color"
                          value={themeSettings.backgroundColor}
                          onChange={(e) => updateThemeSettings('backgroundColor', e.target.value)}
                          className="w-16 h-10 p-1 border rounded"
                        />
                        <Input
                          value={themeSettings.backgroundColor}
                          onChange={(e) => updateThemeSettings('backgroundColor', e.target.value)}
                          placeholder="#ffffff"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Theme Options */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>حالت تاریک</Label>
                        <p className="text-sm text-muted-foreground">
                          فعال‌سازی حالت تاریک برای منو
                        </p>
                      </div>
                      <Switch
                        checked={themeSettings.darkMode}
                        onCheckedChange={(checked) => updateThemeSettings('darkMode', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>انیمیشن‌ها</Label>
                        <p className="text-sm text-muted-foreground">
                          نمایش انیمیشن‌ها و جلوه‌های بصری
                        </p>
                      </div>
                      <Switch
                        checked={themeSettings.animations}
                        onCheckedChange={(checked) => updateThemeSettings('animations', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="typography" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>تنظیمات فونت</CardTitle>
                  <CardDescription>
                    فونت و اندازه متن را تنظیم کنید
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>خانواده فونت</Label>
                      <Select 
                        value={themeSettings.fontFamily} 
                        onValueChange={(value) => updateThemeSettings('fontFamily', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {fontOptions.map((font) => (
                            <SelectItem key={font.value} value={font.value}>
                              {font.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>اندازه فونت</Label>
                      <Select 
                        value={themeSettings.fontSize} 
                        onValueChange={(value) => updateThemeSettings('fontSize', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">کوچک</SelectItem>
                          <SelectItem value="medium">متوسط</SelectItem>
                          <SelectItem value="large">بزرگ</SelectItem>
                          <SelectItem value="extra-large">خیلی بزرگ</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>گردی گوشه‌ها</Label>
                    <Select 
                      value={themeSettings.borderRadius} 
                      onValueChange={(value) => updateThemeSettings('borderRadius', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">بدون گردی</SelectItem>
                        <SelectItem value="small">کم</SelectItem>
                        <SelectItem value="medium">متوسط</SelectItem>
                        <SelectItem value="large">زیاد</SelectItem>
                        <SelectItem value="full">کاملاً گرد</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>حالت فشرده</Label>
                      <p className="text-sm text-muted-foreground">
                        کاهش فاصله‌ها برای نمایش بیشتر محتوا
                      </p>
                    </div>
                    <Switch
                      checked={themeSettings.compactMode}
                      onCheckedChange={(checked) => updateThemeSettings('compactMode', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="layout" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>چیدمان منو</CardTitle>
                  <CardDescription>
                    نحوه نمایش آیتم‌ها و دسته‌بندی‌ها را تنظیم کنید
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>سبک هدر</Label>
                      <Select 
                        value={layoutSettings.headerStyle} 
                        onValueChange={(value: any) => updateLayoutSettings('headerStyle', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="classic">کلاسیک</SelectItem>
                          <SelectItem value="modern">مدرن</SelectItem>
                          <SelectItem value="minimal">مینیمال</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>چیدمان آیتم‌ها</Label>
                      <Select 
                        value={layoutSettings.menuLayout} 
                        onValueChange={(value: any) => updateLayoutSettings('menuLayout', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="grid">شبکه‌ای</SelectItem>
                          <SelectItem value="list">لیستی</SelectItem>
                          <SelectItem value="cards">کارتی</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>سبک دسته‌بندی‌ها</Label>
                      <Select 
                        value={layoutSettings.categoryStyle} 
                        onValueChange={(value: any) => updateLayoutSettings('categoryStyle', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tabs">تب‌ها</SelectItem>
                          <SelectItem value="sidebar">نوار کناری</SelectItem>
                          <SelectItem value="dropdown">منوی کشویی</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>تعداد آیتم در هر ردیف</Label>
                      <Select 
                        value={layoutSettings.itemsPerRow.toString()} 
                        onValueChange={(value) => updateLayoutSettings('itemsPerRow', parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">نمایش اطلاعات</h4>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="flex items-center justify-between">
                        <Label>نمایش قیمت‌ها</Label>
                        <Switch
                          checked={layoutSettings.showPrices}
                          onCheckedChange={(checked) => updateLayoutSettings('showPrices', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label>نمایش توضیحات</Label>
                        <Switch
                          checked={layoutSettings.showDescriptions}
                          onCheckedChange={(checked) => updateLayoutSettings('showDescriptions', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label>نمایش تصاویر</Label>
                        <Switch
                          checked={layoutSettings.showImages}
                          onCheckedChange={(checked) => updateLayoutSettings('showImages', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label>نمایش دسته‌بندی‌ها</Label>
                        <Switch
                          checked={layoutSettings.showCategories}
                          onCheckedChange={(checked) => updateLayoutSettings('showCategories', checked)}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="branding" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>برندینگ</CardTitle>
                  <CardDescription>
                    لوگو و تصاویر برند خود را اضافه کنید
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>لوگوی رستوران</Label>
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center">
                          {themeSettings.logoUrl ? (
                            <img 
                              src={themeSettings.logoUrl} 
                              alt="Logo" 
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <ImageIcon className="h-8 w-8 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 space-y-2">
                          <Input
                            placeholder="آدرس لوگو (URL)"
                            value={themeSettings.logoUrl}
                            onChange={(e) => updateThemeSettings('logoUrl', e.target.value)}
                          />
                          <Button variant="outline" size="sm">
                            <Upload className="ml-2 h-4 w-4" />
                            آپلود لوگو
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>تصویر پس‌زمینه</Label>
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center">
                          {themeSettings.backgroundImage ? (
                            <img 
                              src={themeSettings.backgroundImage} 
                              alt="Background" 
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <ImageIcon className="h-8 w-8 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 space-y-2">
                          <Input
                            placeholder="آدرس تصویر پس‌زمینه (URL)"
                            value={themeSettings.backgroundImage}
                            onChange={(e) => updateThemeSettings('backgroundImage', e.target.value)}
                          />
                          <Button variant="outline" size="sm">
                            <Upload className="ml-2 h-4 w-4" />
                            آپلود تصویر
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Preview Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                پیش‌نمایش
              </CardTitle>
              <CardDescription>
                نمایش زنده تغییرات شما
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Device Selector */}
              <div className="flex items-center gap-1 mb-4 p-1 bg-muted rounded-lg">
                {(['desktop', 'tablet', 'mobile'] as const).map((device) => (
                  <Button
                    key={device}
                    variant={previewDevice === device ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setPreviewDevice(device)}
                    className="flex-1"
                  >
                    {getDeviceIcon(device)}
                  </Button>
                ))}
              </div>

              {/* Preview Frame */}
              <div className="border rounded-lg overflow-hidden">
                <div 
                  className={`
                    transition-all duration-300 mx-auto bg-white
                    ${previewDevice === 'desktop' ? 'w-full h-64' : ''}
                    ${previewDevice === 'tablet' ? 'w-3/4 h-48' : ''}
                    ${previewDevice === 'mobile' ? 'w-1/2 h-40' : ''}
                  `}
                  style={{
                    backgroundColor: themeSettings.backgroundColor,
                    color: themeSettings.textColor,
                    fontFamily: themeSettings.fontFamily,
                  }}
                >
                  {/* Mock Menu Preview */}
                  <div className="p-4 space-y-3">
                    <div 
                      className="h-8 rounded flex items-center px-3"
                      style={{ backgroundColor: themeSettings.primaryColor, color: 'white' }}
                    >
                      <span className="text-sm font-medium">منوی رستوران</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div 
                        className="h-6 rounded"
                        style={{ backgroundColor: themeSettings.secondaryColor + '20' }}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <div 
                          className="h-12 rounded border"
                          style={{ borderColor: themeSettings.primaryColor + '30' }}
                        />
                        <div 
                          className="h-12 rounded border"
                          style={{ borderColor: themeSettings.primaryColor + '30' }}
                        />
                      </div>
                      <div 
                        className="h-4 w-3/4 rounded"
                        style={{ backgroundColor: themeSettings.accentColor + '40' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>رنگ اصلی:</span>
                  <span>{themeSettings.primaryColor}</span>
                </div>
                <div className="flex justify-between">
                  <span>فونت:</span>
                  <span>{fontOptions.find(f => f.value === themeSettings.fontFamily)?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span>چیدمان:</span>
                  <span>{layoutSettings.menuLayout}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                اقدامات سریع
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Download className="ml-2 h-4 w-4" />
                دانلود قالب
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Upload className="ml-2 h-4 w-4" />
                آپلود قالب
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Eye className="ml-2 h-4 w-4" />
                مشاهده منوی زنده
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}