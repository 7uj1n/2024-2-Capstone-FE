import React, { useEffect, useState } from 'react';
import { ResponsivePie } from '@nivo/pie';
import useStore from '../../store/RegionStore'; // Zustand 스토어 가져오기

const PopulationPieChart = () => {
    const routes = useStore(state => state.routes); // 경로 데이터 가져오기
    const [loading, setLoading] = useState(true);
    const [pieData, setPieData] = useState([]);

    useEffect(() => {
        if (routes.length > 0) {
            // 유동인구 총합 계산
            const totalUsers = routes.reduce((sum, route) => sum + (route.users || 0), 0);
            // 파이 차트 데이터 변환
            const data = routes.map((route, index) => ({
                id: `경로 ${index + 1}`,
                label: `경로 ${index + 1}`,
                value: route.users || 0, // 유동인구가 없는 경우 0으로 설정
                percentage: totalUsers > 0 ? ((route.users || 0) / totalUsers * 100).toFixed(1) : 0 // 퍼센트 계산
            }));
            setPieData(data);
        }
        setLoading(false);
    }, [routes]);

    return (
        <div style={{ height: 400 }}>
            {loading ? (
                <p style={{ textAlign: 'center', paddingTop: '10rem' }}>데이터를 불러오는 중입니다...</p>
            ) : routes.length === 0 ? (
                <p style={{ textAlign: 'center', paddingTop: '10rem' }}>데이터가 없습니다.</p>
            ) : (
                <ResponsivePie
                    data={pieData}
                    margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                    innerRadius={0.5}
                    padAngle={0.7}
                    cornerRadius={3}
                    colors={{ scheme: 'pastel1' }}
                    borderWidth={1}
                    borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                    radialLabelsSkipAngle={10}
                    radialLabelsTextColor="#333333"
                    radialLabelsLinkColor={{ from: 'color' }}
                    sliceLabelsSkipAngle={10}
                    sliceLabelsTextColor="#333333"
                    legends={[
                        {
                            anchor: 'bottom',
                            direction: 'row',
                            justify: false,
                            translateX: 0,
                            translateY: 56,
                            itemsSpacing: 0,
                            itemWidth: 100,
                            itemHeight: 18,
                            itemTextColor: '#999',
                            itemDirection: 'left-to-right',
                            itemOpacity: 1,
                            symbolSize: 18,
                            symbolShape: 'circle',
                            effects: [
                                {
                                    on: 'hover',
                                    style: {
                                        itemTextColor: '#000'
                                    }
                                }
                            ]
                        }
                    ]}
                    tooltip={({ datum }) => (
                        <div
                            style={{
                                padding: '5px 10px',
                                background: 'rgba(0, 0, 0, 0.75)',
                                color: '#fff',
                                borderRadius: '3px',
                                fontSize: '15px',
                            }}
                        >
                            <strong>{datum.label}</strong>
                            <div>{`유동인구: ${datum.value}명`}</div>
                            <div>{`비율: ${datum.data.percentage}%`}</div>
                        </div>
                    )}
                />
            )}
        </div>
    );
};

export default PopulationPieChart;
