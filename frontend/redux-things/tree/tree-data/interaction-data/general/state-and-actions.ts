import { Models, VegetationIndex } from '../../../../../models';
import { BuildActionSpec } from '../../../tree-building-helpers';

type GeneralCurrentTab = 'Overview' | 'Diagnosis' | 'Indices';
type GeneralCurrentCard = 'Fields' | 'Details' | 'Profile';

export type State = {
	currentTab: GeneralCurrentTab;
	currentCard: GeneralCurrentCard;
	currentArea: Models.area | undefined;
	currentField: Models.field | undefined;
	selectedFields: Set<Models.field>;
	servicesPulverization: boolean;
	indicesCurrentTab: VegetationIndex;
	indicesCurrentDate: string | undefined;
};

export type Actions = BuildActionSpec<
	[
		{
			type: 'CHANGE_AREA';
			area: Models.area | undefined;
		},
		{
			type: 'CHANGE_FIELD';
			field: Models.field | undefined;
		},
		{
			type: 'CHANGE_GENERAL_CARD';
			card: GeneralCurrentCard;
		},
		{
			type: 'CHANGE_GENERAL_TAB';
			tab: GeneralCurrentTab;
		},
		{
			type: 'CHANGE_SELECTED_FIELDS';
			selectedFields: Set<Models.field>;
		},
		{
			type: 'SET_SERVICES_PULVERIZATION';
			state: boolean;
		},
		{
			type: 'CHANGE_INDICES_TAB';
			tab: VegetationIndex;
		},
		{
			type: 'CHANGE_INDICES_DATE';
			indexDate: string | undefined;
		},
	]
>;
