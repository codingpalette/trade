"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface NavItemProps {
  href: string;
  icon: JSX.Element;
  label: string;
  isMobile: boolean;
  isActive: boolean;
}

export default function NavItem({
  href,
  icon,
  label,
  isMobile,
  isActive,
}: NavItemProps) {
  return (
    <>
      <Link href={href} className="w-full">
        <Button
          variant={isActive ? "default" : "ghost"}
          size={isMobile ? "icon" : "default"}
          className={`${isMobile ? "justify-center" : "justify-start"} w-full`}
        >
          {icon}
          {!isMobile && <span className="ml-2">{label}</span>}
        </Button>
      </Link>
    </>
  );
}
