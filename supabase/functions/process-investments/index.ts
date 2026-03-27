import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Realistic sector behavior profiles
// riskLevel 1 = stable (small moves), 4 = extreme volatility
const sectorBehavior: Record<string, { positiveWeight: number; scenarios: { text: string; min: number; max: number }[] }> = {
  finance: {
    positiveWeight: 0.6, // slight positive bias, stable
    scenarios: [
      { text: "🏦 Stabilné úrokové výnosy", min: 1, max: 3 },
      { text: "💳 Rast digitálnych platieb", min: 1, max: 3 },
      { text: "📉 Obavy z recesie", min: -3, max: -1 },
      { text: "📊 Pozitívna ekonomická správa", min: 1, max: 3 },
      { text: "🏛️ Prísnejšie bankové regulácie", min: -2, max: -1 },
    ],
  },
  consumer: {
    positiveWeight: 0.6,
    scenarios: [
      { text: "🍔 Stabilné tržby podľa očakávaní", min: 0, max: 2 },
      { text: "📦 Problémy v dodávateľskom reťazci", min: -3, max: -1 },
      { text: "🎉 Sviatočné tržby prekročili očakávania", min: 2, max: 5 },
      { text: "🌱 Ekologický sortiment zaujal zákazníkov", min: 1, max: 3 },
      { text: "💸 Inflácia znížila spotrebu", min: -3, max: -1 },
    ],
  },
  real_estate: {
    positiveWeight: 0.65,
    scenarios: [
      { text: "🏠 Ceny nehnuteľností mierne rastú", min: 1, max: 3 },
      { text: "🏗️ Nový projekt spustený", min: 1, max: 3 },
      { text: "📉 Hypotekárne sadzby vzrástli", min: -3, max: -1 },
      { text: "📊 Stabilný dopyt po bývaní", min: 0, max: 2 },
      { text: "🌆 Pokles dopytu po kancelárskych priestoroch", min: -2, max: -1 },
    ],
  },
  technology: {
    positiveWeight: 0.55,
    scenarios: [
      { text: "🚀 Nový AI čip zvýšil dopyt", min: 3, max: 8 },
      { text: "📱 Rekordný predpredaj produktu", min: 2, max: 6 },
      { text: "🔒 Bezpečnostná chyba v produkte", min: -5, max: -1 },
      { text: "🤝 Partnerstvo s veľkou firmou", min: 2, max: 7 },
      { text: "📉 Konkurencia predstavila lepší produkt", min: -6, max: -2 },
      { text: "📊 Kvartálne výsledky prekonali očakávania", min: 2, max: 5 },
    ],
  },
  energy: {
    positiveWeight: 0.55,
    scenarios: [
      { text: "☀️ Dotácie na zelenú energiu schválené", min: 2, max: 6 },
      { text: "🔋 Prelom v technológii batérií", min: 3, max: 8 },
      { text: "⛽ Ceny ropy klesli", min: -3, max: -1 },
      { text: "🌧️ Nepriaznivé počasie znížilo výrobu", min: -4, max: -1 },
      { text: "📈 Rekordná inštalácia solárnych panelov", min: 2, max: 5 },
    ],
  },
  healthcare: {
    positiveWeight: 0.5, // balanced - high risk
    scenarios: [
      { text: "💊 Nový liek schválený!", min: 5, max: 15 },
      { text: "🧬 Prelom v génovej terapii", min: 4, max: 12 },
      { text: "❌ Klinická štúdia zlyhala", min: -12, max: -4 },
      { text: "🏥 Partnerstvo s nemocnicami", min: 2, max: 6 },
      { text: "📋 Regulátor požaduje ďalšie testy", min: -6, max: -2 },
    ],
  },
  crypto: {
    positiveWeight: 0.45, // slightly negative bias - very risky
    scenarios: [
      { text: "⛓️ Veľká banka prijala blockchain", min: 8, max: 20 },
      { text: "🚨 Hacknutá kryptoburza!", min: -20, max: -8 },
      { text: "🐋 Veľký investor nakúpil pozície", min: 5, max: 15 },
      { text: "📜 Nová regulácia kryptomien", min: -10, max: 3 },
      { text: "📉 Masový výpredaj na trhu", min: -18, max: -5 },
      { text: "🔥 Virálny záujem o krypto", min: 5, max: 12 },
      { text: "🏦 Krajina zakázala kryptomeny", min: -15, max: -5 },
    ],
  },
  entertainment: {
    positiveWeight: 0.5,
    scenarios: [
      { text: "🎮 Nová hra dosiahla 10M stiahnutí!", min: 5, max: 14 },
      { text: "🐛 Kritické chyby v hre", min: -10, max: -3 },
      { text: "🏆 Ocenenie Hra roka", min: 3, max: 10 },
      { text: "🎬 Filmová adaptácia oznámená", min: 2, max: 7 },
      { text: "👥 Kľúčový vývojár odišiel", min: -6, max: -2 },
    ],
  },
};

function getRandomScenario(sector: string) {
  const behavior = sectorBehavior[sector] || sectorBehavior.technology;
  const { scenarios, positiveWeight } = behavior;

  // Filter by positive/negative based on weighted probability
  const isPositive = Math.random() < positiveWeight;
  const filtered = scenarios.filter((s) =>
    isPositive ? s.max > 0 : s.min < 0
  );
  const list = filtered.length > 0 ? filtered : scenarios;

  const s = list[Math.floor(Math.random() * list.length)];
  const impact = s.min + Math.random() * (s.max - s.min);
  return { text: s.text, impact: Math.round(impact * 100) / 100 };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: stocks } = await supabase.from("stocks").select("*");
    if (!stocks || stocks.length === 0) {
      return new Response(JSON.stringify({ message: "No stocks found" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    for (const stock of stocks) {
      const { text, impact } = getRandomScenario(stock.sector);

      const newPrice = Math.max(10, stock.current_price * (1 + impact / 100));
      await supabase.from("stocks").update({
        current_price: Math.round(newPrice * 100) / 100,
        price_change_percent: Math.round(impact),
        updated_at: new Date().toISOString(),
      }).eq("id", stock.id);

      await supabase.from("market_events").insert({
        stock_id: stock.id,
        event_text: text,
        price_impact_percent: Math.round(impact),
      });

      const { data: investments } = await supabase
        .from("user_investments").select("*")
        .eq("stock_id", stock.id).eq("is_active", true);

      if (investments) {
        for (const inv of investments) {
          const newValue = Math.max(1, inv.current_value * (1 + impact / 100));
          await supabase.from("user_investments").update({
            current_value: Math.round(newValue * 100) / 100,
            last_update: new Date().toISOString(),
          }).eq("id", inv.id);

          await supabase.from("investment_transactions").insert({
            user_id: inv.user_id,
            stock_id: stock.id,
            type: "market_update",
            amount: Math.round((newValue - inv.current_value) * 100) / 100,
            balance_after: Math.round(newValue * 100) / 100,
            event_text: text,
          });
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: "Market updated" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
