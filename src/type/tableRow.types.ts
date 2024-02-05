import { Database } from "@/type/database.types";

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export type ProductRow = Database["public"]["Tables"]["products"]["Row"];

export type ProductImageRow =
  Database["public"]["Tables"]["product_images"]["Row"];

export type ProductTradeRow =
  Database["public"]["Tables"]["product_trades"]["Row"];
