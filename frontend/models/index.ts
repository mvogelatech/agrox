import type { JsonValue } from 'type-fest';
import { Opaque } from 'type-fest';

type RESERVED_TYPE = Opaque<0, 'RESERVED_TYPE'>;
type DRONE_TYPE = Opaque<1, 'DRONE_TYPE'>;
type PLANE_TYPE = Opaque<2, 'PLANE_TYPE'>;
type TRACTOR_TYPE = Opaque<3, 'TRACTOR_TYPE'>;
type NOT_AVAILABLE_TYPE = Opaque<4, 'NOT_AVAILABLE'>;

export const PulverizationMethods = {
	RESERVED: 0 as RESERVED_TYPE,
	DRONE: 1 as DRONE_TYPE,
	PLANE: 2 as PLANE_TYPE,
	TRACTOR: 3 as TRACTOR_TYPE,
	NOT_AVAILABLE: 4 as NOT_AVAILABLE_TYPE, // due to some error or if the recommendation is missing
};

export type PulverizationMethod = RESERVED_TYPE | DRONE_TYPE | PLANE_TYPE | TRACTOR_TYPE | NOT_AVAILABLE_TYPE;

export type PaymentMethod = 'antecipated_price' | 'cash_price' | 'delayed_price' | undefined;

export const RoleTypeFarmManager = 'farm_manager';

export const RoleTypeFarmUser = 'farm_user';

export type VegetationIndexName = 'savi' | 'ndwi' | 'ndvi' | 'ndre' | 'land_cover' | 'greenness' | 'fcover' | 'true_color' | 'false_color';

export type Index = {
	name: VegetationIndexName;
	text: string;
	description: string;
};

export const NDVI: Index = {
	name: 'ndvi',
	text: 'Vigor',
	description: `NDVI - Índice de vegetação que traz uma visão do vigor do plantio em sua superfície (na copa das plantas), demonstrando o quão bem e adequadamente a lavoura esta realizando o seu processo de fotossíntese.`,
};

export const NDWI: Index = {
	name: 'ndwi',
	text: 'Hidratação',
	description: `NDWI - Índice que reflete uma visão da quantidade de água na copa das plantas da lavoura, demonstrando o quão bem e adequadamente a lavoura esta em relação ao conteúdo de água foliar.`,
};

export const SAVI: Index = {
	name: 'savi',
	text: 'SAVI',
	description: `SAVI - Índice de vegetação que traz uma visão do vigor do plantio em sua superfície (na copa das plantas), demonstrando o quão bem e adequadamente a lavoura esta realizando o seu processo de fotossíntese. Este índice também executa correções de possíveis variações por conta de diferentes espaçamentos do plantio.`,
};

export const fCover: Index = {
	name: 'fcover',
	text: 'fCover',
	description: `FCOVER - Índice que esta relacionado ao quão densa esta a superfície da lavoura em relação ao fechamento das folhas da planta. Indica o quão densa, lisa e homogênea esta a superfície da lavoura.`,
};

export const NDRE: Index = {
	name: 'ndre',
	text: 'Fotossíntese',
	description: `NDRE - Índice que gera indicações do estado fenológico da planta, quando ela passa de um estado de alta atividade foto-sintética para um estado de senescência, ou seja, este índice traz uma visão de maior ou menor massa verde na altura média do cultivo (para cana-de açúcar)`,
};

export const LandCover: Index = {
	name: 'land_cover',
	text: 'Land Cover',
	description: `.`,
};

export const Greenness: Index = {
	name: 'greenness',
	text: 'Nitrogênio',
	description: `GREENNESS - Índice que reflete uma visão da quantidade de Nitrogênio na copa das plantas da lavoura, demonstrando o quão bem e adequadamente a lavoura esta em relação ao conteúdo de Nitrogênio foliar.`,
};

export const TrueColor: Index = {
	name: 'true_color',
	text: 'True Color',
	description: `TRUE COLOR - Esta imagem traz a visão sinótica da área, ou seja, é um retrato/foto aérea normal das lavouras.`,
};

export const FalseColor: Index = {
	name: 'false_color',
	text: 'False Color',
	description: `FALSE COLOR - Esta imagem traz uma visão melhorada e ampliada das condições internas das lavouras, permitindo enxergar melhor as variações da superfície das áreas com a conversão das imgaens em variações e tons de vermelho.`,
};

export type VegetationIndex =
	| typeof SAVI
	| typeof NDVI
	| typeof NDWI
	| typeof NDRE
	| typeof LandCover
	| typeof Greenness
	| typeof fCover
	| typeof TrueColor
	| typeof FalseColor;

export const EmptyPrescription: Models.GeneralPrescription = {
	products: [
		{
			product: '------',
			dosage: 0,
			syrup: 0,
			buffer: 0,
			nozzle_type: 0,
			drop_size: 0,
			total: 0,
			pressure: 0,
			unity: '',
			plague: '------',
		},
	],
	comments: [''],
};

export declare namespace Models {
	export type address = {
		id: number;
		street: string;
		city: string;
		number: number | null;
		km: number | null;
		postal_code: string | null;
		complement: string | null;
		neighborhood: string | null;
		phone_number: string | null;
		contact_name: string | null;
		state_id: number;
		state: state;
	};

	export type user = {
		id: number;
		first_name: string;
		last_name: string;
		username: string;
		password: string;
		cpf: string | null;
		phone_number: string;
		email: string;
		active: boolean;
		creation_date: Date;
		access_date: Date;
		update_date: Date;
		yellow_threshold: number;
		red_threshold: number;
		fcm_token: string | null;
		user_role: user_role[];
		user_accepted_terms: user_accepted_terms[];
		user_accepted_privacy_policy: user_accepted_privacy_policy[];
		notification: notification[];
		many_user_has_many_farm: many_user_has_many_farm[];
	};

	export type role = {
		id: number;
		name: string | null;
	};

	export type user_role = {
		id: number;
		role_id: number;
		user_id: number;
		role: role;
	};

	export type many_user_has_many_farm = {
		user_id: number;
		farm_id: number;
		farm: farm;
	};

	export type terms_and_conditions = {
		id: number;
		content: string;
		publish_date: string;
	};

	export type user_accepted_terms = {
		id: number;
		accepted_date: string;
		id_user: number;
		id_terms_and_conditions: number;
	};

	export type privacy_policy = {
		id: number;
		content: string;
		publish_date: string;
	};

	export type user_accepted_privacy_policy = {
		id: number;
		accepted_date: string;
		id_user: number;
		id_privacy_policy: number;
	};

	export type area = {
		id: number;
		code: number;
		lat: number;
		long: number;
		coordinates: Array<[number, number]> | null;
		name: string;
		state_initials: string | null;
		city: string | null;
		farm_id: number;
		// farm
		field: field[];
	};

	export type company = {
		id: number;
		name: string;
		works_with_drone: boolean;
		works_with_plane: boolean;
		works_with_tractor: boolean;
		lat: number;
		long: number;
		address_id: number;
		address: address;
		quotation: quotation[];
	};

	export type crop = {
		id: number;
		crop_type: string;
		variety: string;
		sowing_date: string;
		expected_harvest_date: string;
		number: number | null;
		is_diagnosis_hired: boolean;
		field_id: number;
		// field
		diagnosis: diagnosis[];
	};

	export type diagnosis = {
		id: number;
		report_date: string;
		affected_area_ha: number;
		crop_id: number;
		infestation: infestation[];
		prescription: prescription[];
	};

	export type prescription = {
		id: number;
		date: string;
		content: PrescriptionContent;
		pulverization_method: number;
		diagnosis_id: number;
		author: string | null;
		phone_number: string | null;
	};

	export type recommended_method = {
		recommended_method: [];
	};

	export type infestation = {
		id: number;
		area_ha: number;
		points: InfestationPoints[];
		diagnosis_id: number;
		plague_id: number;
		plague: plague;
	};

	export type plague = {
		id: number;
		name: string;
		display_name: string;
		color: string;
		in_use: boolean;
		relevance_order: number;
	};

	export type farm = {
		id: number;
		cnpj: string | null;
		social_name: string | null;
		fantasy_name: string;
		lat: number;
		long: number;
		address_id: number;
		address: address;
		area: area[];
		imaging: imaging[];
		// producer
	};

	export type imaging = {
		id: number;
		directory: string;
		processing_timestamp: Date;
		imaging_date: Date;
		farm_id: number | null;
	};

	export type field = {
		id: number;
		code: number;
		area_ha: number;
		lat: number;
		long: number;
		coordinates: Array<[number, number]>;
		name: string;
		image_uri: string | null;
		area_id: number;
		last_crop_id: number | null;
		area: area;
		crop: crop[];
		visiona: VisionaObservation[] | null;
	};

	export type quotation = {
		id: number;
		response_date: string | null;
		expiration_date: string;
		antecipated_price: number | null;
		cash_price: number | null;
		delayed_price: number | null;
		company_id: number;
		quotation_modal_package_id: number;
		company: company;
		quotation_modal_package: quotation_modal_package;
		quotation_checkout: quotation_checkout | null;
	};

	export type quotation_checkout = {
		id: number;
		checkout_date: string;
		selected_price: number;
		quotation_id: number;
		quotation: quotation | null;
	};

	export type quotation_checkout_group = [quotation_checkout] | [quotation_checkout, quotation_checkout];

	export type quotation_modal_package = {
		id: number;
		pulverization_method: PulverizationMethod;
		quotation_package_id: number;
		quotation_package: quotation_package;
		field: field[];
		quotation: quotation[];
	};

	export type quotation_package = {
		id: number;
		code: number;
		request_date: string;
		pulverization_start_date: string;
		pulverization_end_date: string;
		quotation_modal_package: quotation_modal_package[];
	};

	export type state = {
		id: number;
		initials: string;
		name: string;
		ibge_code: number | null;
		country_code: number | null;
		area_code: JsonValue | null;
		// address
	};

	export type notification = {
		id: number;
		type: number;
		body: {
			[key: string]: JsonValue;
			title: string;
			message: string;
			genericId: number;
			genericIdEntity: string;
			link: string | null;
		};
		sent_date: string;
		read_date: string | null;
		delivered_date: string | null;
		user_id: number;
	};

	type PrescriptionDosage = {
		product: string;
		dosage: number;
		syrup: number;
		buffer: number;
		nozzle_type: number;
		drop_size: number;
		total: number;
		pressure: number;
		unity: string;
		plague: string;
	};

	type GeneralPrescription = {
		products: PrescriptionDosage[];
		comments: string[];
	};

	type PrescriptionContent = {
		drone: GeneralPrescription;
		plane: GeneralPrescription;
		terrestrial: GeneralPrescription;
		recommended_method: [];
		diagnosis_id: number;
	};

	export type Coordinate = {
		latitude: number;
		longitude: number;
	};

	type InfestationPoints = {
		center: Coordinate;
		coordinates: Coordinate[];
	};

	// VISIONA API Data structure

	type VisionaObservation = {
		id: string;
		date: string;
		stats: {
			indice: {
				savi?: {
					browseUrl: string;
				};
				ndwi?: {
					browseUrl: string;
				};
				ndvi?: {
					browseUrl: string;
				};
				ndre?: {
					browseUrl: string;
				};
				land_cover?: {
					browseUrl: string;
				};
				greenness?: {
					browseUrl: string;
				};
				fcover?: {
					browseUrl: string;
				};
				true_color?: {
					browseUrl: string;
				};
				false_color?: {
					browseUrl: string;
				};
			};
		};
	};
}
