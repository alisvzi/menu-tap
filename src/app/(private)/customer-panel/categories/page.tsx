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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Category, SubcategoryInput } from "@/types/menu";
import { uploadFiles } from "@/utility/uploads";
import {
  Edit,
  Eye,
  EyeOff,
  GripVertical,
  Plus,
  Store,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface CategoryFormData {
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  slug: string;
  order: number;
  isActive: boolean;
  isVisible: boolean;
  image?: string;
  subcategories?: SubcategoryInput[];
}

export default function CategoriesPage() {
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [providers, setProviders] = useState<
    Array<{ _id: string; name: string; slug: string; isCompleted: boolean }>
  >([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    nameEn: "",
    description: "",
    descriptionEn: "",
    slug: "",
    order: 0,
    isActive: true,
    isVisible: true,
    subcategories: [],
  });
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof CategoryFormData, string>>
  >({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const preset = searchParams.get("businessId");
    fetchProviders().then(() => {
      if (preset) {
        setSelectedBusinessId(preset);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedBusinessId) {
      fetchCategories();
    }
  }, [selectedBusinessId]);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/providers?owner=me&limit=100");
      if (res.ok) {
        const data = await res.json();
        const list = (data.data || data.businesses || []) as Array<{
          _id: string;
          name: string;
          slug: string;
          isCompleted: boolean;
        }>;
        setProviders(list);
        const first = list.find((p) => p.isCompleted) || list[0];
        setSelectedBusinessId(first?._id || "");
      }
    } catch (error) {
      console.error("Error fetching providers:", error);
      toast.error("خطا در بارگذاری مجموعه‌ها");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    if (!selectedBusinessId) return;
    try {
      setLoading(true);
      const response = await fetch(
        `/api/categories?businessId=${selectedBusinessId}`
      );
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      } else {
        toast.error("خطا در بارگذاری دسته‌بندی‌ها");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("خطا در بارگذاری دسته‌بندی‌ها");
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\u0600-\u06FF\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const validateForm = (
    data: CategoryFormData
  ): Partial<Record<keyof CategoryFormData, string>> => {
    const errors: Partial<Record<keyof CategoryFormData, string>> = {};

    if (!data.name.trim()) {
      errors.name = "نام دسته‌بندی الزامی است";
    }

    if (!data.slug.trim()) {
      errors.slug = "نامک (slug) الزامی است";
    } else if (!/^[a-z0-9-]+$/.test(data.slug)) {
      errors.slug =
        "نامک فقط می‌تواند شامل حروف کوچک انگلیسی، اعداد و خط تیره باشد";
    }

    if (data.order < 0) {
      errors.order = "ترتیب نمایش نمی‌تواند منفی باشد";
    }

    return errors;
  };

  const resetForm = () => {
    setFormData({
      name: "",
      nameEn: "",
      description: "",
      descriptionEn: "",
      slug: "",
      order: categories.length,
      isActive: true,
      isVisible: true,
      image: undefined,
      subcategories: [],
    });
    setFormErrors({});
  };

  const handleEditCategory = async () => {
    if (!editingCategory) return;

    const errors = validateForm(formData);
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch(`/api/categories/${editingCategory._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, business: selectedBusinessId }),
      });

      if (response.ok) {
        toast.success("دسته‌بندی با موفقیت ویرایش شد");
        setIsEditDialogOpen(false);
        setEditingCategory(null);
        resetForm();
        fetchCategories();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "خطا در ویرایش دسته‌بندی");
      }
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("خطا در ویرایش دسته‌بندی");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("دسته‌بندی با موفقیت حذف شد");
        fetchCategories();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "خطا در حذف دسته‌بندی");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("خطا در حذف دسته‌بندی");
    }
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      nameEn: category.nameEn || "",
      description: category.description || "",
      descriptionEn: category.descriptionEn || "",
      slug: category.slug,
      order: category.order,
      isActive: category.isActive,
      isVisible: category.isVisible,
      subcategories: (category.subcategories || []).map((sc) => ({
        name_fa: sc.name_fa,
        name_en: sc.name_en || "",
      })),
    });
    setFormErrors({});
    setIsEditDialogOpen(true);
  };

  const handleNameChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      name: value,
      slug: prev.slug || generateSlug(value),
    }));
  };

  const addSubcategory = () => {
    setFormData((prev) => ({
      ...prev,
      subcategories: [
        ...(prev.subcategories || []),
        {
          name_fa: "",
          name_en: "",
        },
      ],
    }));
  };

  const removeSubcategory = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      subcategories: (prev.subcategories || []).filter((_, i) => i !== index),
    }));
  };

  const updateSubcategoryField = (
    index: number,
    field: keyof SubcategoryInput,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      subcategories: (prev.subcategories || []).map((sc, i) =>
        i === index ? { ...sc, [field]: value } : sc
      ),
    }));
  };

  const handleSubcategoryNameFaChange = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      subcategories: (prev.subcategories || []).map((sc, i) =>
        i === index ? { ...sc, name_fa: value } : sc
      ),
    }));
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">دسته‌بندی‌ها</h1>
          <p className="text-muted-foreground">
            دسته‌بندی‌های منوی خود را مدیریت کنید
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5" />
            <Select
              value={selectedBusinessId}
              onValueChange={setSelectedBusinessId}
            >
              <SelectTrigger className="min-w-[220px]">
                <SelectValue placeholder="انتخاب مجموعه" />
              </SelectTrigger>
              <SelectContent>
                {providers.map((p) => (
                  <SelectItem key={p._id} value={p._id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {!providers.length && (
            <Button asChild>
              <Link href="/customer-panel/businesses/new">ایجاد مجموعه</Link>
            </Button>
          )}
        </div>
        <Button asChild>
          <Link
            href={`/customer-panel/categories/new?businessId=${selectedBusinessId}`}
          >
            <Plus className="ml-2 h-4 w-4" />
            دسته‌بندی جدید
          </Link>
        </Button>

        <div className="hidden">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">نام دسته‌بندی *</FieldLabel>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="مثال: پیش غذا"
              />
              {formErrors.name && <FieldError>{formErrors.name}</FieldError>}
            </Field>

            <Field>
              <FieldLabel htmlFor="nameEn">نام انگلیسی</FieldLabel>
              <Input
                id="nameEn"
                value={formData.nameEn}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    nameEn: e.target.value,
                  }))
                }
                placeholder="Appetizers"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="slug">نامک (Slug) *</FieldLabel>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, slug: e.target.value }))
                }
                placeholder="appetizers"
              />
              <FieldDescription>
                نامک برای URL استفاده می‌شود و باید منحصر به فرد باشد
              </FieldDescription>
              {formErrors.slug && <FieldError>{formErrors.slug}</FieldError>}
            </Field>

            <Field>
              <FieldLabel htmlFor="description">توضیحات</FieldLabel>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="توضیحات دسته‌بندی..."
                rows={3}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="descriptionEn">توضیحات انگلیسی</FieldLabel>
              <Textarea
                id="descriptionEn"
                value={formData.descriptionEn}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    descriptionEn: e.target.value,
                  }))
                }
                placeholder="Category description in English..."
                rows={3}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="order">ترتیب نمایش</FieldLabel>
              <Input
                id="order"
                type="number"
                min="0"
                value={formData.order}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    order: parseInt(e.target.value) || 0,
                  }))
                }
              />
              <FieldDescription>
                عدد کمتر در ابتدای لیست نمایش داده می‌شود
              </FieldDescription>
              {formErrors.order && <FieldError>{formErrors.order}</FieldError>}
            </Field>

            <Field>
              <FieldLabel>تصویر دسته‌بندی</FieldLabel>
              {formData.image ? (
                <div className="flex items-center gap-3">
                  <img
                    src={formData.image}
                    alt="تصویر دسته"
                    className="w-20 h-20 object-cover rounded"
                  />
                  <Button
                    variant="outline"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, image: undefined }))
                    }
                  >
                    حذف تصویر
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={async () => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = "image/*";
                    input.onchange = async () => {
                      const f = input.files?.[0] as File | undefined;
                      if (!f) return;
                      try {
                        const uploaded = await uploadFiles([f], "categories");
                        const first = uploaded[0];
                        if (first?.url) {
                          setFormData((prev) => ({
                            ...prev,
                            image: first.url,
                          }));
                        }
                      } catch (e) {
                        console.error(e);
                        toast.error("آپلود تصویر ناموفق بود");
                      }
                    };
                    input.click();
                  }}
                >
                  انتخاب تصویر
                </Button>
              )}
              <FieldDescription>
                یک تصویر برای نمایش دسته‌بندی انتخاب کنید
              </FieldDescription>
            </Field>

            <Separator />
            <div className="space-y-3">
              <h4 className="font-medium text-lg">زیر دسته‌ها</h4>
              <FieldDescription>
                برای این دسته می‌توانید زیر دسته‌ها را اضافه کنید
              </FieldDescription>
              {(formData.subcategories || []).length === 0 ? (
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addSubcategory}
                  >
                    افزودن زیر دسته
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {(formData.subcategories || []).map((sc, index) => (
                    <div key={index} className="border rounded p-3 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Field>
                          <FieldLabel>نام زیر دسته *</FieldLabel>
                          <Input
                            value={sc.name_fa}
                            onChange={(e) =>
                              handleSubcategoryNameFaChange(
                                index,
                                e.target.value
                              )
                            }
                            placeholder="مثال: پیتزا کلاسیک"
                          />
                        </Field>
                        <Field>
                          <FieldLabel>نام انگلیسی</FieldLabel>
                          <Input
                            value={sc.name_en || ""}
                            onChange={(e) =>
                              updateSubcategoryField(
                                index,
                                "name_en",
                                e.target.value
                              )
                            }
                            placeholder="Classic Pizza"
                          />
                        </Field>
                      </div>
                      <div className="flex justify-between">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => removeSubcategory(index)}
                        >
                          حذف
                        </Button>
                        {index ===
                          (formData.subcategories || []).length - 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={addSubcategory}
                          >
                            افزودن زیر دسته
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field orientation="horizontal">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, isActive: checked }))
                  }
                />
                <FieldLabel htmlFor="isActive">فعال</FieldLabel>
              </Field>

              <Field orientation="horizontal">
                <Switch
                  id="isVisible"
                  checked={formData.isVisible}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, isVisible: checked }))
                  }
                />
                <FieldLabel htmlFor="isVisible">قابل مشاهده</FieldLabel>
              </Field>
            </div>
          </FieldGroup>
        </div>
      </div>

      {categories.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <Plus className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  هنوز دسته‌بندی‌ای ندارید
                </h3>
                <p className="text-muted-foreground">
                  اولین دسته‌بندی خود را ایجاد کنید
                </p>
              </div>
              <Button asChild>
                <Link
                  href={`/customer-panel/categories/new?businessId=${selectedBusinessId}`}
                >
                  <Plus className="ml-2 h-4 w-4" />
                  ایجاد دسته‌بندی
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {categories.map((category) => (
            <Card key={category._id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                    <div>
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      {category.nameEn && (
                        <CardDescription>{category.nameEn}</CardDescription>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={category.isActive ? "default" : "secondary"}
                    >
                      {category.isActive ? "فعال" : "غیرفعال"}
                    </Badge>
                    <Badge variant={category.isVisible ? "default" : "outline"}>
                      {category.isVisible ? (
                        <>
                          <Eye className="ml-1 h-3 w-3" /> قابل مشاهده
                        </>
                      ) : (
                        <>
                          <EyeOff className="ml-1 h-3 w-3" /> مخفی
                        </>
                      )}
                    </Badge>
                    <Badge variant="outline">ترتیب: {category.order}</Badge>
                    {category.itemsCount !== undefined && (
                      <Badge variant="secondary">
                        {category.itemsCount} آیتم
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {category.description && (
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      نامک: {category.slug}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(category)}
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
                            <AlertDialogTitle>حذف دسته‌بندی</AlertDialogTitle>
                            <AlertDialogDescription>
                              آیا مطمئن هستید که می‌خواهید دسته‌بندی «
                              {category.name}» را حذف کنید؟ این عمل قابل بازگشت
                              نیست.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>انصراف</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteCategory(category._id)}
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>ویرایش دسته‌بندی</DialogTitle>
            <DialogDescription>
              اطلاعات دسته‌بندی را ویرایش کنید
            </DialogDescription>
          </DialogHeader>
          <FieldSet className="space-y-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="edit-name">نام دسته‌بندی *</FieldLabel>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="مثال: پیش غذا"
                />
                {formErrors.name && <FieldError>{formErrors.name}</FieldError>}
              </Field>

              <Field>
                <FieldLabel htmlFor="edit-nameEn">نام انگلیسی</FieldLabel>
                <Input
                  id="edit-nameEn"
                  value={formData.nameEn}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, nameEn: e.target.value }))
                  }
                  placeholder="Appetizers"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="edit-slug">نامک (Slug) *</FieldLabel>
                <Input
                  id="edit-slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  placeholder="appetizers"
                />
                <FieldDescription>
                  نامک برای URL استفاده می‌شود و باید منحصر به فرد باشد
                </FieldDescription>
                {formErrors.slug && <FieldError>{formErrors.slug}</FieldError>}
              </Field>

              <Field>
                <FieldLabel htmlFor="edit-description">توضیحات</FieldLabel>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="توضیحات دسته‌بندی..."
                  rows={3}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="edit-descriptionEn">
                  توضیحات انگلیسی
                </FieldLabel>
                <Textarea
                  id="edit-descriptionEn"
                  value={formData.descriptionEn}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      descriptionEn: e.target.value,
                    }))
                  }
                  placeholder="Category description in English..."
                  rows={3}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="edit-order">ترتیب نمایش</FieldLabel>
                <Input
                  id="edit-order"
                  type="number"
                  min="0"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      order: parseInt(e.target.value) || 0,
                    }))
                  }
                />
                <FieldDescription>
                  عدد کمتر در ابتدای لیست نمایش داده می‌شود
                </FieldDescription>
                {formErrors.order && (
                  <FieldError>{formErrors.order}</FieldError>
                )}
              </Field>

              <Separator />
              <div className="space-y-3">
                <h4 className="font-medium text-lg">زیر دسته‌ها</h4>
                <FieldDescription>
                  زیر دسته‌های این دسته را مدیریت کنید
                </FieldDescription>
                {(formData.subcategories || []).length === 0 ? (
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addSubcategory}
                    >
                      افزودن زیر دسته
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(formData.subcategories || []).map((sc, index) => (
                      <div key={index} className="border rounded p-3 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <Field>
                            <FieldLabel>نام زیر دسته *</FieldLabel>
                            <Input
                              value={sc.name_fa}
                              onChange={(e) =>
                                handleSubcategoryNameFaChange(
                                  index,
                                  e.target.value
                                )
                              }
                              placeholder="مثال: پیتزا کلاسیک"
                            />
                          </Field>
                          <Field>
                            <FieldLabel>نام انگلیسی</FieldLabel>
                            <Input
                              value={sc.name_en || ""}
                              onChange={(e) =>
                                updateSubcategoryField(
                                  index,
                                  "name_en",
                                  e.target.value
                                )
                              }
                              placeholder="Classic Pizza"
                            />
                          </Field>
                        </div>
                        <div className="flex justify-between">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => removeSubcategory(index)}
                          >
                            حذف
                          </Button>
                          {index ===
                            (formData.subcategories || []).length - 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              onClick={addSubcategory}
                            >
                              افزودن زیر دسته
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field orientation="horizontal">
                  <Switch
                    id="edit-isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, isActive: checked }))
                    }
                  />
                  <FieldLabel htmlFor="edit-isActive">فعال</FieldLabel>
                </Field>

                <Field orientation="horizontal">
                  <Switch
                    id="edit-isVisible"
                    checked={formData.isVisible}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, isVisible: checked }))
                    }
                  />
                  <FieldLabel htmlFor="edit-isVisible">قابل مشاهده</FieldLabel>
                </Field>
              </div>
            </FieldGroup>
          </FieldSet>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              انصراف
            </Button>
            <Button onClick={handleEditCategory} disabled={submitting}>
              {submitting ? "در حال ذخیره..." : "ذخیره تغییرات"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
