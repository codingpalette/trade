"use client";

import { Database } from "@/type/database.types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import ProductList from "@/components/base/ProductList";

interface MyItemsContentPorps {
  data:
    | (Database["public"]["Tables"]["products"]["Row"] & {
        product_images: Database["public"]["Tables"]["product_images"]["Row"][];
        profiles: Database["public"]["Tables"]["profiles"]["Row"] | null;
      })[]
    | null;
  user_id: any;
}

export default function MyItemsContent({ data, user_id }: MyItemsContentPorps) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const PAGE_COUNT = 20;
  const [offset, setOffset] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isLast, setIsLast] = useState(false);
  const [loadedDatas, setLoadedDatas] = useState(data);
  const containerRef = useRef<HTMLDivElement>(null);

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
      .eq("user_id", user_id)
      .order("id", { ascending: false });

    const { data, error } = await query;

    return data;
  };

  return (
    <>
      <div className="my-4">
        <div
          className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-4"
          ref={containerRef}
        >
          <ProductList
            data={loadedDatas}
            PAGE_COUNT={PAGE_COUNT}
            offset={offset}
          />
        </div>
      </div>
    </>
  );
}
