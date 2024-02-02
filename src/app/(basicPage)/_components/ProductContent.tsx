"use client";

import { Database } from "@/type/database.types";
import Image from "next/image";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import TradeDialog from "@/app/(basicPage)/_components/TradeDialog";

interface ProductContentProps {
  data:
    | (Database["public"]["Tables"]["products"]["Row"] & {
        product_images: Database["public"]["Tables"]["product_images"]["Row"][];
        profiles: Database["public"]["Tables"]["profiles"]["Row"] | null;
      })
    | null;
  userId: string | undefined;
}

export default function ProductContent({ data, userId }: ProductContentProps) {
  return (
    <>
      <div className="mx-auto my-4">
        <h2 className="mb-4 text-2xl font-semibold">{data?.title}</h2>
        <p className="mb-8 whitespace-pre-wrap leading-relaxed">
          {data?.content}
        </p>
        {data && data.product_images.length > 0 && (
          <>
            <ScrollArea className="w-full whitespace-nowrap rounded-md border">
              <div className="flex w-max space-x-4 p-4">
                {data?.product_images.map((artwork) => (
                  <div key={artwork.id} className="shrink-0">
                    <div className="relative overflow-hidden">
                      <Image
                        src={`${artwork.image_url}/middle`}
                        alt={`Photo by ${artwork.id}`}
                        className="h-full w-full object-cover"
                        width={300}
                        height={400}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </>
        )}
        <div className="mt-4 flex gap-4">
          {userId && data?.profiles?.user_id !== userId && (
            <TradeDialog userId={userId} />
          )}
          {data?.profiles?.user_id === userId && (
            <Link href={`/write?id=${data?.id}`}>
              <Button>수정</Button>
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
