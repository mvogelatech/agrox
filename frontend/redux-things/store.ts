import { createStore, applyMiddleware, Store } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { persistStore } from 'redux-persist';

import { rootReducerWithPersist } from './root-structure';

const middlewares = [];

if (__DEV__) {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const { createLogger } = require('./custom-logger-middleware');
	middlewares.push(createLogger({ detailed: false }));
}

export const sagaMiddleware = createSagaMiddleware();

middlewares.push(sagaMiddleware);

export const store = createStore(rootReducerWithPersist, applyMiddleware(...middlewares));

export const persistor = persistStore((store as unknown) as Store);
