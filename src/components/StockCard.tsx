import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

const sectorLabels: Record<string, string> = {
  technology: "Technológie",
  energy: "Energia",
  finance: "Financie",
  healthcare: "Zdravotníctvo",
  consumer: "Spotrebiteľský",
  crypto: "Krypto",
  real_estate: "Reality",
  entertainment: "Zábava",
};

const StockCard = ({ stock, investment, index, onSelect }: StockCardProps) => {
  const change = stock.price_change_percent;
  const isPositive = change > 0;
  const isNegative = change < 0;

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
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-foreground truncate">{stock.name}</h3>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                  {sectorLabels[stock.sector] || stock.sector}
                </span>
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
                  {isPositive ? "+" : ""}
                  {change.toFixed(1)}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {stock.current_price.toFixed(0)} 🪙
              </p>
            </div>
          </div>

          {investment && investment.current_value > 0 && (
            <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between">
              <div className="text-xs">
                <span className="text-muted-foreground">Investované: </span>
                <span className="font-bold text-foreground">{investment.invested_coins} 🪙</span>
              </div>
              <div className="text-xs">
                <span className="text-muted-foreground">Hodnota: </span>
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
