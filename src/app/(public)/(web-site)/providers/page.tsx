import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import BannerInfo from "../_components/BannerInfo/BannerInfo";
import ProviderList from "./_components/ProviderList";

const Providers = () => {
  const searchBox = (
    <div className="flex items-center relative max-w-xl mx-auto">
      <Search className="h-[1.2rem] w-[1.2rem] rounded-full absolute right-4 text-muted-foreground" />
      <Input
        className="bg-white pr-12 rounded-4xl text-xs md:text-base"
        placeholder="نام مجموعه مورد نظر خود را جستجو کنید"
      ></Input>
    </div>
  );
  return (
    <>
      <BannerInfo title="لیست مجموعه‌ها و فروشگاه‌ها" node={searchBox} />
      <ProviderList />
    </>
  );
};

export default Providers;
