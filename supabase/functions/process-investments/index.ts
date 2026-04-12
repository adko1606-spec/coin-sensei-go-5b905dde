import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Realistic sector behavior profiles with trend-following
const sectorBehavior: Record<string, { positiveWeight: number; momentum: number; scenarios: { text: string; min: number; max: number }[] }> = {
  finance: {
    positiveWeight: 0.6,
    momentum: 0.4, // 40% chance to follow previous trend
    scenarios: [
      { text: "🏦 Stabilné úrokové výnosy", min: 0.5, max: 1.5 },
      { text: "💳 Rast digitálnych platieb", min: 0.3, max: 1.2 },
      { text: "📉 Obavy z recesie", min: -1.5, max: -0.3 },
      { text: "📊 Pozitívna ekonomická správa", min: 0.5, max: 1.8 },
      { text: "🏛️ Prísnejšie bankové regulácie", min: -1.0, max: -0.2 },
      { text: "📈 Stabilný rast sektora", min: 0.1, max: 0.8 },
    ],
  },
  consumer: {
    positiveWeight: 0.6,
    momentum: 0.35,
    scenarios: [
      { text: "🍔 Stabilné tržby podľa očakávaní", min: 0, max: 1.0 },
      { text: "📦 Problémy v dodávateľskom reťazci", min: -1.5, max: -0.3 },
      { text: "🎉 Sviatočné tržby prekročili očakávania", min: 1, max: 2.5 },
      { text: "🌱 Ekologický sortiment zaujal zákazníkov", min: 0.3, max: 1.5 },
      { text: "💸 Inflácia znížila spotrebu", min: -1.5, max: -0.3 },
    ],
  },
  real_estate: {
    positiveWeight: 0.65,
    momentum: 0.5, // real estate is slow-moving, high momentum
    scenarios: [
      { text: "🏠 Ceny nehnuteľností mierne rastú", min: 0.2, max: 1.0 },
      { text: "🏗️ Nový projekt spustený", min: 0.3, max: 1.2 },
      { text: "📉 Hypotekárne sadzby vzrástli", min: -1.0, max: -0.2 },
      { text: "📊 Stabilný dopyt po bývaní", min: 0.1, max: 0.8 },
      { text: "🌆 Pokles dopytu po kancelárskych priestoroch", min: -0.8, max: -0.1 },
    ],
  },
  technology: {
    positiveWeight: 0.55,
    momentum: 0.3,
    scenarios: [
      { text: "🚀 Nový AI čip zvýšil dopyt", min: 1.5, max: 4 },
      { text: "📱 Rekordný predpredaj produktu", min: 1, max: 3 },
      { text: "🔒 Bezpečnostná chyba v produkte", min: -2.5, max: -0.5 },
      { text: "🤝 Partnerstvo s veľkou firmou", min: 1, max: 3.5 },
      { text: "📉 Konkurencia predstavila lepší produkt", min: -3, max: -1 },
      { text: "📊 Kvartálne výsledky prekonali očakávania", min: 1, max: 2.5 },
    ],
  },
  energy: {
    positiveWeight: 0.55,
    momentum: 0.35,
    scenarios: [
      { text: "☀️ Dotácie na zelenú energiu schválené", min: 1, max: 3 },
      { text: "🔋 Prelom v technológii batérií", min: 1.5, max: 4 },
      { text: "⛽ Ceny ropy klesli", min: -1.5, max: -0.3 },
      { text: "🌧️ Nepriaznivé počasie znížilo výrobu", min: -2, max: -0.5 },
      { text: "📈 Rekordná inštalácia solárnych panelov", min: 1, max: 2.5 },
    ],
  },
  healthcare: {
    positiveWeight: 0.5,
    momentum: 0.25, // healthcare is more random (clinical trials)
    scenarios: [
      { text: "💊 Nový liek schválený!", min: 3, max: 8 },
      { text: "🧬 Prelom v génovej terapii", min: 2, max: 6 },
      { text: "❌ Klinická štúdia zlyhala", min: -6, max: -2 },
      { text: "🏥 Partnerstvo s nemocnicami", min: 1, max: 3 },
      { text: "📋 Regulátor požaduje ďalšie testy", min: -3, max: -1 },
    ],
  },
  crypto: {
    positiveWeight: 0.45,
    momentum: 0.5, // crypto trends hard
    scenarios: [
      { text: "⛓️ Veľká banka prijala blockchain", min: 4, max: 10 },
      { text: "🚨 Hacknutá kryptoburza!", min: -10, max: -4 },
      { text: "🐋 Veľký investor nakúpil pozície", min: 3, max: 8 },
      { text: "📜 Nová regulácia kryptomien", min: -5, max: 1 },
      { text: "📉 Masový výpredaj na trhu", min: -9, max: -3 },
      { text: "🔥 Virálny záujem o krypto", min: 2, max: 6 },
      { text: "🏦 Krajina zakázala kryptomeny", min: -7, max: -2 },
    ],
  },
  entertainment: {
    positiveWeight: 0.5,
    momentum: 0.3,
    scenarios: [
      { text: "🎮 Nová hra dosiahla 10M stiahnutí!", min: 3, max: 7 },
      { text: "🐛 Kritické chyby v hre", min: -5, max: -1.5 },
      { text: "🏆 Ocenenie Hra roka", min: 1.5, max: 5 },
      { text: "🎬 Filmová adaptácia oznámená", min: 1, max: 3.5 },
      { text: "👥 Kľúčový vývojár odišiel", min: -3, max: -1 },
    ],
  },
};

function getRandomScenario(sector: string, previousChange: number) {
  const behavior = sectorBehavior[sector] || sectorBehavior.technology;
  const { scenarios, positiveWeight, momentum } = behavior;

  // Momentum: tendency to follow previous direction
  const momentumBias = previousChange > 0 ? momentum : previousChange < 0 ? -momentum : 0;
  const adjustedPositiveWeight = Math.max(0.2, Math.min(0.8, positiveWeight + momentumBias * 0.3));

  const isPositive = Math.random() < adjustedPositiveWeight;
  const filtered = scenarios.filter((s) =>
    isPositive ? s.max > 0 : s.min < 0
  );
  const list = filtered.length > 0 ? filtered : scenarios;

  const s = list[Math.floor(Math.random() * list.length)];
  
  // Add small random noise for realism (micro-movements)
  const baseImpact = s.min + Math.random() * (s.max - s.min);
  const noise = (Math.random() - 0.5) * 0.3;
  const impact = baseImpact + noise;
  
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
      const { text, impact } = getRandomScenario(stock.sector, stock.price_change_percent);

      const newPrice = Math.max(10, stock.current_price * (1 + impact / 100));
      await supabase.from("stocks").update({
        current_price: Math.round(newPrice * 100) / 100,
        price_change_percent: Math.round(impact * 100) / 100,
        updated_at: new Date().toISOString(),
      }).eq("id", stock.id);

      await supabase.from("market_events").insert({
        stock_id: stock.id,
        event_text: text,
        price_impact_percent: Math.round(impact * 100) / 100,
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
