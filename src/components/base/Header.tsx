"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, Monitor, Moon, Sun, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "next-themes";

export default function Header() {
  const router = useRouter();
  const { setTheme, theme } = useTheme();

  const isUser = true;

  // 테마 변경 이벤트
  function onChangeTheme(value: string) {
    setTheme(value);
  }

  return (
    <>
      <header className="flex w-full items-center justify-between border px-4 py-2 shadow-sm">
        <Link href="/">Home</Link>
        {isUser ? (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <span>Profile</span>
                    <DropdownMenuShortcut>
                      <User className="h-4 w-4" />
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    {/* <Sun className="mr-2 h-4 w-4" /> */}
                    <span>Theme</span>
                    <DropdownMenuShortcut>
                      <Select value={theme} onValueChange={onChangeTheme}>
                        <SelectTrigger className="w-[100px]">
                          <SelectValue placeholder={theme} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="system">
                              <div className="flex items-center justify-between">
                                <Monitor className="h-3 w-3" />
                                <span className="ml-2">system</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="dark">
                              <div className="flex items-center justify-between">
                                <Moon className="h-3 w-3" />
                                <span className="ml-2">dark</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="light">
                              <div className="flex items-center justify-between">
                                <Sun className="h-3 w-3" />
                                <span className="ml-2">light</span>
                              </div>
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                  <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <div className="flex gap-2">
            <Button>로그인</Button>
            <Button>회원가입</Button>
          </div>
        )}
      </header>
    </>
  );
}
