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

interface ResizeBoxPros {
  children: React.ReactNode;
  session: any;
}

export default function ResizeBox({ children, session }: ResizeBoxPros) {
  const { width, height, changeWidth, changeHeight } = useSiteStore();

  // 사이트 크기 높이 변경
  const updateWindowSize = useCallback(() => {
    changeWidth(window.innerWidth);
    changeHeight(window.innerHeight);
  }, []);

  useEffect(() => {
    changeWidth(window.innerWidth);
    changeHeight(window.innerHeight);
    window.addEventListener("resize", updateWindowSize);
    return () => {
      window.removeEventListener("resize", updateWindowSize);
    };
  }, []);

  const [isHide, setIsHide] = useState(false);

  useEffect(() => {
    if (width < 1080) {
      setIsHide(true);
    } else {
      setIsHide(false);
    }
  }, [width]);

  const [isMobile, setIsMobile] = useState(false);

  function resizeEvent(size: number) {
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
        {!isHide && (
          <>
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
            </ResizablePanel>
            <ResizableHandle withHandle />
          </>
        )}
        <ResizablePanel defaultSize={85} style={{ overflow: "visible" }}>
          <Header session={session} />
          <ContentBox>{children}</ContentBox>
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
}
