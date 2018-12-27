import { EntityState, createEntityAdapter, EntityAdapter } from "@ngrx/entity";

import { anyEntityLazyActions, AnyEntityLazyActionTypes } from "@appStore/actions/any-entity-lazy.actions";


export interface AnyEntytyLazyState<T> extends EntityState<T> {
    loaded: boolean;
    loading: boolean;
    error: any;
    notExistKeys:any[];
}

//export const adapter: EntityAdapter<AnyEntity> = createEntityAdapter<AnyEntity>();
// export const anyEntytyinitialState : AnyEntytyState = adapter.getInitialState({
//     loaded: false,
//     loading: false,
//     error: null,
//     notExistKeys: []  
//   });

export const initialSubState = {
    loaded: false,
    loading: false,
    error: null,
    notExistKeys: [] 
}

export function adapter<T>(){ return  createEntityAdapter<T>() }

export function anyEntytyinitialState<T>(){
    return  adapter<T>().getInitialState(initialSubState) ;
};

export function anyEntityLazySelectors<T>(){ return adapter<T>().getSelectors()};

/// From selfunction reduser && initstate 
export function initStateFromSelFoo<T>( selFoo: ((x:T) => any) ){ 
    return initStateFromAdapter( createEntityAdapter<T>({selectId:selFoo}))
} 
export function reducerFromSelFoo<T>( selFoo: ((x:T) => any) ){ 
    return reducerFromAdapter( createEntityAdapter<T>({selectId:selFoo}))
} 

export function selectorsFromSelFoo<T>( selFoo: ((x:T) => any) ){
    return createEntityAdapter<T>({selectId:selFoo}).getSelectors()
} 

/// From adapter reduser && initstate 
export function initStateFromAdapter( adapter: EntityAdapter<any> ){
    return adapter.getInitialState(initialSubState) ;
} 

export function reducerFromAdapter( adapt: EntityAdapter<any>){

    function reducer(state = initStateFromAdapter(adapt), action: anyEntityLazyActions): AnyEntytyLazyState<any>{
        const removeIfExit = (x:any[], v:any ) => x.indexOf(v) > 0 ? x.slice( x.indexOf(v), 1): x ; 
        //console.log(state)
        //console.log(action)
        switch (action.type) {
            case AnyEntityLazyActionTypes.GET_ITEM:
                return { ...state, loading: true };    

            case AnyEntityLazyActionTypes.GET_ITEM_SUCCESS:{
                //console.log(state);
                var s =
                    adapt.addOne( 
                        action.payload,
                        { ...state , loaded: false, loading: true, notExistKeys: removeIfExit(state.notExistKeys, action.payload ) }
                    );  

                //console.log(s);
                return s;        
            }
                
            case AnyEntityLazyActionTypes.GET_ITEM_NOT_FOUND:
                return adapt.removeOne(
                    action.payload,
                    { ...state , loaded: false, loading: true, notExistKeys: [  ...state.notExistKeys , action.payload ] }
                );  

                
            case AnyEntityLazyActionTypes.EROR_ANY_ENTITY:
                return { ...state, loaded: false, loading: false, error:  action.payload};            
                
            default:
                return state;
        }
    }

    return reducer;
}

// export function reducer<T>(state = anyEntytyinitialState<T>(), action: anyEntityLazyActions): AnyEntytyState<T> {
//     const removeIfExit = (x:any[], v:any ) => x.indexOf(v) > 0 ? x.slice( x.indexOf(v), 1): x ; 
//     console.log(state)
//     console.log(action)
//     switch (action.type) {
//         case AnyEntityLazyActionTypes.GET_ITEM:
//             return { ...state, loading: true };    
            
//         case AnyEntityLazyActionTypes.GET_ITEM_SUCCESS:{
        

//         var s =
//             adapter<T>().addOne(
//                 action.payload,
//                 { ...state , loaded: false, loading: true, notExistKeys: removeIfExit(state.notExistKeys, action.payload ) }
//             );  

//             console.log(s);
//             return s;        
//         }
            
//         case AnyEntityLazyActionTypes.GET_ITEM_NOT_FOUND:
//             return adapter<T>().removeOne(
//                 action.payload,
//                 { ...state , loaded: false, loading: true, notExistKeys: [  ...state.notExistKeys , action.payload ] }
//             );  

            
//         case AnyEntityLazyActionTypes.EROR_ANY_ENTITY:
//             return { ...state, loaded: false, loading: false, error:  action.payload};            
            
//         default:
//             return state;
//     }
// }

 

 