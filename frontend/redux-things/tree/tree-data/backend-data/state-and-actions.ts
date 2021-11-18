import { Models } from '../../../../models';
import { BuildActionSpec } from '../../tree-building-helpers';

export type State = {
	quotationPackages: Models.quotation_package[] | null;
	quotationCheckoutGroups: Models.quotation_checkout_group[] | null;
	user: Models.user | null;
	companies: Models.company[] | null;
	terms: Models.terms_and_conditions[] | null;
	privacyPolicy: Models.privacy_policy[] | null;
	plagues: Models.plague[] | null;
};

export type Actions = BuildActionSpec<
	[
		{
			type: 'BACKEND_DATA_RECEIVED__USER';
			user: Models.user;
		},
		{
			type: 'BACKEND_DATA_RECEIVED__COMPANIES';
			companies: Models.company[];
		},
		{
			type: 'BACKEND_DATA_RECEIVED__TERMS_AND_CONDITIONS';
			terms: Models.terms_and_conditions[];
		},
		{
			type: 'BACKEND_DATA__POSTED_NEW_USER_ACCEPTED_TERMS_AND_CONDITIONS';
			acceptedTerms: Models.user_accepted_terms;
		},
		{
			type: 'BACKEND_DATA_RECEIVED__PRIVACY_POLICY';
			privacyPolicy: Models.privacy_policy[];
		},
		{
			type: 'BACKEND_DATA_RECEIVED__PLAGUES';
			plagues: Models.plague[];
		},
		{
			type: 'BACKEND_DATA__POSTED_NEW_USER_ACCEPTED_PRIVACY_POLICY';
			acceptedPrivacyPolicy: Models.user_accepted_privacy_policy;
		},
		{
			type: 'BACKEND_DATA_RECEIVED__QUOTATION_PACKAGES';
			packages: Models.quotation_package[];
		},
		{
			type: 'BACKEND_DATA__POSTED_NEW_QUOTATION_PACKAGE';
			package: Models.quotation_package;
		},
		{
			type: 'BACKEND_DATA_RECEIVED__CHECKOUT_GROUPS';
			groups: Models.quotation_checkout_group[];
		},
		{
			type: 'BACKEND_DATA__POSTED_NEW_CHECKOUT_GROUP';
			group: Models.quotation_checkout_group;
		},
		{
			type: 'BACKEND_DATA__NEW_PUSH_NOTIFICATION';
			notification: Models.notification;
		},
	]
>;
