import ProviderCard from "./ProviderCard";

const ProviderList = () => {
  return (
    <div className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 my-10">
      <ProviderCard />
      <ProviderCard />
      <ProviderCard />
      <ProviderCard />
      <ProviderCard />
      <ProviderCard />
    </div>
  );
};

export default ProviderList;
