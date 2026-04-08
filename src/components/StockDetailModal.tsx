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
  Shield,
  Info,
} from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, ReferenceDot } from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import { toast } from "sonner";
import { sectorProfiles } from "@/data/marketScenarios";
import { useSound } from "@/hooks/useSound";

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

const riskColors: Record<number, string> = {
  1: "border-primary/30 bg-primary/5 text-primary",
  2: "border-accent/30 bg-accent/5 text-accent-foreground",
  3: "border-orange-500/30 bg-orange-500/5 text-orange-600",
  4: "border-destructive/30 bg-destructive/5 text-destructive",
};

type Timeframe = "1D" | "1W" | "1M";

const StockPriceChart = ({ stockId, currentPrice, changePercent, userId }: { stockId: string; currentPrice: number; changePercent: number; userId?: string }) => {
  const { t } = useI18n();
  const [data, setData] = useState<{ t: string; p: number; isBuy?: boolean; buyAmount?: number }[]>([]);
  const [timeframe, setTimeframe] = useState<Timeframe>("1D");

  useEffect(() => {
    const now = new Date();
    let since: Date;
    let limit = 24;

    switch (timeframe) {
      case "1D":
        since = new Date(now);
        since.setHours(0, 0, 0, 0);
        limit = 24;
        break;
      case "1W":
        since = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        limit = 168;
        break;
      case "1M":
        since = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        limit = 720;
        break;
    }

    const loadChart = async () => {
      const [evRes, txRes] = await Promise.all([
        supabase
          .from("market_events")
          .select("created_at, price_impact_percent")
          .eq("stock_id", stockId)
          .gte("created_at", since.toISOString())
          .order("created_at", { ascending: true })
          .limit(limit),
        userId ? supabase
          .from("investment_transactions")
          .select("created_at, amount, type")
          .eq("user_id", userId)
          .eq("stock_id", stockId)
          .eq("type", "invest")
          .gte("created_at", since.toISOString())
          .order("created_at", { ascending: true }) : Promise.resolve({ data: [] }),
      ]);

      const events = evRes.data || [];
      const buys = (txRes.data || []) as any[];

      if (events.length > 0) {
        let price = currentPrice;
        const impacts = events.map((e) => e.price_impact_percent);
        for (let i = impacts.length - 1; i >= 0; i--) {
          price = price / (1 + (impacts[i] ?? 0) / 100);
        }

        const formatTime = (date: Date) => {
          if (timeframe === "1D") return `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
          if (timeframe === "1W") return `${date.getDate()}.${date.getMonth() + 1}`;
          return `${date.getDate()}.${date.getMonth() + 1}`;
        };

        const points: typeof data = [{ t: "Start", p: Math.round(price) }];
        for (let i = 0; i < impacts.length; i++) {
          price = price * (1 + (impacts[i] ?? 0) / 100);
          const time = new Date(events[i].created_at);
          const timeStr = formatTime(time);
          
          // Check if there's a buy at this time
          const buy = buys.find((b) => {
            const bt = new Date(b.created_at);
            return Math.abs(bt.getTime() - time.getTime()) < 3600000;
          });

          points.push({
            t: timeStr,
            p: Math.round(price),
            isBuy: !!buy,
            buyAmount: buy ? buy.amount : undefined,
          });
        }
        setData(points);
      } else {
        setData([
          { t: "Start", p: currentPrice },
          { t: t("invest.current"), p: currentPrice },
        ]);
      }
    };

    loadChart();
  }, [stockId, currentPrice, timeframe, userId]);

  const isPositive = changePercent > 0;
  const isNegative = changePercent < 0;
  const color = isPositive ? "hsl(145, 72%, 40%)" : isNegative ? "hsl(0, 84%, 60%)" : "hsl(220, 10%, 46%)";

  if (data.length < 2) return null;

  const buyPoints = data.filter((d) => d.isBuy);

  return (
    <div className="rounded-xl bg-muted/30 border border-border p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex gap-1">
          {(["1D", "1W", "1M"] as Timeframe[]).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all ${
                timeframe === tf ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
        <span className={`text-sm font-bold ${isPositive ? "text-primary" : isNegative ? "text-destructive" : "text-muted-foreground"}`}>
          {isPositive ? "+" : ""}{Math.round(changePercent)}%
        </span>
      </div>
      <div className="h-40 overflow-x-auto">
        <div style={{ width: data.length > 20 ? `${Math.max(100, data.length * 5)}%` : "100%", height: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id={`detailGrad-${stockId}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={color} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <XAxis dataKey="t" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
              <YAxis hide domain={["dataMin - 5", "dataMax + 5"]} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                formatter={(v: number, _: any, props: any) => {
                  const entry = props.payload;
                  const items = [`${v} F`];
                  if (entry.isBuy) items.push(`📥 ${t("invest.investAction")}: ${entry.buyAmount} F`);
                  return [items.join(" | "), t("common.price")];
                }}
              />
              <Area type="monotone" dataKey="p" stroke={color} fill={`url(#detailGrad-${stockId})`} strokeWidth={2} dot={false} />
              {buyPoints.map((bp, idx) => (
                <ReferenceDot key={idx} x={bp.t} y={bp.p} r={4} fill="hsl(145, 72%, 40%)" stroke="white" strokeWidth={2} />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      {buyPoints.length > 0 && (
        <div className="flex items-center gap-1 mt-1">
          <div className="h-2 w-2 rounded-full bg-primary" />
          <span className="text-[10px] text-muted-foreground">{t("invest.buyMarker")}</span>
        </div>
      )}
    </div>
  );
};

const StockDetailModal = ({ stock, investment, onClose, onAction }: StockDetailModalProps) => {
  const { user, profile } = useAuth();
  const { t } = useI18n();
  const { playInvest, playWithdraw } = useSound();
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
  const sectorProfile = sectorProfiles[stock.sector];

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
    if (!amount || amount <= 0) { toast.error(t("invest.enterValidAmount")); return; }
    if (amount > coins) { toast.error(t("invest.notEnoughCoins")); return; }

    setProcessing(true);
    try {
      const newCoins = coins - amount;
      await supabase.from("profiles").update({ coins: newCoins } as any).eq("user_id", user!.id);

      const newInvested = investedCoins + amount;
      const newValue = currentInvestment + amount;

      if (investment && currentInvestment > 0) {
        await supabase.from("user_investments")
          .update({ invested_coins: newInvested, current_value: newValue, last_update: new Date().toISOString() } as any)
          .eq("user_id", user!.id).eq("stock_id", stock.id);
      } else {
        await supabase.from("user_investments").insert({
          user_id: user!.id, stock_id: stock.id, invested_coins: amount, current_value: amount,
        } as any);
      }

      await supabase.from("investment_transactions").insert({
        user_id: user!.id, stock_id: stock.id, type: "invest", amount,
        balance_after: newValue, event_text: `${t("invest.investedMsg")} ${amount} Fincov`,
      } as any);

      playInvest();
      toast.success(`📈 ${t("invest.investedMsg")} ${amount} ${t("invest.finceInto")} ${stock.name}!`);
      setInvestAmount("");
      onAction();
    } catch { toast.error(t("invest.investError")); }
    setProcessing(false);
  };

  const handleWithdraw = async () => {
    const amount = parseInt(withdrawAmount);
    if (!amount || amount <= 0) { toast.error(t("invest.enterValidAmount")); return; }
    if (amount > Math.floor(currentInvestment)) { toast.error(t("invest.notEnoughInvested")); return; }

    setProcessing(true);
    try {
      const newCoins = coins + amount;
      await supabase.from("profiles").update({ coins: newCoins } as any).eq("user_id", user!.id);

      const ratio = amount / currentInvestment;
      const coinsToRemove = Math.round(investedCoins * ratio);
      const newValue = currentInvestment - amount;
      const newInvested = Math.max(0, investedCoins - coinsToRemove);

      if (newValue <= 0) {
        await supabase.from("user_investments").delete().eq("user_id", user!.id).eq("stock_id", stock.id);
      } else {
        await supabase.from("user_investments")
          .update({ invested_coins: newInvested, current_value: newValue, last_update: new Date().toISOString() } as any)
          .eq("user_id", user!.id).eq("stock_id", stock.id);
      }

      await supabase.from("investment_transactions").insert({
        user_id: user!.id, stock_id: stock.id, type: "withdraw", amount: -amount,
        balance_after: newValue, event_text: `${t("invest.withdrawnMsg")} ${amount} Fincov`,
      } as any);

      playWithdraw();
      toast.success(`💰 ${t("invest.withdrawnMsg")} ${amount} ${t("invest.finceFrom")} ${stock.name}!`);
      setWithdrawAmount("");
      onAction();
    } catch { toast.error(t("invest.withdrawError")); }
    setProcessing(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
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
            {/* Price chart with timeframe & buy markers */}
            <StockPriceChart stockId={stock.id} currentPrice={stock.current_price} changePercent={stock.price_change_percent} userId={user?.id} />

            {/* Sector risk info */}
            {sectorProfile && (
              <div className={`rounded-xl border p-3 ${riskColors[sectorProfile.riskLevel]}`}>
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="h-4 w-4" />
                  <span className="text-sm font-bold">{t("invest.riskLabel")}: {sectorProfile.risk}</span>
                </div>
                <p className="text-xs opacity-80">{sectorProfile.description}</p>
                <p className="text-xs opacity-60 mt-1">{t("invest.historicalReturn")}: {sectorProfile.avgReturn}</p>
              </div>
            )}

            {/* Current investment */}
            {investedCoins > 0 && (
              <div className="rounded-xl bg-muted/50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">{t("invest.deposited")}</span>
                  <span className="font-bold text-foreground">{investedCoins} F</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t("invest.current")}</span>
                  <span className={`font-bold flex items-center gap-1 ${profitLoss >= 0 ? "text-primary" : "text-destructive"}`}>
                    {profitLoss >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                    {Math.round(currentInvestment)} F
                    <span className="text-xs font-normal">
                      ({profitLoss >= 0 ? "+" : ""}{Math.round(profitPercent)}%)
                    </span>
                  </span>
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="flex gap-1 bg-muted/50 rounded-xl p-1">
              {([
                { key: "invest" as const, label: t("invest.investAction"), icon: ArrowDownCircle },
                { key: "withdraw" as const, label: t("invest.withdraw"), icon: ArrowUpCircle },
                { key: "history" as const, label: t("invest.history"), icon: History },
              ]).map((tb) => (
                <button
                  key={tb.key} onClick={() => setTab(tb.key)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
                    tab === tb.key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <tb.icon className="h-3.5 w-3.5" />{tb.label}
                </button>
              ))}
            </div>

            {/* Invest tab */}
            {tab === "invest" && (
              <div className="space-y-3">
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  {t("invest.yourFince")}: <span className="font-bold text-coin">{coins} F</span>
                </div>
                <Input
                  type="number" placeholder={t("invest.howMuchInvest")}
                  value={investAmount} onChange={(e) => setInvestAmount(e.target.value)}
                  max={coins} min={1}
                />
                <div className="flex gap-2">
                  {[10, 25, 50, 100].map((pct) => (
                    <Button key={pct} variant="outline" size="sm" className="flex-1 text-xs"
                      onClick={() => setInvestAmount(String(Math.floor(coins * (pct / 100))))}>
                      {pct}%
                    </Button>
                  ))}
                </div>
                <Button className="w-full" onClick={handleInvest}
                  disabled={processing || !investAmount || parseInt(investAmount) <= 0}>
                  <ArrowDownCircle className="h-4 w-4 mr-2" />
                  {t("invest.investAction")} {investAmount || "0"} F
                </Button>

                <div className="space-y-2">
                  <div className="rounded-lg bg-destructive/5 border border-destructive/20 p-3">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      <AlertTriangle className="h-3 w-3 inline mr-1 text-destructive" />
                      <strong>{t("invest.gameWarning")}</strong>
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/30 border border-border p-3">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                       <Info className="h-3 w-3 inline mr-1" />
                      {t("invest.valueChanges")} {sectorProfile?.riskLevel === 4
                        ? t("invest.cryptoVolatile")
                        : sectorProfile?.riskLevel === 3
                        ? t("invest.riskyArea")
                        : t("invest.stableArea")}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Withdraw tab */}
            {tab === "withdraw" && (
              <div className="space-y-3">
                {currentInvestment > 0 ? (
                  <>
                    <div className="text-xs text-muted-foreground">
                      {t("invest.availableWithdraw")}: <span className="font-bold text-foreground">{Math.floor(currentInvestment)} F</span>
                    </div>
                    <Input
                      type="number" placeholder={t("invest.howMuchWithdraw")}
                      value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)}
                      max={Math.floor(currentInvestment)} min={1}
                    />
                    <div className="flex gap-2">
                      {[25, 50, 75, 100].map((pct) => (
                        <Button key={pct} variant="outline" size="sm" className="flex-1 text-xs"
                          onClick={() => setWithdrawAmount(String(Math.floor(currentInvestment * (pct / 100))))}>
                          {pct}%
                        </Button>
                      ))}
                    </div>
                    <Button className="w-full" variant="secondary" onClick={handleWithdraw}
                      disabled={processing || !withdrawAmount || parseInt(withdrawAmount) <= 0}>
                      <ArrowUpCircle className="h-4 w-4 mr-2" />
                      {t("invest.withdraw")} {withdrawAmount || "0"} F
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    {t("invest.noInvestmentHere")}
                  </div>
                )}
              </div>
            )}

            {/* History tab */}
            {tab === "history" && (
              <div className="space-y-3">
                {events.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase mb-2 flex items-center gap-1">
                      <Newspaper className="h-3 w-3" /> {t("invest.marketNews")}
                    </h4>
                    <div className="space-y-2">
                      {events.map((e) => (
                        <div key={e.id} className="rounded-lg bg-muted/30 p-2.5 text-xs">
                          <p className="text-foreground">{e.event_text}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className={`font-bold ${e.price_impact_percent >= 0 ? "text-primary" : "text-destructive"}`}>
                              {e.price_impact_percent >= 0 ? "+" : ""}{Math.round(e.price_impact_percent)}%
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

                {transactions.length > 0 ? (
                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase mb-2 flex items-center gap-1">
                      <History className="h-3 w-3" /> {t("invest.yourTransactions")}
                    </h4>
                    <div className="space-y-2">
                      {transactions.map((tx) => (
                        <div key={tx.id} className="rounded-lg bg-muted/30 p-2.5 text-xs flex items-center justify-between">
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
                  <div className="text-center py-6 text-muted-foreground text-sm">{t("invest.noTransactions")}</div>
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
