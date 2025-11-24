import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import LogoBox from "../../(web-site)/_components/layout/Footer/LogoBox";

const SheetMenu = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="p-2 bg-black/10 dark:bg-white/20 rounded-lg">
          <Menu className="w-6 h-6" />
        </button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="pt-10">
          <SheetTitle>منوتپ</SheetTitle>
          <SheetDescription>
            این منو طراحی و دیزاین شده توسط منوتپ است
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 flex items-center justify-center">
          <Link href="/" className="flex items-center gap-x-3 ">
            <LogoBox />
          </Link>
        </div>
        <SheetFooter>
          {/* <Button type="submit">Save changes</Button> */}
          <SheetClose asChild>
            <Button variant="outline">بستن</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default SheetMenu;
