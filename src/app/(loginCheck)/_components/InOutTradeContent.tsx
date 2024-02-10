"use client";

import { Database } from "@/type/database.types";
import { ProductTradeRow } from "@/type/tableRow.types";
import { useEffect, useState } from "react";

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { tradeDelete } from "@/actions/tradeAction";
import { toast } from "@/components/ui/use-toast";

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
  mode: "in" | "out";
}

export default function InOutTradeContent({
  data,
  mode,
}: InOutTradeContentProps) {
  useEffect(() => {
    if (data) {
      console.log(data);
    }
  }, [data]);

  const [TradeCloseModalActive, setTradeCloseModalActive] = useState(false);
  const [selectId, setSelectId] = useState<number | null>(null);
  const [evnetLoading, setEventLoading] = useState(false);
  function openTradeCloseModal(id: number) {
    console.log("id", id);
    setSelectId(id);
    setTradeCloseModalActive(true);
  }
  function closeTradeCloseModal() {
    setSelectId(null);
    setTradeCloseModalActive(false);
  }
  async function tradeClose() {
    if (selectId) {
      setEventLoading(true);
      try {
        const target = data?.find((v) => v.id === selectId);
        const res = await tradeDelete(
          selectId,
          target?.req_product.id,
          target?.res_product.id,
        );
      } catch (error: any) {
        console.log(error);
        toast({
          title: "교환취소 실패",
          description: error.message,
        });
      } finally {
        setEventLoading(false);
        closeTradeCloseModal();
      }
      // const res = await fetch(`/api/trade/${selectId}`, {
      //   method: "DELETE",
      // });
      // if (res.ok) {
      //   closeTradeCloseModal();
      // }
    }
  }

  return (
    <>
      <div className="mt-4 w-full overflow-auto">
        <Table className="min-w-[500px]">
          <TableCaption>
            {mode === "out" ? "내 교환 신청목록" : "받은 교환신청"}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead colSpan={2}>
                {mode === "out" ? "내 상품" : "상대 상품"}
              </TableHead>
              <TableHead colSpan={2}>
                {mode === "out" ? "상대 상품" : "내 상품"}
              </TableHead>
              <TableHead>상태</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((v) => {
              const state = v.state === 0 ? "대기" : "진행중";
              return (
                <TableRow key={v.id}>
                  <TableCell className="max-w-6 truncate">
                    <Button variant="link">
                      <Link href={`/product/${v.res_product.id}`}>
                        {v.res_product.title}
                      </Link>
                    </Button>
                  </TableCell>
                  <TableCell className="w-[40px]">
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
                    <Button variant="link">
                      <Link href={`/product/${v.req_product.id}`}>
                        {v.req_product.title}
                      </Link>
                    </Button>
                  </TableCell>
                  <TableCell className="w-[40px]">
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
                  <TableCell className="flex gap-2">
                    {mode === "out" ? (
                      <>
                        <Button
                          variant="destructive"
                          onClick={() => openTradeCloseModal(v.id)}
                        >
                          취소
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button>수락</Button>
                        <Button
                          variant="destructive"
                          onClick={() => openTradeCloseModal(v.id)}
                        >
                          거절
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog open={TradeCloseModalActive} onOpenChange={closeTradeCloseModal}>
        {/* <DialogTrigger asChild>
          <Button variant="outline">Edit Profile</Button>
        </DialogTrigger> */}
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>교환 취소</DialogTitle>
            <DialogDescription>
              정말로 교환을 취소하시겠습니까?
            </DialogDescription>
          </DialogHeader>
          {/* <div className="grid gap-4 py-4"></div> */}
          <DialogFooter>
            <Button onClick={tradeClose} disabled={evnetLoading}>
              {evnetLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              교환 취소
            </Button>
            <Button variant="outline" onClick={closeTradeCloseModal}>
              닫기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
