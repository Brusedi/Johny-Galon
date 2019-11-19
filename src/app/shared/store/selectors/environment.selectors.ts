import { createFeatureSelector, createSelector } from "@ngrx/store";
import { State } from "@appStore/reducers/environment.reduser";

export const AUTH_HEADER_CODE_PREFIX  = "Code";
export const AUTH_HEADER_TOKEN_PREFIX = "Bearer";

export const environmentStore = createFeatureSelector<State>('environment');

export const selectEnvironment = createSelector(
    environmentStore,
    (x:State) => x 
); 

export const selEnvError = createSelector(
    environmentStore,
    (x:State) => x.error 
); 

export const selEnvIsAuthed = createSelector(
    environmentStore,
    (x:State) => x&&x.authenticated ?  x.authenticated : false
); 

export const selEnvAuthCode = createSelector(
    environmentStore,
    (x:State) => x&&x.authenticated ?  ( x.authgData && x.authgData.authCode ? x.authgData.authCode : undefined ) : undefined 
); 

/**
 *  Select Authentificate header value
 */
export const selEnvAuthHeader = createSelector(
     environmentStore,
     (x:State) => x&&x.authenticated 
        ? x.authgData && x.authgData.idToken
            ? AUTH_HEADER_TOKEN_PREFIX +" "+ x.authgData.idToken
            : x.authgData && x.authgData.authToken 
                ? AUTH_HEADER_TOKEN_PREFIX +" "+ x.authgData.authToken 
                : x.authgData && x.authgData.authCode 
                    ? AUTH_HEADER_CODE_PREFIX +" "+ x.authgData.authCode 
                    :undefined
        : undefined 
);

/**
 *  Select JWT Body BASE 64
 */
export const selEnvAuthHeaderBodyB64 = createSelector(
    selEnvAuthHeader,
    x => !x ? undefined
            : x.split('.')[1] 
)

/**
 *  Select  Select JWT Body
 */
export const selEnvAuthHeaderBody = createSelector(
    selEnvAuthHeaderBodyB64,
    x => { try{ return JSON.parse( decodeURIComponent(escape(window.atob( x ))));} catch{ return undefined; } }
)        

/**
 *  Select  Select JWT Body
 */
export const selEnvAuthHeaderName = createSelector(
     selEnvAuthHeaderBody,
     x => x && x["name"] 
        ? x["name"] 
        : x && x["email"] ? x["email"] :undefined
)        

/**
 *  Select  Select JWT Body
 */
export const selEnvAuthHeaderPicUri = createSelector(
    selEnvAuthHeaderBody,
    x => x && x["picture"] ? x["picture"] : undefined
)        


/**
 *  Select Authentificate Tag
 */
export const selEnvAuthTag = createSelector(
    environmentStore,
    (x:State) => x && x.authgData && x.authgData.request && x.authgData.request.tag 
                    ? x.authgData.request.tag 
                    : undefined
); 

/**
*  Authentificate Tag is ...
*/
export const authIsTag = ( tag: string ) => createSelector(
    selEnvAuthTag,
    (x) => !!(x && x == tag) 
);


