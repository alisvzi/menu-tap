"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/forms/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { businessProfileSchema } from "../../_types/business-schema";
import { Provider } from "@/types/business";
// Local provider types until a shared constant is added
const PROVIDER_TYPES = [
  { value: "restaurant", label: "رستوران" },
  { value: "cafe", label: "کافه" },
  { value: "confectionery", label: "شیرینی فروشی" },
  { value: "other", label: "غیره" },
];
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/ui/image-upload";
import { Switch } from "@/components/ui/switch";

interface BusinessInfoFormProps {
  business: Provider;
  setBusiness: (business: Provider) => void;
  onSubmit: (values: Partial<Provider>) => void;
}

export function BusinessInfoForm({
  business,
  setBusiness,
  onSubmit,
}: BusinessInfoFormProps) {
  const businessInfoForm = useForm<z.infer<typeof businessProfileSchema>>({
    resolver: zodResolver(businessProfileSchema),
    defaultValues: {
      name: business.name,
      nameEn: business.nameEn || "",
      slug: business.slug,
      providerType: business.providerType,
      phone: business.phone,
      description: business.description,
      descriptionEn: business.descriptionEn || "",
      email: business.email,
      address: business.address,
      website: business.website,
      instagram: business.instagram,
      isActive: business.isActive,
      isVerified: business.isVerified,
      branches: business.branches || [],
    },
  });

  const branchesField = useFieldArray({
    control: businessInfoForm.control,
    name: "branches",
  });

  const onSubmitBusinessInfo = (
    values: z.infer<typeof businessProfileSchema>
  ) => {
    const providerUpdate: Partial<Provider> = {
      name: values.name,
      nameEn: values.nameEn,
      description: values.description,
      descriptionEn: values.descriptionEn,
      slug: values.slug,
      providerType: values.providerType,
      logo: values.logo,
      coverImage: values.coverImage,
      address: values.address,
      workingHours: values.workingHours,
      phone: values.phone,
      email: values.email || undefined,
      website: values.website || undefined,
      instagram: values.instagram,
      telegram: values.telegram,
      whatsapp: values.whatsapp,
      cuisine: values.cuisine || [],
      priceRange: values.priceRange as Provider['priceRange'],
      features: values.features || [],
      isActive: values.isActive ?? false,
      isVerified: values.isVerified ?? false,
      branches: values.branches?.map((b) => ({
        name: b.title,
        address: b.address,
        coordinates: b.coordinates,
      })),
    };
    onSubmit(providerUpdate);
  };

  return (
    <Form {...businessInfoForm}>
      <form onSubmit={businessInfoForm.handleSubmit(onSubmitBusinessInfo)}>
        <Card>
          <CardHeader>
            <CardTitle>اطلاعات پایه</CardTitle>
            <CardDescription>ویرایش اطلاعات اصلی کسب‌وکار</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={businessInfoForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نام مجموعه</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={businessInfoForm.control}
                name="nameEn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نام انگلیسی</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={businessInfoForm.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>آدرس اینترنتی (اسلاگ)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={businessInfoForm.control}
                name="providerType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نوع مجموعه</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="نوع مجموعه خود را انتخاب کنید" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PROVIDER_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={businessInfoForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>شماره تماس</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={businessInfoForm.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>توضیحات</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={businessInfoForm.control}
              name="descriptionEn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>توضیحات انگلیسی</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <Label className="text-base font-medium">
                تصاویر کسب‌وکار
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>لوگو</Label>
                  <ImageUpload
                    value={
                      business.logo
                        ? [
                            {
                              url: business.logo,
                              name: "logo",
                              size: 0,
                              type: "image/*",
                            },
                          ]
                        : []
                    }
                    onChange={(images) =>
                      setBusiness({
                        ...business,
                        logo: images[0]?.url || "",
                      })
                    }
                    maxFiles={1}
                    maxSize={5}
                    folder="providers/logos"
                    variant="single"
                  />
                </div>
                <div className="space-y-2">
                  <Label>تصویر کاور</Label>
                  <ImageUpload
                    value={
                      business.coverImage
                        ? [
                            {
                              url: business.coverImage,
                              name: "cover",
                              size: 0,
                              type: "image/*",
                            },
                          ]
                        : []
                    }
                    onChange={(images) =>
                      setBusiness({
                        ...business,
                        coverImage: images[0]?.url || "",
                      })
                    }
                    maxFiles={1}
                    maxSize={8}
                    folder="providers/covers"
                    variant="single"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={businessInfoForm.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>فعال</FormLabel>
                    <FormControl>
                      <Switch
                        checked={!!field.value}
                        onCheckedChange={field.onChange}
                        id="isActive"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={businessInfoForm.control}
                name="isVerified"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>تأیید شده</FormLabel>
                    <FormControl>
                      <Switch
                        checked={!!field.value}
                        onCheckedChange={field.onChange}
                        id="isVerified"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <Label className="text-base font-medium">شعب</Label>
              {branchesField.fields.length === 0 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => branchesField.append({ title: "", address: "", coordinates: { lat: 0, lng: 0 } })}
                >
                  افزودن شعبه
                </Button>
              ) : (
                <div className="space-y-3">
                  {branchesField.fields.map((field, index) => (
                    <div key={field.id} className="border rounded p-3 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <FormField
                          control={businessInfoForm.control}
                          name={`branches.${index}.title` as const}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>عنوان شعبه</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={businessInfoForm.control}
                          name={`branches.${index}.address` as const}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>آدرس شعبه</FormLabel>
                              <FormControl>
                                <Textarea {...field} rows={2} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <FormField
                          control={businessInfoForm.control}
                          name={`branches.${index}.coordinates.lat` as const}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>عرض جغرافیایی (lat)</FormLabel>
                              <FormControl>
                                <Input type="number" value={field.value ?? ''} onChange={(e) => field.onChange(Number(e.target.value))} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={businessInfoForm.control}
                          name={`branches.${index}.coordinates.lng` as const}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>طول جغرافیایی (lng)</FormLabel>
                              <FormControl>
                                <Input type="number" value={field.value ?? ''} onChange={(e) => field.onChange(Number(e.target.value))} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex justify-between">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => branchesField.remove(index)}
                        >
                          حذف شعبه
                        </Button>
                        {index === branchesField.fields.length - 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => branchesField.append({ title: "", address: "", coordinates: { lat: 0, lng: 0 } })}
                          >
                            افزودن شعبه
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={businessInfoForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ایمیل</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <Label className="text-base font-medium">آدرس</Label>
              <div className="space-y-4">
                <FormField
                  control={businessInfoForm.control}
                  name="address.street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>آدرس کامل</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={2} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={businessInfoForm.control}
                    name="address.city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>شهر</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={businessInfoForm.control}
                    name="address.state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>استان</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={businessInfoForm.control}
                    name="address.postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>کد پستی</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-base font-medium">
                اطلاعات تکمیلی
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={businessInfoForm.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>وبسایت</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={businessInfoForm.control}
                  name="instagram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>اینستاگرام</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit">ثبت تغییرات</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
