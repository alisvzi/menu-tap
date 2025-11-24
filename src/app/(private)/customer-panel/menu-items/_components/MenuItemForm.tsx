"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { menuItemSchema } from "../_types/menu-item-schema";
import { useAuth } from "@/lib/auth/context";
import { toast } from "sonner";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ImageUpload, UploadedImage } from "@/components/ui/image-upload";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DialogFooter } from "@/components/ui/dialog";
import { Category, CreateMenuItemData, MenuItem } from "@/types/menu";

type FormValues = z.infer<typeof menuItemSchema>;

interface MenuItemFormProps {
  categories: Category[];
  onCancel: () => void;
  onSuccess: () => void;
  mode?: "create" | "edit";
  item?: MenuItem | null;
}

export default function MenuItemForm({
  categories,
  onCancel,
  onSuccess,
  mode = "create",
  item,
}: MenuItemFormProps) {
  const { token } = useAuth();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      name: "",
      nameEn: "",
      slug: "",
      category: "",
      subcategory: "",
      description: "",
      descriptionEn: "",
      price: 0,
      originalPrice: undefined,
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
      images: [],
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (mode === "edit" && item) {
      reset({
        name: item.name || "",
        nameEn: item.nameEn || "",
        slug: item.slug || "",
        category:
          typeof item.category === "string"
            ? item.category
            : (item.category as any)._id,
        subcategory: item.subcategory || "",
        description: item.description || "",
        descriptionEn: item.descriptionEn || "",
        price: item.price || 0,
        originalPrice: item.originalPrice,
        preparationTime: item.preparationTime || 15,
        calories: item.calories,
        isVegetarian: !!item.isVegetarian,
        isVegan: !!item.isVegan,
        isGlutenFree: !!item.isGlutenFree,
        isSpicy: !!(item as any).isSpicy,
        isPopular: !!item.isPopular,
        isAvailable: !!item.isAvailable,
        isVisible: true,
        tags: item.tags || [],
        allergens: item.allergens || [],
        images: (item.images || []).map((url) => ({ url })),
      });
    }
  }, [mode, item, reset]);

  const [tagInput, setTagInput] = useState("");
  const [allergenInput, setAllergenInput] = useState("");
  const selectedCategory = useWatch({ control, name: "category" });
  const tags = useWatch({ control, name: "tags" }) || [];
  const allergens = useWatch({ control, name: "allergens" }) || [];

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) {
      setValue("tags", [...tags, t]);
      setTagInput("");
    }
  };

  const removeTag = (t: string) => {
    setValue("tags", tags.filter((x) => x !== t));
  };

  const addAllergen = () => {
    const a = allergenInput.trim();
    if (a && !allergens.includes(a)) {
      setValue("allergens", [...allergens, a]);
      setAllergenInput("");
    }
  };

  const removeAllergen = (a: string) => {
    setValue("allergens", allergens.filter((x) => x !== a));
  };

  const onSubmit = async (values: FormValues) => {
    try {
      if (!token) {
        toast.error("ابتدا وارد حساب کاربری شوید");
        return;
      }
      const payload: CreateMenuItemData = {
        name: values.name,
        nameEn: values.nameEn || undefined,
        description: values.description || undefined,
        descriptionEn: values.descriptionEn || undefined,
        price: values.price,
        originalPrice: values.originalPrice,
        category: values.category,
        subcategory: values.subcategory || undefined,
        preparationTime: values.preparationTime,
        calories: values.calories,
        isVegetarian: values.isVegetarian,
        isVegan: values.isVegan,
        isGlutenFree: values.isGlutenFree,
        isSpicy: values.isSpicy,
        isPopular: values.isPopular,
        isAvailable: values.isAvailable,
        // isVisible is UI-only; API does not accept it
        tags: values.tags,
        allergens: values.allergens,
        slug: values.slug ? values.slug.trim() : undefined,
        images: values.images.map((img) => img.url),
      } as CreateMenuItemData;

      const res = await fetch(
        mode === "edit" && item?._id
          ? `/api/menu-items/${item._id}`
          : "/api/menu-items",
        {
          method: mode === "edit" ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (res.ok) {
        toast.success(mode === "edit" ? "تغییرات با موفقیت ذخیره شد" : "آیتم منو با موفقیت ایجاد شد");
        reset();
        onSuccess();
      } else {
        const err = await res.json();
        toast.error(
          err.error || (mode === "edit" ? "خطا در ذخیره تغییرات آیتم" : "خطا در ایجاد آیتم منو")
        );
      }
    } catch (e) {
      console.error(e);
      toast.error(
        mode === "edit" ? "خطای غیرمنتظره در ذخیره تغییرات" : "خطای غیرمنتظره در ایجاد آیتم"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldSet className="space-y-6">
        <FieldGroup>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="name">نام آیتم *</FieldLabel>
              <Input id="name" placeholder="مثال: پیتزا مارگاریتا" {...register("name")} />
              {errors.name && <FieldError>{errors.name.message}</FieldError>}
            </Field>

            <Field>
              <FieldLabel htmlFor="nameEn">نام انگلیسی</FieldLabel>
              <Input id="nameEn" placeholder="Margherita Pizza" {...register("nameEn")} />
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="slug">اسلاگ</FieldLabel>
            <Input id="slug" placeholder="margherita-pizza" {...register("slug")} />
            <FieldDescription>اگر خالی باشد، خودکار ساخته می‌شود</FieldDescription>
            {errors.slug && <FieldError>{errors.slug.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel htmlFor="category">دسته‌بندی *</FieldLabel>
            <Controller
              control={control}
              name="category"
              render={({ field }) => (
                <Select value={field.value} onValueChange={(v) => field.onChange(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="دسته‌بندی را انتخاب کنید" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c._id} value={c._id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.category && <FieldError>{errors.category.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel htmlFor="subcategory">زیر دسته</FieldLabel>
            <Controller
              control={control}
              name="subcategory"
              render={({ field }) => (
                <Select
                  value={field.value || ""}
                  onValueChange={(v) => field.onChange(v)}
                  disabled={!selectedCategory}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={!selectedCategory ? "ابتدا دسته را انتخاب کنید" : "زیر دسته را انتخاب کنید"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {(
                      categories.find((c) => c._id === selectedCategory)?.subcategories || []
                    ).map((sc) => (
                      <SelectItem key={sc._id} value={sc._id}>
                        {sc.name_fa}
                        {sc.name_en ? ` (${sc.name_en})` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="description">توضیحات</FieldLabel>
              <Textarea id="description" rows={3} placeholder="توضیحات آیتم منو..." {...register("description")} />
            </Field>

            <Field>
              <FieldLabel htmlFor="descriptionEn">توضیحات انگلیسی</FieldLabel>
              <Textarea id="descriptionEn" rows={3} placeholder="Menu item description in English..." {...register("descriptionEn")} />
            </Field>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Field>
              <FieldLabel htmlFor="price">قیمت (تومان) *</FieldLabel>
              <Input id="price" type="number" min={0} placeholder="50000" {...register("price", { valueAsNumber: true })} />
              {errors.price && <FieldError>{errors.price.message}</FieldError>}
            </Field>

            <Field>
              <FieldLabel htmlFor="originalPrice">قیمت اصلی (تومان)</FieldLabel>
              <Input id="originalPrice" type="number" min={0} placeholder="70000" {...register("originalPrice", { valueAsNumber: true })} />
              <FieldDescription>برای نمایش تخفیف</FieldDescription>
              {errors.originalPrice && <FieldError>{errors.originalPrice.message}</FieldError>}
            </Field>

            <Field>
              <FieldLabel htmlFor="preparationTime">زمان آماده‌سازی (دقیقه)</FieldLabel>
              <Input id="preparationTime" type="number" min={0} placeholder="15" {...register("preparationTime", { valueAsNumber: true })} />
              {errors.preparationTime && <FieldError>{errors.preparationTime.message}</FieldError>}
            </Field>
          </div>

          <Field>
            <FieldLabel>تصویر آیتم منو</FieldLabel>
            <Controller
              control={control}
              name="images"
              render={({ field }) => (
                <ImageUpload
                  value={field.value}
                  onChange={(images) => field.onChange(images)}
                  maxFiles={1}
                  maxSize={1}
                  folder="menu-items"
                  variant="gallery"
                />
              )}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="calories">کالری</FieldLabel>
            <Input id="calories" type="number" min={0} placeholder="350" {...register("calories", { valueAsNumber: true })} />
            {errors.calories && <FieldError>{errors.calories.message}</FieldError>}
          </Field>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">ویژگی‌های غذایی</h4>
              <div className="space-y-3">
                <Field orientation="horizontal">
                  <Controller
                    control={control}
                    name="isVegetarian"
                    render={({ field }) => (
                      <Switch id="isVegetarian" checked={field.value} onCheckedChange={field.onChange} />
                    )}
                  />
                  <FieldLabel htmlFor="isVegetarian">گیاهی</FieldLabel>
                </Field>

                <Field orientation="horizontal">
                  <Controller
                    control={control}
                    name="isVegan"
                    render={({ field }) => (
                      <Switch id="isVegan" checked={field.value} onCheckedChange={field.onChange} />
                    )}
                  />
                  <FieldLabel htmlFor="isVegan">وگان</FieldLabel>
                </Field>

                <Field orientation="horizontal">
                  <Controller
                    control={control}
                    name="isGlutenFree"
                    render={({ field }) => (
                      <Switch id="isGlutenFree" checked={field.value} onCheckedChange={field.onChange} />
                    )}
                  />
                  <FieldLabel htmlFor="isGlutenFree">بدون گلوتن</FieldLabel>
                </Field>

                <Field orientation="horizontal">
                  <Controller
                    control={control}
                    name="isSpicy"
                    render={({ field }) => (
                      <Switch id="isSpicy" checked={field.value} onCheckedChange={field.onChange} />
                    )}
                  />
                  <FieldLabel htmlFor="isSpicy">تند</FieldLabel>
                </Field>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">تنظیمات نمایش</h4>
              <div className="space-y-3">
                <Field orientation="horizontal">
                  <Controller
                    control={control}
                    name="isPopular"
                    render={({ field }) => (
                      <Switch id="isPopular" checked={field.value} onCheckedChange={field.onChange} />
                    )}
                  />
                  <FieldLabel htmlFor="isPopular">محبوب</FieldLabel>
                </Field>

                <Field orientation="horizontal">
                  <Controller
                    control={control}
                    name="isAvailable"
                    render={({ field }) => (
                      <Switch id="isAvailable" checked={field.value} onCheckedChange={field.onChange} />
                    )}
                  />
                  <FieldLabel htmlFor="isAvailable">موجود</FieldLabel>
                </Field>

                <Field orientation="horizontal">
                  <Controller
                    control={control}
                    name="isVisible"
                    render={({ field }) => (
                      <Switch id="isVisible" checked={field.value} onCheckedChange={field.onChange} />
                    )}
                  />
                  <FieldLabel htmlFor="isVisible">قابل مشاهده</FieldLabel>
                </Field>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>برچسب‌ها</FieldLabel>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="برچسب جدید..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={addTag}>
                    افزودن
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {tags.map((tag, idx) => (
                    <Badge key={idx} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              </div>
            </Field>

            <Field>
              <FieldLabel>آلرژن‌ها</FieldLabel>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={allergenInput}
                    onChange={(e) => setAllergenInput(e.target.value)}
                    placeholder="آلرژن جدید..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addAllergen();
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={addAllergen}>
                    افزودن
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {allergens.map((al, idx) => (
                    <Badge key={idx} variant="destructive" className="cursor-pointer" onClick={() => removeAllergen(al)}>
                      {al} ×
                    </Badge>
                  ))}
                </div>
              </div>
            </Field>
          </div>
        </FieldGroup>
      </FieldSet>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          انصراف
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? mode === "edit" ? "در حال ذخیره..." : "در حال ایجاد..."
            : mode === "edit" ? "ذخیره تغییرات" : "ایجاد آیتم"}
        </Button>
      </DialogFooter>
    </form>
  );
}