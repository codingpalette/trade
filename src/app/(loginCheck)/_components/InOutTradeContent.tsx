"use client";

import { Database } from "@/type/database.types";
import { ProductTradeRow } from "@/type/tableRow.types";
import { useEffect } from "react";

// 이제 ProductTradeRow를 확장하는 인터페이스를 정의할 수 있습니다.
// interface ProductTradeRowWithDetails extends ProductTradeRow {
//   res_product: (ProductRow & {
//     product_images: ProductImageRow[];
//   })[];
//   req_product: ProductRow & {
//     product_images: ProductImageRow[];
//   };
// }

interface ProductTradeRowWithDetails extends ProductTradeRow {
  res_product: {};
  req_product: {};
}

interface InOutTradeContentProps {
  data?: ProductTradeRowWithDetails[] | null;
}

export default function InOutTradeContent({ data }: InOutTradeContentProps) {
  useEffect(() => {
    if (data) {
      console.log(data);
    }
  }, [data]);
  return (
    <div>
      <h2>InOutTradeContent</h2>
    </div>
  );
}
