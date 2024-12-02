import React, { useEffect, useState } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import './airportCongestionPage.css'; // CSS 파일 가져오기

function AirportCongestionPage() {
    const [currentTime, setCurrentTime] = useState('');
    const [chartData, setChartData] = useState([]);

    const trafficMessages = {
        "원활": "현재 시간 기준, 인천공항은 원활한 상태입니다. 공항 이용이 비교적 수월할 것으로 보입니다.",
        "보통": "현재 시간 기준, 인천공항은 보통 수준의 혼잡도를 보이고 있습니다. 이용에 큰 불편은 없으나 여유를 두고 이동하시길 권장합니다.",
        "약간 혼잡": "현재 시간 기준, 인천공항은 약간 혼잡한 상태입니다. 탑승 준비에 다소 시간이 필요할 수 있으니 서둘러 주시기 바랍니다.",
        "혼잡": "현재 시간 기준, 인천공항은 혼잡한 상태입니다. 공항 이용 시 충분한 시간을 확보하고 이동하시기 바랍니다.",
        "매우 혼잡": "현재 시간 기준, 인천공항은 매우 혼잡한 상태입니다. 절차 진행에 상당한 지연이 예상되오니, 가능한 한 서둘러 이동하시기 바랍니다."
    };


    useEffect(() => {
        // 현재 시간을 업데이트
        const now = new Date();
        const koreaTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
        const hours = String(koreaTime.getHours()).padStart(2, '0');
        const minutes = String(koreaTime.getMinutes()).padStart(2, '0');
        setCurrentTime(`${hours}:${minutes}`);

        // 차트 데이터를 생성
        const data = [];
        for (let i = 0; i <= 6; i++) {
            const time = new Date(koreaTime.getTime() + i * 60 * 60 * 1000);
            const timeString = `${String(time.getHours()).padStart(2, '0')}:00`; // 시간을 1시간 단위로 설정
            data.push({
                time: timeString,
                population: Math.floor(Math.random() * 1000), // 임의의 유동인구수 데이터
                congestion: Math.random() > 0.5 ? '혼잡' : '원활' // 임의의 혼잡도 데이터
            });
        }
        setChartData(data);
    }, []);

    return (
        <div className="airport-congestion-page">
            <h2 className="airport-congestion-title">공항 예상 혼잡도</h2>
            <div className="airport-congestion-content">
                {/* <h3 style={{
                    border: '1px solid #ccc', // 얇은 테두리
                    borderRadius: '8px', // 모서리를 둥글게
                    backgroundColor: '#fff', // 배경색 흰색
                    padding: '10px', // 내부 여백
                    display: 'inline-block' // 인라인 블록 요소로 설정
                }}>
                    현재 시간: 2024-08-17 {currentTime}
                </h3> */}
                <div className='airport-congestion-text'>
                    <h3>
                        현재 시간 기준, 인천공항은{' '}
                        <span style={{ color: 'green', fontWeight: 'bold' }}>보통</span> 수준의 혼잡도를 보이고 있습니다.
                    </h3>
                    <h3>이용에 큰 불편은 없으나 여유를 두고 이동하시길 권장합니다.</h3>
                </div>
                <div className="airport-congestion-graph" style={{ height: '400px'}}>
                    <ResponsiveBar
                        data={chartData}
                        keys={['population']}
                        indexBy="time"
                        margin={{ top: 50, right: 130, bottom: 50, left: 80 }}
                        padding={0.5}   // 막대 간격 조정
                        valueScale={{ type: 'linear' }}
                        indexScale={{ type: 'band', round: true }}
                        colors="#FF8349" // 주황색으로 설정
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
                            tickValues: 'every 1 hour',
                            tickTextColor: '#333',
                            tickFontSize: 50 // x축 라벨 글자 크기 설정
                        }}
                        axisLeft={{
                            tickSize: 5,    
                            tickPadding: 5, 
                            tickRotation: 0,    // y축 라벨 회전 각도 설정
                            legend: '유동인구수',
                            legendPosition: 'middle', // y축 라벨 위치 설정
                            legendOffset: -40,  // y축 라벨 위치 조정
                            tickTextColor: '#333', // y축 라벨 색상 설정
                            tickFontSize: 14 // y축 라벨 글자 크기 설정
                        }}
                        labelSkipWidth={12} // 라벨 너비 설정
                        labelSkipHeight={12}    // 라벨 높이 설정
                        labelTextColor={{ from: 'color', modifiers: [['darker', 3.6]] }}    // 라벨 색상 설정
                        labelFontSize={14} // 라벨 글자 크기 설정
                        tooltip={({ id, value, color, data }) => (
                            <div
                                style={{
                                    padding: '12px',
                                    color,
                                    background: '#222222',
                                }}
                            >
                                <strong>{data.time}</strong>
                                <br />
                                유동인구수: {value}
                                <br />
                                혼잡도: {data.congestion}
                            </div>
                        )}
                        legends={[
                            {
                                dataFrom: 'keys',
                                anchor: 'bottom-right',
                                direction: 'column',
                                justify: false, // 범례 정렬 설정
                                translateX: 120,
                                translateY: 0,
                                itemsSpacing: 2,
                                itemWidth: 100, //
                                itemHeight: 20,
                                itemDirection: 'left-to-right',
                                itemOpacity: 0.85,
                                symbolSize: 20, // 범례 기호 크기 설정
                                effects: [
                                    {
                                        on: 'hover',
                                        style: {
                                            itemOpacity: 1
                                        }
                                    }
                                ]
                            }
                        ]}
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