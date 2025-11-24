"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldLabel, FieldGroup, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { uploadFiles } from "@/utility/uploads";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface SubcategoryInput {
  name_fa: string;
  name_en?: string;
}

interface CategoryInput {
  name: string;
  nameEn?: string;
  description?: string;
  descriptionEn?: string;
  slug: string;
  image?: string;
  order: number;
  isActive: boolean;
  isVisible: boolean;
  subcategories?: SubcategoryInput[];
}

export default function NewCategoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const businessId = searchParams.get("businessId") || "";
  const [providers, setProviders] = useState<Array<{ _id: string; name: string; isCompleted: boolean }>>([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>(businessId);

  const [formData, setFormData] = useState<CategoryInput>({
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
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const generateSlug = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

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
        { name_fa: "", name_en: "" },
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

  const validateForm = (data: CategoryInput) => {
    const errors: Record<string, string> = {};
    if (!data.name?.trim()) errors.name = "نام دسته‌بندی الزامی است";
    if (!data.slug?.trim()) errors.slug = "نامک الزامی است";
    return errors;
  };

  const handleCreateCategory = async () => {
    const errors = validateForm(formData);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      toast.error("لطفاً خطاهای فرم را برطرف کنید");
      return;
    }
    if (!selectedBusinessId) {
      toast.error("ابتدا مجموعه را انتخاب کنید");
      return;
    }
    try {
      setSubmitting(true);
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, business: selectedBusinessId }),
      });
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json?.error || "ایجاد دسته‌بندی ناموفق بود");
      }
      toast.success("دسته‌بندی با موفقیت ایجاد شد");
      router.push(`/customer-panel/categories?businessId=${selectedBusinessId}`);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/providers?owner=me&limit=100");
        if (res.ok) {
          const data = await res.json();
          const list = (data.data || data.businesses || []) as Array<{
            _id: string;
            name: string;
            isCompleted: boolean;
          }>;
          setProviders(list);
          if (!selectedBusinessId) {
            const first = list.find((p) => p.isCompleted) || list[0];
            setSelectedBusinessId(first?._id || "");
          }
        }
      } catch (e) {
        console.error("Error fetching providers:", e);
        toast.error("خطا در بارگذاری مجموعه‌ها");
      }
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">دسته‌بندی جدید</h1>
          <p className="text-muted-foreground">ایجاد دسته‌بندی برای منوی مجموعه</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Label>مجموعه:</Label>
            <Select value={selectedBusinessId} onValueChange={setSelectedBusinessId}>
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
          <Button variant="outline" asChild>
            <Link href={`/customer-panel/categories?businessId=${selectedBusinessId}`}>بازگشت</Link>
          </Button>
          <Button onClick={handleCreateCategory} disabled={submitting}>
            {submitting ? "در حال ایجاد..." : "ایجاد دسته‌بندی"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>اطلاعات دسته‌بندی</CardTitle>
          <CardDescription>فیلدهای موردنیاز را تکمیل کنید</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldSet className="space-y-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">نام دسته‌بندی *</FieldLabel>
                <Input id="name" value={formData.name} onChange={(e) => handleNameChange(e.target.value)} placeholder="مثال: پیش غذا" />
                {formErrors.name && <FieldError>{formErrors.name}</FieldError>}
              </Field>

              <Field>
                <FieldLabel htmlFor="nameEn">نام انگلیسی</FieldLabel>
                <Input id="nameEn" value={formData.nameEn} onChange={(e) => setFormData((p) => ({ ...p, nameEn: e.target.value }))} placeholder="Appetizers" />
              </Field>

              <Field>
                <FieldLabel htmlFor="slug">نامک (Slug) *</FieldLabel>
                <Input id="slug" value={formData.slug} onChange={(e) => setFormData((p) => ({ ...p, slug: e.target.value }))} placeholder="appetizers" />
                <FieldDescription>نامک برای URL استفاده می‌شود و باید منحصر به فرد باشد</FieldDescription>
                {formErrors.slug && <FieldError>{formErrors.slug}</FieldError>}
              </Field>

              <Field>
                <FieldLabel htmlFor="description">توضیحات</FieldLabel>
                <Textarea id="description" value={formData.description} onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))} rows={3} />
              </Field>

              <Field>
                <FieldLabel htmlFor="descriptionEn">توضیحات انگلیسی</FieldLabel>
                <Textarea id="descriptionEn" value={formData.descriptionEn} onChange={(e) => setFormData((p) => ({ ...p, descriptionEn: e.target.value }))} rows={3} />
              </Field>

              <Field>
                <FieldLabel>تصویر دسته‌بندی</FieldLabel>
                {formData.image ? (
                  <div className="flex items-center gap-3">
                    <img src={formData.image} alt="تصویر دسته" className="w-20 h-20 object-cover rounded" />
                    <Button variant="outline" onClick={() => setFormData((p) => ({ ...p, image: undefined }))}>حذف تصویر</Button>
                  </div>
                ) : (
                  <Button variant="outline" onClick={async () => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = "image/*";
                    input.onchange = async () => {
                      const f = input.files?.[0] as File | undefined;
                      if (!f) return;
                      try {
                        const uploaded = await uploadFiles([f], "categories");
                        const first = uploaded[0];
                        if (first?.url) setFormData((p) => ({ ...p, image: first.url }));
                      } catch (e) {
                        console.error(e);
                        toast.error("آپلود تصویر ناموفق بود");
                      }
                    };
                    input.click();
                  }}>انتخاب تصویر</Button>
                )}
                <FieldDescription>یک تصویر برای نمایش دسته‌بندی انتخاب کنید</FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="order">ترتیب نمایش</FieldLabel>
                <Input id="order" type="number" min="0" value={formData.order} onChange={(e) => setFormData((p) => ({ ...p, order: parseInt(e.target.value) || 0 }))} />
                <FieldDescription>عدد کمتر در ابتدای لیست نمایش داده می‌شود</FieldDescription>
              </Field>

              <Separator />
              <div className="space-y-3">
                <h4 className="font-medium text-lg">زیر دسته‌ها</h4>
                <FieldDescription>برای این دسته می‌توانید زیر دسته‌ها را اضافه کنید</FieldDescription>
                {(formData.subcategories || []).length === 0 ? (
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" onClick={addSubcategory}>افزودن زیر دسته</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(formData.subcategories || []).map((sc, index) => (
                      <div key={index} className="border rounded p-3 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <Field>
                            <FieldLabel>نام زیر دسته *</FieldLabel>
                            <Input value={sc.name_fa} onChange={(e) => updateSubcategoryField(index, "name_fa", e.target.value)} placeholder="مثال: پیتزا کلاسیک" />
                          </Field>
                          <Field>
                            <FieldLabel>نام انگلیسی</FieldLabel>
                            <Input value={sc.name_en || ""} onChange={(e) => updateSubcategoryField(index, "name_en", e.target.value)} placeholder="Classic Pizza" />
                          </Field>
                        </div>
                        <div className="flex justify-between">
                          <Button type="button" variant="outline" onClick={() => removeSubcategory(index)}>حذف</Button>
                          {index === (formData.subcategories || []).length - 1 && (
                            <Button type="button" variant="outline" onClick={addSubcategory}>افزودن زیر دسته</Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field orientation="horizontal">
                  <Switch id="isActive" checked={formData.isActive} onCheckedChange={(checked) => setFormData((p) => ({ ...p, isActive: checked }))} />
                  <FieldLabel htmlFor="isActive">فعال</FieldLabel>
                </Field>

                <Field orientation="horizontal">
                  <Switch id="isVisible" checked={formData.isVisible} onCheckedChange={(checked) => setFormData((p) => ({ ...p, isVisible: checked }))} />
                  <FieldLabel htmlFor="isVisible">قابل مشاهده</FieldLabel>
                </Field>
              </div>
            </FieldGroup>
          </FieldSet>
        </CardContent>
      </Card>
    </div>
  );
}
