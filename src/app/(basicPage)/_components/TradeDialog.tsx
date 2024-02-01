"use client";

import { myItems } from "@/actions/tradeAction";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Database } from "@/type/database.types";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TradeDialogProps {
  userId: string | undefined;
}

export default function TradeDialog({ userId }: TradeDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const [listData, setListData] = useState<
    (Database["public"]["Tables"]["products"]["Row"] & {
      product_images: Database["public"]["Tables"]["product_images"]["Row"][];
    })[]
  >([]);

  async function onClickTrate() {
    console.log("userId", userId);
    try {
      const res = await myItems(userId);
      console.log("res", res);
      if (res) {
        setListData(res);
        setIsOpen(true);
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  const payments = [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "489e1d42",
      amount: 125,
      status: "processing",
      email: "example@gmail.com",
    },
  ];

  return (
    <>
      <Button onClick={onClickTrate}>교환신청</Button>
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
          <div className="w-full overflow-auto rounded-md border">
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
                    <TableCell>
                      <Label>{data.title}</Label>
                    </TableCell>
                    <TableCell>
                      <Label>{data.title}</Label>
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
                      <Button>교환신청</Button>
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
    </>
  );
}
