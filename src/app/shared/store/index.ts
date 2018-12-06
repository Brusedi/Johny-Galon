import { ActionReducerMap }         from '@ngrx/store';
import * as fromReducers            from './reducers';
import { anyEntytySetEffects }      from './effects/any-entity-lazy-set.effects';
import { RouterReducerState, routerReducer }       from '@ngrx/router-store';
//import { RouterStateUrl }           from './router';
import { RouterEffects }            from './effects/router.effects';
import { RouterStateUrl }           from './router';


export interface State {
    references:fromReducers.anyEntityLazySet.State; 
    router: RouterReducerState<RouterStateUrl>;
}
  
export const reducers: ActionReducerMap<State> = {
    references:fromReducers.anyEntityLazySet.reducer ,
    router: routerReducer
};
  

export const effects = [ anyEntytySetEffects,RouterEffects];