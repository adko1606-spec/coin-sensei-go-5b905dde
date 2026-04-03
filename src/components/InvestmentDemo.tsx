import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Clock, Wallet, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Area, AreaChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useI18n } from "@/contexts/I18nContext";

interface InvestmentDemoProps {
  onClose?: () => void;
}

const InvestmentDemo = ({ onClose }: InvestmentDemoProps) => {
  const { t } = useI18n();
  const [years, setYears] = useState(10);
  const [monthly, setMonthly] = useState(100);
  const [rate, setRate] = useState(7);

  const chartData = useMemo(() => {
    const data: { year: string; value: number; invested: number }[] = [];
    const r = rate / 100;
    const annualContribution = monthly * 12;

    for (let y = 1; y <= years; y++) {
      const totalValue = annualContribution * (((Math.pow(1 + r, y) - 1) / r) * (1 + r));
      data.push({
        year: `${t("demo.year")} ${y}`,
        value: Math.round(totalValue),
        invested: annualContribution * y,
      });
    }
    return data;
  }, [years, monthly, rate, t]);

  const finalValue = chartData.length > 0 ? chartData[chartData.length - 1].value : 0;
  const totalInvested = monthly * 12 * years;
  const profit = finalValue - totalInvested;

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat("sk-SK", { style: "currency", currency: "EUR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <Card className="border-accent/30 bg-accent/5">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <GraduationCap className="h-5 w-5 text-accent" />
            {t("demo.title")}
          </CardTitle>
          <p className="text-xs text-muted-foreground">{t("demo.subtitle")}</p>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="rounded-xl bg-primary/10 border border-primary/20 p-4 text-center">
            <p className="text-xs font-bold text-primary uppercase mb-1">{t("demo.finalValue")}</p>
            <p className="text-3xl font-black text-primary">{formatCurrency(finalValue)}</p>
            <div className="flex items-center justify-center gap-4 mt-2 text-xs">
              <span className="text-muted-foreground">{t("demo.totalInvested")}: <strong>{formatCurrency(totalInvested)}</strong></span>
              <span className="text-primary font-bold">{t("demo.profit")}: +{formatCurrency(profit)}</span>
            </div>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(145, 72%, 40%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(145, 72%, 40%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(205, 100%, 50%)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="hsl(205, 100%, 50%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="year" tick={{ fontSize: 10, fill: "hsl(220, 10%, 46%)" }} interval={Math.max(0, Math.floor(years / 5) - 1)} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(220, 10%, 46%)" }} tickFormatter={(v) => v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `${(v / 1000).toFixed(0)}K` : `${v}`} />
                <Tooltip formatter={(value: number, name: string) => [formatCurrency(value), name === "value" ? t("demo.value") : t("demo.totalInvested")]} />
                <Area type="monotone" dataKey="invested" stroke="hsl(205, 100%, 50%)" fill="url(#colorInvested)" strokeWidth={2} />
                <Area type="monotone" dataKey="value" stroke="hsl(145, 72%, 40%)" fill="url(#colorValue)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl bg-muted/50 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-accent" />{t("demo.duration")}</span>
                <span className="text-sm font-bold text-accent">{years} {t("demo.years")}</span>
              </div>
              <Slider value={[years]} onValueChange={([v]) => setYears(v)} min={1} max={40} step={1} />
            </div>
            <div className="rounded-xl bg-muted/50 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold flex items-center gap-1.5"><Wallet className="h-3.5 w-3.5 text-accent" />{t("demo.monthlyAmount")}</span>
                <span className="text-sm font-bold text-accent">{monthly} €</span>
              </div>
              <Slider value={[monthly]} onValueChange={([v]) => setMonthly(v)} min={10} max={1000} step={10} />
            </div>
            <div className="rounded-xl bg-muted/50 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold flex items-center gap-1.5"><TrendingUp className="h-3.5 w-3.5 text-accent" />{t("demo.annualReturn")}</span>
                <span className="text-sm font-bold text-accent">{rate.toFixed(1)} %</span>
              </div>
              <Slider value={[rate]} onValueChange={([v]) => setRate(v)} min={1} max={20} step={0.5} />
            </div>
          </div>

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-3">
            <p className="text-xs text-foreground leading-relaxed">💡 <strong>{t("demo.compoundTip")}</strong></p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default InvestmentDemo;
