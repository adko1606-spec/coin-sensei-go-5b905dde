import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Coins,
  PiggyBank,
  GraduationCap,
  RefreshCw,
  BarChart3,
  Briefcase,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import BottomNav from "@/components/BottomNav";
import StockCard from "@/components/StockCard";
import StockDetailModal from "@/components/StockDetailModal";
import InvestmentDemo from "@/components/InvestmentDemo";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

const Invest = () => {
  const { user, profile, refreshProfile } = useAuth();
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [investments, setInvestments] = useState<UserInvestment[]>([]);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [showDemo, setShowDemo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"market" | "portfolio">("market");

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

  // Trigger market update (client-side simulation for responsiveness)
  const handleRefreshMarket = async () => {
    try {
      const url = `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/process-investments`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
      });
      if (res.ok) {
        toast.success("📊 Trh bol aktualizovaný!");
        await loadData();
        await refreshProfile();
      }
    } catch {
      // Silent fail - market updates happen automatically
    }
  };

  const totalInvested = investments.reduce((s, i) => s + i.invested_coins, 0);
  const totalValue = investments.reduce((s, i) => s + i.current_value, 0);
  const totalProfit = totalValue - totalInvested;

  const portfolioStocks = stocks.filter((s) =>
    investments.some((i) => i.stock_id === s.id && i.current_value > 0)
  );

  if (loading) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <div className="animate-pulse text-primary font-bold text-xl">Načítavam trh...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-hero pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-extrabold text-foreground">Investície</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-full bg-coin/10 px-3 py-1">
              <Coins className="h-4 w-4 text-coin" />
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
            <strong>Toto je vzdelávacia hra</strong>, nie skutočné investovanie. V realite sú výnosy nepredvídateľné a môžeš stratiť celú investíciu. Nikdy neinvestuj peniaze, ktoré si nemôžeš dovoliť stratiť.
          </p>
        </div>

        {/* Portfolio overview */}
        {totalInvested > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-2xl bg-card border border-border p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <PiggyBank className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-foreground">Tvoje portfólio</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Investované</p>
                <p className="text-lg font-bold text-foreground">{totalInvested}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Hodnota</p>
                <p className="text-lg font-bold text-foreground">{Math.round(totalValue)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Zisk/Strata</p>
                <p
                  className={`text-lg font-bold ${
                    totalProfit >= 0 ? "text-primary" : "text-destructive"
                  }`}
                >
                  {totalProfit >= 0 ? "+" : ""}
                  {Math.round(totalProfit)}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tabs: Market / Portfolio */}
        <div className="mt-4 flex gap-2">
          <Button
            variant={view === "market" ? "default" : "outline"}
            size="sm"
            className="flex-1"
            onClick={() => setView("market")}
          >
            <BarChart3 className="h-4 w-4 mr-1" />
            Trh
          </Button>
          <Button
            variant={view === "portfolio" ? "default" : "outline"}
            size="sm"
            className="flex-1"
            onClick={() => setView("portfolio")}
          >
            <Briefcase className="h-4 w-4 mr-1" />
            Portfólio
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDemo(!showDemo)}
          >
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-muted-foreground uppercase">
                Dostupné akcie
              </h3>
              <Button variant="ghost" size="sm" onClick={handleRefreshMarket}>
                <RefreshCw className="h-3.5 w-3.5 mr-1" />
                Aktualizovať
              </Button>
            </div>
            {stocks.map((stock, idx) => (
              <StockCard
                key={stock.id}
                stock={stock}
                investment={investments.find((i) => i.stock_id === stock.id)}
                index={idx}
                onSelect={setSelectedStock}
              />
            ))}
          </motion.div>
        )}

        {/* Portfolio View */}
        {view === "portfolio" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 space-y-3"
          >
            {portfolioStocks.length > 0 ? (
              <>
                <h3 className="text-sm font-bold text-muted-foreground uppercase">
                  Tvoje investície
                </h3>
                {portfolioStocks.map((stock, idx) => (
                  <StockCard
                    key={stock.id}
                    stock={stock}
                    investment={investments.find((i) => i.stock_id === stock.id)}
                    index={idx}
                    onSelect={setSelectedStock}
                  />
                ))}
              </>
            ) : (
              <div className="text-center py-12">
                <PiggyBank className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground font-medium">Zatiaľ nemáš žiadne investície</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Prejdi na trh a začni investovať!
                </p>
                <Button className="mt-4" onClick={() => setView("market")}>
                  Prejsť na trh
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </main>

      {/* Stock Detail Modal */}
      {selectedStock && (
        <StockDetailModal
          stock={selectedStock}
          investment={investments.find((i) => i.stock_id === selectedStock.id)}
          onClose={() => setSelectedStock(null)}
          onAction={handleAction}
        />
      )}

      <BottomNav />
    </div>
  );
};

export default Invest;
