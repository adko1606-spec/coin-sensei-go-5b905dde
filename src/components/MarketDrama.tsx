import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/contexts/I18nContext";

interface Stock {
  id: string;
  name: string;
  icon: string;
  price_change_percent: number;
  current_price: number;
}

const MarketDrama = () => {
  const { t } = useI18n();
  const [stocks, setStocks] = useState<Stock[]>([]);

  useEffect(() => {
    supabase.from("stocks").select("id, name, icon, price_change_percent, current_price").order("price_change_percent", { ascending: false }).then(({ data }) => {
      if (data) setStocks(data as any);
    });
  }, []);

  if (stocks.length < 4) return null;

  const gainers = stocks.slice(0, 3);
  const losers = [...stocks].sort((a, b) => a.price_change_percent - b.price_change_percent).slice(0, 3);

  return (
    <div className="space-y-3">
      {/* Top gainers */}
      <div className="rounded-2xl bg-primary/5 border border-primary/10 p-3">
        <h4 className="text-xs font-bold text-primary mb-2 flex items-center gap-1">
          <TrendingUp className="h-3.5 w-3.5" /> {t("invest.topGainers")}
        </h4>
        <div className="space-y-1.5">
          {gainers.map((s) => (
            <div key={s.id} className="flex items-center justify-between">
              <span className="text-xs text-foreground">{s.icon} {s.name}</span>
              <span className="text-xs font-bold text-primary">+{Math.round(s.price_change_percent)}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top losers */}
      <div className="rounded-2xl bg-destructive/5 border border-destructive/10 p-3">
        <h4 className="text-xs font-bold text-destructive mb-2 flex items-center gap-1">
          <TrendingDown className="h-3.5 w-3.5" /> {t("invest.topLosers")}
        </h4>
        <div className="space-y-1.5">
          {losers.map((s) => (
            <div key={s.id} className="flex items-center justify-between">
              <span className="text-xs text-foreground">{s.icon} {s.name}</span>
              <span className="text-xs font-bold text-destructive">{Math.round(s.price_change_percent)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketDrama;
