import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, ArrowRight, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { sectorProfiles } from "@/data/marketScenarios";
import { supabase } from "@/integrations/supabase/client";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

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

interface StockCardProps {
  stock: Stock;
  investment?: UserInvestment;
  index: number;
  onSelect: (stock: Stock) => void;
}

const riskColors: Record<number, string> = {
  1: "bg-primary/15 text-primary",
  2: "bg-accent/15 text-accent-foreground",
  3: "bg-orange-500/15 text-orange-600",
  4: "bg-destructive/15 text-destructive",
};

const StockCard = ({ stock, investment, index, onSelect }: StockCardProps) => {
  const [priceHistory, setPriceHistory] = useState<{ t: number; p: number }[]>([]);
  const change = stock.price_change_percent;
  const isPositive = change > 0;
  const isNegative = change < 0;
  const profile = sectorProfiles[stock.sector];

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    supabase
      .from("market_events")
      .select("created_at, price_impact_percent")
      .eq("stock_id", stock.id)
      .gte("created_at", today.toISOString())
      .order("created_at", { ascending: true })
      .limit(24)
      .then(({ data }) => {
        if (data && data.length > 0) {
          let price = stock.current_price;
          // Reconstruct price from events backwards
          const impacts = data.map((e) => e.price_impact_percent);
          // Go backwards to find starting price
          for (let i = impacts.length - 1; i >= 0; i--) {
            price = price / (1 + (impacts[i] ?? 0) / 100);
          }
          // Now go forward building chart
          const points: { t: number; p: number }[] = [{ t: 0, p: Math.round(price) }];
          for (let i = 0; i < impacts.length; i++) {
            price = price * (1 + (impacts[i] ?? 0) / 100);
            points.push({ t: i + 1, p: Math.round(price) });
          }
          setPriceHistory(points);
        } else {
          // No events today - show flat line
          setPriceHistory([
            { t: 0, p: stock.current_price },
            { t: 1, p: stock.current_price },
          ]);
        }
      });
  }, [stock.id, stock.current_price]);

  const chartColor = isPositive
    ? "hsl(145, 72%, 40%)"
    : isNegative
    ? "hsl(0, 84%, 60%)"
    : "hsl(220, 10%, 46%)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card
        className="cursor-pointer transition-all hover:shadow-md active:scale-[0.98] border-border/50"
        onClick={() => onSelect(stock)}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{stock.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-sm text-foreground truncate">{stock.name}</h3>
                {profile && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium flex items-center gap-0.5 ${riskColors[profile.riskLevel]}`}>
                    <Shield className="h-2.5 w-2.5" />
                    {profile.risk} riziko
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate">{stock.description}</p>
            </div>

            {/* Mini sparkline chart */}
            <div className="w-16 h-8 flex-shrink-0">
              {priceHistory.length > 1 && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={priceHistory}>
                    <defs>
                      <linearGradient id={`grad-${stock.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={chartColor} stopOpacity={0.3} />
                        <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="p"
                      stroke={chartColor}
                      fill={`url(#grad-${stock.id})`}
                      strokeWidth={1.5}
                      dot={false}
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="text-right flex-shrink-0">
              <div className="flex items-center gap-1 justify-end">
                {isPositive ? (
                  <TrendingUp className="h-3.5 w-3.5 text-primary" />
                ) : isNegative ? (
                  <TrendingDown className="h-3.5 w-3.5 text-destructive" />
                ) : (
                  <Minus className="h-3.5 w-3.5 text-muted-foreground" />
                )}
                <span
                  className={`text-sm font-bold ${
                    isPositive ? "text-primary" : isNegative ? "text-destructive" : "text-muted-foreground"
                  }`}
                >
                  {isPositive ? "+" : ""}{Math.round(change)}%
                </span>
              </div>
            </div>
          </div>

          {investment && investment.current_value > 0 && (
            <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between">
              <div className="text-xs">
                <span className="text-muted-foreground">Vložené: </span>
                <span className="font-bold text-foreground">{investment.invested_coins} 🪙</span>
              </div>
              <div className="text-xs">
                <span className="text-muted-foreground">Teraz: </span>
                <span
                  className={`font-bold ${
                    investment.current_value >= investment.invested_coins
                      ? "text-primary"
                      : "text-destructive"
                  }`}
                >
                  {Math.round(investment.current_value)} 🪙
                </span>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StockCard;
