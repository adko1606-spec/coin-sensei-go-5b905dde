import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  ArrowDownCircle,
  ArrowUpCircle,
  X,
  History,
  Newspaper,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
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

interface StockDetailModalProps {
  stock: Stock;
  investment?: UserInvestment;
  onClose: () => void;
  onAction: () => void;
}

const StockDetailModal = ({ stock, investment, onClose, onAction }: StockDetailModalProps) => {
  const { user, profile, addCoins } = useAuth();
  const [investAmount, setInvestAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [tab, setTab] = useState<"invest" | "withdraw" | "history">("invest");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [processing, setProcessing] = useState(false);

  const coins = (profile as any)?.coins ?? 0;
  const currentInvestment = investment?.current_value ?? 0;
  const investedCoins = investment?.invested_coins ?? 0;
  const profitLoss = currentInvestment - investedCoins;
  const profitPercent = investedCoins > 0 ? ((profitLoss / investedCoins) * 100) : 0;

  useEffect(() => {
    if (!user) return;
    const loadData = async () => {
      const [txRes, evRes] = await Promise.all([
        supabase
          .from("investment_transactions")
          .select("*")
          .eq("user_id", user.id)
          .eq("stock_id", stock.id)
          .order("created_at", { ascending: false })
          .limit(20),
        supabase
          .from("market_events")
          .select("*")
          .eq("stock_id", stock.id)
          .order("created_at", { ascending: false })
          .limit(10),
      ]);
      if (txRes.data) setTransactions(txRes.data);
      if (evRes.data) setEvents(evRes.data);
    };
    loadData();
  }, [user, stock.id]);

  const handleInvest = async () => {
    const amount = parseInt(investAmount);
    if (!amount || amount <= 0) {
      toast.error("Zadaj platnú sumu");
      return;
    }
    if (amount > coins) {
      toast.error("Nemáš dostatok mincí");
      return;
    }

    setProcessing(true);
    try {
      // Deduct coins
      const newCoins = coins - amount;
      await supabase.from("profiles").update({ coins: newCoins } as any).eq("user_id", user!.id);

      // Upsert investment
      const newInvested = investedCoins + amount;
      const newValue = currentInvestment + amount;

      if (investment && currentInvestment > 0) {
        await supabase
          .from("user_investments")
          .update({
            invested_coins: newInvested,
            current_value: newValue,
            last_update: new Date().toISOString(),
          } as any)
          .eq("user_id", user!.id)
          .eq("stock_id", stock.id);
      } else {
        await supabase.from("user_investments").insert({
          user_id: user!.id,
          stock_id: stock.id,
          invested_coins: amount,
          current_value: amount,
        } as any);
      }

      // Log transaction
      await supabase.from("investment_transactions").insert({
        user_id: user!.id,
        stock_id: stock.id,
        type: "invest",
        amount: amount,
        balance_after: newValue,
        event_text: `Investoval si ${amount} mincí do ${stock.name}`,
      } as any);

      toast.success(`📈 Investoval si ${amount} mincí do ${stock.name}!`);
      setInvestAmount("");
      onAction();
    } catch (e) {
      toast.error("Chyba pri investovaní");
    }
    setProcessing(false);
  };

  const handleWithdraw = async () => {
    const amount = parseInt(withdrawAmount);
    if (!amount || amount <= 0) {
      toast.error("Zadaj platnú sumu");
      return;
    }
    if (amount > Math.floor(currentInvestment)) {
      toast.error("Nemáš toľko investovaných mincí");
      return;
    }

    setProcessing(true);
    try {
      // Add coins back
      const newCoins = coins + amount;
      await supabase.from("profiles").update({ coins: newCoins } as any).eq("user_id", user!.id);

      // Update investment
      const ratio = amount / currentInvestment;
      const coinsToRemove = Math.round(investedCoins * ratio);
      const newValue = currentInvestment - amount;
      const newInvested = Math.max(0, investedCoins - coinsToRemove);

      if (newValue <= 0) {
        await supabase
          .from("user_investments")
          .delete()
          .eq("user_id", user!.id)
          .eq("stock_id", stock.id);
      } else {
        await supabase
          .from("user_investments")
          .update({
            invested_coins: newInvested,
            current_value: newValue,
            last_update: new Date().toISOString(),
          } as any)
          .eq("user_id", user!.id)
          .eq("stock_id", stock.id);
      }

      // Log transaction
      await supabase.from("investment_transactions").insert({
        user_id: user!.id,
        stock_id: stock.id,
        type: "withdraw",
        amount: -amount,
        balance_after: newValue,
        event_text: `Vybral si ${amount} mincí z ${stock.name}`,
      } as any);

      toast.success(`💰 Vybral si ${amount} mincí z ${stock.name}!`);
      setWithdrawAmount("");
      onAction();
    } catch (e) {
      toast.error("Chyba pri výbere");
    }
    setProcessing(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          className="w-full max-w-lg bg-card rounded-2xl shadow-2xl max-h-[85vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between rounded-t-2xl z-10">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{stock.icon}</span>
              <div>
                <h2 className="font-bold text-lg text-foreground">{stock.name}</h2>
                <p className="text-xs text-muted-foreground">{stock.description}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-muted transition-colors">
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          <div className="p-4 space-y-4">
            {/* Current investment info */}
            {investedCoins > 0 && (
              <div className="rounded-xl bg-muted/50 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Investované</span>
                  <span className="font-bold text-foreground">{investedCoins} 🪙</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Aktuálna hodnota</span>
                  <span className="font-bold text-foreground">{Math.round(currentInvestment)} 🪙</span>
                </div>
                <div className="flex items-center justify-between border-t border-border pt-2">
                  <span className="text-sm text-muted-foreground">Zisk/Strata</span>
                  <span
                    className={`font-bold flex items-center gap-1 ${
                      profitLoss >= 0 ? "text-primary" : "text-destructive"
                    }`}
                  >
                    {profitLoss >= 0 ? (
                      <TrendingUp className="h-3.5 w-3.5" />
                    ) : (
                      <TrendingDown className="h-3.5 w-3.5" />
                    )}
                    {profitLoss >= 0 ? "+" : ""}
                    {Math.round(profitLoss)} 🪙 ({profitPercent.toFixed(1)}%)
                  </span>
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="flex gap-1 bg-muted/50 rounded-xl p-1">
              {[
                { key: "invest" as const, label: "Investovať", icon: ArrowDownCircle },
                { key: "withdraw" as const, label: "Vybrať", icon: ArrowUpCircle },
                { key: "history" as const, label: "História", icon: History },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
                    tab === t.key
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <t.icon className="h-3.5 w-3.5" />
                  {t.label}
                </button>
              ))}
            </div>

            {/* Invest tab */}
            {tab === "invest" && (
              <div className="space-y-3">
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <span>Dostupné mince:</span>
                  <span className="font-bold text-coin">{coins} 🪙</span>
                </div>
                <Input
                  type="number"
                  placeholder="Koľko mincí chceš investovať?"
                  value={investAmount}
                  onChange={(e) => setInvestAmount(e.target.value)}
                  max={coins}
                  min={1}
                />
                <div className="flex gap-2">
                  {[10, 25, 50, 100].map((pct) => (
                    <Button
                      key={pct}
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs"
                      onClick={() => setInvestAmount(String(Math.floor(coins * (pct / 100))))}
                    >
                      {pct}%
                    </Button>
                  ))}
                </div>
                <Button
                  className="w-full"
                  onClick={handleInvest}
                  disabled={processing || !investAmount || parseInt(investAmount) <= 0}
                >
                  <ArrowDownCircle className="h-4 w-4 mr-2" />
                  Investovať {investAmount || "0"} 🪙
                </Button>
                <div className="rounded-lg bg-accent/5 border border-accent/20 p-3">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <AlertTriangle className="h-3 w-3 inline mr-1" />
                    Investície sa zhodnocujú každých 12 hodín. Hodnota môže rásť aj klesať podľa trhových udalostí.
                  </p>
                </div>
              </div>
            )}

            {/* Withdraw tab */}
            {tab === "withdraw" && (
              <div className="space-y-3">
                {currentInvestment > 0 ? (
                  <>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <span>Dostupné na výber:</span>
                      <span className="font-bold text-foreground">{Math.floor(currentInvestment)} 🪙</span>
                    </div>
                    <Input
                      type="number"
                      placeholder="Koľko mincí chceš vybrať?"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      max={Math.floor(currentInvestment)}
                      min={1}
                    />
                    <div className="flex gap-2">
                      {[25, 50, 75, 100].map((pct) => (
                        <Button
                          key={pct}
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs"
                          onClick={() =>
                            setWithdrawAmount(String(Math.floor(currentInvestment * (pct / 100))))
                          }
                        >
                          {pct}%
                        </Button>
                      ))}
                    </div>
                    <Button
                      className="w-full"
                      variant="secondary"
                      onClick={handleWithdraw}
                      disabled={processing || !withdrawAmount || parseInt(withdrawAmount) <= 0}
                    >
                      <ArrowUpCircle className="h-4 w-4 mr-2" />
                      Vybrať {withdrawAmount || "0"} 🪙
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    Nemáš žiadne investície v tejto akcii
                  </div>
                )}
              </div>
            )}

            {/* History tab */}
            {tab === "history" && (
              <div className="space-y-3">
                {/* Market events */}
                {events.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase mb-2 flex items-center gap-1">
                      <Newspaper className="h-3 w-3" />
                      Trhové udalosti
                    </h4>
                    <div className="space-y-2">
                      {events.slice(0, 5).map((e) => (
                        <div
                          key={e.id}
                          className="rounded-lg bg-muted/30 p-2.5 text-xs"
                        >
                          <p className="text-foreground">{e.event_text}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span
                              className={`font-bold ${
                                e.price_impact_percent >= 0 ? "text-primary" : "text-destructive"
                              }`}
                            >
                              {e.price_impact_percent >= 0 ? "+" : ""}
                              {e.price_impact_percent.toFixed(1)}%
                            </span>
                            <span className="text-muted-foreground">
                              {new Date(e.created_at).toLocaleDateString("sk-SK")}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Transaction history */}
                {transactions.length > 0 ? (
                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase mb-2 flex items-center gap-1">
                      <History className="h-3 w-3" />
                      Tvoje transakcie
                    </h4>
                    <div className="space-y-2">
                      {transactions.map((tx) => (
                        <div
                          key={tx.id}
                          className="rounded-lg bg-muted/30 p-2.5 text-xs flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            {tx.type === "invest" ? (
                              <ArrowDownCircle className="h-4 w-4 text-primary" />
                            ) : tx.type === "withdraw" ? (
                              <ArrowUpCircle className="h-4 w-4 text-secondary" />
                            ) : (
                              <TrendingUp className="h-4 w-4 text-accent" />
                            )}
                            <span className="text-foreground">{tx.event_text}</span>
                          </div>
                          <span className="text-muted-foreground whitespace-nowrap ml-2">
                            {new Date(tx.created_at).toLocaleDateString("sk-SK")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground text-sm">
                    Žiadne transakcie
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default StockDetailModal;
