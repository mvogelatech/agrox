import React from 'react';
import { Models } from '../../models';
import { FieldCard } from '../00-common/field-card';

type detailsFieldCardProps = {
	field: Models.field;
	isSelected: boolean;
	onFieldPress: () => void;
};

export function DetailsFieldCard(props: detailsFieldCardProps) {
	return (
		<FieldCard
			isElevated
			isDiagnosisMode
			isIndexNotAvailable
			customStyle={
				props.isSelected
					? { marginTop: '2rem', marginBottom: '10rem', borderWidth: '3rem', borderColor: '#469BA2' }
					: { marginTop: '2rem', marginBottom: '10rem', borderWidth: '3rem', borderColor: 'white' }
			}
			field={props.field}
			onFieldPress={props.onFieldPress}
		/>
	);
}
