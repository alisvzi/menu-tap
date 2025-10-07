import { Sparkles } from "lucide-react";

const BannerInfo = ({ title, node }) => {
  return (
    <section className="pt-24 pb-16 px-4 hero-pattern">
      <div className="container">
        <div className="text-center max-w-6xl mx-auto">
          <div className="inline-flex items-center space-x-2 space-x-reverse bg-rose-gold/10 text-rose-gold px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>منوی دیجیتال هوشمند</span>
          </div>
          <h1 className="text-xl md:text-5xl font-bold mb-6 leading-tight">
            <span className="text-rose-gold alexandria">{title}</span>
          </h1>
          <div>{node}</div>
        </div>
      </div>
    </section>
  );
};

export default BannerInfo;
