"use client";

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
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { ImageUpload, UploadedImage } from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Category } from "@/types/menu";
import { ArrowLeft, Save, Store, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface MenuItemFormData {
  name: string;
  nameEn: string;
  description: string;
  descriptionEn?: string;
  slug: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  preparationTime: number;
  calories?: number;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isSpicy: boolean;
  isPopular: boolean;
  isAvailable: boolean;
  isVisible: boolean;
  tags: string[];
  allergens: string[];
  ingredients: { name: string; nameEn?: string; allergen?: boolean }[];
  images: UploadedImage[];
}

export default function NewMenuItemPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [providers, setProviders] = useState<
    Array<{ _id: string; name: string; isCompleted: boolean }>
  >([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>("");
  const [formData, setFormData] = useState<MenuItemFormData>({
    name: "",
    nameEn: "",
    description: "",
    descriptionEn: "",
    slug: "",
    price: 0,
    originalPrice: undefined,
    category: "",
    subcategory: "",
    preparationTime: 15,
    calories: undefined,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    isSpicy: false,
    isPopular: false,
    isAvailable: true,
    isVisible: true,
    tags: [],
    allergens: [],
    ingredients: [],
    images: [],
  });
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof MenuItemFormData, string>>
  >({});
  const [submitting, setSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [allergenInput, setAllergenInput] = useState("");
  const [ingredientName, setIngredientName] = useState("");
  const [ingredientNameEn, setIngredientNameEn] = useState("");
  const [ingredientAllergen, setIngredientAllergen] = useState(false);

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

  const validateForm = (
    data: MenuItemFormData
  ): Partial<Record<keyof MenuItemFormData, string>> => {
    const errors: Partial<Record<keyof MenuItemFormData, string>> = {};

    if (!data.name.trim()) {
      errors.name = "نام آیتم الزامی است";
    }

    if (!data.category) {
      errors.category = "انتخاب دسته‌بندی الزامی است";
    }

    if (data.price <= 0) {
      errors.price = "قیمت باید بیشتر از صفر باشد";
    }

    if (data.originalPrice && data.originalPrice <= data.price) {
      errors.originalPrice = "قیمت اصلی باید بیشتر از قیمت فعلی باشد";
    }

    if (data.preparationTime < 0) {
      errors.preparationTime = "زمان آماده‌سازی نمی‌تواند منفی باشد";
    }

    if (data.calories && data.calories < 0) {
      errors.calories = "کالری نمی‌تواند منفی باشد";
    }

    return errors;
  };

  const handleSubmit = async () => {
    if (!selectedBusinessId) {
      toast.error("ابتدا مجموعه را انتخاب کنید");
      return;
    }
    const errors = validateForm(formData);
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast.error("لطفاً خطاهای فرم را برطرف کنید");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        ...formData,
        images: formData.images.map((img) => img.url),
        business: selectedBusinessId,
      };
      const response = await fetch("/api/menu-items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success("آیتم منو با موفقیت ایجاد شد");
        router.push("/customer-panel/menu-items");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "خطا در ایجاد آیتم منو");
      }
    } catch (error) {
      console.error("Error creating menu item:", error);
      toast.error("خطا در ایجاد آیتم منو");
    } finally {
      setSubmitting(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const addAllergen = () => {
    if (
      allergenInput.trim() &&
      !formData.allergens.includes(allergenInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        allergens: [...prev.allergens, allergenInput.trim()],
      }));
      setAllergenInput("");
    }
  };

  const removeAllergen = (allergen: string) => {
    setFormData((prev) => ({
      ...prev,
      allergens: prev.allergens.filter((a) => a !== allergen),
    }));
  };

  const addIngredient = () => {
    const nameFa = ingredientName.trim();
    const nameEn = ingredientNameEn.trim();
    if (!nameFa) return;
    setFormData((prev) => ({
      ...prev,
      ingredients: [
        ...prev.ingredients,
        {
          name: nameFa,
          nameEn: nameEn || undefined,
          allergen: ingredientAllergen,
        },
      ],
    }));
    setIngredientName("");
    setIngredientNameEn("");
    setIngredientAllergen(false);
  };

  const removeIngredient = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
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
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="ml-2 h-4 w-4" />
            بازگشت
          </Button>
          <div>
            <h1 className="text-3xl font-bold">افزودن آیتم جدید</h1>
            <p className="text-muted-foreground">
              آیتم جدید به منوی خود اضافه کنید
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => router.push("/customer-panel/menu-items")}
          >
            <X className="ml-2 h-4 w-4" />
            انصراف
          </Button>
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
          <Button onClick={handleSubmit} disabled={submitting}>
            <Save className="ml-2 h-4 w-4" />
            {submitting ? "در حال ذخیره..." : "ذخیره آیتم"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>اطلاعات آیتم منو</CardTitle>
          <CardDescription>اطلاعات کامل آیتم منو را وارد کنید</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldSet className="space-y-6">
            <FieldGroup>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="name">نام آیتم *</FieldLabel>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="مثال: پیتزا مارگاریتا"
                  />
                  {formErrors.name && (
                    <FieldError>{formErrors.name}</FieldError>
                  )}
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
                    placeholder="Margherita Pizza"
                  />
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor="slug">اسلاگ </FieldLabel>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  placeholder="slug"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="category">دسته‌بندی *</FieldLabel>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: value,
                      subcategory: "",
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="دسته‌بندی را انتخاب کنید" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.category && (
                  <FieldError>{formErrors.category}</FieldError>
                )}
                {categories.length === 0 && (
                  <FieldDescription>
                    ابتدا باید حداقل یک دسته‌بندی ایجاد کنید
                  </FieldDescription>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="subcategory">زیر دسته</FieldLabel>
                <Select
                  value={formData.subcategory || ""}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, subcategory: value }))
                  }
                  disabled={!formData.category}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        !formData.category
                          ? "ابتدا دسته را انتخاب کنید"
                          : "زیر دسته را انتخاب کنید"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {(
                      categories.find((c) => c._id === formData.category)
                        ?.subcategories || []
                    ).map((sc) => (
                      <SelectItem key={sc._id} value={sc._id}>
                        {sc.name_fa}
                        {sc.name_en ? ` (${sc.name_en})` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.category &&
                  (
                    categories.find((c) => c._id === formData.category)
                      ?.subcategories || []
                  ).length === 0 && (
                    <FieldDescription>
                      برای این دسته زیر دسته‌ای موجود نیست
                    </FieldDescription>
                  )}
              </Field>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    placeholder="توضیحات آیتم منو..."
                    rows={4}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="descriptionEn">
                    توضیحات انگلیسی
                  </FieldLabel>
                  <Textarea
                    id="descriptionEn"
                    value={formData.descriptionEn}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        descriptionEn: e.target.value,
                      }))
                    }
                    placeholder="Menu item description in English..."
                    rows={4}
                  />
                </Field>
              </div>

              <Field>
                <FieldLabel>تصاویر آیتم منو</FieldLabel>
                <FieldDescription>
                  تصاویر جذاب از آیتم منو آپلود کنید. حداکثر 5 تصویر مجاز است.
                </FieldDescription>
                <ImageUpload
                  value={formData.images}
                  onChange={(images) =>
                    setFormData((prev) => ({ ...prev, images }))
                  }
                  maxFiles={5}
                  maxSize={5}
                  folder="menu-items"
                  variant="gallery"
                />
              </Field>

              <Field>
                <FieldLabel>مواد به‌کاررفته</FieldLabel>
                <FieldDescription>
                  نام فارسی و انگلیسی مواد را وارد کنید و در صورت آلرژن بودن
                  علامت بزنید
                </FieldDescription>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
                    <Input
                      value={ingredientName}
                      onChange={(e) => setIngredientName(e.target.value)}
                      placeholder="نام ماده (فارسی)"
                    />
                    <Input
                      value={ingredientNameEn}
                      onChange={(e) => setIngredientNameEn(e.target.value)}
                      placeholder="Ingredient name (English)"
                    />
                    <Field orientation="horizontal">
                      <Switch
                        id="ingredientAllergen"
                        checked={ingredientAllergen}
                        onCheckedChange={setIngredientAllergen}
                      />
                      <div>
                        <FieldLabel htmlFor="ingredientAllergen">
                          آلرژن
                        </FieldLabel>
                      </div>
                    </Field>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addIngredient}
                    >
                      افزودن
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {formData.ingredients.map((ing, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between border border-border rounded p-2"
                      >
                        <div className="text-sm">
                          <span className="font-medium">{ing.name}</span>
                          {ing.nameEn && (
                            <span className="text-muted-foreground ml-2">
                              {ing.nameEn}
                            </span>
                          )}
                          {ing.allergen && (
                            <Badge variant="destructive" className="ml-2">
                              آلرژن
                            </Badge>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => removeIngredient(index)}
                        >
                          حذف
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </Field>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field>
                  <FieldLabel htmlFor="price">قیمت (تومان) *</FieldLabel>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        price: parseFloat(e.target.value) || 0,
                      }))
                    }
                    placeholder="50000"
                  />
                  {formErrors.price && (
                    <FieldError>{formErrors.price}</FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="originalPrice">
                    قیمت اصلی (تومان)
                  </FieldLabel>
                  <Input
                    id="originalPrice"
                    type="number"
                    min="0"
                    value={formData.originalPrice || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        originalPrice: parseFloat(e.target.value) || undefined,
                      }))
                    }
                    placeholder="70000"
                  />
                  <FieldDescription>برای نمایش تخفیف</FieldDescription>
                  {formErrors.originalPrice && (
                    <FieldError>{formErrors.originalPrice}</FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="preparationTime">
                    زمان آماده‌سازی (دقیقه)
                  </FieldLabel>
                  <Input
                    id="preparationTime"
                    type="number"
                    min="0"
                    value={formData.preparationTime}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        preparationTime: parseInt(e.target.value) || 0,
                      }))
                    }
                    placeholder="15"
                  />
                  {formErrors.preparationTime && (
                    <FieldError>{formErrors.preparationTime}</FieldError>
                  )}
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="calories">کالری</FieldLabel>
                <Input
                  id="calories"
                  type="number"
                  min="0"
                  value={formData.calories || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      calories: parseInt(e.target.value) || undefined,
                    }))
                  }
                  placeholder="350"
                  className="max-w-xs"
                />
                {formErrors.calories && (
                  <FieldError>{formErrors.calories}</FieldError>
                )}
              </Field>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="font-medium text-lg">ویژگی‌های غذایی</h4>
                  <div className="space-y-4">
                    <Field orientation="horizontal">
                      <Switch
                        id="isVegetarian"
                        checked={formData.isVegetarian}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            isVegetarian: checked,
                          }))
                        }
                      />
                      <div>
                        <FieldLabel htmlFor="isVegetarian">گیاهی</FieldLabel>
                        <FieldDescription>این غذا گیاهی است</FieldDescription>
                      </div>
                    </Field>

                    <Field orientation="horizontal">
                      <Switch
                        id="isVegan"
                        checked={formData.isVegan}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({ ...prev, isVegan: checked }))
                        }
                      />
                      <div>
                        <FieldLabel htmlFor="isVegan">وگان</FieldLabel>
                        <FieldDescription>این غذا وگان است</FieldDescription>
                      </div>
                    </Field>

                    <Field orientation="horizontal">
                      <Switch
                        id="isGlutenFree"
                        checked={formData.isGlutenFree}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            isGlutenFree: checked,
                          }))
                        }
                      />
                      <div>
                        <FieldLabel htmlFor="isGlutenFree">
                          بدون گلوتن
                        </FieldLabel>
                        <FieldDescription>
                          این غذا بدون گلوتن است
                        </FieldDescription>
                      </div>
                    </Field>

                    <Field orientation="horizontal">
                      <Switch
                        id="isSpicy"
                        checked={formData.isSpicy}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({ ...prev, isSpicy: checked }))
                        }
                      />
                      <div>
                        <FieldLabel htmlFor="isSpicy">تند</FieldLabel>
                        <FieldDescription>این غذا تند است</FieldDescription>
                      </div>
                    </Field>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-lg">تنظیمات نمایش</h4>
                  <div className="space-y-4">
                    <Field orientation="horizontal">
                      <Switch
                        id="isPopular"
                        checked={formData.isPopular}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            isPopular: checked,
                          }))
                        }
                      />
                      <div>
                        <FieldLabel htmlFor="isPopular">محبوب</FieldLabel>
                        <FieldDescription>
                          این آیتم در لیست محبوب‌ها نمایش داده شود
                        </FieldDescription>
                      </div>
                    </Field>

                    <Field orientation="horizontal">
                      <Switch
                        id="isAvailable"
                        checked={formData.isAvailable}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            isAvailable: checked,
                          }))
                        }
                      />
                      <div>
                        <FieldLabel htmlFor="isAvailable">موجود</FieldLabel>
                        <FieldDescription>
                          این آیتم در حال حاضر موجود است
                        </FieldDescription>
                      </div>
                    </Field>

                    <Field orientation="horizontal">
                      <Switch
                        id="isVisible"
                        checked={formData.isVisible}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            isVisible: checked,
                          }))
                        }
                      />
                      <div>
                        <FieldLabel htmlFor="isVisible">قابل مشاهده</FieldLabel>
                        <FieldDescription>
                          این آیتم در منو نمایش داده شود
                        </FieldDescription>
                      </div>
                    </Field>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field>
                  <FieldLabel>برچسب‌ها</FieldLabel>
                  <FieldDescription>
                    برچسب‌هایی برای دسته‌بندی بهتر آیتم اضافه کنید
                  </FieldDescription>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        placeholder="برچسب جدید..."
                        onKeyPress={(e) =>
                          e.key === "Enter" && (e.preventDefault(), addTag())
                        }
                      />
                      <Button type="button" variant="outline" onClick={addTag}>
                        افزودن
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() => removeTag(tag)}
                        >
                          {tag} ×
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Field>

                <Field>
                  <FieldLabel>آلرژن‌ها</FieldLabel>
                  <FieldDescription>
                    آلرژن‌های موجود در این آیتم را مشخص کنید
                  </FieldDescription>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        value={allergenInput}
                        onChange={(e) => setAllergenInput(e.target.value)}
                        placeholder="آلرژن جدید..."
                        onKeyPress={(e) =>
                          e.key === "Enter" &&
                          (e.preventDefault(), addAllergen())
                        }
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addAllergen}
                      >
                        افزودن
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.allergens.map((allergen, index) => (
                        <Badge
                          key={index}
                          variant="destructive"
                          className="cursor-pointer"
                          onClick={() => removeAllergen(allergen)}
                        >
                          {allergen} ×
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Field>
              </div>
            </FieldGroup>
          </FieldSet>
        </CardContent>
      </Card>
    </div>
  );
}
