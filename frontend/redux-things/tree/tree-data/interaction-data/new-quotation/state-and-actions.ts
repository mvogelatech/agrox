import { BuildActionSpec } from '../../../tree-building-helpers';

export type State = {
	pulverizationStartDate: Date | undefined;
	pulverizationEndDate: Date | undefined;
	fieldsWithMethods: Map<number, number | undefined> | undefined;
};

export type Actions = BuildActionSpec<
	[
		{
			type: 'CHANGE_START_DATE';
			pulverizationStartDate: Date;
		},
		{
			type: 'CHANGE_END_DATE';
			pulverizationEndDate: Date;
		},
		{
			type: 'CHANGE_FIELD_WITH_METHODS';
			fieldsWithMethods: Map<number, number | undefined>;
		},
	]
>;
