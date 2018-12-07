import { ActionReducerMap }         from '@ngrx/store';
import * as fromReducers            from './reducers';
import { anyEntytyLazySetEffects }      from './effects/any-entity-lazy-set.effects';
import { RouterReducerState, routerReducer }       from '@ngrx/router-store';
//import { RouterStateUrl }           from './router';
import { RouterEffects }            from './effects/router.effects';
import { RouterStateUrl }           from './router';
import { anyEntytySetEffects } from './effects/any-entity-set.effects';


export interface State {
    data:fromReducers.anyEntitySet.State;
    references:fromReducers.anyEntityLazySet.State; 
    router: RouterReducerState<RouterStateUrl>;
}
  
export const reducers: ActionReducerMap<State> = {
    data:fromReducers.anyEntitySet.reducer,
    references:fromReducers.anyEntityLazySet.reducer ,
    router: routerReducer
};
  

export const effects = [ anyEntytySetEffects , anyEntytyLazySetEffects,RouterEffects];