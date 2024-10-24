
import { create } from 'zustand';

const useStore = create((set) => ({
    selectedRegion: '', // 선택한 지역 기본 값
    selectedRegionCD: '', // 선택한 지역 코드 기본 값
    isPolygon: true,    // 폴리곤 표시 여부 기본 값
    setSelectedRegion: (region, regionCD) => set({ selectedRegion: region, selectedRegionCD: regionCD }), // 선택한 지역, 코드 변경
    setIsPolygon: (state) => set(({ isPolygon: state })), // 폴리곤 표시 여부 변경
}));

export default useStore;