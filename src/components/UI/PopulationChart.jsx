import { useEffect, useState } from 'react';
import { ResponsiveLine } from '@nivo/line';
import axios from 'axios';
import useStore from '../../store/RegionStore'; // Zustand 스토어 가져오기
import useUserStore from '../../store/UserStore'; // 사용자 상태 관리용 Zustand 스토어 가져오기

const PopulationChart = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const selectedRegionCD = useStore((state) => state.selectedRegionCD); // 선택한 지역 코드 가져오기
    const selectedDate = useStore((state) => state.selectedDate); // 선택한 날짜 가져오기
    const token = useUserStore((state) => state.token); // 사용자 토큰 가져오기

    // 동적으로 y축 눈금 생성
    const calculateDynamicTicks = (values) => {
        const minValue = Math.min(...values);
        const maxValue = Math.max(...values);
        const range = maxValue - minValue;

        const step = range <= 10 ? 1 : Math.ceil(range / 10);
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
                        date: selectedDate,
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data.hourlyData && response.data.hourlyData.length > 0) {
                    const populationData = response.data.hourlyData.map((item) => ({
                        x: item.time.replace('시', ':00'), // 시간 형식 변환
                        y: item.population,
                    }));

                    setData([
                        {
                            id: `${response.data.dongCode} to ${response.data.destination}`,
                            data: populationData,
                        },
                    ]);
                } else {
                    setData([
                        {
                            id: 'No Data',
                            data: [],
                        },
                    ]);
                }
                console.log('Population data:', response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching population data:', error);
                setError('데이터를 불러오는 중 오류가 발생했습니다.');
                setLoading(false);
            }
        };

        fetchPopulationData();
    }, [selectedRegionCD, selectedDate, token]);

    const tickValues = data.length > 0 && data[0].data ? data[0].data.filter((_, index) => index % 3 === 0).map((d) => d.x) : [];

    return (
        <div style={{ height: '400px' }}>
            {loading ? (
                <p style={{ textAlign: 'center', paddingTop: '10rem' }}>데이터를 불러오는 중입니다...</p>
            ) : data.length > 0 && data[0].data.length > 0 ? (
                <ResponsiveLine
                    data={data}
                    margin={{ top: 50, right: 20, bottom: 50, left: 60 }}
                    xScale={{ type: 'point' }}
                    yScale={{
                        type: 'linear',
                        min: 'auto',
                        max: 'auto',
                        stacked: false,
                        reverse: false,
                    }}
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                        orient: 'bottom',
                        tickSize: 7,
                        tickPadding: 3,
                        tickRotation: 0,
                        legend: '시간',
                        legendOffset: 40,
                        legendPosition: 'middle',
                        tickValues: tickValues,
                    }}
                    axisLeft={{
                        orient: 'left',
                        tickSize: 7,
                        tickPadding: 3,
                        tickRotation: 0,
                        legend: '유동인구 수',
                        legendOffset: -40,
                        legendPosition: 'middle',
                        tickValues: calculateDynamicTicks(
                            data[0].data.map((d) => d.y)
                        ),
                        format: (d) => Math.round(d),
                    }}
                    pointSize={7}
                    pointColor={{ from: 'color', modifiers: [] }}
                    pointBorderWidth={2}
                    pointBorderColor={{ from: 'serieColor' }}
                    useMesh={true}
                    colors={{ scheme: 'tableau10' }}
                    legends={[]}
                    tooltip={({ point }) => (
                        <div
                            style={{
                                padding: '5px 10px',
                                background: 'rgba(0, 0, 0, 0.75)',
                                color: '#fff',
                                borderRadius: '3px',
                                fontSize: '15px',
                            }}
                        >
                            <div>{point.data.x}</div>
                            <div>{`유동인구: ${point.data.y}명`}</div>
                        </div>
                    )}
                />
            ) : (
                <p style={{ textAlign: 'center', paddingTop: '10rem' }}>데이터가 없습니다.</p>
            )}
        </div>
    );
};

export default PopulationChart;
