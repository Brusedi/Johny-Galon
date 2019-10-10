import { Action } from '@ngrx/store';

export enum EnvironmentActionTypes {
    AUTH_START              = '[Environment] Start authentication',
    AUTH_SUCCESS            = '[Environment] Authentication success',
    ERROR_ENVIRONMENT       = '[Environment] Error'
}


export class ErrorEnvironment implements Action {
    readonly type = EnvironmentActionTypes.ERROR_ENVIRONMENT
    constructor(public payload: any) {}
}  

export type EnvironmentAction =
    ErrorEnvironment
;