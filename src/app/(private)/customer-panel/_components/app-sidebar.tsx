"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/lib/auth/context";
import {
  BarChart3,
  Bell,
  Building2,
  ChevronDown,
  CreditCard,
  Edit,
  Eye,
  Globe,
  HelpCircle,
  Home,
  LogOut,
  Menu,
  MessageSquare,
  Palette,
  Plus,
  Settings,
  Store,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface Business {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
}

export function AppSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [expandedSections, setExpandedSections] = useState<string[]>(["main"]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/providers?owner=me&limit=10");
      if (response.ok) {
        const data = await response.json();
        setBusinesses(data.businesses || []);
      }
    } catch (error) {
      console.error("Error fetching businesses:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path);
  };

  const mainMenuItems = [
    {
      title: "پیشخوان",
      url: "/customer-panel",
      icon: Home,
      badge: null,
    },
    {
      title: "کسب‌وکارهای من",
      url: "/customer-panel/businesses",
      icon: Building2,
      badge: businesses.length > 0 ? businesses.length.toString() : null,
    },
    {
      title: "آمار و گزارشات",
      url: "/customer-panel/analytics",
      icon: BarChart3,
      badge: null,
    },
    {
      title: "اعلانات",
      url: "/customer-panel/notifications",
      icon: Bell,
      badge: "3", // This would come from API
    },
  ];

  const businessMenuItems = [
    {
      title: "مدیریت منو",
      icon: Menu,
      items: [
        {
          title: "دسته‌بندی‌ها",
          url: "/customer-panel/categories",
          icon: Menu,
        },
        {
          title: "آیتم‌های منو",
          url: "/customer-panel/menu-items",
          icon: Store,
        },
        {
          title: "افزودن آیتم جدید",
          url: "/customer-panel/menu-items/new",
          icon: Plus,
        },
      ],
    },
    {
      title: "ظاهر و قالب",
      icon: Palette,
      items: [
        {
          title: "تنظیمات ظاهری",
          url: "/customer-panel/appearance",
          icon: Palette,
        },
        {
          title: "سفارشی‌سازی رنگ‌ها",
          url: "/customer-panel/colors",
          icon: Palette,
        },
      ],
    },
    {
      title: "مدیریت محتوا",
      icon: Edit,
      items: [
        {
          title: "تصاویر و رسانه",
          url: "/customer-panel/media",
          icon: Eye,
        },
        {
          title: "نمایش منو",
          url: "/customer-panel/preview",
          icon: Globe,
        },
      ],
    },
    {
      title: "بازخورد و نظرات",
      icon: MessageSquare,
      items: [
        {
          title: "نظرات مشتریان",
          url: "/customer-panel/reviews",
          icon: MessageSquare,
        },
      ],
    },
  ];

  const accountMenuItems = [
    {
      title: "تنظیمات حساب",
      url: "/customer-panel/account",
      icon: Settings,
    },
    {
      title: "صورت‌حساب و پرداخت",
      url: "/customer-panel/billing",
      icon: CreditCard,
    },
    {
      title: "پشتیبانی",
      url: "/customer-panel/support",
      icon: HelpCircle,
    },
  ];

  return (
    <Sidebar
      side="right"
      collapsible="icon"
      className="border-l bg-background text-foreground"
    >
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-6">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Store className="w-4 h-4 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold">منوتپ</h2>
            <p className="text-xs text-muted-foreground">پنل مدیریت</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {/* Main Menu */}
        <SidebarGroup>
          <SidebarGroupLabel>منوی اصلی</SidebarGroupLabel>
          <SidebarMenu>
            {mainMenuItems.map((item) => (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive(item.url)}
                  className="justify-start"
                >
                  <Link href={item.url}>
                    <item.icon className="ml-2 size-4" />
                    {item.title}
                    {item.badge && (
                      <Badge variant="secondary" className="mr-auto text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <Separator className="my-4" />

        {/* Quick Actions */}
        <SidebarGroup>
          <SidebarGroupLabel>عملیات سریع</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/customer-panel/businesses/new">
                  <Plus className="ml-2 size-4" />
                  کسب‌وکار جدید
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/customer-panel/menu-items/new">
                  <Store className="ml-2 size-4" />
                  آیتم منو جدید
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <Separator className="my-4" />

        {/* My Businesses */}
        {businesses.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel
              className="cursor-pointer flex items-center justify-between"
              onClick={() => toggleSection("businesses")}
            >
              کسب‌وکارهای من
              <ChevronDown
                className={`size-4 transition-transform ${
                  expandedSections.includes("businesses") ? "rotate-180" : ""
                }`}
              />
            </SidebarGroupLabel>
            {expandedSections.includes("businesses") && (
              <SidebarMenu>
                {businesses.slice(0, 5).map((business) => (
                  <SidebarMenuItem key={business._id}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname.includes(business._id)}
                    >
                      <Link href={`/customer-panel/businesses/${business._id}`}>
                        <Building2 className="ml-2 size-4" />
                        <span className="truncate">{business.name}</span>
                        {!business.isActive && (
                          <Badge
                            variant="secondary"
                            className="mr-auto text-xs"
                          >
                            غیرفعال
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                {businesses.length > 5 && (
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/customer-panel/businesses">
                        <span className="text-xs text-muted-foreground">
                          مشاهده همه ({businesses.length})
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            )}
          </SidebarGroup>
        )}

        {/* Business Management */}
        <Separator className="my-4" />
        <SidebarGroup>
          <SidebarGroupLabel>مدیریت کسب‌وکار</SidebarGroupLabel>
          <SidebarMenu>
            {businessMenuItems.map((section) => (
              <SidebarMenuItem key={section.title}>
                <SidebarMenuButton
                  onClick={() => toggleSection(section.title)}
                  className="justify-between"
                >
                  <div className="flex items-center gap-2">
                    <section.icon className="ml-2 size-4" />
                    {section.title}
                  </div>
                  <ChevronDown
                    className={`size-4 transition-transform ${
                      expandedSections.includes(section.title)
                        ? "rotate-180"
                        : ""
                    }`}
                  />
                </SidebarMenuButton>
                {expandedSections.includes(section.title) && (
                  <SidebarMenuSub>
                    {section.items.map((item) => (
                      <SidebarMenuSubItem key={item.url}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={isActive(item.url)}
                        >
                          <Link href={item.url}>
                            <item.icon className="ml-2 size-4" />
                            {item.title}
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <Separator className="my-4" />

        {/* Account & Settings */}
        <SidebarGroup>
          <SidebarGroupLabel>حساب کاربری</SidebarGroupLabel>
          <SidebarMenu>
            {accountMenuItems.map((item) => (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive(item.url)}
                  className="justify-start"
                >
                  <Link href={item.url}>
                    <item.icon className="ml-2 size-4" />
                    {item.title}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <div className="space-y-2">
          <SidebarMenuButton
            asChild
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <button
              type="button"
              className="flex items-center gap-2"
              onClick={logout}
            >
              <LogOut className="size-4" />
              خروج از حساب
            </button>
          </SidebarMenuButton>
          <div className="text-xs text-center text-muted-foreground pt-2">
            <span>نسخه 1.0.0</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
