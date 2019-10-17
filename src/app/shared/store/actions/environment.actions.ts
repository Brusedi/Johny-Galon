import { Action } from '@ngrx/store';
import { authingData, authingReqData } from '@appStore/reducers/environment.reduser';

export enum EnvironmentActionTypes {
    AUTH_START              = '[Environment] Start authentication',
    AUTH_SUCCESS            = '[Environment] Authentication success',
    ERROR_ENVIRONMENT       = '[Environment] Error'
}


export class ErrorEnvironment implements Action {
    readonly type = EnvironmentActionTypes.ERROR_ENVIRONMENT
    constructor(public payload: any) {}
}  

export class AuthStart implements Action {
    readonly type = EnvironmentActionTypes.AUTH_START
    constructor(public payload: authingReqData ) {}
}  

export class AuthSuccess implements Action {
    readonly type = EnvironmentActionTypes.AUTH_SUCCESS
    constructor(public payload: string) {}
}  


export type EnvironmentAction =
    | ErrorEnvironment
    | AuthStart
    | AuthSuccess
;