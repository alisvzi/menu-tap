import ProviderCard from "./ProviderCard";

export interface IProvider {
  _id: string;
  name: string;
  nameEn?: string;
  slug: string;
  logo?: string;
  coverImage?: string;
}

interface ProviderListProps {
  providers: IProvider[];
  isSkeleton?: boolean;
}

const ProviderList = ({ providers, isSkeleton = false }: ProviderListProps) => {
  console.log(providers, "providers");
  if (providers?.length === 0) {
    return (
      <div className="container my-10">
        <div className="text-center py-20">
          <h3 className="text-xl font-semibold text-muted-foreground mb-2">
            هیچ مجموعه‌ای یافت نشد
          </h3>
          <p className="text-muted-foreground">
            لطفاً جستجوی خود را تغییر دهید یا دوباره تلاش کنید
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 my-10 ${
        isSkeleton ? "skeleton" : ""
      }`}
    >
      {providers.map((provider) => (
        <ProviderCard key={provider._id} provider={provider} />
      ))}
    </div>
  );
};

export default ProviderList;
