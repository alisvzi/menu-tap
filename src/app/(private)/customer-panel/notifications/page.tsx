"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  Bell, 
  BellRing, 
  Check, 
  X, 
  Settings, 
  Mail, 
  MessageSquare, 
  ShoppingCart,
  TrendingUp,
  AlertCircle,
  Info,
  CheckCircle,
  Clock,
  Trash2
} from "lucide-react";

interface Notification {
  id: string;
  type: 'order' | 'system' | 'promotion' | 'alert' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  orderNotifications: boolean;
  promotionNotifications: boolean;
  systemNotifications: boolean;
  weeklyReports: boolean;
  monthlyReports: boolean;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', type: 'order', title: 'سفارش جدید دریافت شد', message: 'سفارش شماره #1234 برای پیتزا مارگاریتا دریافت شد.', timestamp: '5 دقیقه پیش', read: false, priority: 'high' },
    { id: '2', type: 'system', title: 'به‌روزرسانی سیستم', message: 'سیستم مدیریت منو به نسخه جدید به‌روزرسانی شد.', timestamp: '2 ساعت پیش', read: false, priority: 'medium' },
    { id: '3', type: 'promotion', title: 'فرصت تبلیغاتی جدید', message: 'امکان تبلیغ منوی شما در صفحه اصلی فراهم شده است.', timestamp: '1 روز پیش', read: true, priority: 'low' },
    { id: '4', type: 'alert', title: 'هشدار موجودی', message: 'موجودی آیتم «برگر کلاسیک» رو به اتمام است.', timestamp: '2 روز پیش', read: true, priority: 'high' },
    { id: '5', type: 'info', title: 'گزارش هفتگی', message: 'گزارش فروش هفته گذشته آماده مشاهده است.', timestamp: '3 روز پیش', read: true, priority: 'medium' },
  ]);
  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    orderNotifications: true,
    promotionNotifications: false,
    systemNotifications: true,
    weeklyReports: true,
    monthlyReports: false,
  });
  const [loading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAsUnread = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: false } : notif
      )
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const updateSettings = (key: keyof NotificationSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    // Here you would typically save to API
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <ShoppingCart className="h-4 w-4" />;
      case 'system':
        return <Settings className="h-4 w-4" />;
      case 'promotion':
        return <TrendingUp className="h-4 w-4" />;
      case 'alert':
        return <AlertCircle className="h-4 w-4" />;
      case 'info':
        return <Info className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getNotificationColor = (type: string, priority: string) => {
    if (priority === 'high') return 'text-red-600';
    if (priority === 'medium') return 'text-yellow-600';
    return 'text-blue-600';
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive" className="text-xs">فوری</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="text-xs">متوسط</Badge>;
      case 'low':
        return <Badge variant="outline" className="text-xs">کم</Badge>;
      default:
        return null;
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'read') return notif.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">در حال بارگذاری اعلانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BellRing className="h-8 w-8" />
            اعلانات
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </h1>
          <p className="text-muted-foreground">
            اعلانات و پیام‌های مهم سیستم
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            <CheckCircle className="ml-2 h-4 w-4" />
            همه را خوانده شده علامت بزن
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Notifications List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filter Tabs */}
          <div className="flex items-center gap-2">
            <Button 
              variant={filter === 'all' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setFilter('all')}
            >
              همه ({notifications.length})
            </Button>
            <Button 
              variant={filter === 'unread' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setFilter('unread')}
            >
              خوانده نشده ({unreadCount})
            </Button>
            <Button 
              variant={filter === 'read' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setFilter('read')}
            >
              خوانده شده ({notifications.length - unreadCount})
            </Button>
          </div>

          {/* Notifications */}
          <div className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">اعلانی وجود ندارد</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    {filter === 'unread' 
                      ? 'همه اعلانات خوانده شده‌اند'
                      : 'هیچ اعلانی برای نمایش وجود ندارد'
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredNotifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  className={`transition-all hover:shadow-md ${
                    !notification.read ? 'border-primary/50 bg-primary/5' : ''
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 ${getNotificationColor(notification.type, notification.priority)}`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className={`font-medium ${!notification.read ? 'font-semibold' : ''}`}>
                                {notification.title}
                              </h4>
                              {getPriorityBadge(notification.priority)}
                              {!notification.read && (
                                <div className="w-2 h-2 bg-primary rounded-full" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {notification.timestamp}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            {notification.read ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsUnread(notification.id)}
                                className="h-8 w-8 p-0"
                              >
                                <Mail className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                className="h-8 w-8 p-0"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Notification Settings */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                تنظیمات اعلانات
              </CardTitle>
              <CardDescription>
                نحوه دریافت اعلانات را تنظیم کنید
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">روش‌های اطلاع‌رسانی</h4>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">اعلانات ایمیل</label>
                    <p className="text-xs text-muted-foreground">
                      دریافت اعلانات از طریق ایمیل
                    </p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => updateSettings('emailNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">اعلانات فوری</label>
                    <p className="text-xs text-muted-foreground">
                      دریافت اعلانات فوری در مرورگر
                    </p>
                  </div>
                  <Switch
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => updateSettings('pushNotifications', checked)}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">انواع اعلانات</h4>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">اعلانات سفارش</label>
                    <p className="text-xs text-muted-foreground">
                      سفارشات جدید و تغییرات وضعیت
                    </p>
                  </div>
                  <Switch
                    checked={settings.orderNotifications}
                    onCheckedChange={(checked) => updateSettings('orderNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">اعلانات تبلیغاتی</label>
                    <p className="text-xs text-muted-foreground">
                      فرصت‌های تبلیغاتی و تخفیف‌ها
                    </p>
                  </div>
                  <Switch
                    checked={settings.promotionNotifications}
                    onCheckedChange={(checked) => updateSettings('promotionNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">اعلانات سیستم</label>
                    <p className="text-xs text-muted-foreground">
                      به‌روزرسانی‌ها و تغییرات سیستم
                    </p>
                  </div>
                  <Switch
                    checked={settings.systemNotifications}
                    onCheckedChange={(checked) => updateSettings('systemNotifications', checked)}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">گزارش‌های دوره‌ای</h4>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">گزارش هفتگی</label>
                    <p className="text-xs text-muted-foreground">
                      خلاصه فعالیت‌های هفته
                    </p>
                  </div>
                  <Switch
                    checked={settings.weeklyReports}
                    onCheckedChange={(checked) => updateSettings('weeklyReports', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">گزارش ماهانه</label>
                    <p className="text-xs text-muted-foreground">
                      خلاصه فعالیت‌های ماه
                    </p>
                  </div>
                  <Switch
                    checked={settings.monthlyReports}
                    onCheckedChange={(checked) => updateSettings('monthlyReports', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>آمار اعلانات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>کل اعلانات</span>
                  <span className="font-medium">{notifications.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>خوانده نشده</span>
                  <span className="font-medium text-primary">{unreadCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>اعلانات فوری</span>
                  <span className="font-medium text-red-600">
                    {notifications.filter(n => n.priority === 'high').length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}