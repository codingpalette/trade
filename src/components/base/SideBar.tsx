"use cleint";

import { Button } from "@/components/ui/button";
import {
  ArrowLeftFromLine,
  ArrowLeftRight,
  ArrowRightFromLine,
  RefreshCcw,
  ShoppingBasket,
  ShoppingCart,
} from "lucide-react";

export default function SideBar() {
  return (
    <>
      <div className="bg-card">
        <div className="border border-x-0 border-t-0 px-4 py-2 ">
          <Button variant="ghost" className="w-full">
            HOME
          </Button>
        </div>
        <nav className="grid gap-2 px-2 py-4">
          <Button className="inline-flex items-center justify-start">
            <ShoppingCart className="mr-2 h-4 w-4" />
            상품
          </Button>
          <Button
            variant="ghost"
            className="inline-flex items-center justify-start"
          >
            <ShoppingBasket className="mr-2 h-4 w-4" />내 상품
          </Button>
          <Button
            variant="ghost"
            className="inline-flex items-center justify-start"
          >
            <ArrowRightFromLine className="mr-2 h-4 w-4" />내 교환 신청
          </Button>
          <Button
            variant="ghost"
            className="inline-flex items-center justify-start"
          >
            <ArrowLeftFromLine className="mr-2 h-4 w-4" />
            받은 교환 요청
          </Button>
          <Button
            variant="ghost"
            className="inline-flex items-center justify-start"
          >
            <ArrowLeftRight className="mr-2 h-4 w-4" />
            교환중
          </Button>
        </nav>
      </div>
    </>
  );
}
