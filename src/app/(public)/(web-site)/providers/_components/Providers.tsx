import { connectDB } from "@/lib/db/connection";
import Provider from "@/lib/models/Provider";
import type { IProvider } from "./ProviderList";
import ProviderList from "./ProviderList";

async function fetchProviders(): Promise<IProvider[]> {
  await connectDB();

  return (await Provider.find({ isActive: true })
    .select("name nameEn slug logo coverImage")
    .sort({ createdAt: -1 })
    .lean()) as unknown as IProvider[];
}

const Providers = async () => {
  const providers = await fetchProviders();

  return <ProviderList providers={providers} />;
};

export default Providers;
