import { Action } from '@ngrx/store';
import { authingData } from '@appStore/reducers/environment.reduser';

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
    constructor(public payload: authingData) {}
}  


export type EnvironmentAction =
    | ErrorEnvironment
    | AuthStart
;