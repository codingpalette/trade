"use client";

import Header from "@/components/base/Header";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import SideBar from "@/components/base/SideBar";
import ContentBox from "@/components/base/ContentBox";
import useSiteStore from "@/stores/siteStore";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  getPanelElement,
  getPanelGroupElement,
  getResizeHandleElement,
} from "react-resizable-panels";

interface ResizeBoxPros {
  children: React.ReactNode;
  session: any;
}

export default function ResizeBox({ children, session }: ResizeBoxPros) {
  const refs = useRef<any>();

  useEffect(() => {
    const leftPanelElement = getPanelElement("left-panel");

    // If you want to, you can store them in a ref to pass around
    refs.current = {
      leftPanelElement,
    };
  }, []);

  const [isMobile, setIsMobile] = useState(false);

  function resizeEvent(size: number) {
    console.log("size", size);
    if (size === 5) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }

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
          minSize={10}
          collapsible={true}
          collapsedSize={5}
          onResize={resizeEvent}
          className="sticky left-0 top-0 h-dvh"
          id="left-panel"
        >
          <SideBar isMobile={isMobile} />
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
