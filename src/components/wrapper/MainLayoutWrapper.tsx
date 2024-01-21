import Header from "../base/Header";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import ContentBox from "../base/ContentBox";

export default async function MainLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  console.log("session", session);

  return (
    <>
      <Header session={session} />
      <ContentBox>{children}</ContentBox>
    </>
  );
}
