"use client";

import { Database } from "@/type/database.types";
import { ProductTradeRow } from "@/type/tableRow.types";
import { useEffect } from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { Avatar } from "@/components/ui/avatar";

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
  res_product: any;
  req_product: any;
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
    <>
      <div className="mt-4">
        <Table>
          <TableCaption>내 교환 신청목록</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead colSpan={2}>내 상품</TableHead>
              <TableHead colSpan={2}>상대 상품</TableHead>
              <TableHead>상태</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((v) => {
              const state = v.state === 0 ? "대기" : "진행중";
              return (
                <TableRow key={v.id}>
                  <TableCell className="max-w-6 truncate">
                    {v.res_product.title}
                  </TableCell>
                  <TableCell>
                    {v.res_product.product_images.length > 0 && (
                      <Avatar>
                        <Image
                          src={`${v.res_product.product_images[0].image_url}/middle`}
                          alt={`Photo by ${v.id}`}
                          width={40}
                          height={40}
                        />
                      </Avatar>
                    )}
                  </TableCell>
                  <TableCell className="max-w-6 truncate">
                    {v.req_product.title}
                  </TableCell>
                  <TableCell>
                    {v.req_product.product_images.length > 0 && (
                      <Avatar>
                        <Image
                          src={`${v.req_product.product_images[0].image_url}/middle`}
                          alt={`Photo by ${v.id}`}
                          width={40}
                          height={40}
                        />
                      </Avatar>
                    )}
                  </TableCell>
                  <TableCell>{state}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
