import { EntityState, createEntityAdapter, EntityAdapter, Dictionary } from "@ngrx/entity";
import { anyEntityActions, AnyEntityActionTypes } from "@appStore/actions/any-entity.actions";
import { FieldDescribes } from "@appModels/metadata";
import { monad, tMonad } from "@appModels/monad";

//import { anyEntityLazyActions, AnyEntityLazyActionTypes } from "@appStore/actions/any-entity-lazy.actions";

// Использование в качестве форегинов 
// 1. Полная идентификация , 
// 2. частичная 
// 3. ссылочная 
//
//
//



export interface Metadata {
    table: any
    fieldsDesc: FieldDescribes
}


export interface AnyEntytyState<T> extends EntityState<T> {
    loaded: boolean;
    partLoaded: Dictionary<string[]>;
    loading: boolean;
    uploading:boolean;
    uploaded:boolean;
    metaLoaded: boolean;
    metaLoading: boolean;
    metadata:Metadata;           ///rrrrr!!!
    template?:T;
    rowSeed?:T;
    error: any;
    insertedId?:any;
    jab:        boolean;
    
}

export const initialSubState = {
    loaded: false,
    partLoaded: {},
    loading: false,
    uploading:false,
    uploaded:false,
    metaLoaded: false,
    metaLoading: false,
    metadata:{ table:{} ,fieldsDesc:{} },
    template:null,
    rowSeed:null,
    error: null,
    insertedId:null,
    jab: true
}

export function adapter<T>(){ return  createEntityAdapter<T>() }

export function anyEntytyinitialState<T>(){
    return  adapter<T>().getInitialState(initialSubState) ;
};

export function anyEntityLazySelectors<T>(){ return adapter<T>().getSelectors()};

/// From selfunction reduser && initstate 
export function initStateFromSelFoo<T>( selFoo: ((x: T) => any) ){ 
    return initStateFromAdapter( createEntityAdapter<T>({selectId:selFoo}))
} 
export function reducerFromSelFoo<T>( selFoo: ((x:T) => any) ){ 
    return reducerFromAdapter( createEntityAdapter<T>({selectId:selFoo}))
} 

export function selectorsFromSelFoo<T>( selFoo: ((x:T) => any) ){
    return createEntityAdapter<T>({selectId:selFoo}).getSelectors()
} 

/// From adapter reduser && initstate 
export function initStateFromAdapter( adapter: EntityAdapter<any> ):AnyEntytyState<any> {
    return adapter.getInitialState(initialSubState) ;
} 

export function reducerFromAdapter( adapt: EntityAdapter<any>){
    
    function reducer(state = initStateFromAdapter(adapt), action: anyEntityActions): AnyEntytyState<any>{
        const removeIfExit = (x:any[], v:any ) => x.indexOf(v) > 0 ? x.slice( x.indexOf(v), 1): x ; 
        //console.log(state)
        //console.log(action)
        switch (action.type) {

            case AnyEntityActionTypes.ADD_ITEM:
                return { ...state, uploading: true , insertedId:null  };    

            case AnyEntityActionTypes.ADD_ITEM_SUCCESS:
                return { ...state, uploading: false, uploaded:true, insertedId:action.payload};    

            case AnyEntityActionTypes.UPD_ITEM:{
                console.log('UPD_ITEM_SUCCESS');
                return { ...state, uploading: true , insertedId:null  };    
            }    
            case AnyEntityActionTypes.UPD_ITEM_SUCCESS:{
                console.log('UPD_ITEM_SUCCESS');
                return { ...state, uploading: false, uploaded:true, insertedId:action.payload};    
            }    
            case AnyEntityActionTypes.GET_ITEMS_PART:
                return { ...state, loading: true };    

            case AnyEntityActionTypes.GET_ITEMS_PART_SUCCESS: 
                // Возможна несогласованность ид и ентитесов, без опшинов ее не разрешить  
                //
                return tMonad.of(({
                        a:action,
                        p2:{ ...state , loading: false , partLoaded:  { ...state.partLoaded , [action.payload.request]:action.payload.ids  }  }   
                    }))
                    .map( x => x.a.isReload 
                            ? adapt.updateMany( x.a.payload.entites.map( (y,i) => ({id: x.a.payload.ids[i]  , changes:y } )), x.p2 ) 
                            : adapt.addMany( x.a.payload.entites, x.p2 )  )
                    .run();

            

            case AnyEntityActionTypes.GET_ITEMS:
                return { ...state, loading: true };    

            case AnyEntityActionTypes.GET_ITEMS_SUCCESS:{
                //console.log('GET_ITEMS_SUCCESS');
                var s =
                    adapt.addMany( 
                        action.payload,
                        { ...state , loaded: true, loading: false  }
                    );  
                return s;        
            }

            case AnyEntityActionTypes.GET_ITEMS_META:
                action.reduserData = state.metaLoading;
                return { ...state, metaLoading: true, metaLoaded: false  };    

            case AnyEntityActionTypes.GET_ITEMS_META_SUCCESS:{
                return { ...state,  metaLoading:false, metaLoaded: true , metadata:action.payload };
            }

            case AnyEntityActionTypes.GET_TEMPLATE_ROWSEED:
            case AnyEntityActionTypes.GET_TEMPLATE:{
                return { ...state, template: null };    
            }    

            case AnyEntityActionTypes.GET_TEMPLATE_SUCCESS:{
                return { ...state, template:action.payload  };    
            }    

            case AnyEntityActionTypes.SET_ROW_SEED:{
                return { ...state, rowSeed:action.payload  };    
            }    

            case AnyEntityActionTypes.CHANGE_ROW_SEED:{
                return { ...state, rowSeed:(state.rowSeed? ({...state.rowSeed, ...action.payload }): action.payload ) };    
            }    

            /// uploaded
            case AnyEntityActionTypes.EROR_ANY_ENTITY:{
                //console.log(action);
                return { ...state, loading: false, uploading:false, metaLoading:false, error: action.payload };        //loaded: false     
            }
                
            case AnyEntityActionTypes.EROR_ANY_ENTITY_RESET:
                return { ...state, error:null};            

            case AnyEntityActionTypes.JAB_STATE:
                return { ...state, jab:!state.jab};            
                
            default:
                return state;
        }
    }

    return reducer;
}
