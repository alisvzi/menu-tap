"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/forms/field";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { businessSettingsSchema } from "../../_types/business-schema";
import { Provider } from "@/types/business";

interface SettingsFormProps {
  business: Provider;
  onSubmit: (data: Partial<Provider>) => void;
  saving: boolean;
}

export function SettingsForm({
  business,
  onSubmit,
  saving,
}: SettingsFormProps) {
  const settingsForm = useForm({
    resolver: zodResolver(businessSettingsSchema),
    defaultValues: {
      showPrices: business.settings.showPrices,
      showCalories: business.settings.showCalories,
      showIngredients: business.settings.showIngredients,
      allowOnlineOrdering: business.settings.allowOnlineOrdering,
    },
  });

  const onSubmitSettings = async (data: any) => {
    await onSubmit({ settings: data });
  };

  return (
    <div className="space-y-6">
      <Form {...settingsForm}>
        <form onSubmit={settingsForm.handleSubmit(onSubmitSettings)}>
          <Card>
            <CardHeader>
              <CardTitle>تنظیمات منو</CardTitle>
              <CardDescription>
                مدیریت تنظیمات نمایش منو و سفارشات
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={settingsForm.control}
                  name="showPrices"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="cursor-pointer">
                        نمایش قیمت‌ها
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={settingsForm.control}
                  name="showCalories"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="cursor-pointer">
                        نمایش کالری
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={settingsForm.control}
                  name="showIngredients"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="cursor-pointer">
                        نمایش مواد تشکیل‌دهنده
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={settingsForm.control}
                  name="allowOnlineOrdering"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="cursor-pointer">
                        سفارش آنلاین
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={saving}
                  className="premium-button"
                >
                  {saving ? "در حال ذخیره..." : "ذخیره تنظیمات"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}