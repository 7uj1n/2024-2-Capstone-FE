// Douglas-Peucker 알고리즘을 사용하여 경로 단순화
export const simplifyPath = (path, tolerance) => {
    if (path.length < 3) return path;

    const sqTolerance = tolerance * tolerance;

    const simplifyDPStep = (points, first, last, sqTolerance, simplified) => {
        let maxSqDist = sqTolerance;
        let index = -1;

        for (let i = first + 1; i < last; i++) {
            const sqDist = getSqSegDist(points[i], points[first], points[last]);

            if (sqDist > maxSqDist) {
                index = i;
                maxSqDist = sqDist;
            }
        }

        if (maxSqDist > sqTolerance) {
            if (index - first > 1) simplifyDPStep(points, first, index, sqTolerance, simplified);
            simplified.push(points[index]);
            if (last - index > 1) simplifyDPStep(points, index, last, sqTolerance, simplified);
        }
    };

    const getSqSegDist = (p, p1, p2) => {
        let x = p1[0];
        let y = p1[1];
        let dx = p2[0] - x;
        let dy = p2[1] - y;

        if (dx !== 0 || dy !== 0) {
            const t = ((p[0] - x) * dx + (p[1] - y) * dy) / (dx * dx + dy * dy);

            if (t > 1) {
                x = p2[0];
                y = p2[1];
            } else if (t > 0) {
                x += dx * t;
                y += dy * t;
            }
        }

        dx = p[0] - x;
        dy = p[1] - y;

        return dx * dx + dy * dy;
    };

    const last = path.length - 1;
    const simplified = [path[0]];
    simplifyDPStep(path, 0, last, sqTolerance, simplified);
    simplified.push(path[last]);

    return simplified;
};