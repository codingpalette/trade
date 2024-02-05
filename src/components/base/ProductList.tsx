"use client";

import { Database } from "@/type/database.types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import Link from "next/link";
import { ProductImageRow, ProductRow, ProfileRow } from "@/type/tableRow.types";

interface ProductListProps {
  data:
    | (ProductRow & {
        product_images: ProductImageRow[];
        profiles: ProfileRow | null;
      })[]
    | null;

  PAGE_COUNT: number;
  offset: number;
}

export default function ProductList({
  data,
  PAGE_COUNT,
  offset,
}: ProductListProps) {
  return (
    <>
      {data?.map((v, index) => {
        const recalculatedDelay =
          index >= PAGE_COUNT * 2
            ? (index - PAGE_COUNT * (offset - 1)) / 15
            : index / 15;
        return (
          <motion.div
            key={v.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              ease: [0.25, 0.25, 0, 1],
              delay: recalculatedDelay,
            }}
          >
            <Card className="" key={v.id}>
              <CardHeader>
                <CardTitle className="truncate">{v.title}</CardTitle>
                <CardDescription className="line-clamp-3 h-14">
                  {v.content}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-video w-full">
                  {v.product_images.length > 0 && (
                    <img
                      src={`${v.product_images[0]?.image_url}/middle`}
                      className="absolute left-0 top-0 h-full w-full object-cover"
                    />
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Link href={`/product/${v.id}`}>
                  <Button>상세보기</Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>
        );
      })}
    </>
  );
}
