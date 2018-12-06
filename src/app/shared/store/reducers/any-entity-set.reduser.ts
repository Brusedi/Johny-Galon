import { anyEntityOptions } from "@appModels/any-entity";
import { anyEntityActions } from "@appStore/actions/any-entity.actions";
import { AnyEntytyState }   from "./any-entity.reduser";
import { AnyEntitySetAction, AnyEntitySetActionTypes, ExecItemAction } from "@appStore/actions/any-entity-set.actions";
import * as fromEntityReduser from "./any-entity.reduser"

// 
export interface AnyEntytySetItemState<T> {
    state      : AnyEntytyState<T>,
    option     : anyEntityOptions<T>
    action?    : anyEntityActions 
} 

// key as location
export interface State {  
    [key: string]: AnyEntytySetItemState<any>
    error: any;
}

export const initialState: State = {
    error:null
};

export function reducer(state :State  = initialState, action: AnyEntitySetAction): State {
    //console.log( action) ;
    switch (action.type) {


        case AnyEntitySetActionTypes.ADD_ANY_ENTITY:
            return { ...state, [action.payload.name]: { 
                                    state:      fromEntityReduser.initStateFromSelFoo( action.payload.selectId),
                                    option:     action.payload,
                                    action:     null 
                                } };    

        case AnyEntitySetActionTypes.EXEC : {                                
            action.reduserData = (< AnyEntytySetItemState<any>>state[action.payload.name]).option;
            return {...state};
        }            

        case AnyEntitySetActionTypes.EXEC_ANY_ENTITY_ACTION: {
            //console.log(action.payload);
            //console.log(state);
            var s = { ...state, 
                        [action.payload.itemOption.name]:{ 
                            ...state[action.payload.itemOption.name],
                            action: (<ExecItemAction>action).payload.itemAction,
                            state: fromEntityReduser.reducerFromSelFoo( state[action.payload.itemOption.name].option.selectId )(
                                state[action.payload.itemOption.name].state, (<ExecItemAction>action).payload.itemAction 
                            )     
                    }};
            //console.log(s);        
            return s;        
        };    
        
        case AnyEntitySetActionTypes.COMPLETE_ANY_ENTITY_ACTION: {
            return { ...state, 
                [action.payload.name]:{ 
                    ...state[action.payload.name],
                    action: null
            }};
        };    

        case AnyEntitySetActionTypes.EROR_ANY_ENTITY_SET:{        
                //console.log(action);
                return { ...state, error:action.payload };    
            }    

        default:
            return state;
    }
}

 