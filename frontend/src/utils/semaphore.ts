import { Models } from '../../models';
import { colors } from '../assets';
import { getLatestCrop, getLatestDiagnosis } from '.';
import { useMainSelector } from '../../redux-things';

export type Thresholds = {
	yellow_threshold: number;
	red_threshold: number;
};

export function useThresholds(): Thresholds {
	const { yellow_threshold, red_threshold } = useMainSelector((state) => state.backendData.user)!;
	return { yellow_threshold, red_threshold };
}

export function getSemaphoreColor(infestationPercentage: number, thresholds: Thresholds) {
	if (infestationPercentage <= thresholds.yellow_threshold) return colors.flags.green;
	if (infestationPercentage <= thresholds.red_threshold) return colors.flags.yellow;
	return colors.flags.red;
}

export function getMapPinColor(field: Models.field, thresholds: Thresholds, tab: string) {
	if (tab === 'Overview') return colors.flags.blue;

	const latestCrop = getLatestCrop(field);
	if (!latestCrop?.is_diagnosis_hired) return colors.neutral.gray_20;

	const latestDiagnosis = getLatestDiagnosis(field);
	if (!latestDiagnosis) return colors.flags.blue;

	const fieldInfestationPercentage = (latestDiagnosis.affected_area_ha / field.area_ha) * 100;
	return getSemaphoreColor(fieldInfestationPercentage, thresholds);
}

export function getMapPinColorDate(field: Models.field) {
	const latestCrop = getLatestCrop(field);

	if (field.crop[0].diagnosis[0]) {
		const now = new Date(); // Data de hoje
		const past = new Date(field.crop[0].diagnosis[0].report_date); // Outra data no passado
		const diff = Math.abs(now.getTime() - past.getTime()); // Subtrai uma data pela outra
		const days = Math.ceil(diff / (1000 * 60 * 60 * 24)); // Divide o total pelo total de milisegundos correspondentes a 1 dia. (1000 milisegundos = 1 segundo).

		// Mostra a diferença em dias

		if (days <= 30) {
			console.log(colors.flags.green);
			return colors.flags.green;
		}

		if (days > 60) {
			console.log(colors.flags.red);
			return colors.flags.red;
		}

		if (days > 30) {
			console.log(colors.flags.yellow);
			return colors.flags.yellow;
		}
	}

	if (!latestCrop?.is_diagnosis_hired) return colors.neutral.gray_20;

	const latestDiagnosis = getLatestDiagnosis(field);
	if (!latestDiagnosis) return colors.flags.blue;

	// const fieldInfestationPercentage = (latestDiagnosis.affected_area_ha / field.area_ha) * 100;
	// return getSemaphoreColor(fieldInfestationPercentage, thresholds);
}
