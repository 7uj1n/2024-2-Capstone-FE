import React from 'react';
import { ResponsivePie } from '@nivo/pie';
import pathData from '../data/path.json'; // 경로 데이터 가져오기

const PopulationPieChart = () => {
    // 경로 데이터에서 유동인구 수를 추출하여 파이차트 데이터 형식으로 변환
    const pieData = pathData.path
        .filter(route => route.type === 'exist') // 기존 경로만 포함
        .map(route => ({
            id: `경로 ${route.id}`,
            label: `경로 ${route.id}`,
            value: route.population || 0, // population 데이터가 없는 경우 0으로 설정
        }));

    return (
        <div style={{ height: 400 }}>
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
            />
        </div>
    );
};

export default PopulationPieChart;