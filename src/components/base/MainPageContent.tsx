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
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import { motion } from "framer-motion";

interface MainPageContentProps {
  data: any[] | null;
}

export default function MainPageContent({ data }: MainPageContentProps) {
  const supabase = createClientComponentClient();
  const PAGE_COUNT = 20;
  const [loadedDatas, setLoadedDatas] = useState(data);
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isLast, setIsLast] = useState(false);

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

    const { data } = await supabase!
      .from("products")
      .select(`*, product_images(*)`)
      .range(from, to)
      .order("id", { ascending: false });

    return data;
  };

  return (
    <>
      <div className="my-4 flex gap-4">
        <Input placeholder="검색어를 입력해 주세요..." />
        <Button>검색</Button>
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
                  <Button>상세보기</Button>
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
