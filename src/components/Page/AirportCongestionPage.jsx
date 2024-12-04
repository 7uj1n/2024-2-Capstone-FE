import React, { useEffect, useState } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import useTimeStore from '../../store/TimeStore';
import useStore from '../../store/UserStore';
import axios from 'axios';
import './airportCongestionPage.css';

function AirportCongestionPage() {
    const [chartData, setChartData] = useState([]);
    const [currentCongestionMessage, setCurrentCongestionMessage] = useState("");
    const [currentCongestionLevel, setCurrentCongestionLevel] = useState("");
    const currentTime = useTimeStore((state) => state.currentTime);
    const token = useStore((state) => state.token);

    const trafficMessages = {
        "원활": "공항 이용이 비교적 수월할 것으로 보입니다.",
        "보통": "이용에 큰 불편은 없으나 여유를 두고 이동하시길 권장합니다.",
        "약간 혼잡": "탑승 준비에 다소 시간이 필요할 수 있으니 서둘러 주시기 바랍니다.",
        "혼잡": "공항 이용 시 충분한 시간을 확보하고 이동하시기 바랍니다.",
        "매우 혼잡": "절차 진행에 상당한 지연이 예상되오니, 가능한 한 서둘러 이동하시기 바랍니다."
    };

    const congestionColors = {
        "원활": "skyblue",
        "보통": "#599468",
        "약간 혼잡": "#ffd700",
        "혼잡": "orange",
        "매우 혼잡": "#ff0800"
    };


    const getCongestionLevel = (population) => {
        // LG U+ 데이터가 전체의 30%라 가정하고 보정
        // const adjustedPopulation = population * (3.33/ 5);    // 7 / 5
        
        const adjustedPopulation = population;    

        if (adjustedPopulation <= 6500) return '원활';
        if (adjustedPopulation <= 7200) return '보통';
        if (adjustedPopulation <= 7600) return '약간 혼잡';
        if (adjustedPopulation <= 8000) return '혼잡';
        return '매우 혼잡';
    };

    // const getCongestionLevel = (population) => {
    //     // LG U+ 데이터가 전체의 30%라 가정하고 보정
    //     // const adjustedPopulation = population * (2 / 3);    // 7 / 5
        
    //     const adjustedPopulation = population;    // 7 / 5

    //     if (adjustedPopulation <= 6000) return '원활';
    //     if (adjustedPopulation <= 6600) return '보통';
    //     if (adjustedPopulation <= 7200) return '약간 혼잡';
    //     if (adjustedPopulation <= 7600) return '혼잡';
    //     return '매우 혼잡';
    // };

    // const getCongestionLevel = (population) => {
    //     if (population <= 7000) return '원활';
    //     if (population <= 7600) return '보통';
    //     if (population <= 8200) return '약간 혼잡';
    //     if (population <= 8600) return '혼잡';
    //     return '매우 혼잡';
    // };

    useEffect(() => {
        const fetchCongestionData = async () => {
            const apiUrl = import.meta.env.VITE_API_BASE_URL;
            try {
                const hour = currentTime.split(':')[0];
                const response = await axios.get(`${apiUrl}/api/gcs/congestion`, {
                    params: {
                        date: '2024-08-17',
                        time: hour
                    },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = response.data;
                console.log(data);

                const baseTime = new Date();
                baseTime.setHours(hour);
                baseTime.setMinutes(0);
                baseTime.setSeconds(0);

                // 기존 시간 계산 로직에서 수정
const formatTime = (hour) => `${String(hour % 24).padStart(2, '0')}:00`;

const chartData = [
    { time: formatTime(baseTime.getHours()), population: data.current_count, congestion: getCongestionLevel(data.current_count), color: congestionColors[getCongestionLevel(data.current_count)] },
    { time: formatTime(baseTime.getHours() + 1), population: data.predictions['+1h'], congestion: getCongestionLevel(data.predictions['+1h']), color: congestionColors[getCongestionLevel(data.predictions['+1h'])] },
    { time: formatTime(baseTime.getHours() + 2), population: data.predictions['+2h'], congestion: getCongestionLevel(data.predictions['+2h']), color: congestionColors[getCongestionLevel(data.predictions['+2h'])] },
    { time: formatTime(baseTime.getHours() + 3), population: data.predictions['+3h'], congestion: getCongestionLevel(data.predictions['+3h']), color: congestionColors[getCongestionLevel(data.predictions['+3h'])] },
    { time: formatTime(baseTime.getHours() + 4), population: data.predictions['+4h'], congestion: getCongestionLevel(data.predictions['+4h']), color: congestionColors[getCongestionLevel(data.predictions['+4h'])] },
    { time: formatTime(baseTime.getHours() + 5), population: data.predictions['+5h'], congestion: getCongestionLevel(data.predictions['+5h']), color: congestionColors[getCongestionLevel(data.predictions['+5h'])] },
    { time: formatTime(baseTime.getHours() + 6), population: data.predictions['+6h'], congestion: getCongestionLevel(data.predictions['+6h']), color: congestionColors[getCongestionLevel(data.predictions['+6h'])] }
];

                const currentLevel = getCongestionLevel(data.current_count);
                setCurrentCongestionLevel(currentLevel);
                setCurrentCongestionMessage(trafficMessages[currentLevel]);
                setChartData(chartData);
            } catch (error) {
                console.error("Error fetching congestion data:", error);
            }
        };

        if (currentTime) {
            fetchCongestionData();
        }
    }, [currentTime, token]);

    return (
        <div className="airport-congestion-page">
            <h2 className="airport-congestion-title">공항 예상 혼잡도</h2>
            <div className="airport-congestion-content">
                <div className='airport-congestion-text'>
                    <h3>
                        현재 시간 기준, 인천공항은{' '}
                        <span style={{ color: congestionColors[currentCongestionLevel], fontWeight: 'bold' }}>
                            {currentCongestionLevel}
                        </span>{' '}
                        수준의 혼잡도를 보이고 있습니다.
                    </h3>
                    <h3>{currentCongestionMessage}</h3>
                </div>
                <div className="airport-congestion-graph" style={{ height: '400px' }}>
                    <ResponsiveBar
                        data={chartData}
                        keys={['population']}
                        indexBy="time"
                        margin={{ top: 50, right: 130, bottom: 50, left: 80 }}
                        padding={0.5}
                        valueScale={{ type: 'linear' }}
                        indexScale={{ type: 'band', round: true }}
                        colors={({ data }) => data.color} // 데이터의 색상 적용
                        borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                        axisTop={null}
                        axisRight={null}
                        axisBottom={{
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: '시간',
                            legendPosition: 'middle',
                            legendOffset: 32,
                        }}
                        axisLeft={{
                            tickSize: 10,
                            tickPadding: 8,
                            tickRotation: 0,
                            legend: '유동인구수',
                            legendPosition: 'middle',
                            legendOffset: -60,
                        }}
                        labelSkipWidth={12}
                        labelSkipHeight={12}
                        labelTextColor={{ from: 'color', modifiers: [['darker', 3.6]] }}
                        tooltip={({ id, value, color, data }) => (
                            <div style={{ padding: '12px', color, background: '#222222' }}>
                                <strong>{data.time}</strong>
                                <br />
                                유동인구수: {value}
                                <br />
                                혼잡도: {data.congestion}
                            </div>
                        )}
                        // legends={[
                        //     {
                        //         dataFrom: 'keys',
                        //         anchor: 'bottom-right',
                        //         direction: 'column',
                        //         translateX: 120,
                        //         itemsSpacing: 2,
                        //         itemWidth: 100,
                        //         itemHeight: 20,
                        //         itemDirection: 'left-to-right',
                        //         symbolSize: 20,
                        //     }
                        // ]}
                        animate={true}
                        motionStiffness={90}
                        motionDamping={15}
                    />
                </div>
            </div>
        </div>
    );
}

export default AirportCongestionPage;
