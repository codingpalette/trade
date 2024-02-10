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
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ProductImageRow, ProductRow, ProfileRow } from "@/type/tableRow.types";
import Image from "next/image";

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
            <div
              key={v.id}
              className="bg-card overflow-hidden rounded-md border"
            >
              <figure className="shrink-0">
                <div className="">
                  <AspectRatio ratio={16 / 9}>
                    {v.product_images[0]?.image_url && (
                      <Image
                        src={`${v.product_images[0].image_url}/middle`}
                        alt={`Photo by ${v.id}`}
                        fill
                        className="rounded-md object-cover"
                      />
                    )}
                  </AspectRatio>
                </div>
                <figcaption className="p-4">
                  <h2 className="text-lg font-semibold">{v.title}</h2>
                  <p className="text-muted-foreground line-clamp-3 h-14 text-sm">
                    {v.content}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <Link href={`/product/${v.id}`}>
                      <Button>상세보기</Button>
                    </Link>
                  </div>
                </figcaption>
                {/* <figcaption className="text-muted-foreground pt-2 text-xs">
                  Photo by
                  <span className="text-foreground font-semibold">
                    {v.title}
                  </span>
                </figcaption> */}
              </figure>
            </div>
            {/* <Card className="" key={v.id}>
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
            </Card> */}
          </motion.div>
        );
      })}
    </>
  );
}
