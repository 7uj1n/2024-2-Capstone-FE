import { create } from 'zustand';
import pathData from '../components/data/path2.json'; // 경로 데이터 가져오기

const useStore = create((set) => ({
    selectedRegion: '', // 선택한 지역 기본 값
    selectedRegionCD: '', // 선택한 지역 코드 기본 값
    selectedDate: null, // 선택한 날짜 기본 값
    selectedTime: null, // 선택한 시간 기본 값
    selectedRoute: pathData.path[0].id, // 선택한 경로 기본 값을 첫 번째 경로로 설정
    routes: pathData.path, // 경로 데이터
    setSelectedRegion: (region, regionCD) => set({ selectedRegion: region, selectedRegionCD: regionCD }), // 선택한 지역, 코드 변경
    setSelectedDateTime: (date, time) => set({ selectedDate: date, selectedTime: time }), // 선택한 날짜와 시간 변경
    setSelectedRoute: (route) => set({ selectedRoute: route }), // 선택한 경로 변경
    updateRouteLikes: (routeId, likes) => set((state) => ({
        routes: state.routes.map(route => route.id === routeId ? { ...route, like: likes } : route)
    })), // 경로의 좋아요 수 업데이트
    updateRouteDislikes: (routeId, dislikes) => set((state) => ({
        routes: state.routes.map(route => route.id === routeId ? { ...route, dislike: dislikes } : route)
    })) // 경로의 싫어요 수 업데이트
}));

export default useStore;