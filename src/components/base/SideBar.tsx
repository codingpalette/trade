"use cleint";

import { Button } from "@/components/ui/button";
import {
  ArrowLeftFromLine,
  ArrowLeftRight,
  ArrowRightFromLine,
  ShoppingBasket,
  ShoppingCart,
} from "lucide-react";
import { usePathname } from "next/navigation";
import NavItem from "@/components/base/NavItem";

interface SideBarProps {
  isMobile: boolean;
}

export default function SideBar({ isMobile }: SideBarProps) {
  const pathname = usePathname();

  // 네비게이션 링크 데이터
  const navItems = [
    { href: "/", icon: <ShoppingCart className="h-4 w-4" />, label: "상품" },
    {
      href: "/about",
      icon: <ShoppingBasket className="h-4 w-4" />,
      label: "내 상품",
    },
    {
      href: "/c",
      icon: <ArrowRightFromLine className="h-4 w-4" />,
      label: "내 교환 신청",
    },
    {
      href: "/a",
      icon: <ArrowLeftFromLine className="h-4 w-4" />,
      label: "받은 교환 신청",
    },
    {
      href: "/b",
      icon: <ArrowLeftRight className="h-4 w-4" />,
      label: "교환중",
    },
    // 추가 링크를 여기에 넣을 수 있습니다
  ];

  return (
    <>
      <div className="bg-card">
        <div className="border border-x-0 border-t-0 px-4 py-2 ">
          <Button variant="ghost" className="w-full">
            HOME
          </Button>
        </div>
        <nav className="flex flex-col items-center justify-center gap-2 px-2 py-4">
          {navItems.map((item, index) => (
            <NavItem
              key={item.href + index}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isMobile={isMobile}
              isActive={pathname === item.href}
            />
          ))}
        </nav>
      </div>
    </>
  );
}
