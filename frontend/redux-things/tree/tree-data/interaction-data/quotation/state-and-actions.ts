import { BuildActionSpec } from '../../../tree-building-helpers';

type QuotationCurrentTab = 'Preparing' | 'Available';

export type State = {
	currentTab: QuotationCurrentTab;
};

export type Actions = BuildActionSpec<
	[
		{
			type: 'CHANGE_QUOTATION_TAB';
			tab: QuotationCurrentTab;
		},
	]
>;
