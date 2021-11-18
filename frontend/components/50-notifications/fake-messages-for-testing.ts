import { Models } from '../../models';

let nextFakeId = 10000;

export function makeDummyMessageNotification(): Models.notification {
	return {
		id: nextFakeId++,
		user_id: 1,
		type: 5,
		body: {
			title: 'Hello ' + Math.random(), // eslint-disable-line @typescript-eslint/restrict-plus-operands
			message: 'World' + Math.random(), // eslint-disable-line @typescript-eslint/restrict-plus-operands
			genericId: Math.random(),
			genericIdEntity: 'area',
			link: 'http://google.com',
		},
		sent_date: new Date().toISOString(),
		delivered_date: null,
		read_date: null,
	};
}

export function makeDummyQuotationReadyNotification(): Models.notification {
	const dummy = makeDummyMessageNotification();
	dummy.type = 1;
	dummy.body.quotationId = 1;
	return dummy;
}
