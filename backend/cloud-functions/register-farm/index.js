/* eslint-disable dot-notation */

'use strict';

const Storage = require('@google-cloud/storage');
const XLSX = require('xlsx');
const { maskBr, validateBr } = require('js-brasil');
const path = require('path');
const axios = require('axios');

const BACKEND_URL_TEXT = 'http://localhost:8080';
// const BACKEND_URL_TEXT = process.env.BACKEND_URL;

const ACCESS_TOKEN_FOR_AGROEXPLORE_DEVS = 'X9y48UWfeE0,JZ7%bX}GI{vo.[&k!H-k8]uet8;X';

// this function is activated when a file is created in the farm-registration bucket,
// it expects an excel file with the farm/area/field/crops/users data
async function registerFarm(event, context) {
	console.log(context);
	const gcsEvent = event;
	const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: '2-digit', day: '2-digit' });
	const [{ value: month }, , { value: day }, , { value: year }] = dateTimeFormat.formatToParts(new Date());
	const storage = new Storage.Storage();
	const gcsFile = storage.bucket(gcsEvent.bucket).file(gcsEvent.name);
	const fileExt = path.extname(gcsEvent.name);

	if (fileExt.toLocaleLowerCase() === '.xls' || fileExt.toLocaleLowerCase() === '.xlsx') {
		// process only excel files
		try {
			if (BACKEND_URL_TEXT === '') {
				throw new Error(`Missing enviroment variables values. BACKEND_URL: ${BACKEND_URL_TEXT}`);
			}

			console.log(`Processing file: ${gcsEvent.name}`);

			// Download the file from Gcloud storage bucket (diagnosis_inbox) and read it in memory
			const [excelFileContent] = await gcsFile.download();

			const data = new Uint8Array(excelFileContent);
			const workbook = XLSX.read(data, { type: 'array' });

			const sheetFarm = workbook.Sheets['Fazenda'];
			const farmAddressData = await parseFarm(sheetFarm);

			const sheetFields = workbook.Sheets['Talhões'];
			const fieldArray = await parseFields(sheetFields);

			const sheetUsers = workbook.Sheets['Usuarios'];
			const userArray = await parseUsers(sheetUsers);

			// request the backend to insert farm data into database
			// insert field data extracted from map into the db, the return is used to form a path to upload shapefile data
			const dataText = {
				accessToken: ACCESS_TOKEN_FOR_AGROEXPLORE_DEVS,
				farmData: farmAddressData.farmData,
				addressData: farmAddressData.addressData,
				userListData: userArray,
				areaFieldCropListData: fieldArray,
			};

			const config = {
				method: 'post',
				url: `${BACKEND_URL_TEXT}/farm/register-farm`,
				headers: {
					'Content-Type': 'application/json',
				},
				data: dataText,
			};

			const response = await axios(config);
			console.log(response.status);
		} catch (error) {
			const message = `Register Farm cloud function failed: ${error.message}`;
			console.log(message);
			console.log(error);

			// create a new logfile in the error bucket;
			const logFileContent = JSON.stringify(error.stack);
			const logFile = storage.bucket(gcsEvent.bucket).file(`error-${year}-${month}-${day}/${path.basename(gcsEvent.name)}.log`);
			await logFile.save(logFileContent);
		}
	}
}

async function parseFarm(sheet) {
	const [jsonData] = XLSX.utils.sheet_to_json(sheet);

	// Razão Social - Nome Fantasia - CNPJ - Rua - Número - KM - CEP - Complemento - Bairro - Telefone - Nome de Contato - Cidade - Estado - Latitude - Longitude
	// console.log(jsonData['Razão Social']);
	// console.log(jsonData['Nome Fantasia']);

	jsonData.CNPJ = maskBr.cnpj(jsonData.CNPJ);
	// console.log(jsonData.CNPJ);

	// console.log(jsonData.Rua);

	let numb = Number.parseInt(jsonData['Número'], 10);
	if (!numb) numb = 0;
	// console.log(jsonData['Número']);

	let kmNumber = Number.parseInt(jsonData.KM, 10);
	if (!kmNumber) kmNumber = 0;
	// console.log(jsonData.KM);

	jsonData.CEP = maskBr.cep(jsonData.CEP);
	// console.log(jsonData.CEP);

	// console.log(jsonData.Complemento);
	// console.log(jsonData.Bairro);

	jsonData.Telefone = maskBr.telefone(jsonData.Telefone);
	// console.log(jsonData.Telefone);

	// console.log(jsonData['Nome de Contato']);
	// console.log(jsonData.Cidade);
	// console.log(jsonData.Estado);

	let latitude = Number.parseFloat(jsonData.Latitude);
	if (!latitude) latitude = 0;
	// console.log(jsonData.Latitude);

	let longitude = Number.parseFloat(jsonData.Longitude);
	if (!longitude) longitude = 0;
	// console.log(jsonData.Longitude);

	const farmData = {
		cnpj: jsonData.CNPJ,
		socialName: jsonData['Razão Social'],
		fantasyName: jsonData['Nome Fantasia'],
		lat: latitude,
		long: longitude,
	};

	const addressData = {
		street: jsonData.Rua,
		city: jsonData.Cidade,
		number: numb,
		km: kmNumber,
		postalCode: jsonData.CEP,
		complement: jsonData.Complemento,
		neighborhood: jsonData.Bairro,
		phoneNumber: jsonData.Telefone,
		contactName: jsonData['Nome de Contato'],
		stateInitials: jsonData.Estado,
	};
	return { farmData, addressData };
}

async function parseFields(sheet) {
	const jsonDataArray = XLSX.utils.sheet_to_json(sheet);
	const newArray = [];
	let it = 1; // used as a code backup (plain sequence number)
	for (const jsonData of jsonDataArray) {
		// Código Talhão - Nome Talhão - Latitude - Longitude - Plantio - Variedade - Data de Plantio - Data de Colheita - Corte - Código Área - Nome Área - Cidade - Estado
		let codField = Number.parseInt(jsonData['Código Talhão'], 10);
		if (!codField) codField = it;
		// console.log(jsonData['Código Talhão']);

		// console.log(jsonData['Nome Talhão']);

		let latitude = Number.parseFloat(jsonData.Latitude);
		if (!latitude) latitude = 0;
		// console.log(jsonData.Latitude);

		let longitude = Number.parseFloat(jsonData.Longitude);
		if (!longitude) longitude = 0;
		// console.log(jsonData.Longitude);

		if (jsonData.Plantio === '') {
			jsonData.Plantio = 'N/A';
		}
		// console.log(jsonData.Plantio);

		if (jsonData.Variedade === '') {
			jsonData.Variedade = 'N/A';
		}
		// console.log(jsonData.Variedade);

		jsonData['Data de Plantio'] = maskBr.data(jsonData['Data de Plantio']);
		if (!validateBr.data(jsonData['Data de Plantio'])) {
			jsonData['Data de Plantio'] = '01/01/1900';
		}
		// console.log(jsonData['Data de Plantio']);

		jsonData['Data de Colheita'] = maskBr.data(jsonData['Data de Colheita']);
		if (!validateBr.data(jsonData['Data de Colheita'])) {
			jsonData['Data de Colheita'] = '01/01/1900';
		}
		// console.log(jsonData['Data de Colheita']);

		let cutNumber = Number.parseInt(jsonData['Corte'], 10);
		if (!cutNumber) cutNumber = 0;
		// console.log(jsonData['Corte']);

		let codArea = Number.parseInt(jsonData['Código Área'], 10);
		if (!codArea) codArea = it;
		// console.log(jsonData['Código Área']);

		// console.log(jsonData['Nome Área']);

		if (!jsonData['Zona']) jsonData['Zona'] = '';
		// console.log(jsonData['Zona']);

		// console.log(jsonData['Cidade']);
		// console.log(jsonData['Estado']);

		const areaData = {
			code: codArea,
			lat: 0, // not in use
			long: 0, // not in use
			name: jsonData['Nome Área'],
			stateInitials: jsonData['Estado'],
			city: jsonData['Cidade'],
			zone: jsonData['Zona'],
		};

		const fieldData = {
			code: codField,
			areaHA: 0, // this is a not null field, but we still have no data here to know this value
			lat: latitude,
			long: longitude,
			name: jsonData['Nome Talhão'],
			coordinates: [],
		};

		const cropData = {
			cropType: jsonData.Plantio,
			variety: jsonData.Variedade,
			sowingDate: jsonData['Data de Plantio'],
			expectedHarvestDate: jsonData['Data de Colheita'],
			number: cutNumber,
		};

		it++;
		newArray.push({ areaData, fieldData, cropData });
	}

	return newArray;
}

async function parseUsers(sheet) {
	const jsonDataArray = XLSX.utils.sheet_to_json(sheet);
	const newArray = [];
	for (const jsonData of jsonDataArray) {
		// Nome - Sobrenome - CPF - Celular - Whatsapp - Email - Perfil
		// console.log(jsonData.Nome);
		// console.log(jsonData.Sobrenome);

		jsonData.CPF = maskBr.cpf(jsonData.CPF);
		// console.log(jsonData.CPF);

		jsonData['Celular'] = maskBr.telefone(jsonData['Celular']);
		// console.log(jsonData['Celular']);

		// console.log(jsonData['Whatsapp']);
		// console.log(jsonData.Email);

		let userRole = 'farm_user';
		if (jsonData['Perfil'] === 'Administrador') {
			userRole = 'farm_manager';
		}
		// console.log(jsonData['Perfil']); // administrador / visualizador

		const userData = {
			firstName: jsonData.Nome,
			lastName: jsonData.Sobrenome,
			username: jsonData['Celular'],
			// password: string;
			cpf: jsonData.CPF,
			phoneNumber: jsonData['Celular'],
			email: jsonData.Email,
			roleName: userRole,
		};

		newArray.push(userData);
	}

	return newArray;
}

module.exports = { registerFarm };

// local testing for this cloud function  'http://localhost:8080'; //
// registerFarm({ name: 'AgroexploreCadastroFazenda_Jorge_Sadala.xlsx', bucket: 'farm-registration' }, null);
// registerFarm({ name: 'AgroexploreCadastroFazenda_Júnior_Estevo.xlsx', bucket: 'farm-registration' }, null);
// registerFarm({ name: 'AgroexploreCadastroFazenda_Júlio_Martarella_Cadastro_Final.xlsx', bucket: 'farm-registration' }, null);
