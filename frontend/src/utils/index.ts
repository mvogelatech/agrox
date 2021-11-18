import { Dimensions } from 'react-native';
import { Models, PulverizationMethods } from '../../models';

export type StrictUnion<A, B> = (A & { [K in keyof B]?: undefined }) | (B & { [K in keyof A]?: undefined });

export function getQuotationsFromPackage(pkg: Models.quotation_package): Models.quotation[] {
	const quotations: Models.quotation[] = [];
	for (const modal of pkg.quotation_modal_package) {
		for (const quotation of modal.quotation) quotations.push(quotation);
	}

	return quotations;
}

export function formatDate(date: string) {
	if (date.length < 10) return date;
	const dateArray = date.slice(0, 10).split('-');
	return `${dateArray[2]}/${dateArray[1]}/${dateArray[0]}`;
}

export function formatDateWithTime(date: string) {
	const dateArray = date.slice(0, 10).split('-');
	const timeArray = date.slice(11, 19).split(':');
	// TODO: Get timezone from the device
	return `${dateArray[2]}/${dateArray[1]}/${dateArray[0]}\t|\t ${Number.parseFloat(timeArray[0]) - 3}:${timeArray[1]}`;
}

export function getLatestCrop(field: Models.field) {
	if (field.crop.length === 0) return null;
	return field.crop[0];
}

export function getLatestDiagnosis(field: Models.field) {
	const latestCrop = getLatestCrop(field);
	if (latestCrop === null) return null;
	if (latestCrop.diagnosis.length === 0) return null;
	return latestCrop.diagnosis[0];
}

export function getAreaLatestDiagnosis(area: Models.area) {
	return getLatestDiagnosis(area.field[0]);
}

type FieldState = 'hired_diagnosis_available' | 'hired_diagnosis_unavailable' | 'not_hired';

export function getFieldState(field: Models.field): FieldState {
	const latestCrop = getLatestCrop(field);
	if (latestCrop?.is_diagnosis_hired) {
		const latestDiagnosis = getLatestDiagnosis(field);
		if (latestDiagnosis) return 'hired_diagnosis_available';
		return 'hired_diagnosis_unavailable';
	}

	return 'not_hired';
}

export function getPrescriptionStatus(latestDiagnosis: Models.diagnosis) {
	if (latestDiagnosis?.affected_area_ha === 0) return 'not-infested';
	if (latestDiagnosis?.prescription?.length === 0) return 'not-available';
	if (!latestDiagnosis?.prescription) return 'not-available';
	return 'ok';
}

export function getLatestPrescriptionPulverizationMethod(field: Models.field) {
	const latestCrop = getLatestCrop(field);
	// console.log('aqui', latestCrop);

	let pulverizationMethod: number = PulverizationMethods.NOT_AVAILABLE;
	if (latestCrop?.diagnosis[0]?.prescription[0]) pulverizationMethod = latestCrop.diagnosis[0].prescription[0].pulverization_method;

	return pulverizationMethod;
}

export function getAreaState(area: Models.area) {
	const allStates = area.field.map((field) => getFieldState(field));
	if (allStates.some((state) => state === 'hired_diagnosis_available')) return 'hired_diagnosis_available';
	if (allStates.some((state) => state === 'hired_diagnosis_unavailable')) return 'hired_diagnosis_unavailable';
	return 'not_hired';
}

export function getFieldInfestationText(field: Models.field, card: boolean) {
	const state = getFieldState(field);
	let fieldInfestationPercentage = '';
	switch (state) {
		case 'hired_diagnosis_available':
			fieldInfestationPercentage = getFieldInfestationPercentage(field).toFixed(2);
			return card ? `${fieldInfestationPercentage}%\nInfestado` : `${fieldInfestationPercentage}%`;

		case 'hired_diagnosis_unavailable':
			return 'AGUARDANDO\nDIAGNÓSTICO';
		case 'not_hired':
			return 'DIAGNÓSTICO\nNÃO CONTRATADO';
		default:
			break;
	}
}

export function getFieldProfileText(field: Models.field) {
	const state = getFieldState(field);
	let fieldInfestationPercentage = '';
	switch (state) {
		case 'hired_diagnosis_available':
			fieldInfestationPercentage = getFieldInfestationPercentage(field).toFixed(2);
			return `${fieldInfestationPercentage}%\n Infestado`;

		case 'hired_diagnosis_unavailable':
			return 'Aguardando\nDiagnóstico';
		case 'not_hired':
			return 'Diagnóstico\nNão Contratado';
		default:
			break;
	}
}

export function getFieldInfestationPercentage(field: Models.field) {
	const latestDiagnosis = getLatestDiagnosis(field)!;
	return (latestDiagnosis.affected_area_ha / field.area_ha) * 100;
}

export function getAreaAffectedAreaHA(area: Models.area) {
	if (area.field.every((field) => getLatestCrop(field)?.diagnosis.length === 0)) return null;
	const allDiagnosisAffectedArea = area.field.map((field) => {
		const latestDiagnosis = getLatestDiagnosis(field);
		if (latestDiagnosis) return latestDiagnosis.affected_area_ha;
		return 0;
	});
	// eslint-disable-next-line unicorn/no-reduce
	return allDiagnosisAffectedArea.reduce((x, y) => x + y, 0);
}

export function getAllFieldsAreaHA(area: Models.area) {
	const allFieldsAreas = area.field.map((field) => field.area_ha);
	// eslint-disable-next-line unicorn/no-reduce
	return allFieldsAreas.reduce((x, y) => x + y, 0);
}

export function getFieldAffectedAreaHA(field: Models.field) {
	const latestDiagnosis = getLatestDiagnosis(field);
	if (!latestDiagnosis) return null;
	return latestDiagnosis.affected_area_ha;
}

export const REM_SCALE = Dimensions.get('window').width / 390;

const onLaytoutTimeout = 900;
const afterScrollToEndTimeout = 900;
export function scrollToEndAndBack(ref: any, type: 'scrollview' | 'flatlist') {
	if (type === 'flatlist') {
		setTimeout(function () {
			ref.current?.scrollToEnd();
			setTimeout(function () {
				ref.current?.scrollToIndex({ animated: true, index: 0 });
			}, afterScrollToEndTimeout);
		}, onLaytoutTimeout);
	} else {
		setTimeout(function () {
			ref.current?.scrollToEnd();
			setTimeout(function () {
				ref.current?.scrollTo({ animated: true, y: 0, x: 0 });
			}, afterScrollToEndTimeout);
		}, onLaytoutTimeout);
	}
}
