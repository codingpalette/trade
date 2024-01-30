import { create } from "zustand";

// 스토어 상태의 타입 정의
interface SiteStoreState {
  width: number;
  height: number;
  changeWidth: (width: number) => void;
  changeHeight: (height: number) => void;
}

const useSiteStore = create<SiteStoreState>((set) => ({
  // width: typeof window !== "undefined" ? window.innerWidth : 0, // 클라이언트 사이드에서만 window 객체 사용
  // height: typeof window !== "undefined" ? window.innerHeight : 0, // 클라이언트 사이드에서만 window 객체 사용
  width: window.innerWidth,
  height: window.innerHeight,
  changeWidth: (width: number) => set({ width }),
  changeHeight: (height: number) => set({ height }),
}));

export default useSiteStore;
