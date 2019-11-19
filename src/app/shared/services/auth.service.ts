// ===_==_==_=_==_=__==========================
//   / \/ |( / |/ /_ \
//  /     / /   _/ __/
//  \/\/\_\/\/\_\___/
// Author:		Schogolev Mike
// Create date: 16.10.2019
// Description:	Auth & Autorization service
//
// 161019 Пока нужна чисто затычка    
// =============================================

// Helper 
//export const isNeedAuth = (error:any) => true?true:false 
import { Store } from '@ngrx/store';
import { Injectable, Inject } from '@angular/core';
import * as fromStore from '@appStore/index';
import { Http,  RequestOptions , Headers} from '@angular/http';
import { AppSettingsService } from './app-setting.service';
import { map, mergeMap, tap, take, combineLatest, takeLast, filter  } from 'rxjs/operators';
import { Router } from '@angular/router';
import { of, timer, Observable } from 'rxjs';
import * as fromSelectors from '@appStore/selectors/index';
import { AuthSuccess, ErrorEnvironment, AuthTokenReceived, AuthLogoutSucess } from '@appStore/actions/environment.actions';

export const TAG_NVA                   = "ADFS"
export const TAG_GOOGLE                = "GOOGLE"


const A_PAR_RESPONSE_TYPE       =  "code" ;   
const A_PAR_RESPONSE_GRANT_TYPE =  "authorization_code" ; 

const A_ACCES_TOKEN_KEY         =  "access_token";
const A_ID_TOKEN_KEY            =  "id_token";

const A_PAR_WA                  =  "wsignout1.0" ;

const POPUP_WIN_PARS            =  "location=no,width=600,height=600,scrollbars=yes,top=100,left=700,resizable = no";
const POPUP_WIN_NAME            =  "LoginPopUp";


//kill
//const A_PAR_RES           =  "https://sqlback-win12.nvavia.ru/FsCsweb" ;
//const A_PAR_REDIR         =  "http://localhost:4200/Auth" ;


//const A_PAR_WA            =  "wsignout1.0" ;
//const A_PAR_LO_REDIR      =  "{http://localhost:4200/Auth}" ;




@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private myLocation: string ; 

    constructor(
        private store: Store<fromStore.State>,
        private http: Http,
        private settings: AppSettingsService,
        private router:Router,
        @Inject("windowObject") private  window: Window
      ) {  
            this.myLocation = window.location.origin+'/' ; 
      }


    // 071119   
    //Clear release method //////////////////////////////////////////////////////////////////////////// 
    
    /*
    * Login to ..
    * return action for dispatching  
    */ 
    public  Login = (timeOutSec:number) =>
        this.store.select( fromSelectors.authIsTag(TAG_GOOGLE)).pipe(
            take(1),
            mergeMap( x => x ? this.LoginGoogle$(timeOutSec) : this.LoginFS3$(timeOutSec)  )
        );    

    
    /*
    * Request Auth token after auth-code request from back (ADFS AND GOOGLE) 
    * return action for dispatching  
    */ 
    public authToken$() {
        const pars$ = this.store.select( fromSelectors.selEnvAuthCode ).pipe(
            combineLatest( this.settings.getSettings()   , (aCode,s) => ({ code:aCode , setting :s }) ),
            combineLatest( of(this.myLocation) , (x ,loc) =>  ({...x , myLoc:loc })),
            combineLatest( this.store.select( fromSelectors.selEnvAuthTag ) , (x , tag) =>  ({...x , tag: tag ? tag :TAG_NVA  })),
            map( x =>  new  URLSearchParams([
                ["grant_type"   ,A_PAR_RESPONSE_GRANT_TYPE ],
                ["client_id"    ,x.tag==TAG_GOOGLE ? x.setting.auth2ClientId_Google : x.setting.auth2ClientId],
                ["redirect_uri" ,x.myLoc+x.setting.auth2LoginRedirectSuffix],
                ["code"         ,x.code],
                ["tag"          ,x.tag ]])),  
            take(1)                
        )

        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/x-www-form-urlencoded') ;
        const myOption = new RequestOptions(  {headers:myHeaders } )   
        
        return pars$.pipe(
            combineLatest( this.settings.getSettings(), ( x, y ) => ({ bodyPars:x , uri: ( y.svcFasadeUri +'/' + y.auth2RequestTokenSuffix) }) ),
            mergeMap( x => this.http.post( x.uri, x.bodyPars.toString() , myOption )),
            map(x => x.text()),
            map(x  => x.trim()===""? {}: JSON.parse(x) ),
            map(x => x && ( x.hasOwnProperty(A_ACCES_TOKEN_KEY) || x.hasOwnProperty(A_ID_TOKEN_KEY ))
                        ?  new AuthTokenReceived(  
                                x.hasOwnProperty(A_ACCES_TOKEN_KEY) ? x[A_ACCES_TOKEN_KEY]  : undefined ,  
                                x.hasOwnProperty(A_ID_TOKEN_KEY)    ? x[A_ID_TOKEN_KEY]     : undefined 
                            )
                        :  new  ErrorEnvironment("Не смог получить JWT")   )
        )
    }          

    /*
    * Login to ..
    * return action for dispatching  
    */ 
    public  Logout = (timeOutSec:number) => 
        this.store.select( fromSelectors.authIsTag(TAG_GOOGLE)).pipe(
            take(1),
            //tap(x => console.log( ' ig G ' + x  )),
            //mergeMap( x => x ? this.LogoutGoogleUri$() : this.LogoutFS3Uri$()  ),
            mergeMap( x => x ? of(new AuthLogoutSucess()) : this.LogoutProcess$( this.LogoutFS3Uri$(), timeOutSec ) )
        );
        //loUri$.subscribe(console.log);            
        //return this.LogoutProcess$( loUri$, timeOutSec );
    

    /* 
    * get uri with pars Logout from ADFS 3.0 (OAuth2) and wait responce
    * return action for dispatching  
    */ 
    private LogoutFS3Uri$ = () =>     
        of(this.myLocation).pipe(
            combineLatest(this.settings.getSettings() , (l,s) => ({ 
                set:s,
                pars: (new  URLSearchParams([    
                    ["wa"       ,   A_PAR_WA],
                    ["wtrealm"  ,   l ],
                    ["wreply"   ,   l+s.auth2LoginRedirectSuffix] ] ))
                })
            ),
            map( x => x.set.auth2LogoutEndPoint + '?' + x.pars.toString()) , 
            take(1),
            tap(console.log),
        );     

    /* 
    * get uri with pars Logout from ADFS 3.0 (OAuth2) and wait responce
    * return action for dispatching  
    */ 
    private LogoutGoogleUri$ = () =>    
        this.settings.getSettings().pipe(
            map(x=>x.auth2LogoutEndPoint_Google)                
        );       

    /* 
    * Logout process
    * return action for dispatching  
    */ 
    private LogoutProcess$ ( uri$:Observable<string>, timeOutSec:number) {
        const closeIf =  ( x:Window) => { try { x.close() ; return true } catch (e) { return false ; } };
        return of(this.window).pipe(
            combineLatest( uri$ , (w,uri) => w.open( uri, POPUP_WIN_NAME , POPUP_WIN_PARS )),
            //tap(x=>console.log('wwww')),
            combineLatest( timer (1000, 1000) , (x,y) => x ),
            take(1),
            //take(timeOutSec?1:timeOutSec),
            tap( closeIf ),
            //tap(x=>console.log('wwwww')),
            map( x => new AuthLogoutSucess() )
        );                    
    }        

    /*
    * Login to ADFS 3.0 (OAuth2) and wait responce
    * return action for dispatching  
    */ 
    private LoginFS3$(timeOutSec:number){
        const uriAndParams$ =  of(this.myLocation).pipe(
            combineLatest( this.settings.getSettings() , (l,s) => ({ myLoc:l , setting :s }) ),
            map( x =>  new  URLSearchParams([
                ["response_type",A_PAR_RESPONSE_TYPE],
                ["client_id"    ,x.setting.auth2ClientId],
                ["resource"     ,x.setting.auth2resource],
                ["redirect_uri" ,x.myLoc+x.setting.auth2LoginRedirectSuffix]])) , 
                combineLatest( this.settings.getSettings() , (pars,st) => st.auth2AuthEndPoint + '?' + pars.toString() )                               
        );
        //console.log('call FS !');        
        return this.loginProcess$( uriAndParams$, timeOutSec  ) ;
    }        

    /*
    * Login to Google+
    * return action for dispatching  
    */ 
    private LoginGoogle$(timeOutSec:number){
        //const uriAndParams$ =  of(this.myLocation).pipe(
        const uriAndParams$ =  of(this.window.location.origin+'/').pipe(
            tap(console.log),
            combineLatest( this.settings.getSettings() , (l,s) => ({ myLoc:l , setting :s }) ),
            map( x =>  new  URLSearchParams([
                        ["response_type",A_PAR_RESPONSE_TYPE    ],
                        ["client_id"    ,x.setting.auth2ClientId_Google],
                        ["scope"        ,x.setting.auth2Scope_Google],
                        ["redirect_uri" ,x.myLoc+x.setting.auth2LoginRedirectSuffix]])),  
            combineLatest( this.settings.getSettings() , (pars,st) => st.auth2AuthEndPoint_Google + '?' + pars.toString() )                                
        );
        //console.log('call G !');
        return this.loginProcess$( uriAndParams$, timeOutSec  ) ;
    }

    /*
    * Proccess auth-code request
    */  
    private loginProcess$( uri$ :Observable<string>  , timeOutSec:number) {
        // try-catch wraps
        const isHerfReadingAndstartsWith = ( w:Window, herf:string ) => { try { return w.location.href.startsWith(herf) } catch (e) { return false } }
        const isHerfReadingAndClosed  = ( w:Window) => { try { return w.closed } catch (e) { return false } }

        const parseLoginResult = (w:Window, herf:string ) =>{
            const rPar = ( url:string, par:string ) =>   new URL(url).searchParams.get(par) ;   
            const closeIf =  ( x:Window) => { try { x.close() ; return true } catch (e) { return false ; } }
            var retAct = isHerfReadingAndstartsWith(w,herf) 
                ?  rPar( w.location.href ,'code') 
                    ? new AuthSuccess( rPar( w.location.href ,'code') )  
                    : new ErrorEnvironment(  rPar( w.location.href ,'error') ? rPar( w.location.href ,'error'): "Unknown error" )
                : new ErrorEnvironment( "Unknown error" )
            closeIf(w) ;                           
            return retAct;
        }       
        //console.log('call!');
        return of(this.window).pipe(
            //tap(x=>console.log("lg"+x)),    
            combineLatest( uri$ , (w,u)=> ({ 
                popup: w.open( u, POPUP_WIN_NAME , POPUP_WIN_PARS ), 
                myLoc: w.location.href
            })),
            combineLatest( timer (1000, 1000) , (x,y) => x ), 
            take(timeOutSec) ,                                              // timeout sec
            //tap(console.log),
            filter(  x => ! x.popup || isHerfReadingAndClosed(x.popup) || isHerfReadingAndstartsWith(x.popup, x.myLoc) ), 
            take(1),
            map( x => parseLoginResult(x.popup, x.myLoc)  )
        );    
    }     


    /* 
    * Logout to ADFS 3.0 (OAuth2) and wait responce
    * return action for dispatching  
    */ 
    // public LogoutFS3$(timeOutSec:number){    
    //     const uri$ =  of(this.window.location.href).pipe(
    //         combineLatest(this.settings.getSettings() , (l,s) => ({ 
    //                 set:s,
    //                 pars: new  URLSearchParams([    
    //                     ["wa"       ,   A_PAR_WA],
    //                     ["wtrealm"  ,   l ],
    //                     ["wreply"   ,   l+s.auth2LoginRedirectSuffix] ] )
    //                 })
    //         ),
    //         map( x => x.set.auth2LogoutEndPoint + '?' + x.pars.toString())  
    //     ); 

    //     //const isHerfReadingAndClosed  = ( w:Window) => { try { return w.closed } catch (e) { return false } }

    //     return of(this.window).pipe(
    //        combineLatest( uri$ , (w,uri) => w.open( uri, POPUP_WIN_NAME , POPUP_WIN_PARS )),
    //        //combineLatest( timer (1000, 1000) , (x,y) => x ), 
    //        //take(timeOutSec)
    //        //tap(console.log),
    //        map( x => new AuthLogoutSucess() )
    //     )    
    // }    

    // /*
    // * Build parameters for Login on ADFS (OAuth2)
    // */  
    // private  LoginFS3RequestParams$ =   
    //     of(this.window.location.href).pipe(
    //         combineLatest( this.settings.getSettings() , (l,s) => ({ myLoc:l , setting :s }) ),
    //         map( x =>  new  URLSearchParams([
    //                      ["response_type",A_PAR_RESPONSE_TYPE],
    //                      ["client_id"    ,x.setting.auth2ClientId],
    //                      ["resource"     ,x.setting.auth2resource],
    //                      ["redirect_uri" ,x.myLoc+x.setting.auth2LoginRedirectSuffix]]))  
    //     )

    // /*
    // * Build Login URI with parameters on ADFS (OAuth2)
    // */      
    // private LoginFS3RequestUri$ = 
    //     this.LoginFS3RequestParams$.pipe(        
    //         combineLatest( this.settings.getSettings() , (pars,st) => st.auth2AuthEndPoint + '?' + pars.toString() )
    //     )     
            
   
    // /*
    // * Login to ADFS 3.0 (OAuth2) and wait responce
    // * return action for dispatching  
    // */ 
    // public LoginFS3Old$(timeOutSec:number){

    //     const isHerfReadingAndstartsWith = ( w:Window, herf:string ) => { try { return w.location.href.startsWith(herf) } catch (e) { return false } }
    //     const isHerfReadingAndClosed  = ( w:Window) => { try { return w.closed } catch (e) { return false } }

    //     const parseLoginResult = (w:Window, herf:string ) =>{
    //         const rPar = ( url:string, par:string ) =>   new URL(url).searchParams.get(par) ;   
    //         const closeIf =  ( x:Window) => { try { x.close() ; return true } catch (e) { return false ; } }
    //         var retAct = isHerfReadingAndstartsWith(w,herf) 
    //             ?  rPar( w.location.href ,'code') 
    //                 ? new AuthSuccess( rPar( w.location.href ,'code') )  
    //                 : new ErrorEnvironment(  rPar( w.location.href ,'error') ? rPar( w.location.href ,'error'): "Unknown error" )
    //             : new ErrorEnvironment( "Unknown error" )
    //         closeIf(w) ;                           
    //         return retAct;
    //     }       
    //     return of(this.window).pipe(
    //         combineLatest( this.LoginFS3RequestUri$ , (w,u)=> ({ 
    //             popup: w.open( u, 'hoy' , "width=400,height=400" ), 
    //             myLoc: w.location.href
    //         })),
    //         combineLatest( timer (1000, 1000) , (x,y) => x ), 
    //         take(timeOutSec) ,                                              // timeout sec
    //         //tap(console.log),
    //         filter(  x => ! x.popup || isHerfReadingAndClosed(x.popup) || isHerfReadingAndstartsWith(x.popup, x.myLoc) ), 
    //         take(1),
    //         map( x => parseLoginResult(x.popup, x.myLoc)  )
    //     )      
    // }
    
         
        

    /*
    * Build parameters for request JWT token from bakend proxy 
    */  
   private  authTokenRequestParams$ =   
        this.store.select( fromSelectors.selEnvAuthCode ).pipe(
            combineLatest( this.settings.getSettings()   , (aCode,s) => ({ code:aCode , setting :s }) ),
            combineLatest( of(this.myLocation) , (x ,loc) =>  ({...x , myLoc:loc })),
            map( x =>  new  URLSearchParams([
                ["grant_type"   ,A_PAR_RESPONSE_GRANT_TYPE ],
                ["client_id"    ,x.setting.auth2ClientId],
                ["redirect_uri" ,x.myLoc+x.setting.auth2LoginRedirectSuffix],
                ["code"         ,x.code] ]))  
        )
                

    /*
    * Request JWT token from bakend proxy
    * return action for dispatching  
    */ 
    // public authTokenRequest$() {

    //     const myHeaders = new Headers();
    //     myHeaders.append('Content-Type', 'application/x-www-form-urlencoded') ;
    //     const myOption = new RequestOptions(  {headers:myHeaders } )   

    //     return this.authTokenRequestParams$.pipe(
    //         combineLatest( this.settings.getSettings(), ( x, y ) => ({ bodyPars:x , uri: ( y.svcFasadeUri +'/' + y.auth2RequestTokenSuffix) }) ),
    //         mergeMap( x => this.http.post( x.uri, x.bodyPars.toString() , myOption )),
    //         map(x =>  x.text()),
    //         map(x  => x.trim()===""? {}: JSON.parse(x) ),
    //         map(x => x && x.hasOwnProperty(A_ACCES_TOKEN_KEY) ? new AuthTokenReceived(x[A_ACCES_TOKEN_KEY]) : new  ErrorEnvironment("Не смог получить JWT")   )
    //     )
    // }          

    /// logout  -----------------------------


    ///////////////////////////////////////////////////////////////////////////////////////////////////  
    // public FsLogin = () =>
    //     of(this.window).pipe(
    //         combineLatest( this.getFSAuthCodeUri() , (w,u)=> w.open( u, 'hoy' , "width=200,height=200" ) ), 
    //         combineLatest( timer(1000, 1000) , (x,y) => x ), 
    //         take(5),  // увеличить lj dhtvtyb nfqvfenf
    //         tap(console.log), 
    //         takeLast(1),
    //         map(( x:Window) => x.close() ),
    //         map(x=> 'хуя')

    //     )   
       


    // private buildAuthReguest ( authUrl:string , clientId:string ) { 
    //     const authParams = {
    //         "response_type":A_PAR_RESPONSE_TYPE,      
    //         "client_id":clientId,
    //         "resource":A_PAR_RES,
    //         "redirect_uri":A_PAR_REDIR
    //     }
    //      //const myHeaders = new Headers();
    //     //     myHeaders.append('Access-Control-Allow-Origin', '*');
    //     //     myHeaders.append('Access-Control-Allow-Credentials', 'true');
    //     //     myHeaders.append('Content-Type', 'application/json') ;
        
    //     const myOption = new RequestOptions( {headers:new Headers() });
    //     //const myParams = new URLSearchParams(authParams);
    //     //const myOption = new RequestOptions( {headers:myHeaders });
    //     //const myOption = new RequestOptions( {headers:myHeaders  ,params: myParams});
    //     return of(authUrl)
    //         .pipe( 
    //             map (x => x +  Object.keys(authParams).reduce( ( (a,n) => a + n + '=' +  authParams[n] + '&' ),'?' ) ),
    //             //tap(console.log)
    //         );
    // }


    // //ебля с постом
    // // private sendAuthReguestAsPost ( authUrl:string , clientId:string ) { 

    // //     const buildBodyPars = ( ) =>
    // //          new  URLSearchParams([
    // //             [ "response_type","A_PAR_RESPONSE_TYPE" ],
    // //             [ "client_id", clientId ],
    // //             [ "resource",A_PAR_RES ],
    // //             [ "redirect_uri",A_PAR_REDIR ],
    // //         ]);

        
    // //     const myHeaders = new Headers();
    // //     myHeaders.append('Content-Type', 'application/x-www-form-urlencoded') ;

    // //     const myOption = new RequestOptions(  {headers:myHeaders } )   

    // //     return this.http.post(authUrl , buildBodyPars().toString() , myOption );
    // // }

    
    // private buildLogoutReq ( logoutUrl:string ) { 
    //     const authParams = {
    //         "wa":A_PAR_WA,      
    //         "wtrealm": "http://localhost:4200",
    //         "wreply":A_PAR_LO_REDIR        
    //     }
    //     return of(logoutUrl)
    //         .pipe( 
    //             map (x => x +  Object.keys(authParams).reduce( ( (a,n) => a + n + '=' +  authParams[n] + '&' ),'?' ) ),
    //             tap(console.log)
    //         );
    // }
    
    // public getFSAuthCodeUri() {
    //     return this.settings.getSettings().pipe(
    //         //tap(console.log),
    //         mergeMap( x => this.buildAuthReguest(x.auth2AuthEndPoint,x.auth2ClientId ) ),
    //         //tap(x =>  )     
    //         //mergeMap( x => this.http.get(x))     
            
    //         //mergeMap( x => this.sendAuthReguestAsPost(x.auth2AuthEndPoint,x.auth2ClientId ) ),
    //         //tap(console.log)
    //     );
    // }

    // public getFSLogoutUri() {
    //     return this.settings.getSettings().pipe(
    //         tap(console.log),
    //         mergeMap( x => this.buildLogoutReq(x.auth2LogoutEndPoint) ),
    //         tap(console.log)
    //     );
    // } 

    // public authTokenRequest() {
    //     const buildBodyPars = (code:string, clientId:string ) =>
    //          new  URLSearchParams([
    //             [ "grant_type","authorization_code" ],
    //             [ "client_id", clientId ],
    //             [ "redirect_uri",A_PAR_REDIR ],
    //             [ "code",code ],
    //         ]);

    //     const myHeaders = new Headers();
    //         myHeaders.append('Content-Type', 'application/x-www-form-urlencoded') ;

    //     const myOption = new RequestOptions(  {headers:myHeaders } )   

    //     return this.store.select( fromSelectors.selEnvAuthCode ).pipe(  
    //         take(1),
    //         combineLatest( this.settings.getSettings(), ( x, y ) => ({code:x , cliId:y.auth2ClientId, uri:y.auth2TokenndPoint }) ),
    //         //map( x => ( buildBodyPars(x.code,x.cliId))),
    //          mergeMap( x => this.http.post( x.uri, buildBodyPars(x.code,x.cliId).toString() , myOption ) ) ,
    //          map(x =>  x.text()),
    //          map(x  => x.trim()===""? {}: JSON.parse(x) ),
    //          map(x => x && x.hasOwnProperty(A_ACCES_TOKEN_KEY) ? x[A_ACCES_TOKEN_KEY] : 'ВАМХУЯ'  )
    //     )   
    // }             


    // public authTokenRequestFromBack() {
    //     const buildBodyPars = (code:string, clientId:string ) =>
    //          new  URLSearchParams([
    //             [ "grant_type","authorization_code" ],
    //             [ "client_id", clientId ],
    //             [ "redirect_uri",A_PAR_REDIR ],
    //             [ "code",code ],
    //         ]);

    //     const myHeaders = new Headers();
    //         myHeaders.append('Content-Type', 'application/x-www-form-urlencoded') ;

    //     const myOption = new RequestOptions(  {headers:myHeaders } )   

    //     return this.store.select( fromSelectors.selEnvAuthCode ).pipe(  
    //         take(1),
    //         combineLatest( this.settings.getSettings(), ( x, y ) => ({code:x , cliId:y.auth2ClientId, uri:y.auth2TokenndPoint }) ),
    //         //map( x => ( buildBodyPars(x.code,x.cliId))),
    //          mergeMap( x => this.http.post( x.uri, buildBodyPars(x.code,x.cliId).toString() , myOption ) ) 
    //     )   
    // }             



  }
  