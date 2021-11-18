import { BuildActionSpec } from '../../tree-building-helpers';

export type State = {
	userId: number | null;
	userToken: string | null;
};

export type Actions = BuildActionSpec<
	[
		{
			type: 'SET_AUTH_DATA_USER_TOKEN';
			userToken: string;
		},
		{
			type: 'SET_AUTH_DATA_USER_ID';
			userId: number;
		},
	]
>;
