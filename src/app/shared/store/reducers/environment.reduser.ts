import { EnvironmentAction, EnvironmentActionTypes } from "@appStore/actions/environment.actions";

// 
//

export interface authingReqData {
    fromError:string; 
    fromSource:string;
    tag:string;  
}

export interface authingData {
    request:authingReqData;
    authCode:string;        
    authToken:string;    
    idToken:string;    
    authTokenRequesting:boolean;
}

export interface State  {
    authenticated: boolean;
    authenticating:boolean;
    logoutind:boolean;
    //tryingLogin:boolean;
    authgData:authingData;
    error:any;
}

export const initialState = {
    authenticated: false,
    authenticating:false,
    logoutind:false,
    //tryingLogin:false,
    authgData:null,
    error: null,
}

export function reducer(state :State  = initialState, action: EnvironmentAction): State {
    switch (action.type) {

        case EnvironmentActionTypes.ERROR_ENVIRONMENT:{    
            //console.log(action.payload);
            return { ...state , error:action.payload};    
        } 

        case EnvironmentActionTypes.AUTH_START:{      
            //console.log(action.payload);
            return { ...state , authenticating:true,  authenticated:false ,  authgData: { ...state.authgData, request: action.payload}  } ;    
        } 

        case EnvironmentActionTypes.AUTH_SUCCESS:{      
            //console.log(action.payload);
            return { ...state ,  authenticating:false,  authenticated:true ,  authgData: { ...state.authgData, authCode: action.payload, authTokenRequesting:true}  } ;    
        } 

        case EnvironmentActionTypes.AUTH_LOGOUT:{      
            //console.log(action.payload);
            return { ...state ,  logoutind:true } ;    
        } 

        case EnvironmentActionTypes.AUTH_LOGOUT_SUCCESS:{      
             //console.log(action.payload);
             return { ...state ,  authenticating:false,  authenticated:false , logoutind:false,  authgData: null  } ;    
        } 

        case EnvironmentActionTypes.AUTH_TOKEN_RECIVED:{      
            //console.log(action.payload);
            return { ...state ,  authgData:  { ...state.authgData, authTokenRequesting:false, authToken: action.authToken, idToken: action.idToken }   } ;    
        } 

        default:
            return state;
    }
}    