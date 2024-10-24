import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import pathData from '../data/path.json'; // 경로 데이터 가져오기

const PathLeadTimeChart = () => {
    // leadtime을 분 단위로 변환하는 함수
    const convertLeadTimeToMinutes = (leadtime) => {
        const [hours, minutes] = leadtime.split('시간 ').map(time => parseInt(time, 10));
        return hours * 60 + minutes;
    };

    const data = pathData.path.map(route => ({
        route: `경로 ${route.id}`,
        leadtime: convertLeadTimeToMinutes(route.leadtime)
    }));

    return (
        <div style={{ height: '400px' }}>
            <ResponsiveBar
                data={data}
                keys={['leadtime']}
                indexBy="route"
                margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
                padding={0.3}
                valueScale={{ type: 'linear' }}
                indexScale={{ type: 'band', round: true }}
                colors={{ scheme: 'nivo' }}
                borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: '경로',
                    legendPosition: 'middle',
                    legendOffset: 32
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: '예상 시간 (분)',
                    legendPosition: 'middle',
                    legendOffset: -40
                }}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                legends={[
                    {
                        dataFrom: 'keys',
                        anchor: 'bottom-right',
                        direction: 'column',
                        justify: false,
                        translateX: 120,
                        translateY: 0,
                        itemsSpacing: 2,
                        itemWidth: 100,
                        itemHeight: 20,
                        itemDirection: 'left-to-right',
                        itemOpacity: 0.85,
                        symbolSize: 20,
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
    );
};

export default PathLeadTimeChart;