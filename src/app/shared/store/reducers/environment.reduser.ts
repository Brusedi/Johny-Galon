import { EnvironmentAction, EnvironmentActionTypes } from "@appStore/actions/environment.actions";

// 
export interface authingData {
    fromError:string; 
    fromSource:string; 
}

export interface State  {
    authenticated: boolean;
    authenticating:boolean;
    authgData:authingData;
    error:any;
}

export const initialState = {
    authenticated: false,
    authenticating:false,
    authgData:null,
    error: null,
}

export function reducer(state :State  = initialState, action: EnvironmentAction): State {
    switch (action.type) {

        case EnvironmentActionTypes.ERROR_ENVIRONMENT:{    
            console.log(action.payload);
            return { ...state , error:action.payload};    
        } 

        case EnvironmentActionTypes.AUTH_START:{      
            console.log(action.payload);
            return { ...state , authenticated:true,  authgData:action.payload};    
        } 

        default:
            return state;
    }
}    