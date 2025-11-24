"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category, MenuItem } from "@/types/menu";
import {
  Clock,
  DollarSign,
  Edit,
  Eye,
  EyeOff,
  Plus,
  Search,
  Star,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import MenuItemForm from "./_components/MenuItemForm";
import Link from "next/link";

export default function MenuItemsPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    fetchMenuItems();
    fetchCategories();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/menu-items");
      if (response.ok) {
        const data = await response.json();
        setMenuItems(data.menuItems || []);
      } else {
        toast.error("خطا در بارگذاری آیتم‌های منو");
      }
    } catch (error) {
      console.error("Error fetching menu items:", error);
      toast.error("خطا در بارگذاری آیتم‌های منو");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleDeleteMenuItem = async (itemId: string) => {
    try {
      const response = await fetch(`/api/menu-items/${itemId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("آیتم منو با موفقیت حذف شد");
        fetchMenuItems();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "خطا در حذف آیتم منو");
      }
    } catch (error) {
      console.error("Error deleting menu item:", error);
      toast.error("خطا در حذف آیتم منو");
    }
  };

  const openEditDialog = (item: MenuItem) => {
    setEditingItem(item);
    setIsEditDialogOpen(true);
  };

  // Eliminar las funciones y variables innecesarias que ahora maneja MenuItemForm

  const filteredMenuItems = menuItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.nameEn &&
        item.nameEn.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory =
      selectedCategory === "all" ||
      (typeof item.category === "string"
        ? item.category === selectedCategory
        : item.category._id === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c._id === categoryId);
    return category ? category.name : "نامشخصص";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">آیتم‌های منو</h1>
        <Button asChild>
          <Link href="/customer-panel/menu-items/new">
            <Plus className="ml-2 h-4 w-4" />
            ایجاد آیتم منو جدید
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="جستجو در آیتم‌های منو..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="همه دسته‌بندی‌ها" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه دسته‌بندی‌ها</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {filteredMenuItems.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <Plus className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  {searchTerm || selectedCategory !== "all"
                    ? "آیتمی یافت نشد"
                    : "هنوز آیتمی ندارید"}
                </h3>
                <p className="text-muted-foreground">
                  {searchTerm || selectedCategory !== "all"
                    ? "فیلترهای خود را تغییر دهید"
                    : "اولین آیتم منو خود را ایجاد کنید"}
                </p>
              </div>
              {!searchTerm && selectedCategory === "all" && (
                <Button asChild>
                  <Link href="/customer-panel/menu-items/new">
                    <Plus className="ml-2 h-4 w-4" />
                    ایجاد آیتم
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredMenuItems.map((item) => (
            <Card key={item._id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      {item.isPopular && (
                        <Badge variant="default" className="bg-yellow-500">
                          <Star className="ml-1 h-3 w-3" />
                          محبوب
                        </Badge>
                      )}
                    </div>
                    {item.nameEn && (
                      <CardDescription>{item.nameEn}</CardDescription>
                    )}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="outline">
                        {typeof item.category === "string"
                          ? getCategoryName(item.category)
                          : item.category.name}
                      </Badge>
                      <Badge variant="outline">
                        <DollarSign className="ml-1 h-3 w-3" />
                        {item.price.toLocaleString()} تومان
                      </Badge>
                      {item.preparationTime && (
                        <Badge variant="outline">
                          <Clock className="ml-1 h-3 w-3" />
                          {item.preparationTime} دقیقه
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={item.isAvailable ? "default" : "secondary"}>
                      {item.isAvailable ? "موجود" : "ناموجود"}
                    </Badge>
                    <Badge variant={item.isVisible ? "default" : "outline"}>
                      {item.isVisible ? (
                        <>
                          <Eye className="ml-1 h-3 w-3" /> قابل مشاهده
                        </>
                      ) : (
                        <>
                          <EyeOff className="ml-1 h-3 w-3" /> مخفی
                        </>
                      )}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {item.description && (
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-1">
                    {item.isVegetarian && (
                      <Badge variant="outline" className="text-green-600">
                        گیاهی
                      </Badge>
                    )}
                    {item.isVegan && (
                      <Badge variant="outline" className="text-green-600">
                        وگان
                      </Badge>
                    )}
                    {item.isGlutenFree && (
                      <Badge variant="outline" className="text-blue-600">
                        بدون گلوتن
                      </Badge>
                    )}
                    {item.isSpicy && (
                      <Badge variant="outline" className="text-red-600">
                        تند
                      </Badge>
                    )}
                    {item.calories && (
                      <Badge variant="outline">{item.calories} کالری</Badge>
                    )}
                  </div>

                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {item.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {item.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          {item.originalPrice.toLocaleString()} تومان
                        </span>
                      )}
                      <span className="font-semibold text-lg">
                        {item.price.toLocaleString()} تومان
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(item)}
                      >
                        <Edit className="ml-1 h-3 w-3" />
                        ویرایش
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="ml-1 h-3 w-3" />
                            حذف
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>حذف آیتم منو</AlertDialogTitle>
                            <AlertDialogDescription>
                              آیا مطمئن هستید که می‌خواهید آیتم «{item.name}» را
                              حذف کنید؟ این عمل قابل بازگشت نیست.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>انصراف</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteMenuItem(item._id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              حذف
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>ویرایش آیتم منو</DialogTitle>
            <DialogDescription>
              اطلاعات آیتم منو را ویرایش کنید
            </DialogDescription>
          </DialogHeader>
          {editingItem && (
            <MenuItemForm
              categories={categories}
              onCancel={() => setIsEditDialogOpen(false)}
              onSuccess={() => {
                setIsEditDialogOpen(false);
                fetchMenuItems();
              }}
              mode="edit"
              item={editingItem}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
