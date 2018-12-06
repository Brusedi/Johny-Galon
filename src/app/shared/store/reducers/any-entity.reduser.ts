import { EntityState, createEntityAdapter, EntityAdapter } from "@ngrx/entity";
import { FieldDescribe } from "@appModels/metadata";
import { anyEntityActions, AnyEntityActionTypes } from "@appStore/actions/any-entity.actions";

//import { anyEntityLazyActions, AnyEntityLazyActionTypes } from "@appStore/actions/any-entity-lazy.actions";


export interface AnyEntytyState<T> extends EntityState<T> {
    loaded: boolean;
    loading: boolean;
    metaLoaded: boolean;
    metaLoading: boolean;
    metadata:{[key: string]:FieldDescribe}
    error: any;
}

export const initialSubState = {
    loaded: false,
    loading: false,
    metaLoaded: false,
    metaLoading: false,
    metadata:{},
    error: null,

}

export function adapter<T>(){ return  createEntityAdapter<T>() }

export function anyEntytyinitialState<T>(){
    return  adapter<T>().getInitialState(initialSubState) ;
};

export function anyEntityLazySelectors<T>(){ return adapter<T>().getSelectors()};

/// From selfunction reduser && initstate 
export function initStateFromSelFoo<T>( selFoo: ((T) => any) ){ 
    return initStateFromAdapter( createEntityAdapter<T>({selectId:selFoo}))
} 
export function reducerFromSelFoo<T>( selFoo: ((T) => any) ){ 
    return reducerFromAdapter( createEntityAdapter<T>({selectId:selFoo}))
} 

export function selectorsFromSelFoo<T>( selFoo: ((T) => any) ){
    return createEntityAdapter<T>({selectId:selFoo}).getSelectors()
} 

/// From adapter reduser && initstate 
export function initStateFromAdapter( adapter: EntityAdapter<any> ){
    return adapter.getInitialState(initialSubState) ;
} 

export function reducerFromAdapter( adapt: EntityAdapter<any>){

    function reducer(state = initStateFromAdapter(adapt), action: anyEntityActions): AnyEntytyState<any>{
        const removeIfExit = (x:any[], v:any ) => x.indexOf(v) > 0 ? x.slice( x.indexOf(v), 1): x ; 
        //console.log(state)
        //console.log(action)
        switch (action.type) {
            case AnyEntityActionTypes.GET_ITEMS:
                return { ...state, loading: true };    

            case AnyEntityActionTypes.GET_ITEMS_SUCCESS:{
                //console.log(state);
                var s =
                    adapt.addMany( 
                        action.payload,
                        { ...state , loaded: false, loading: true }
                    );  
                return s;        
            }
                
            case AnyEntityActionTypes.EROR_ANY_ENTITY:
                return { ...state, loaded: false, loading: false, error:  action.payload};            
                
            default:
                return state;
        }
    }

    return reducer;
}
