
-- Table for fictional stocks
CREATE TABLE public.stocks (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '📈',
  sector TEXT NOT NULL DEFAULT 'general',
  base_volatility NUMERIC NOT NULL DEFAULT 0.05,
  current_price NUMERIC NOT NULL DEFAULT 100,
  price_change_percent NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table for user investments
CREATE TABLE public.user_investments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  stock_id TEXT NOT NULL REFERENCES public.stocks(id),
  invested_coins INTEGER NOT NULL,
  current_value NUMERIC NOT NULL,
  invested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_update TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(user_id, stock_id)
);

-- Table for market events / history
CREATE TABLE public.market_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stock_id TEXT NOT NULL REFERENCES public.stocks(id),
  event_text TEXT NOT NULL,
  price_impact_percent NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table for investment transaction history
CREATE TABLE public.investment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  stock_id TEXT NOT NULL REFERENCES public.stocks(id),
  type TEXT NOT NULL CHECK (type IN ('invest', 'withdraw', 'market_update')),
  amount NUMERIC NOT NULL,
  balance_after NUMERIC NOT NULL,
  event_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.stocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investment_transactions ENABLE ROW LEVEL SECURITY;

-- Stocks: everyone can read
CREATE POLICY "Anyone can view stocks" ON public.stocks FOR SELECT TO public USING (true);

-- User investments: users can CRUD their own
CREATE POLICY "Users can view own investments" ON public.user_investments FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own investments" ON public.user_investments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own investments" ON public.user_investments FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own investments" ON public.user_investments FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Market events: everyone can read
CREATE POLICY "Anyone can view market events" ON public.market_events FOR SELECT TO public USING (true);

-- Transaction history: users see their own
CREATE POLICY "Users can view own transactions" ON public.investment_transactions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transactions" ON public.investment_transactions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Seed fictional stocks
INSERT INTO public.stocks (id, name, description, icon, sector, base_volatility, current_price) VALUES
  ('tech_innovate', 'TechInnovate', 'Technologická spoločnosť zameraná na AI a robotiku', '🤖', 'technology', 0.08, 100),
  ('green_energy', 'ZelenáEnergia', 'Obnoviteľné zdroje energie a solárne panely', '☀️', 'energy', 0.06, 100),
  ('fin_bank', 'FinBank', 'Stabilná banka s dlhou históriou', '🏦', 'finance', 0.03, 100),
  ('health_plus', 'HealthPlus', 'Farmaceutická firma vyvíjajúca nové lieky', '💊', 'healthcare', 0.07, 100),
  ('food_corp', 'FoodCorp', 'Potravinársky gigant s globálnou sieťou', '🍔', 'consumer', 0.04, 100),
  ('crypto_chain', 'CryptoChain', 'Blockchain technológie a decentralizované financie', '⛓️', 'crypto', 0.12, 100),
  ('realestate_sk', 'RealitySK', 'Slovenský realitný fond', '🏠', 'real_estate', 0.05, 100),
  ('game_studio', 'GameStudio', 'Herná spoločnosť s populárnymi titulmi', '🎮', 'entertainment', 0.09, 100);
