import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/type/database.types";
import { cookies } from "next/headers";
import MainPageContent from "@/app/(basicPage)/_components/MainPageContent";
import { revalidatePath } from "next/cache";
export const dynamic = "force-dynamic";

interface HomeProps {
  searchParams: {
    search: string;
  };
}

export default async function Home({ searchParams }: HomeProps) {
  const supabase = createServerComponentClient<Database>({ cookies });

  let query = supabase
    .from("products")
    .select(`*, product_images(*), profiles(*)`)
    .eq(`state`, 0)
    .order("id", { ascending: false })
    .limit(20);

  if (searchParams.search) {
    query = query.or(
      `title.ilike.%${searchParams.search}%,content.like.%${searchParams.search}%`,
    );
  }

  const { data, error } = await query;
  // console.log("data", data);

  // revalidatePath("/");

  return (
    <>
      <MainPageContent data={data} search={searchParams.search} />
    </>
  );
}
