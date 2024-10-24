import { ResponsiveLine } from '@nivo/line';
import populationData from '../data/population.json'; // 유동인구 데이터 가져오기

const PopulationChart = () => {
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
                data={data}
                margin={{ top: 50, right: 50, bottom: 50, left: 60 }} // 오른쪽 여백 조정
                xScale={{ type: 'point' }}
                yScale={{
                    type: 'linear',
                    min: 'auto',
                    max: 'auto',
                    stacked: true,
                    reverse: false
                }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    orient: 'bottom',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: '시간',
                    legendOffset: 36,
                    legendPosition: 'middle',
                    tickValues: tickValues // 간격을 두고 표시할 시간 레이블 설정
                }}
                axisLeft={{
                    orient: 'left',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: '유동인구 수',
                    legendOffset: -40,
                    legendPosition: 'middle'
                }}
                pointSize={10}
                pointColor={{ theme: 'background' }}
                pointBorderWidth={2}
                pointBorderColor={{ from: 'serieColor' }}
                pointLabelYOffset={-12}
                useMesh={true}
                legends={[]} // 범례 제거
            />
        </div>
    );
};

export default PopulationChart;