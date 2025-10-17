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
import { ChevronUp, MapPin } from "lucide-react";

const branches = [
  {
    name: "شعبه مرکزی",
    address: "تهران، خیابان ولیعصر، بالاتر از پارک ساعی، پلاک ۲۴۵۰",
  },
  {
    name: "شعبه شرق",
    address: "تهران، نارمک، میدان هفت‌حوض، خیابان گلبرگ شرقی، پلاک ۸۲",
  },
  {
    name: "شعبه غرب",
    address: "تهران، صادقیه، بلوار آیت‌الله کاشانی، نرسیده به شهرزیبا، پلاک ۱۸",
  },
];

export default function BranchesDrawer() {
  return (
    <Drawer direction="bottom">
      <DrawerTrigger asChild>
        <Card className="flex flex-row justify-between items-center p-3 gap-2 rounded-xl cursor-pointer hover:bg-accent/50 transition-colors">
          <MapPin className="w-5 h-5 text-primary" />
          <p className="text-xs text-muted-foreground whitespace-nowrap">
            نمایش آدرس
          </p>
          <ChevronUp className="text-muted-foreground" />
        </Card>
      </DrawerTrigger>

      <DrawerContent className="border-none shadow-2xl rounded-t-3xl text-right">
        <DrawerHeader className="text-right border-b border-border pb-3">
          <DrawerTitle className="text-lg font-bold text-card-foreground flex items-center justify-center gap-2">
            آدرس شعب مجموعه
          </DrawerTitle>
          <DrawerDescription className="text-sm text-muted-foreground">
            برای مشاهده یا انتخاب نزدیک‌ترین شعبه
          </DrawerDescription>
        </DrawerHeader>

        <div className="p-5 space-y-3 overflow-y-auto">
          {branches.map((branch) => (
            <div
              key={branch.name}
              className="flex flex-col gap-1 bg-card shadow-md p-3 border border-border rounded-2xl"
            >
              <span className="font-semibold">{branch.name}</span>
              <span className="text-sm text-muted-foreground leading-relaxed">
                {branch.address}
              </span>
            </div>
          ))}
        </div>

        <DrawerFooter className="border-t border-border">
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">
              بستن
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
