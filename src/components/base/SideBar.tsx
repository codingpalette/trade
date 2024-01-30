"use cleint";

import { Button } from "@/components/ui/button";
import {
  ArrowLeftFromLine,
  ArrowLeftRight,
  ArrowRightFromLine,
  ShoppingBasket,
  ShoppingCart,
} from "lucide-react";

interface SideBarProps {
  isMobile?: Boolean;
}

export default function SideBar({ isMobile }: SideBarProps) {
  return (
    <>
      <div className="bg-card">
        <div className="border border-x-0 border-t-0 px-4 py-2 ">
          <Button variant="ghost" className="w-full">
            HOME
          </Button>
        </div>
        <nav className="flex flex-col items-center justify-center gap-2 px-2 py-4">
          <Button size={isMobile ? "icon" : "default"}>
            <ShoppingCart className="h-4 w-4" />
            {!isMobile && <span className="ml-2">상품</span>}
          </Button>
          <Button variant="ghost" size={isMobile ? "icon" : "default"}>
            <ShoppingBasket className="h-4 w-4" />
            {!isMobile && <span className="ml-2">내 상품</span>}
          </Button>
          <Button variant="ghost" size={isMobile ? "icon" : "default"}>
            <ArrowRightFromLine className="h-4 w-4" />
            {!isMobile && <span className="ml-2">내 교환 신청</span>}
          </Button>
          <Button variant="ghost" size={isMobile ? "icon" : "default"}>
            <ArrowLeftFromLine className="h-4 w-4" />
            {!isMobile && <span className="ml-2">받은 교환 요청</span>}
          </Button>
          <Button variant="ghost" size={isMobile ? "icon" : "default"}>
            <ArrowLeftRight className="h-4 w-4" />
            {!isMobile && <span className="ml-2">교환중</span>}
          </Button>
        </nav>
      </div>
    </>
  );
}
