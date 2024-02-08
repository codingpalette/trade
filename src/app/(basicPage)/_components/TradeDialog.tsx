"use client";

import { myItems, tradeInsert } from "@/actions/tradeAction";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Label } from "@/components/ui/label";
import { useState } from "react";
import Image from "next/image";
import { Avatar } from "@/components/ui/avatar";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { ProductImageRow, ProductRow } from "@/type/tableRow.types";

interface TradeDialogProps {
  userId: string | undefined;
  targetItemId: number | undefined;
  state: number | null | undefined;
}

export default function TradeDialog({
  userId,
  targetItemId,
  state,
}: TradeDialogProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectItem, setSelectItem] = useState<number | null>(null);
  const [tradeEventLoading, setTradeEventLoading] = useState(false);

  const [listData, setListData] = useState<
    (ProductRow & {
      product_images: ProductImageRow[];
    })[]
  >([]);

  async function onClickTrade() {
    try {
      setSelectItem(null);
      const res = await myItems(userId);
      if (res) {
        setListData(res);
        setIsOpen(true);
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  function onClickAlert(id: number) {
    setSelectItem(id);
    setIsAlertOpen(true);
  }

  async function onClickTradeEvent(e: any) {
    e.preventDefault();
    setTradeEventLoading(true);
    try {
      if (selectItem && targetItemId) {
        await tradeInsert(selectItem, targetItemId);
        toast({
          title: "교환신청 성공",
          description: "교환신청이 완료되었습니다.",
        });
        router.push("/trade_output");
      }
    } catch (error: any) {
      toast({
        title: "교환신청 실패",
        description: error.message,
      });
    } finally {
      setTradeEventLoading(false);
    }
  }

  return (
    <>
      <Button onClick={onClickTrade} disabled={state !== 0}>
        교환신청
      </Button>
      <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
        {/* <DialogTrigger asChild>
          <Button>교환신청</Button>
        </DialogTrigger> */}
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>교환신청</DialogTitle>
            <DialogDescription>
              교환신청 상품을 선택해 주세요.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[300px] w-full overflow-auto rounded-md border">
            <Table className="min-w-[500px]">
              <TableHeader>
                <TableRow>
                  <TableHead>상품명</TableHead>
                  <TableHead>간단설명</TableHead>
                  <TableHead>이미지</TableHead>
                  <TableHead>교환신청</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {listData.map((data) => (
                  <TableRow key={data.id}>
                    <TableCell className="max-w-6 truncate">
                      <Label className="">{data.title}</Label>
                    </TableCell>
                    <TableCell className="max-w-6 truncate">
                      <Label className="">{data.content}</Label>
                    </TableCell>
                    <TableCell>
                      <Label>
                        {data.product_images.length > 0 && (
                          <Avatar>
                            <Image
                              src={`${data.product_images[0].image_url}/middle`}
                              alt={`Photo by ${data.id}`}
                              width={40}
                              height={40}
                            />
                          </Avatar>
                        )}
                      </Label>
                    </TableCell>
                    <TableCell>
                      <Button onClick={() => onClickAlert(data.id)}>
                        교환신청
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                닫기
              </Button>
            </DialogClose>
            {/* <Button type="submit">Save changes</Button> */}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog
        open={isAlertOpen}
        onOpenChange={() => setIsAlertOpen(false)}
      >
        {/* <AlertDialogTrigger>Open</AlertDialogTrigger> */}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>교환 신청을 하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              교환 신청 후 상대방의 수락을 기다려 주세요.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>닫기</AlertDialogCancel>
            <AlertDialogAction
              onClick={onClickTradeEvent}
              disabled={tradeEventLoading}
            >
              {tradeEventLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              교환 신청!
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
