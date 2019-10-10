import { EnvironmentAction, EnvironmentActionTypes } from "@appStore/actions/environment.actions";

export interface State  {
    authenticated: boolean;
    authenticating:boolean;
    error:any;
}

export const initialState = {
    authenticated: false,
    authenticating:false,
    error: null,
}

export function reducer(state :State  = initialState, action: EnvironmentAction): State {
    switch (action.type) {
        case EnvironmentActionTypes.ERROR_ENVIRONMENT:{    
            console.log(action.payload);
            return { ...state , error:action.payload};    
        } 
    }
}    