import { BuildActionSpec } from '../../../tree-building-helpers';

type InfestationCurrentCard = 'General' | 'Prescription' | 'Pulverization';

export type State = {
	currentCard: InfestationCurrentCard;
};

export type Actions = BuildActionSpec<
	[
		{
			type: 'CHANGE_INFESTATION_CARD';
			card: InfestationCurrentCard;
		},
	]
>;
