import { useEffect, useState } from 'react';
import { ResponsiveLine } from '@nivo/line';
import axios from 'axios';
import useStore from '../../store/RegionStore'; // Zustand 스토어 가져오기
import useUserStore from '../../store/UserStore'; // 사용자 상태 관리용 Zustand 스토어 가져오기

const PopulationChart = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const selectedRegionCD = useStore(state => state.selectedRegionCD); // 선택한 지역 코드 가져오기
    const selectedDate = useStore(state => state.selectedDate); // 선택한 날짜 가져오기
    const token = useUserStore(state => state.token); // 사용자 토큰 가져오기
    const routes = useStore(state => state.routes); // 경로 데이터 가져오기

    // 데이터의 최소값과 최대값을 기반으로 동적으로 눈금 생성
    const calculateDynamicTicks = (values) => {
        const minValue = Math.min(...values);
        const maxValue = Math.max(...values);
        const range = maxValue - minValue;

        // 데이터 범위에 따라 적절한 간격 결정 (기본: 5 간격, 값이 크면 10 이상)
        const step = range <= 10 ? 1 : Math.ceil(range / 10);

        // 최소값에서 최대값까지 지정된 간격으로 정수 눈금 생성
        const ticks = [];
        for (let i = Math.floor(minValue); i <= Math.ceil(maxValue); i += step) {
            ticks.push(i);
        }
        return ticks;
    };

    useEffect(() => {
        const fetchPopulationData = async () => {
            if (!selectedRegionCD || !selectedDate || !token) return;

            const apiUrl = import.meta.env.VITE_API_BASE_URL;
            try {
                const response = await axios.get(`${apiUrl}/api/gcs/population/${selectedRegionCD}`, {
                    params: {
                        date: selectedDate
                    },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.data.hourlyData && response.data.hourlyData.length > 0) {
                    const populationData = response.data.hourlyData.map(item => ({
                        x: item.time,
                        y: item.population
                    }));

                    setData([{
                        id: `${response.data.dongCode} to ${response.data.destination}`,
                        data: populationData
                    }]);
                } else {
                    setData([]);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching population data:', error);
                setError('데이터를 불러오는 중 오류가 발생했습니다.');
                setLoading(false);
            }
        };

        fetchPopulationData();
    }, [selectedRegionCD, selectedDate, token]);

    // 시간 레이블을 간격을 두고 표시하기 위해 tickValues 설정
    const tickValues = data.length > 0 && data[0].data ? data[0].data.filter((_, index) => index % 3 === 0).map(d => d.x) : [];

    return (
        <div style={{ height: '400px' }}> {/* 고정된 높이 설정 */}
            {loading ? (
                <p style={{ textAlign: 'center', paddingTop: '10rem' }}>데이터를 불러오는 중입니다...</p>
            ) : routes.length === 0 ? (
                <p style={{ textAlign: 'center', paddingTop: '10rem' }}>데이터가 없습니다.</p>
            ) : data.length > 0 && data[0].data ? (
                <ResponsiveLine
                    data={data} // 변환된 데이터 전달
                    margin={{ top: 50, right: 20, bottom: 50, left: 60 }} // 차트 여백 설정
                    xScale={{ type: 'point' }} // x축 스케일 설정
                    yScale={{
                        type: 'linear', // y축 스케일 설정
                        min: 'auto', // y축 최소값 자동 설정
                        max: 'auto', // y축 최대값 자동 설정
                        stacked: true, // y축 데이터 스택 설정
                        reverse: false, // y축 반전 설정
                    }}
                    axisTop={null} // 상단 축 비활성화
                    axisRight={null} // 오른쪽 축 비활성화
                    axisBottom={{
                        orient: 'bottom', // x축 위치 설정
                        tickSize: 7, // x축 눈금 크기 설정
                        tickPadding: 3, // x축 눈금 패딩 설정
                        tickRotation: 0, // x축 눈금 회전 설정
                        legend: '시간', // x축 레전드 설정
                        legendOffset: 40, // x축 레전드 오프셋 설정
                        legendPosition: 'middle', // x축 레전드 위치 설정
                        tickValues: tickValues // 간격을 두고 표시할 시간 레이블 설정
                    }}
                    axisLeft={{
                        orient: 'left', // y축 위치 설정
                        tickSize: 7, // y축 눈금 크기 설정
                        tickPadding: 3, // y축 눈금 패딩 설정
                        tickRotation: 0, // y축 눈금 회전 설정
                        legend: '유동인구 수', // y축 레전드 설정
                        legendOffset: -40, // y축 레전드 오프셋 설정
                        legendPosition: 'middle', // y축 레전드 위치 설정
                        tickValues: data.length > 0 && data[0].data
                            ? calculateDynamicTicks(data[0].data.map(d => d.y)) // 동적으로 계산된 눈금 값 사용
                            : [], // 데이터가 없을 경우 빈 배열
                        format: d => Math.round(d), // 정수 값만 표시
                    }}
                    pointSize={7} // 데이터 포인트 크기 설정
                    pointColor={{ from: 'color', modifiers: [] }} // 데이터 포인트 색상 설정
                    pointBorderWidth={2} // 데이터 포인트 테두리 두께 설정
                    pointBorderColor={{ from: 'serieColor' }} // 데이터 포인트 테두리 색상 설정
                    pointLabelYOffset={-12} // 데이터 포인트 라벨 Y 오프셋 설정
                    useMesh={true} // 메쉬 사용 설정 (툴팁 활성화)
                    colors={{ scheme: 'tableau10' }} //그래프 색 설정
                    legends={[]} // 범례 제거
                />
            ) : (
                <p style={{ textAlign: 'center', paddingTop: '10rem' }}>데이터가 없습니다.</p>
            )}
        </div>
    );
};

export default PopulationChart;