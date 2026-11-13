import type { IconType } from "react-icons";
import {
  LuApple, LuBaby, LuCookie, LuCupSoda, LuPackage,
  LuPawPrint, LuSnowflake, LuSparkles, LuSprayCan, LuWheat,
} from "react-icons/lu";

export type Tint = 1 | 2 | 3 | 4 | 5 | 6;

interface CollectionStyle {
  icon: IconType;
  tint: Tint;
}

const styles: Record<string, CollectionStyle> = {
  fresh: { icon: LuApple, tint: 1 },
  frozen: { icon: LuSnowflake, tint: 3 },
  "dry-goods": { icon: LuWheat, tint: 6 },
  beverages: { icon: LuCupSoda, tint: 3 },
  snacks: { icon: LuCookie, tint: 2 },
  household: { icon: LuSprayCan, tint: 5 },
  "baby-kids": { icon: LuBaby, tint: 4 },
  "health-beauty": { icon: LuSparkles, tint: 5 },
  pet: { icon: LuPawPrint, tint: 1 },
};

const fallback: CollectionStyle = { icon: LuPackage, tint: 2 };

export const getCollectionStyle = (collectionSlug: string): CollectionStyle =>
  styles[collectionSlug] ?? fallback;
