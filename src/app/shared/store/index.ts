import { ActionReducerMap }         from '@ngrx/store';
import * as fromReducers            from './reducers';

import { RouterReducerState, routerReducer }       from '@ngrx/router-store';
//import { RouterStateUrl }           from './router';
import { RouterEffects }            from './effects/router.effects';
import { RouterStateUrl }           from './router';
import { anyEntytySetEffects }      from './effects/any-entity-set.effects';
import { EnvironmentEffects } from './effects/environment.effects';


export interface State {
    data:fromReducers.anyEntitySet.State;
    router: RouterReducerState<RouterStateUrl>;
    environment:fromReducers.environment.State;
}
  
export const reducers: ActionReducerMap<State> = {
    data:fromReducers.anyEntitySet.reducer,
    router: routerReducer,
    environment:fromReducers.environment.reducer
};
  

export const effects = [ anyEntytySetEffects ,RouterEffects, EnvironmentEffects];