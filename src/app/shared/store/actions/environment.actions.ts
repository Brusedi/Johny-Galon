import { Action } from '@ngrx/store';
import { authingData, authingReqData } from '@appStore/reducers/environment.reduser';

export enum EnvironmentActionTypes {
    //AUTH_TRYING_LOGIN       = '[Environment] Authentication trying external Login',
    AUTH_START              = '[Environment] Start authentication (resived code)',
    AUTH_SUCCESS            = '[Environment] Authentication success',
    AUTH_LOGOUT             = '[Environment] Authentication Log out begin',
    AUTH_LOGOUT_SUCCESS     = '[Environment] Authentication Log out success',
    AUTH_TOKEN_RECIVED      = '[Environment] Authentication token received',
    
    ERROR_ENVIRONMENT       = '[Environment] Error',
    ERROR_ENVIRONMENT_RESET = '[Environment] Error reset'
}

// export class AuthTryingLogin implements Action {
//     readonly type = EnvironmentActionTypes.AUTH_TRYING_LOGIN
//     constructor(public payload: any) {}
// }  

export class ErrorEnvironment implements Action {
    readonly type = EnvironmentActionTypes.ERROR_ENVIRONMENT
    constructor(public payload: any) {}
}  

export class AuthStart implements Action {
    readonly type = EnvironmentActionTypes.AUTH_START
    constructor(public payload: authingReqData ) {}
}  

export class AuthTokenReceived implements Action {
    readonly type = EnvironmentActionTypes.AUTH_TOKEN_RECIVED
    constructor(public authToken: string ,  public idToken: string) {}
}  

export class AuthSuccess implements Action {
    readonly type = EnvironmentActionTypes.AUTH_SUCCESS
    constructor(public payload: string) {}
}  

export class AuthLogout implements Action {
    readonly type = EnvironmentActionTypes.AUTH_LOGOUT
    constructor() {}
}

export class AuthLogoutSucess implements Action {
        readonly type = EnvironmentActionTypes.AUTH_LOGOUT_SUCCESS
        constructor() {}
}  

export class ErrorEnvironmentReset implements Action {
    readonly type = EnvironmentActionTypes.ERROR_ENVIRONMENT_RESET
    constructor() {}
}  


export type EnvironmentAction =
    | ErrorEnvironment
    | AuthStart
    | AuthSuccess
    | AuthLogout
    | AuthLogoutSucess
    | AuthTokenReceived
    | AuthLogoutSucess
    | ErrorEnvironmentReset
;