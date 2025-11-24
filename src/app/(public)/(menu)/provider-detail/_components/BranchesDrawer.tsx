import { Button } from "@/components/ui/button";
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
import { MapPin, Phone } from "lucide-react";

interface Address {
  city: string;
  street: string;
  postalCode?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface Branch {
  name: string;
  address: string;
  phone?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface BranchesDrawerProps {
  mainAddress: Address;
  branches?: Branch[];
}

export default function BranchesDrawer({
  mainAddress,
  branches,
}: BranchesDrawerProps) {
  const allLocations = [
    {
      name: "آدرس اصلی",
      address: `${mainAddress.city}, ${mainAddress.street}`,
      phone: undefined,
    },
    ...(branches || []),
  ];
  return (
    <Drawer direction="bottom">
      <DrawerTrigger asChild>
        <div className="flex flex-row justify-between items-center p-2 gap-2 rounded-xl cursor-pointer hover:bg-accent/50 transition-colors border border-border">
          <MapPin className="w-5 h-5 text-foreground" />
          <p className="text-xs text-foreground whitespace-nowrap">
            نمایش آدرس
          </p>
        </div>
      </DrawerTrigger>

      <DrawerContent className="max-w-xl mx-auto">
        <DrawerHeader className="text-right border-b border-border pb-3">
          <DrawerTitle className="text-lg font-bold text-card-foreground flex items-center justify-center gap-2">
            آدرس شعب مجموعه
          </DrawerTitle>
          <DrawerDescription className="text-sm text-muted-foreground">
            برای مشاهده یا انتخاب نزدیک‌ترین شعبه
          </DrawerDescription>
        </DrawerHeader>

        <div className="p-5 space-y-3 overflow-y-auto">
          {allLocations.map((location, index) => (
            <div
              key={index}
              className="flex flex-col gap-2 bg-card shadow-md p-3 border border-border rounded-2xl"
            >
              <span className="font-semibold">{location.name}</span>
              <span className="text-sm text-muted-foreground leading-relaxed">
                {location.address}
              </span>
              {location.phone && (
                <div className="flex items-center gap-2 mt-1">
                  <Phone className="w-3 h-3 text-muted-foreground" />
                  <a
                    href={`tel:${location.phone}`}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    {location.phone}
                  </a>
                </div>
              )}
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
