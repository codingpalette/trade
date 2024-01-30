import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import ContentBox from "@/components/base/ContentBox";
import Header from "@/components/base/Header";

import { cookies } from "next/headers";
import ResizeBox from "@/components/base/ResizeBox";

export default async function MainLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <>
      <Header session={session} />
      <ContentBox>{children}</ContentBox>
      {/* <ResizeBox session={session}>{children}</ResizeBox> */}
    </>
  );
}
