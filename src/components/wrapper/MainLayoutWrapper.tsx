import Header from "../base/Header";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import ContentBox from "@/components/base/ContentBox";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import SideBar from "@/components/base/SideBar";

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
      <ResizablePanelGroup
        direction="horizontal"
        className="relative w-full"
        style={{ overflow: " visible" }}
      >
        <ResizablePanel
          defaultSize={15}
          maxSize={25}
          className="sticky left-0 top-0 h-dvh"
        >
          <SideBar />
          {/* <div className="flex h-full items-center justify-center p-6 ">
            <span className="font-semibold">Sidebar</span>
          </div> */}
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={85} style={{ overflow: "visible" }}>
          <Header session={session} />
          <ContentBox>{children}</ContentBox>
          {/* <div className="flex h-full items-center justify-center p-6">
            <span className="font-semibold">Content</span>
          </div> */}
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
}
