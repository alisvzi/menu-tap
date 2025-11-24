import { Input } from "@/components/ui/input";
import { SkeletonData } from "@/configs/mock-data";
import { Search } from "lucide-react";
import { Suspense } from "react";
import BannerInfo from "../_components/BannerInfo/BannerInfo";
import ProviderList from "./_components/ProviderList";
import ProvidersPage from "./_components/Providers";

interface ProvidersPageProps {
  searchParams: {
    search?: string;
    city?: string;
    cuisine?: string;
    priceRange?: string;
    page?: string;
  };
}

const mockData = SkeletonData.providers;

const Providers = ({ searchParams }: ProvidersPageProps) => {
  const searchBox = (
    <div className="flex items-center relative max-w-xl mx-auto">
      <Search className="h-[1.2rem] w-[1.2rem] rounded-full absolute right-4 text-muted-foreground" />
      <Input
        className="bg-white pr-12 rounded-4xl text-xs md:text-base"
        placeholder="نام مجموعه مورد نظر خود را جستجو کنید"
        defaultValue={""}
      />
    </div>
  );

  return (
    <>
      <BannerInfo title="لیست مجموعه‌ها و فروشگاه‌ها" node={searchBox} />
      <Suspense
        fallback={<ProviderList isSkeleton={true} providers={mockData} />}
      >
        <ProvidersPage />
      </Suspense>
    </>
  );
};

export default Providers;
