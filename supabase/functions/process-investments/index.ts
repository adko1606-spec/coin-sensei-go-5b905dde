import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Market scenarios per sector
const scenarios: Record<string, { text: string; min: number; max: number }[]> = {
  technology: [
    { text: "🚀 AI revolúcia zvyšuje dopyt po technológiách", min: 3, max: 12 },
    { text: "📱 Rekordný predpredaj nového produktu", min: 2, max: 8 },
    { text: "🔒 Bezpečnostný incident znížil dôveru investorov", min: -6, max: -1 },
    { text: "🤝 Strategické partnerstvo s veľkou firmou", min: 3, max: 10 },
    { text: "📊 Výsledky prekonali očakávania", min: 2, max: 7 },
  ],
  energy: [
    { text: "☀️ Dotácie na obnoviteľnú energiu schválené", min: 3, max: 10 },
    { text: "🔋 Prelom v technológii batérií", min: 4, max: 12 },
    { text: "⛽ Pokles cien ropy zvýšil konkurenciu", min: -4, max: -1 },
    { text: "📈 Rekordná inštalácia solárnych panelov", min: 2, max: 7 },
  ],
  finance: [
    { text: "🏦 Centrálna banka znížila úroky", min: 1, max: 5 },
    { text: "💳 Nová digitálna služba zaujala milióny", min: 2, max: 7 },
    { text: "📉 Obavy z recesie", min: -4, max: -1 },
    { text: "💰 Rekordné zisky z úrokových výnosov", min: 2, max: 6 },
  ],
  healthcare: [
    { text: "💊 Nový liek schválený regulátorom", min: 5, max: 15 },
    { text: "🧬 Prelom v génovej terapii", min: 4, max: 12 },
    { text: "❌ Klinická štúdia zlyhala", min: -8, max: -2 },
    { text: "🏥 Partnerstvo s nemocničnou sieťou", min: 2, max: 8 },
  ],
  consumer: [
    { text: "🍔 Expanzia na nové trhy", min: 2, max: 6 },
    { text: "📦 Problémy v dodávateľskom reťazci", min: -3, max: -1 },
    { text: "🎉 Rekordné sviatočné tržby", min: 3, max: 7 },
  ],
  crypto: [
    { text: "⛓️ Veľká banka prijala blockchain", min: 6, max: 18 },
    { text: "🚨 Hacknutá kryptoburza", min: -12, max: -3 },
    { text: "🐋 Veľký investor nakúpil pozície", min: 5, max: 15 },
    { text: "📜 Nová krypto regulácia v EÚ", min: -5, max: 3 },
  ],
  real_estate: [
    { text: "🏠 Ceny nehnuteľností rastú", min: 1, max: 5 },
    { text: "🏗️ Nový projekt spustený", min: 2, max: 6 },
    { text: "📉 Hypotekárne sadzby vzrástli", min: -4, max: -1 },
  ],
  entertainment: [
    { text: "🎮 Nová hra dosiahla 10M stiahnutí", min: 5, max: 14 },
    { text: "🐛 Kritické chyby v novej hre", min: -6, max: -1 },
    { text: "🏆 Ocenenie Hra roka", min: 3, max: 10 },
  ],
};

function getRandomScenario(sector: string) {
  const list = scenarios[sector] || scenarios.technology;
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

    // Get all stocks
    const { data: stocks } = await supabase.from("stocks").select("*");
    if (!stocks || stocks.length === 0) {
      return new Response(JSON.stringify({ message: "No stocks found" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Process each stock
    for (const stock of stocks) {
      const { text, impact } = getRandomScenario(stock.sector);

      // Update stock price
      const newPrice = Math.max(10, stock.current_price * (1 + impact / 100));
      await supabase
        .from("stocks")
        .update({
          current_price: Math.round(newPrice * 100) / 100,
          price_change_percent: impact,
          updated_at: new Date().toISOString(),
        })
        .eq("id", stock.id);

      // Log market event
      await supabase.from("market_events").insert({
        stock_id: stock.id,
        event_text: text,
        price_impact_percent: impact,
      });

      // Update all user investments for this stock
      const { data: investments } = await supabase
        .from("user_investments")
        .select("*")
        .eq("stock_id", stock.id)
        .eq("is_active", true);

      if (investments) {
        for (const inv of investments) {
          const newValue = Math.max(1, inv.current_value * (1 + impact / 100));
          await supabase
            .from("user_investments")
            .update({
              current_value: Math.round(newValue * 100) / 100,
              last_update: new Date().toISOString(),
            })
            .eq("id", inv.id);

          // Log transaction
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
