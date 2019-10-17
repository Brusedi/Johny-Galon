import { EnvironmentAction, EnvironmentActionTypes } from "@appStore/actions/environment.actions";


// 
export interface authingReqData {
    fromError:string; 
    fromSource:string; 
}

export interface authingData {
    request:authingReqData;
    authCode:string;        
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
            return { ...state , authenticating:true,  authenticated:false ,  authgData: { ...state.authgData, request: action.payload}  } ;    
        } 

        case EnvironmentActionTypes.AUTH_SUCCESS:{      
            console.log(action.payload);
            return { ...state ,  authenticating:false,  authenticated:true ,  authgData: { ...state.authgData, authCode: action.payload}  } ;    
        } 

        default:
            return state;
    }
}    