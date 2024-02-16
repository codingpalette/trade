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
import { tradeDelete, tradeAcceptEvent } from "@/actions/tradeAction";
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
  const [tradeModalActive, setTradeModalActive] = useState(false);
  const [tradeModalMode, setTradeModalMode] = useState<"accept" | "cancel">(
    "accept",
  );
  const [selectId, setSelectId] = useState<number | null>(null);
  const [evnetLoading, setEventLoading] = useState(false);
  function openTradeModal(id: number, mode: "accept" | "cancel" = "accept") {
    setSelectId(id);
    setTradeModalMode(mode);
    setTradeModalActive(true);
  }
  function closeTradeModal() {
    setSelectId(null);
    setTradeModalActive(false);
  }

  async function tradeEvent() {
    if (tradeModalMode === "cancel") {
      tradeClose();
    } else {
      tradeAccept();
    }
  }

  async function tradeClose() {
    if (selectId) {
      setEventLoading(true);
      try {
        const target = data?.find((v) => v.id === selectId);
        await tradeDelete(
          selectId,
          target?.req_product.id,
          target?.res_product.id,
        );
        toast({
          title: "취소 성공",
          description: "교환을 취소하였습니다.",
        });
      } catch (error: any) {
        console.log(error);
        toast({
          title: "교환취소 실패",
          description: error.message,
        });
      } finally {
        setEventLoading(false);
        closeTradeModal();
      }
    }
  }

  async function tradeAccept() {
    if (selectId) {
      console.log("selectId", selectId);
      setEventLoading(true);
      try {
        const target = data?.find((v) => v.id === selectId);
        console.log("target", target);
        await tradeAcceptEvent(
          selectId,
          target?.req_product.id,
          target?.res_product.id,
        );
        toast({
          title: "수락 성공",
          description: "교환을 수락하였습니다.",
        });
      } catch (error: any) {
        console.log(error);
        toast({
          title: "교환수락 실패",
          description: error.message,
        });
      } finally {
        setEventLoading(false);
        closeTradeModal();
      }
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
                          onClick={() => openTradeModal(v.id, "cancel")}
                        >
                          취소
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button onClick={() => openTradeModal(v.id, "accept")}>
                          수락
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => openTradeModal(v.id, "cancel")}
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

      <Dialog open={tradeModalActive} onOpenChange={closeTradeModal}>
        {/* <DialogTrigger asChild>
          <Button variant="outline">Edit Profile</Button>
        </DialogTrigger> */}
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {tradeModalMode === "accept" ? "교환 수락" : "교환 취소"}
            </DialogTitle>
            <DialogDescription>
              {tradeModalMode === "accept"
                ? "정말로 교환을 수락하시겠습니까?"
                : "정말로 교환을 취소하시겠습니까?"}
            </DialogDescription>
          </DialogHeader>
          {/* <div className="grid gap-4 py-4"></div> */}
          <DialogFooter>
            <Button onClick={tradeEvent} disabled={evnetLoading}>
              {evnetLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {tradeModalMode === "accept" ? "교환 수락" : "교환 취소"}
            </Button>
            <Button variant="outline" onClick={closeTradeModal}>
              닫기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
