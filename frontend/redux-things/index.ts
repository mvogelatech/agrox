import { store, sagaMiddleware } from './store';

import { getRootSaga } from './sagas';

export { State as MainState } from './tree';
export { store, persistor } from './store';

export * from './utils';

sagaMiddleware.run(getRootSaga(store.getState.bind(store)));
