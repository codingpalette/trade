"use client";

import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import { motion } from "framer-motion";
import { z } from "zod";
import { toast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface MainPageContentProps {
  data: any[] | null;
  search: string | undefined;
}

export default function MainPageContent({
  data,
  search,
}: MainPageContentProps) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const PAGE_COUNT = 20;
  const [loadedDatas, setLoadedDatas] = useState(data);
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isLast, setIsLast] = useState(false);

  useEffect(() => {
    setLoadedDatas(data);
    setOffset(1);
  }, [data]);

  const handleScroll = () => {
    if (containerRef.current && typeof window !== "undefined") {
      const container = containerRef?.current;
      const { bottom } = container?.getBoundingClientRect();
      const { innerHeight } = window;
      setIsInView((prev) => bottom <= innerHeight);
    }
  };
  useEffect(() => {
    const handleDebouncedScroll = debounce(
      () => !isLast && handleScroll(),
      200,
    );
    window.addEventListener("scroll", handleDebouncedScroll);
    return () => {
      window.removeEventListener("scroll", handleDebouncedScroll);
    };
  }, []);

  useEffect(() => {
    if (isInView) {
      loadMoreTickets(offset);
    }
  }, [isInView]);

  const loadMoreTickets = async (offset: number) => {
    setIsLoading(true);
    setOffset((prev) => prev + 1);
    const newDatas = await fetchTickets(offset);
    if (loadedDatas && newDatas) {
      if (newDatas.length < PAGE_COUNT) {
        setIsLast(true);
      }
      const newList = [...loadedDatas, ...newDatas];
      setLoadedDatas(newList);
    }
    setIsLoading(false);
  };

  const fetchTickets = async (offset: number) => {
    const from = offset * PAGE_COUNT;
    const to = from + PAGE_COUNT - 1;
    let query = supabase
      .from("products")
      .select(`*, product_images(*)`)
      .range(from, to)
      .order("id", { ascending: false });

    if (search) {
      query = query.or(`title.ilike.%${search}%,content.like.%${search}%`);
    }
    const { data, error } = await query;

    return data;
  };

  // 검증 스키마 정의
  const searchSchema = z
    .string()
    .min(2, "검색어는 2글자 이상이어야 합니다.")
    .refine(
      (value) => value.trim().length > 0,
      "공백만으로 구성된 검색어는 유효하지 않습니다.",
    );
  const [searchValue, setSeacrhValue] = useState("");

  useEffect(() => {
    if (search) {
      setSeacrhValue(search);
    } else {
      setSeacrhValue("");
    }
  }, [search]);

  function onClickSerach() {
    try {
      // Zod를 사용한 검증
      searchSchema.parse(searchValue);
      // 검증이 통과하면, 로직을 계속 진행
      router.push(`/?search=${searchValue}`);
    } catch (error: any) {
      // 검증 실패 시, 에러 처리
      console.log(error);
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors[0].message;
        toast({
          title: "검색에 실패 했습니다.",
          description: errorMessages,
        });
      }
    }
  }

  return (
    <>
      <div className="my-4">
        <form action={onClickSerach} className="flex gap-4">
          <Input
            placeholder="검색어를 입력해 주세요..."
            value={searchValue}
            onChange={(e) => setSeacrhValue(e.target.value)}
            maxLength={30}
          />
          <Button type="submit">검색</Button>
        </form>
      </div>
      <div
        className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-4"
        ref={containerRef}
      >
        {loadedDatas?.map((v, index) => {
          const recalculatedDelay =
            index >= PAGE_COUNT * 2
              ? (index - PAGE_COUNT * (offset - 1)) / 15
              : index / 15;
          return (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                ease: [0.25, 0.25, 0, 1],
                delay: recalculatedDelay,
              }}
            >
              <Card className="" key={v.id}>
                <CardHeader>
                  <CardTitle className="truncate">{v.title}</CardTitle>
                  <CardDescription className="line-clamp-3 h-14">
                    {v.content}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative aspect-video w-full">
                    {v.product_images.length > 0 && (
                      <img
                        src={`${v.product_images[0]?.image_url}/middle`}
                        className="absolute left-0 top-0 h-full w-full object-cover"
                      />
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Link href={`/product/${v.id}`}>
                    <Button>상세보기</Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          );
        })}
      </div>
      <div className="h-4"></div>
    </>
  );
}
