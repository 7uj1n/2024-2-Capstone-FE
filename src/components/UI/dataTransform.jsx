// dataTransform.js
export function transformData(data) {
    const pathData = {
        path: []
    };

    const tripMap = new Map();

    // JSON 데이터를 배열 형식으로 변환
    const keys = Object.keys(data.TRIP_NO);
    const dataArray = keys.map(key => ({
        TRIP_NO: data.TRIP_NO[key],
        DPR_CELL_YCRD_first: data.DPR_CELL_YCRD_first[key],
        DPR_CELL_XCRD_first: data.DPR_CELL_XCRD_first[key],
        ARV_CELL_ID: data.ARV_CELL_ID[key],
        DPR_MEGA_NM_first: data.DPR_MEGA_NM_first[key],
        DPR_CCW_NM_first: data.DPR_CCW_NM_first[key],
        DPR_ADNG_NM_first: data.DPR_ADNG_NM_first[key]
    }));

    dataArray.forEach(item => {
        if (!tripMap.has(item.TRIP_NO)) {
            tripMap.set(item.TRIP_NO, {
                id: item.TRIP_NO,
                type: 'exist', // 기본값 설정
                leadtime: 0, // 기본값 설정
                coordinate: []
            });
        }

        const trip = tripMap.get(item.TRIP_NO);
        trip.coordinate.push([item.DPR_CELL_YCRD_first, item.DPR_CELL_XCRD_first]);
    });

    pathData.path = Array.from(tripMap.values());
    return pathData;
}