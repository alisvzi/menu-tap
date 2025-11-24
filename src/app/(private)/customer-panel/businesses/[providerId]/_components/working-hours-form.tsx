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
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Provider } from "@/types/business";
import { zodResolver } from "@hookform/resolvers/zod";
import { Clock } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { workingHoursSchema } from "../../_types/business-schema";

const DAYS = [
  { key: "monday", label: "دوشنبه" },
  { key: "tuesday", label: "سه‌شنبه" },
  { key: "wednesday", label: "چهارشنبه" },
  { key: "thursday", label: "پنج‌شنبه" },
  { key: "friday", label: "جمعه" },
  { key: "saturday", label: "شنبه" },
  { key: "sunday", label: "یکشنبه" },
];

interface WorkingHoursFormProps {
  business: Provider;
  onSubmit: (data: Partial<Provider>) => void;
  saving: boolean;
}

export function WorkingHoursForm({
  business,
  onSubmit,
  saving,
}: WorkingHoursFormProps) {
  const workingHoursForm = useForm<z.infer<typeof workingHoursSchema>>({
    resolver: zodResolver(workingHoursSchema),
    defaultValues: {
      workingHours: business.workingHours,
    },
  });

  const onSubmitWorkingHours = async (data: { workingHours: any[] }) => {
    await onSubmit({ workingHours: data.workingHours });
  };

  return (
    <Form {...workingHoursForm}>
      <form onSubmit={workingHoursForm.handleSubmit(onSubmitWorkingHours)}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              ساعات کاری
            </CardTitle>
            <CardDescription>تنظیم ساعات کاری کسب‌وکار</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {DAYS.map((day, index) => {
                const workingHour = business.workingHours.find(
                  (wh) => wh.day === day.key
                );
                return (
                  <div
                    key={day.key}
                    className="flex items-center gap-4 p-4 border rounded-lg"
                  >
                    <div className="w-20">
                      <Label className="text-sm font-medium">{day.label}</Label>
                    </div>
                    <FormField
                      control={workingHoursForm.control}
                      name={`workingHours.${index}.isOpen`}
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value || false}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-sm cursor-pointer">
                            فعال
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                    {workingHour?.isOpen && (
                      <>
                        <FormField
                          control={workingHoursForm.control}
                          name={`workingHours.${index}.openTime`}
                          render={({ field }) => (
                            <FormItem className="flex items-center gap-2">
                              <FormLabel className="text-sm">از:</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="time"
                                  className="w-24"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={workingHoursForm.control}
                          name={`workingHours.${index}.closeTime`}
                          render={({ field }) => (
                            <Field className="flex items-center gap-2">
                              <FieldLabel className="text-sm">تا:</FieldLabel>
                              <Input
                                {...field}
                                type="time"
                                className="w-24"
                                data-invalid={
                                  !!workingHoursForm.formState.errors
                                    ?.workingHours?.[index]?.closeTime
                                }
                              />
                              {workingHoursForm.formState.errors
                                ?.workingHours?.[index]?.closeTime && (
                                <FieldError>
                                  {workingHoursForm.formState.errors?.workingHours?.[
                                    index
                                  ]?.closeTime?.message?.toString()}
                                </FieldError>
                              )}
                            </Field>
                          )}
                        />
                      </>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex justify-end mt-6">
              <Button
                type="submit"
                disabled={saving}
                className="premium-button"
              >
                {saving ? "در حال ذخیره..." : "ذخیره ساعات کاری"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}