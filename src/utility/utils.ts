import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("fa-IR").format(price);
}

// Working Hours Utilities
export interface WorkingHour {
  day:
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday";
  isOpen: boolean;
  openTime?: string; // HH:MM format
  closeTime?: string; // HH:MM format
}

export const DAYS_OF_WEEK = [
  { key: "saturday" as const, label: "شنبه", order: 0 },
  { key: "sunday" as const, label: "یک‌شنبه", order: 1 },
  { key: "monday" as const, label: "دوشنبه", order: 2 },
  { key: "tuesday" as const, label: "سه‌شنبه", order: 3 },
  { key: "wednesday" as const, label: "چهارشنبه", order: 4 },
  { key: "thursday" as const, label: "پنج‌شنبه", order: 5 },
  { key: "friday" as const, label: "جمعه", order: 6 },
];

export function getCurrentDayKey(): WorkingHour["day"] {
  const today = new Date().getDay();
  const dayKeys: WorkingHour["day"][] = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  return dayKeys[today];
}

export function getTodayWorkingHours(
  workingHours: WorkingHour[]
): WorkingHour | null {
  const todayKey = getCurrentDayKey();
  return workingHours.find((wh) => wh.day === todayKey) || null;
}

export function isCurrentlyOpen(workingHours: WorkingHour[]): boolean {
  const todayHours = getTodayWorkingHours(workingHours);

  if (
    !todayHours ||
    !todayHours.isOpen ||
    !todayHours.openTime ||
    !todayHours.closeTime
  ) {
    return false;
  }

  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;

  return (
    currentTime >= todayHours.openTime && currentTime <= todayHours.closeTime
  );
}

export function getNextOpenTime(workingHours: WorkingHour[]): string {
  const todayKey = getCurrentDayKey();
  const todayIndex = DAYS_OF_WEEK.findIndex((day) => day.key === todayKey);

  // Check if open today but later
  const todayHours = getTodayWorkingHours(workingHours);
  if (todayHours && todayHours.isOpen && todayHours.openTime) {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

    if (currentTime < todayHours.openTime) {
      return `امروز ساعت ${todayHours.openTime}`;
    }
  }

  // Check next days
  for (let i = 1; i <= 7; i++) {
    const nextDayIndex = (todayIndex + i) % 7;
    const nextDay = DAYS_OF_WEEK[nextDayIndex];
    const nextDayHours = workingHours.find((wh) => wh.day === nextDay.key);

    if (nextDayHours && nextDayHours.isOpen && nextDayHours.openTime) {
      return `${nextDay.label} ساعت ${nextDayHours.openTime}`;
    }
  }

  return "نامشخص";
}

export function formatWorkingHoursDisplay(workingHours: WorkingHour[]): string {
  const todayHours = getTodayWorkingHours(workingHours);

  if (!todayHours || !todayHours.isOpen) {
    return `تعطیل • باز می‌شود ${getNextOpenTime(workingHours)}`;
  }

  if (!todayHours.openTime || !todayHours.closeTime) {
    return "ساعات کاری نامشخص";
  }

  const isOpen = isCurrentlyOpen(workingHours);
  const status = isOpen ? "باز" : "بسته";

  return `${status} • ${todayHours.openTime} - ${todayHours.closeTime}`;
}

export function validateWorkingHours(workingHours: WorkingHour[]): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check if all days are present
  const requiredDays: WorkingHour["day"][] = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  const presentDays = workingHours.map((wh) => wh.day);
  const missingDays = requiredDays.filter((day) => !presentDays.includes(day));

  if (missingDays.length > 0) {
    errors.push(`روزهای گمشده: ${missingDays.join(", ")}`);
  }

  // Validate time formats and logic
  workingHours.forEach((wh) => {
    if (wh.isOpen) {
      if (!wh.openTime || !wh.closeTime) {
        errors.push(`زمان باز یا بسته شدن برای ${wh.day} مشخص نشده`);
        return;
      }

      // Validate time format
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(wh.openTime)) {
        errors.push(`فرمت زمان باز شدن برای ${wh.day} نامعتبر است`);
      }
      if (!timeRegex.test(wh.closeTime)) {
        errors.push(`فرمت زمان بسته شدن برای ${wh.day} نامعتبر است`);
      }

      // Check if close time is after open time
      if (wh.openTime >= wh.closeTime) {
        errors.push(
          `زمان بسته شدن باید بعد از زمان باز شدن باشد برای ${wh.day}`
        );
      }
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function fallbackNameHelper(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2);
}

export function toPlainObject<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}
