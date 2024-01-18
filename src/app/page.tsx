import supabase from "@/utils/supabase";

export default async function Home() {
  const { data } = await supabase.from("page").select("*");
  console.log("data", data);

  return (
    <>
      <div>2222</div>
    </>
  );
}
