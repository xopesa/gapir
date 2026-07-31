"use client";

import { Coins, Sparkle } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { Badge, Button, Card, SectionHeader, ShopItemCard } from "@/src/components/ui";
import { shopItems } from "@/src/mocks";
import { useUserStore } from "@/src/stores/user-store";

const categories = ["Все", "Бустеры", "Подписка", "Темы", "Аватары"] as const;

export function ShopScreen() {
  const [category, setCategory] = useState<(typeof categories)[number]>("Все");
  const [message, setMessage] = useState("");
  const { gapCoins, purchasedItems, purchaseItem } = useUserStore();
  const filtered = useMemo(
    () =>
      category === "Все"
        ? shopItems
        : shopItems.filter((item) => item.category === category),
    [category],
  );

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">Возможности и стиль</p>
          <h1>Магазин</h1>
          <p>Используйте GapCoin, которые получаете за обучение.</p>
        </div>
        <Badge tone="mint" className="balance-badge">
          <Coins weight="fill" /> {gapCoins} GapCoin
        </Badge>
      </header>

      <Card className="shop-banner" tone="ice">
        <span className="shop-banner-icon"><Sparkle weight="fill" /></span>
        <div>
          <p className="eyebrow">Награда недели</p>
          <h2>Учитесь 5 дней — получите 150 GapCoin</h2>
          <p>Остался ещё один активный день.</p>
        </div>
        <Badge tone="blue">4 / 5 дней</Badge>
      </Card>

      <section>
        <SectionHeader eyebrow="Каталог" title="Выберите для себя" />
        <div className="category-tabs" role="tablist" aria-label="Категории магазина">
          {categories.map((item) => (
            <Button
              key={item}
              size="sm"
              variant={category === item ? "primary" : "ghost"}
              role="tab"
              aria-selected={category === item}
              onClick={() => setCategory(item)}
            >
              {item}
            </Button>
          ))}
        </div>
        {message && <p className="shop-message" role="status">{message}</p>}
        <div className="shop-grid">
          {filtered.map((item) => (
            <ShopItemCard
              key={item.id}
              item={item}
              purchased={purchasedItems.includes(item.id)}
              canAfford={gapCoins >= item.price}
              onPurchase={() => {
                const success = purchaseItem(item.id, item.price);
                setMessage(success ? `${item.title}: покупка сохранена` : "Недостаточно GapCoin");
              }}
            />
          ))}
        </div>
      </section>

      <Card className="merch-soon" tone="soft">
        <div>
          <p className="eyebrow">Мерч</p>
          <h2>Gapir в реальном мире — скоро</h2>
          <p>Минималистичные блокноты, бутылки и футболки.</p>
        </div>
        <Badge>Скоро</Badge>
      </Card>
    </div>
  );
}
