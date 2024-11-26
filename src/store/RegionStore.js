import { create } from 'zustand';

const useRegionStore = create((set) => ({
    selectedRegion: '', // 선택한 지역 기본 값
    selectedRegionCD: '', // 선택한 지역 코드 기본 값
    selectedDate: null, // 선택한 날짜 기본 값
    selectedRoute: null, // 선택한 경로 기본 값
    routes: [], // 경로 데이터 초기 값
    setSelectedRegion: (region, regionCD) => set({ selectedRegion: region, selectedRegionCD: regionCD }), // 선택한 지역, 코드 변경
    setSelectedDateTime: (date) => set({ selectedDate: date }), // 선택한 날짜와 시간 변경
    setSelectedRoute: (route) => set({ selectedRoute: route }), // 선택한 경로 변경
    setRoutes: (routes) => set({ routes }), // 경로 데이터 설정
    updateRouteLikes: (routeId, likes) => set((state) => ({
        routes: state.routes.map(route => route.routeId === routeId ? { ...route, positive: likes } : route)
    })), // 경로의 좋아요 수 업데이트
    updateRouteDislikes: (routeId, dislikes) => set((state) => ({
        routes: state.routes.map(route => route.routeId === routeId ? { ...route, negative: dislikes } : route)
    })), // 경로의 싫어요 수 업데이트
    clearRegionSelection: () => set({ selectedRegion: '', selectedRegionCD: '', selectedDate: null, selectedRoute: null, routes: [] }) // 지역 선택 상태 초기화
}));

export default useRegionStore;