import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  PiggyBank,
  GraduationCap,
  BarChart3,
  Briefcase,
  Heart,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import BottomNav from "@/components/BottomNav";
import StockCard from "@/components/StockCard";
import StockDetailModal from "@/components/StockDetailModal";
import InvestmentDemo from "@/components/InvestmentDemo";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { investmentCategories } from "@/data/marketScenarios";

interface Stock {
  id: string;
  name: string;
  description: string;
  icon: string;
  sector: string;
  current_price: number;
  price_change_percent: number;
}

interface UserInvestment {
  stock_id: string;
  invested_coins: number;
  current_value: number;
}

const formatCountdown = (ms: number) => {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return `${h}h ${m}m`;
};

const Invest = () => {
  const { user, profile, refreshProfile, currentLives, nextLifeIn } = useAuth();
  const { t } = useI18n();
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [investments, setInvestments] = useState<UserInvestment[]>([]);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [showDemo, setShowDemo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"market" | "portfolio">("market");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const coins = (profile as any)?.coins ?? 0;

  const loadData = useCallback(async () => {
    if (!user) return;
    const [stocksRes, investRes] = await Promise.all([
      supabase.from("stocks").select("*").order("name"),
      supabase.from("user_investments").select("*").eq("user_id", user.id).eq("is_active", true),
    ]);
    if (stocksRes.data) setStocks(stocksRes.data as any);
    if (investRes.data) setInvestments(investRes.data as any);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAction = async () => {
    await refreshProfile();
    await loadData();
  };

  const totalInvested = investments.reduce((s, i) => s + i.invested_coins, 0);
  const totalValue = investments.reduce((s, i) => s + i.current_value, 0);
  const totalProfit = totalValue - totalInvested;

  const filteredStocks = categoryFilter === "all"
    ? stocks
    : stocks.filter((s) => {
        const cat = investmentCategories.find((c) => c.id === categoryFilter);
        return cat ? cat.sectors.includes(s.sector) : true;
      });

  const portfolioStocks = stocks.filter((s) =>
    investments.some((i) => i.stock_id === s.id && i.current_value > 0)
  );

  if (loading) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <div className="animate-pulse text-primary font-bold text-xl">{t("invest.loadingMarket")}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-hero pb-20">
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-extrabold text-foreground">{t("invest.title")}</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-full bg-destructive/10 px-2.5 py-1">
              <Heart className="h-3.5 w-3.5 text-destructive fill-destructive" />
              <span className="text-xs font-bold text-destructive">{currentLives}</span>
              {currentLives < 6 && nextLifeIn && (
                <span className="text-[9px] text-destructive/70">{formatCountdown(nextLifeIn)}</span>
              )}
            </div>
            <div className="flex items-center gap-1 rounded-full bg-coin/10 px-3 py-1">
              <span className="text-sm">🪙</span>
              <span className="text-sm font-bold text-coin">{coins}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4">
        {/* Educational disclaimer */}
        <div className="mt-4 rounded-xl bg-destructive/5 border border-destructive/20 p-3 flex items-start gap-2">
          <span className="text-base mt-0.5">⚠️</span>
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong>{t("invest.warning").split(".")[0]}.</strong> {t("invest.warning").split(".").slice(1).join(".")}
          </p>
        </div>

        {/* Portfolio overview */}
        {totalInvested > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-2xl bg-card border border-border p-4">
            <div className="flex items-center gap-2 mb-3">
              <PiggyBank className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-foreground">{t("invest.yourPortfolio")}</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">{t("invest.invested")}</p>
                <p className="text-lg font-bold text-foreground">{totalInvested}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">{t("invest.value")}</p>
                <p className="text-lg font-bold text-foreground">{Math.round(totalValue)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">{t("invest.profitLoss")}</p>
                <p className={`text-lg font-bold ${totalProfit >= 0 ? "text-primary" : "text-destructive"}`}>
                  {totalProfit >= 0 ? "+" : ""}{Math.round(totalProfit)}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tabs: Market / Portfolio */}
        <div className="mt-4 flex gap-2">
          <Button variant={view === "market" ? "default" : "outline"} size="sm" className="flex-1" onClick={() => setView("market")}>
            <BarChart3 className="h-4 w-4 mr-1" />{t("invest.market")}
          </Button>
          <Button variant={view === "portfolio" ? "default" : "outline"} size="sm" className="flex-1" onClick={() => setView("portfolio")}>
            <Briefcase className="h-4 w-4 mr-1" />{t("invest.portfolio")}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowDemo(!showDemo)}>
            <GraduationCap className="h-4 w-4" />
          </Button>
        </div>

        {/* Demo */}
        {showDemo && (
          <div className="mt-4">
            <InvestmentDemo onClose={() => setShowDemo(false)} />
          </div>
        )}

        {/* Market View */}
        {view === "market" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 space-y-3">
            <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
              <Button variant={categoryFilter === "all" ? "default" : "outline"} size="sm" className="shrink-0 text-xs" onClick={() => setCategoryFilter("all")}>
                🌐 {t("invest.all")}
              </Button>
              {investmentCategories.map((cat) => (
                <Button key={cat.id} variant={categoryFilter === cat.id ? "default" : "outline"} size="sm" className="shrink-0 text-xs" onClick={() => setCategoryFilter(cat.id)}>
                  {cat.icon} {t(`invest.${cat.id}`) || cat.label}
                </Button>
              ))}
            </div>

            <h3 className="text-sm font-bold text-muted-foreground uppercase">
              {categoryFilter === "all" ? t("invest.allInstruments") : investmentCategories.find((c) => c.id === categoryFilter)?.label}
            </h3>
            {filteredStocks.map((stock, idx) => (
              <StockCard key={stock.id} stock={stock} investment={investments.find((i) => i.stock_id === stock.id)} index={idx} onSelect={setSelectedStock} />
            ))}
            {filteredStocks.length === 0 && (
              <p className="text-center py-8 text-muted-foreground text-sm">{t("invest.noInstruments")}</p>
            )}
          </motion.div>
        )}

        {/* Portfolio View */}
        {view === "portfolio" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 space-y-3">
            {portfolioStocks.length > 0 ? (
              <>
                <h3 className="text-sm font-bold text-muted-foreground uppercase">{t("invest.yourInvestments")}</h3>
                {portfolioStocks.map((stock, idx) => (
                  <StockCard key={stock.id} stock={stock} investment={investments.find((i) => i.stock_id === stock.id)} index={idx} onSelect={setSelectedStock} />
                ))}
              </>
            ) : (
              <div className="text-center py-12">
                <PiggyBank className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground font-medium">{t("invest.noInvestments")}</p>
                <p className="text-xs text-muted-foreground mt-1">{t("invest.startInvesting")}</p>
                <Button className="mt-4" onClick={() => setView("market")}>{t("invest.goToMarket")}</Button>
              </div>
            )}
          </motion.div>
        )}
      </main>

      {selectedStock && (
        <StockDetailModal stock={selectedStock} investment={investments.find((i) => i.stock_id === selectedStock.id)} onClose={() => setSelectedStock(null)} onAction={handleAction} />
      )}

      <BottomNav />
    </div>
  );
};

export default Invest;
