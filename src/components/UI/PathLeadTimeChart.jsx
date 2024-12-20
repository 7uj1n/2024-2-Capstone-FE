import React, { useEffect, useState } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import useStore from '../../store/RegionStore'; // Zustand 스토어 가져오기

const PathLeadTimeChart = () => {
    const routes = useStore(state => state.routes); // 경로 데이터 가져오기
    const [loading, setLoading] = useState(true);
    const [barData, setBarData] = useState([]);

    // 색상 배열
    const colors = ['#fbb4ae', '#b3cde3', '#ccebc5', '#decbe4', '#fed9a6', '#fed9a6', '#fed9a6', '#fed9a6', '#f2f2f2'];

    useEffect(() => {
        if (routes.length > 0) {
            // 데이터를 Nivo 차트 형식에 맞게 변환
            const data = routes.map((route, index) => ({
                route: `경로 ${index + 1}`,
                averageTime: route.totalTime || 0, // averageTime 데이터가 없는 경우 0으로 설정
                color: colors[index % colors.length] // 색상 배열에서 색상 선택
            }));
            setBarData(data);
        }
        setLoading(false);
    }, [routes]);

    const formatTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}시간 ${mins}분` : `${mins}분`;
    };

    return (
        <div style={{ height: '400px' }}> {/* 고정된 높이 설정 */}
            {loading ? (
                <p style={{ textAlign: 'center', paddingTop: '10rem' }}>데이터를 불러오는 중입니다...</p>
            ) : routes.length === 0 ? (
                <p style={{ textAlign: 'center', paddingTop: '10rem' }}>데이터가 없습니다.</p>
            ) : (
                <ResponsiveBar
                    data={barData} // 변환된 데이터 전달
                    keys={['averageTime']} // 막대 차트에서 사용할 데이터 키 설정
                    indexBy="route" // x축에서 사용할 데이터 키 설정
                    margin={{ top: 40, right: 20, bottom: 50, left: 60 }} // 차트 여백 설정
                    padding={0.3} // 막대 간격 설정
                    valueScale={{ type: 'linear' }} // y축 스케일 설정
                    indexScale={{ type: 'band', round: true }} // x축 스케일 설정
                    colors={({ data }) => data.color} // 데이터 색상 설정
                    borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }} // 막대 테두리 색상 설정
                    axisTop={null} // 상단 축 비활성화
                    axisRight={null} // 오른쪽 축 비활성화
                    axisBottom={{
                        tickSize: 5, // x축 눈금 크기 설정
                        tickPadding: 5, // x축 눈금 패딩 설정
                        tickRotation: 0, // x축 눈금 회전 설정
                        legend: '경로', // x축 레전드 설정
                        legendPosition: 'middle', // x축 레전드 위치 설정
                        legendOffset: 32 // x축 레전드 오프셋 설정
                    }}
                    axisLeft={{
                        tickSize: 5, // y축 눈금 크기 설정
                        tickPadding: 5, // y축 눈금 패딩 설정
                        tickRotation: 0, // y축 눈금 회전 설정
                        legend: '예상 시간 (분)', // y축 레전드 설정
                        legendPosition: 'middle', // y축 레전드 위치 설정
                        legendOffset: -40 // y축 레전드 오프셋 설정
                    }}
                    tooltip={({ value }) => (
                        <div
                            style={{
                                padding: '5px 10px',
                                background: 'rgba(0, 0, 0, 0.75)',
                                color: '#fff',
                                borderRadius: '3px',
                                fontSize: '15px',
                            }}
                        >
                            {`소요 시간: ${formatTime(value)}`}
                        </div>
                    )}
                    labelSkipWidth={12} // 라벨 스킵 너비 설정
                    labelSkipHeight={12} // 라벨 스킵 높이 설정
                    labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }} // 라벨 텍스트 색상 설정
                    legends={[
                        {
                            dataFrom: 'keys', // 범례 데이터 출처 설정
                            anchor: 'bottom-right', // 범례 위치 설정
                            direction: 'column', // 범례 방향 설정
                            justify: false, // 범례 정렬 설정
                            translateX: 120, // 범례 x축 이동 설정
                            translateY: 0, // 범례 y축 이동 설정
                            itemsSpacing: 2, // 범례 아이템 간격 설정
                            itemWidth: 100, // 범례 아이템 너비 설정
                            itemHeight: 20, // 범례 아이템 높이 설정
                            itemDirection: 'left-to-right', // 범례 아이템 방향 설정
                            itemOpacity: 0.85, // 범례 아이템 불투명도 설정
                            symbolSize: 20, // 범례 심볼 크기 설정
                            effects: [
                                {
                                    on: 'hover', // 호버 시 효과 설정
                                    style: {
                                        itemOpacity: 1 // 호버 시 아이템 불투명도 설정
                                    }
                                }
                            ]
                        }
                    ]}
                    animate={true} // 애니메이션 활성화
                    motionStiffness={90} // 애니메이션 강성 설정
                    motionDamping={15} // 애니메이션 감쇠 설정
                />
            )}
        </div>
    );
};

export default PathLeadTimeChart;
