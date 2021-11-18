export { AllFields } from './all-fields/all-fields';
import { OverviewDetails } from './overview-details/overview-details';
export { OverviewDetails } from './overview-details/overview-details';
import { OverviewFieldProfile } from './overview-field-profile/overview-field-profile';
export { OverviewFieldProfile } from './overview-field-profile/overview-field-profile';
import { DiagnosisDetails } from './diagnosis-details/diagnosis-details';
export { DiagnosisDetails } from './diagnosis-details/diagnosis-details';
import { DiagnosisFieldProfile } from './diagnosis-field-profile/diagnosis-field-profile';
export { DiagnosisFieldProfile } from './diagnosis-field-profile/diagnosis-field-profile';

export type BottomComponent = typeof OverviewDetails | typeof OverviewFieldProfile | typeof DiagnosisDetails | typeof DiagnosisFieldProfile;
