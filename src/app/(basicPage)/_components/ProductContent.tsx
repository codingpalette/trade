"use client";

import { Database } from "@/type/database.types";
import Image from "next/image";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import TradeDialog from "@/app/(basicPage)/_components/TradeDialog";
import { ProductImageRow, ProductRow, ProfileRow } from "@/type/tableRow.types";

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
import { useState } from "react";
import { productsDelete } from "@/actions/productAction";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

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
  const router = useRouter();
  const { toast } = useToast();
  const [modalActive, setModalActive] = useState(false);
  const [delLoading, setDelLoading] = useState(false);
  function openModal() {
    setModalActive(true);
  }
  function closeModal() {
    setModalActive(false);
  }

  async function deleteEvent() {
    try {
      if (!data) return;
      setDelLoading(true);
      await productsDelete(data.id);
      toast({
        title: "삭제 성공",
        description: "상품이 삭제되었습니다.",
      });
      router.push("/");
    } catch (error: any) {
      toast({
        title: "삭제 실패",
        description: error.message,
      });
      console.error(error);
    } finally {
      setDelLoading(false);
    }
  }

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
          {data?.profiles?.user_id === userId && data?.state === 0 && (
            <>
              <Link href={`/write?id=${data?.id}`}>
                <Button disabled={data?.state !== 0}>수정</Button>
              </Link>
              <Button variant="outline" onClick={openModal}>
                삭제
              </Button>
            </>
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
                로그인한 사용자만 상품을 거래할 수 있습니다.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>
      <Dialog open={modalActive} onOpenChange={closeModal}>
        {/* <DialogTrigger asChild>
          <Button variant="outline">Share</Button>
        </DialogTrigger> */}
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>상품삭제</DialogTitle>
            <DialogDescription>
              정말로 상품을 삭제하시겠습니까?
            </DialogDescription>
          </DialogHeader>
          {/* <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                Link
              </Label>
              <Input
                id="link"
                defaultValue="https://ui.shadcn.com/docs/installation"
                readOnly
              />
            </div>
            <Button type="submit" size="sm" className="px-3">
              <span className="sr-only">Copy</span>
            </Button>
          </div> */}
          <DialogFooter className="">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                닫기
              </Button>
            </DialogClose>
            <Button onClick={deleteEvent} disabled={delLoading}>
              {delLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
