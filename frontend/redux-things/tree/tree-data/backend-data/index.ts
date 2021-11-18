import { createReducer } from '../../tree-building-helpers';
import { State, Actions } from './state-and-actions';
export { State, Actions } from './state-and-actions';

const reducer = createReducer<State, Actions>(
	{
		user: null,
		companies: null,
		terms: null,
		quotationPackages: null,
		quotationCheckoutGroups: null,
		privacyPolicy: null,
		plagues: null,
	},
	{
		BACKEND_DATA_RECEIVED__USER(prevState, action) {
			return {
				...prevState,
				user: action.user,
			};
		},
		BACKEND_DATA_RECEIVED__COMPANIES(prevState, action) {
			return {
				...prevState,
				companies: action.companies,
			};
		},
		BACKEND_DATA_RECEIVED__TERMS_AND_CONDITIONS(prevState, action) {
			return {
				...prevState,
				terms: action.terms,
			};
		},
		BACKEND_DATA__POSTED_NEW_USER_ACCEPTED_TERMS_AND_CONDITIONS(prevState, action) {
			if (!prevState.user) return prevState;

			// TODO dispatch this action automatically whenever an equivalent POST request is made (use a saga for this)
			return {
				...prevState,
				user: {
					...prevState.user,
					user_accepted_terms: [...prevState.user.user_accepted_terms, action.acceptedTerms],
				},
			};
		},
		BACKEND_DATA_RECEIVED__PRIVACY_POLICY(prevState, action) {
			return {
				...prevState,
				privacyPolicy: action.privacyPolicy,
			};
		},
		BACKEND_DATA_RECEIVED__PLAGUES(prevState, action) {
			return {
				...prevState,
				plagues: action.plagues,
			};
		},
		BACKEND_DATA__POSTED_NEW_USER_ACCEPTED_PRIVACY_POLICY(prevState, action) {
			if (!prevState.user) return prevState;

			// TODO dispatch this action automatically whenever an equivalent POST request is made (use a saga for this)
			return {
				...prevState,
				user: {
					...prevState.user,
					user_accepted_privacy_policy: [...prevState.user.user_accepted_privacy_policy, action.acceptedPrivacyPolicy],
				},
			};
		},
		BACKEND_DATA_RECEIVED__QUOTATION_PACKAGES(prevState, action) {
			return {
				...prevState,
				quotationPackages: action.packages,
			};
		},
		BACKEND_DATA__POSTED_NEW_QUOTATION_PACKAGE(prevState, action) {
			// TODO dispatch this action automatically whenever an equivalent POST request is made (use a saga for this)
			return {
				...prevState,
				quotationPackages: [...prevState.quotationPackages!, action.package],
			};
		},
		BACKEND_DATA_RECEIVED__CHECKOUT_GROUPS(prevState, action) {
			return {
				...prevState,
				quotationCheckoutGroups: action.groups,
			};
		},
		BACKEND_DATA__POSTED_NEW_CHECKOUT_GROUP(prevState, action) {
			// TODO dispatch this action automatically whenever an equivalent POST request is made (use a saga for this)
			return {
				...prevState,
				quotationCheckoutGroups: [...prevState.quotationCheckoutGroups!, action.group],
			};
		},
		BACKEND_DATA__NEW_PUSH_NOTIFICATION(prevState, action) {
			if (!prevState.user) return prevState;

			return {
				...prevState,
				user: {
					...prevState.user,
					notification: [...prevState.user.notification, action.notification],
				},
			};
		},
	},
);

export default reducer;
