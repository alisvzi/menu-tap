"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { 
  Palette, 
  Eye, 
  Save, 
  RotateCcw, 
  Download, 
  Upload,
  Pipette,
  Smartphone,
  Monitor,
  Tablet
} from "lucide-react";

interface ColorScheme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  muted: string;
  border: string;
  isCustom?: boolean;
}

interface ColorSettings {
  scheme: ColorScheme;
  darkMode: boolean;
  contrast: number;
  saturation: number;
  brightness: number;
  autoAdapt: boolean;
}

export default function ColorsPage() {
  const [presetSchemes] = useState<ColorScheme[]>([
    {
      id: 'default',
      name: 'پیش‌فرض',
      primary: '#3b82f6',
      secondary: '#64748b',
      accent: '#f59e0b',
      background: '#ffffff',
      text: '#0f172a',
      muted: '#f1f5f9',
      border: '#e2e8f0'
    },
    {
      id: 'warm',
      name: 'گرم',
      primary: '#dc2626',
      secondary: '#7c2d12',
      accent: '#ea580c',
      background: '#fef7ed',
      text: '#1c1917',
      muted: '#fed7aa',
      border: '#fdba74'
    },
    {
      id: 'cool',
      name: 'سرد',
      primary: '#0891b2',
      secondary: '#0f766e',
      accent: '#06b6d4',
      background: '#f0fdfa',
      text: '#134e4a',
      muted: '#a7f3d0',
      border: '#6ee7b7'
    },
    {
      id: 'elegant',
      name: 'شیک',
      primary: '#7c3aed',
      secondary: '#4c1d95',
      accent: '#a855f7',
      background: '#faf7ff',
      text: '#2e1065',
      muted: '#e9d5ff',
      border: '#c4b5fd'
    },
    {
      id: 'nature',
      name: 'طبیعی',
      primary: '#16a34a',
      secondary: '#15803d',
      accent: '#22c55e',
      background: '#f7fee7',
      text: '#14532d',
      muted: '#bbf7d0',
      border: '#86efac'
    },
    {
      id: 'sunset',
      name: 'غروب',
      primary: '#f97316',
      secondary: '#ea580c',
      accent: '#fb923c',
      background: '#fff7ed',
      text: '#9a3412',
      muted: '#fed7aa',
      border: '#fdba74'
    }
  ]);

  const [colorSettings, setColorSettings] = useState<ColorSettings>({
    scheme: presetSchemes[0],
    darkMode: false,
    contrast: 100,
    saturation: 100,
    brightness: 100,
    autoAdapt: false
  });

  const [customColors, setCustomColors] = useState<ColorScheme>({
    id: 'custom',
    name: 'سفارشی',
    primary: '#3b82f6',
    secondary: '#64748b',
    accent: '#f59e0b',
    background: '#ffffff',
    text: '#0f172a',
    muted: '#f1f5f9',
    border: '#e2e8f0',
    isCustom: true
  });

  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [loading, setLoading] = useState(false);

  const updateColorSettings = (key: keyof ColorSettings, value: any) => {
    setColorSettings(prev => ({ ...prev, [key]: value }));
  };

  const updateCustomColor = (key: keyof ColorScheme, value: string) => {
    setCustomColors(prev => ({ ...prev, [key]: value }));
  };

  const applyScheme = (scheme: ColorScheme) => {
    setColorSettings(prev => ({ ...prev, scheme }));
  };

  const applyCustomScheme = () => {
    setColorSettings(prev => ({ ...prev, scheme: customColors }));
  };

  const resetToDefault = () => {
    setColorSettings({
      scheme: presetSchemes[0],
      darkMode: false,
      contrast: 100,
      saturation: 100,
      brightness: 100,
      autoAdapt: false
    });
    setCustomColors({
      id: 'custom',
      name: 'سفارشی',
      primary: '#3b82f6',
      secondary: '#64748b',
      accent: '#f59e0b',
      background: '#ffffff',
      text: '#0f172a',
      muted: '#f1f5f9',
      border: '#e2e8f0',
      isCustom: true
    });
  };

  const saveColors = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Show success message
    } catch (error) {
      console.error('Error saving colors:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportColors = () => {
    const data = {
      colorSettings,
      customColors,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'menu-colors.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const getPreviewStyle = () => {
    const { scheme, contrast, saturation, brightness } = colorSettings;
    return {
      backgroundColor: scheme.background,
      color: scheme.text,
      filter: `contrast(${contrast}%) saturate(${saturation}%) brightness(${brightness}%)`,
      borderColor: scheme.border
    };
  };

  const ColorPicker = ({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        <div 
          className="w-10 h-10 rounded border-2 border-muted cursor-pointer"
          style={{ backgroundColor: value }}
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'color';
            input.value = value;
            input.onchange = (e) => onChange((e.target as HTMLInputElement).value);
            input.click();
          }}
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="font-mono"
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Palette className="h-8 w-8" />
            رنگ‌ها و تم
          </h1>
          <p className="text-muted-foreground">
            رنگ‌های منوی خود را شخصی‌سازی کنید
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={exportColors}>
            <Download className="ml-2 h-4 w-4" />
            خروجی
          </Button>
          <Button variant="outline" onClick={resetToDefault}>
            <RotateCcw className="ml-2 h-4 w-4" />
            بازنشانی
          </Button>
          <Button onClick={saveColors} disabled={loading}>
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent ml-2" />
            ) : (
              <Save className="ml-2 h-4 w-4" />
            )}
            ذخیره
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="presets" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="presets">قالب‌های آماده</TabsTrigger>
              <TabsTrigger value="custom">رنگ‌های سفارشی</TabsTrigger>
              <TabsTrigger value="advanced">تنظیمات پیشرفته</TabsTrigger>
            </TabsList>

            <TabsContent value="presets" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>قالب‌های رنگی آماده</CardTitle>
                  <CardDescription>
                    از قالب‌های از پیش طراحی شده استفاده کنید
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {presetSchemes.map((scheme) => (
                      <div 
                        key={scheme.id}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                          colorSettings.scheme.id === scheme.id ? 'border-primary' : 'border-muted'
                        }`}
                        onClick={() => applyScheme(scheme)}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">{scheme.name}</h4>
                          {colorSettings.scheme.id === scheme.id && (
                            <Badge>انتخاب شده</Badge>
                          )}
                        </div>
                        
                        <div className="flex gap-2 mb-3">
                          <div 
                            className="w-6 h-6 rounded border"
                            style={{ backgroundColor: scheme.primary }}
                            title="اصلی"
                          />
                          <div 
                            className="w-6 h-6 rounded border"
                            style={{ backgroundColor: scheme.secondary }}
                            title="ثانویه"
                          />
                          <div 
                            className="w-6 h-6 rounded border"
                            style={{ backgroundColor: scheme.accent }}
                            title="تاکیدی"
                          />
                          <div 
                            className="w-6 h-6 rounded border"
                            style={{ backgroundColor: scheme.background }}
                            title="پس‌زمینه"
                          />
                          <div 
                            className="w-6 h-6 rounded border"
                            style={{ backgroundColor: scheme.text }}
                            title="متن"
                          />
                        </div>

                        <div 
                          className="h-16 rounded border p-2 text-xs"
                          style={{ 
                            backgroundColor: scheme.background,
                            color: scheme.text,
                            borderColor: scheme.border
                          }}
                        >
                          <div 
                            className="px-2 py-1 rounded text-white text-center"
                            style={{ backgroundColor: scheme.primary }}
                          >
                            نمونه منو
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="custom" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>رنگ‌های سفارشی</CardTitle>
                  <CardDescription>
                    رنگ‌های دلخواه خود را انتخاب کنید
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <ColorPicker
                      label="رنگ اصلی"
                      value={customColors.primary}
                      onChange={(value) => updateCustomColor('primary', value)}
                    />
                    
                    <ColorPicker
                      label="رنگ ثانویه"
                      value={customColors.secondary}
                      onChange={(value) => updateCustomColor('secondary', value)}
                    />
                    
                    <ColorPicker
                      label="رنگ تاکیدی"
                      value={customColors.accent}
                      onChange={(value) => updateCustomColor('accent', value)}
                    />
                    
                    <ColorPicker
                      label="پس‌زمینه"
                      value={customColors.background}
                      onChange={(value) => updateCustomColor('background', value)}
                    />
                    
                    <ColorPicker
                      label="رنگ متن"
                      value={customColors.text}
                      onChange={(value) => updateCustomColor('text', value)}
                    />
                    
                    <ColorPicker
                      label="رنگ کم‌رنگ"
                      value={customColors.muted}
                      onChange={(value) => updateCustomColor('muted', value)}
                    />
                  </div>

                  <Button onClick={applyCustomScheme} className="w-full">
                    <Pipette className="ml-2 h-4 w-4" />
                    اعمال رنگ‌های سفارشی
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>تنظیمات پیشرفته</CardTitle>
                  <CardDescription>
                    تنظیمات دقیق‌تر رنگ‌ها و نمایش
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>حالت تاریک</Label>
                      <p className="text-sm text-muted-foreground">
                        فعال‌سازی تم تاریک برای منو
                      </p>
                    </div>
                    <Switch
                      checked={colorSettings.darkMode}
                      onCheckedChange={(checked) => updateColorSettings('darkMode', checked)}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>کنتراست: {colorSettings.contrast}%</Label>
                    <Slider
                      value={[colorSettings.contrast]}
                      onValueChange={([value]) => updateColorSettings('contrast', value)}
                      min={50}
                      max={150}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>اشباع رنگ: {colorSettings.saturation}%</Label>
                    <Slider
                      value={[colorSettings.saturation]}
                      onValueChange={([value]) => updateColorSettings('saturation', value)}
                      min={0}
                      max={200}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>روشنایی: {colorSettings.brightness}%</Label>
                    <Slider
                      value={[colorSettings.brightness]}
                      onValueChange={([value]) => updateColorSettings('brightness', value)}
                      min={50}
                      max={150}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>تطبیق خودکار</Label>
                      <p className="text-sm text-muted-foreground">
                        تطبیق رنگ‌ها با تصاویر منو
                      </p>
                    </div>
                    <Switch
                      checked={colorSettings.autoAdapt}
                      onCheckedChange={(checked) => updateColorSettings('autoAdapt', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                پیش‌نمایش زنده
              </CardTitle>
              <CardDescription>
                نمایش تغییرات در زمان واقعی
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Button
                  variant={previewDevice === 'mobile' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewDevice('mobile')}
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
                <Button
                  variant={previewDevice === 'tablet' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewDevice('tablet')}
                >
                  <Tablet className="h-4 w-4" />
                </Button>
                <Button
                  variant={previewDevice === 'desktop' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewDevice('desktop')}
                >
                  <Monitor className="h-4 w-4" />
                </Button>
              </div>

              <div 
                className={`border-2 rounded-lg overflow-hidden ${
                  previewDevice === 'mobile' ? 'w-full max-w-sm mx-auto' :
                  previewDevice === 'tablet' ? 'w-full max-w-md mx-auto' :
                  'w-full'
                }`}
                style={getPreviewStyle()}
              >
                <div 
                  className="p-3 text-white text-center font-medium"
                  style={{ backgroundColor: colorSettings.scheme.primary }}
                >
                  رستوران نمونه
                </div>
                
                <div className="p-4 space-y-3">
                  <div 
                    className="p-3 rounded border"
                    style={{ 
                      backgroundColor: colorSettings.scheme.muted,
                      borderColor: colorSettings.scheme.border
                    }}
                  >
                    <h4 className="font-medium mb-1">غذای اصلی</h4>
                    <p className="text-sm opacity-75">توضیحات غذا</p>
                    <div 
                      className="text-sm font-medium mt-2"
                      style={{ color: colorSettings.scheme.accent }}
                    >
                      ۱۲۰,۰۰۰ تومان
                    </div>
                  </div>

                  <div 
                    className="p-3 rounded border"
                    style={{ 
                      backgroundColor: colorSettings.scheme.muted,
                      borderColor: colorSettings.scheme.border
                    }}
                  >
                    <h4 className="font-medium mb-1">نوشیدنی</h4>
                    <p className="text-sm opacity-75">توضیحات نوشیدنی</p>
                    <div 
                      className="text-sm font-medium mt-2"
                      style={{ color: colorSettings.scheme.accent }}
                    >
                      ۲۵,۰۰۰ تومان
                    </div>
                  </div>

                  <button 
                    className="w-full p-2 rounded text-white font-medium"
                    style={{ backgroundColor: colorSettings.scheme.secondary }}
                  >
                    سفارش
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>اطلاعات رنگ فعلی</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>قالب:</span>
                  <span className="font-medium">{colorSettings.scheme.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>رنگ اصلی:</span>
                  <span className="font-mono">{colorSettings.scheme.primary}</span>
                </div>
                <div className="flex justify-between">
                  <span>کنتراست:</span>
                  <span>{colorSettings.contrast}%</span>
                </div>
                <div className="flex justify-between">
                  <span>حالت تاریک:</span>
                  <span>{colorSettings.darkMode ? 'فعال' : 'غیرفعال'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}