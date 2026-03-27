import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, ArrowRight, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { sectorProfiles } from "@/data/marketScenarios";

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
  const change = stock.price_change_percent;
  const isPositive = change > 0;
  const isNegative = change < 0;
  const profile = sectorProfiles[stock.sector];

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
