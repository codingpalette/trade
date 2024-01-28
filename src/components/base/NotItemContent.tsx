"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotItemContent() {
  return (
    <>
      <div className="not-item-content mb-4 mt-12">
        <div className="mx-auto max-w-[400px]">
          <img src="/images/not_item_image.svg" />
        </div>
        <div className="not-item-content__title mt-8 text-center text-2xl font-semibold">
          <h2>아이템이 존재하지 않습니다.</h2>
        </div>
        <div className="mt-4 text-center">
          <p>죄송합니다 존재하지 않는 아이템 입니다.</p>
          <Link href="/">
            <Button className="mt-4">홈으로 돌아가기</Button>
          </Link>
        </div>
      </div>
    </>
  );
}
