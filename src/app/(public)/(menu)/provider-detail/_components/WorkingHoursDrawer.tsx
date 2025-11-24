import { Badge } from "@/components/ui/badge";
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
import {
  DAYS_OF_WEEK,
  formatWorkingHoursDisplay,
  isCurrentlyOpen,
  type WorkingHour,
} from "@/utility/utils";
import { ChevronUp, Clock } from "lucide-react";

interface WorkingHoursDrawerProps {
  workingHours: WorkingHour[];
}
export default function WorkingHoursDrawer({
  workingHours,
}: WorkingHoursDrawerProps) {
  const isOpen = isCurrentlyOpen(workingHours);
  const displayText = formatWorkingHoursDisplay(workingHours);

  return (
    <Drawer direction="bottom">
      <DrawerTrigger asChild>
        <Card className="flex flex-row justify-between items-center p-3 gap-2 rounded-xl">
          <Clock className="w-5 h-5 text-primary" />
          <div className="flex items-center gap-2">
            <Badge
              variant={isOpen ? "default" : "secondary"}
              className="text-xs"
            >
              {isOpen ? "باز" : "بسته"}
            </Badge>
            <p className="text-xs text-muted-foreground whitespace-nowrap">
              {displayText}
            </p>
          </div>
          <ChevronUp className="text-muted-foreground" />
        </Card>
      </DrawerTrigger>

      <DrawerContent className="max-w-xl mx-auto">
        <DrawerHeader className="text-right border-b border-border pb-3">
          <DrawerTitle className="text-lg font-bold text-card-foreground flex items-center justify-center gap-2">
            <Clock className="w-5 h-5" />
            ساعات کاری مجموعه
          </DrawerTitle>
          <DrawerDescription className="text-sm text-muted-foreground">
            زمان باز و بسته بودن مجموعه در روزهای مختلف هفته
          </DrawerDescription>
        </DrawerHeader>

        <div className="p-5 space-y-2 overflow-y-auto">
          {DAYS_OF_WEEK.map((day) => {
            const dayHours = workingHours.find((wh) => wh.day === day.key);
            const isToday =
              day.key ===
              new Date()
                .toLocaleDateString("en-US", { weekday: "long" })
                .toLowerCase();

            return (
              <div
                key={day.key}
                className={`flex items-center justify-between bg-card shadow-md p-4 border border-border rounded-2xl ${
                  isToday ? "ring-2 ring-primary/20 bg-primary/5" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{day.label}</span>
                  {isToday && (
                    <Badge variant="outline" className="text-xs">
                      امروز
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {dayHours?.isOpen &&
                  dayHours.openTime &&
                  dayHours.closeTime ? (
                    <>
                      <Badge variant="default" className="text-xs">
                        باز
                      </Badge>
                      <span className="text-sm">
                        {dayHours.openTime} - {dayHours.closeTime}
                      </span>
                    </>
                  ) : (
                    <>
                      <Badge variant="secondary" className="text-xs">
                        تعطیل
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        بسته
                      </span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
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
