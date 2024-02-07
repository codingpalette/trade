"use client";

import { Database } from "@/type/database.types";
import Image from "next/image";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import TradeDialog from "@/app/(basicPage)/_components/TradeDialog";
import { ProductImageRow, ProductRow, ProfileRow } from "@/type/tableRow.types";

interface ProductContentProps {
  data:
    | (ProductRow & {
        product_images: ProductImageRow[];
        profiles: ProfileRow | null;
      })
    | null;
  userId: string | undefined;
}

export default function ProductContent({ data, userId }: ProductContentProps) {
  return (
    <>
      <div className="mx-auto my-4 w-full">
        <h2 className="mb-4 break-all text-2xl font-semibold">{data?.title}</h2>
        <p className="mb-8 whitespace-pre-wrap break-all leading-relaxed">
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
            <TradeDialog
              userId={userId}
              targetItemId={data?.id}
              state={data?.state}
            />
          )}
          {data?.profiles?.user_id === userId && (
            <Link href={`/write?id=${data?.id}`}>
              <Button disabled={data?.state !== 0}>수정</Button>
            </Link>
          )}
        </div>
        {userId && data?.state !== 0 && (
          <div className="mt-4">
            <Alert>
              {/* <Terminal className="h-4 w-4" /> */}
              {/* <AlertTitle>Heads up!</AlertTitle> */}
              <AlertDescription>
                거래중인 상품은 수정할 수 없습니다.
              </AlertDescription>
            </Alert>
          </div>
        )}
        {!userId && (
          <div className="mt-4">
            <Alert>
              {/* <Terminal className="h-4 w-4" /> */}
              {/* <AlertTitle>Heads up!</AlertTitle> */}
              <AlertDescription>
                로기인한 사용자만 상품을 거래할 수 있습니다.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>
    </>
  );
}
