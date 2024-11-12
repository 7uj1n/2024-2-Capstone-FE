import { ResponsiveLine } from '@nivo/line';
import populationData from '../data/population.json'; // 유동인구 데이터 가져오기

const PopulationChart = () => {
    // 데이터를 Nivo 차트 형식에 맞게 변환
    const data = populationData.map(item => ({
        id: `${item.name} to ${item.destination}`,
        data: item.data.map(d => ({
            x: d.time,
            y: d.population
        }))
    }));

    // 시간 레이블을 간격을 두고 표시하기 위해 tickValues 설정
    const tickValues = data[0].data.filter((_, index) => index % 3 === 0).map(d => d.x);

    return (
        <div style={{ height: '400px' }}> {/* 고정된 높이 설정 */}
            <ResponsiveLine
                data={data} // 변환된 데이터 전달
                margin={{ top: 50, right: 20, bottom: 50, left: 60 }} // 차트 여백 설정
                xScale={{ type: 'point' }} // x축 스케일 설정
                yScale={{
                    type: 'linear', // y축 스케일 설정
                    min: 'auto', // y축 최소값 자동 설정
                    max: 'auto', // y축 최대값 자동 설정
                    stacked: true, // y축 데이터 스택 설정
                    reverse: false // y축 반전 설정
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
                    legendPosition: 'middle' // y축 레전드 위치 설정
                }}
                pointSize={7} // 데이터 포인트 크기 설정
                pointColor={{ from: 'color', modifiers: [] }} // 데이터 포인트 색상 설정
                pointBorderWidth={2} // 데이터 포인트 테두리 두께 설정
                pointBorderColor={{ from: 'serieColor' }} // 데이터 포인트 테두리 색상 설정
                pointLabelYOffset={-12} // 데이터 포인트 라벨 Y 오프셋 설정
                useMesh={true} // 메쉬 사용 설정 (툴팁 활성화)
                colors={{ scheme: 'tableau10' }} //그래프 색 설정 'dark2' 'pastel1' 'tableau10'
                legends={[]} // 범례 제거
            />
        </div>
    );
};

export default PopulationChart;