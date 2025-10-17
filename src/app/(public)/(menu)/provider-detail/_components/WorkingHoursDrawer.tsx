import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ChevronUp, Clock } from "lucide-react";

const workingHours = [
  { day: "شنبه", open: "08:00", close: "22:00" },
  { day: "یک‌شنبه", open: "08:00", close: "22:00" },
  { day: "دوشنبه", open: "08:00", close: "22:00" },
  { day: "سه‌شنبه", open: "08:00", close: "22:00" },
  { day: "چهارشنبه", open: "08:00", close: "22:00" },
  { day: "پنج‌شنبه", open: "08:00", close: "23:00" },
  { day: "جمعه", open: "09:00", close: "23:00" },
];

export default function WorkingHoursDrawer() {
  return (
    <Drawer direction="bottom">
      <DrawerTrigger asChild>
        <Card className="flex flex-row justify-between items-center p-3 gap-2 rounded-xl">
          <Clock className="w-5 h-5 text-primary" />
          <p className="text-xs text-muted-foreground whitespace-nowrap">
            {workingHours[0].open} - {workingHours[0].close}
          </p>
          <ChevronUp className="text-muted-foreground" />
        </Card>
      </DrawerTrigger>

      <DrawerContent className="border-none shadow-2xl rounded-t-3xl text-right">
        <DrawerHeader className="text-right border-b border-border pb-3">
          <DrawerTitle className="text-lg font-bold text-card-foreground flex items-center justify-center gap-2">
            ساعات کاری مجموعه
          </DrawerTitle>
          <DrawerDescription className="text-sm text-muted-foreground">
            زمان باز و بسته بودن مجموعه در روزهای مختلف هفته
          </DrawerDescription>
        </DrawerHeader>

        <div className="p-5 space-y-2 overflow-y-auto">
          {workingHours.map((item) => (
            <div
              key={item.day}
              className="flex items-center justify-between bg-card  shadow-md p-4 border border-border rounded-2xl"
            >
              <span className="text-sm font-semibold">{item.day}</span>
              <span className="text-sm">
                {item.open} - {item.close}
              </span>
            </div>
          ))}
        </div>

        <DrawerFooter className="border-t border-border">
          <DrawerClose asChild>
            <Button variant="outline">بستن</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
