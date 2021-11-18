import { Models } from '../../models';
import { getLatestDiagnosis } from '.';

type InfestationPoint = {
	key: string;
	color: string;
	coordinate: Models.Coordinate;
};

export function getAllInfestationPointsFromArea(area: Models.area): InfestationPoint[] {
	return area.field.flatMap((field) => getAllInfestationPointsFromField(field));
}

export function getAllInfestationPointsFromField(field: Models.field): InfestationPoint[] {
	const diagnosis = getLatestDiagnosis(field);
	if (!diagnosis) return [];

	const allPoints: InfestationPoint[] = [];
	for (const infestation of diagnosis.infestation) {
		for (const point of infestation.points) {
			allPoints.push({
				key: `${point.center.latitude}_${point.center.longitude}_${diagnosis.id}_${infestation.plague.name}`,
				color: infestation.plague.color,
				coordinate: point.center,
			});
		}
	}

	return allPoints;
}
