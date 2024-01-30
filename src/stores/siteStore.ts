import { create } from "zustand";

// 스토어 상태의 타입 정의
interface SiteStoreState {
  width: number;
  height: number;
  changeWidth: (width: number) => void;
  changeHeight: (height: number) => void;
}

const useSiteStore = create<SiteStoreState>((set) => ({
  width: 0, // 브라우저 창의 초기 너비
  height: 0, // 브라우저 창의 초기 높이
  changeWidth: (width: number) => set({ width }),
  changeHeight: (height: number) => set({ height }),
}));

export default useSiteStore;
