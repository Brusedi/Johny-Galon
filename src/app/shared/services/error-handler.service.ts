import { Injectable } from '@angular/core';
import * as fromStore from '@appStore/index';
import { Store } from '@ngrx/store';
import * as fromSelectors from '@appStore/selectors/index';
import { of, from } from 'rxjs';
import { anyEntityActions, ErrorAnyEntity, ErrorAnyEntityReset } from '@appStore/actions/any-entity.actions';
import { anyEntityOptions } from '@appModels/any-entity';
import { ErrorAnyEntitySet, ExecItemAction } from '@appStore/actions/any-entity-set.actions';
import { map, mergeMap, tap } from 'rxjs/operators';
import { AuthStart, ErrorEnvironment } from '@appStore/actions/environment.actions';
import { formArrayNameProvider } from '@angular/forms/src/directives/reactive_directives/form_group_name';
import { tMonad, Either } from '@appModels/monad';
import { IDialogBoxData } from '../app-common';


// РАЗНАЯ НУЖНАЯ ШНЯГА
const ERR_SUBLEVEL_PROP = "callstack";

const JWT_HDR_ERR       = "error";
const JWT_HDR_ERR_DESC  = "error_description";

export enum ErrLevel { Environment, EntitySet, Entity  }  ;

//IDialodBoxData

export interface IErrLevelInfo {
    level :  ErrLevel 
    description? : string  
    [ERR_SUBLEVEL_PROP]?: IErrLevelInfo
}


//////////////////////////////////////////////////////////////////////////////////
export const isEmpty = (x:any) => !!x
export const safeGet  = (e:any,p:string, d:any ) => e && e.hasOwnProperty(p) ? e[p] : d; 
export const safeGetChain  = (e:any, ps:string[] , f:((x:any) => any) = (x)=>undefined  ) => tMonad.of( ps.reduce( (a,x) => safeGet( a, x, undefined )  , e ) ).map( x => !!x ? x : f(e) ).run()
export const safeGetOrEmpty  = (e:any,p:string, d:any ) => ( e && e.hasOwnProperty(p) && e[p] ) ? e[p] : d; 

const removePrefix = (v:string, p:string)  => v && p && v.startsWith(p) ? v.substring( p.length ).trim() : v ;
const firstNotEmpty = (x:any[] , f:(y:any) => any  ) => x.reduce((a,v)=> !!a ? a : f(v) ,undefined) 

export const safeGetFromHeaders : ( hdrs:any , key:string, f?:(x:any[]) => string[] ) => any[] = ( hdrs, key, f = (x) => x ) => 
    !hdrs ? [] : Array.from<[]>(hdrs).reduce( (a:any[] ,x:any[] )  => x[0] == key ? a.concat(f(x[1]) ) : a  , []  ); 


const parseRemovePrefix = ( h:string, prefix:string = undefined ) => h.split(', ').map( x => removePrefix(x,prefix)  ) 
const headerComplexFunc  = ( remPrefix:string = undefined ) => (x:any[] ) =>  x.reduce(  (a,z) => a.concat(parseRemovePrefix (z , remPrefix )) ,[] ) ;   
const headerSimpleFunc = ( caption:string ) => (x:any[] ) =>  x.map( y =>  caption+ "="+y ) ;    

const getFromStr = ( str:string, key:string ) => str && key && str.startsWith(key+"=") ? str.substring( key.length+1 ).trim() : undefined ; 
 
/*
* Get value from parsed headers type "key=val" ; def - value if key not found, sucFunc - transform result from header val and defval  
*/
const getfromParsedHeader = ( headers:string[], key:string, def:string, sucFunc:(v:string,defV:string) => string = (v,d)=>v ) => 
     tMonad.of( headers.reduce( (a,x)=> a ? a : getFromStr(x, key)  ,undefined  ) ).map( x=> x ? sucFunc(x,def) : def ).run() ;

const addAsAtr = (x:string,y:string) => y+" ["+x+"]";


export const safeAllMap  = (e:any,  vmap:[string,string][] , els:any = e ) => 
    vmap.every( x => e.hasOwnProperty(x[0])) ? vmap.reduce( (a,v) =>({...a, [v[1]]:e[v[0]]})) : els

export const safeAllMapM  = <U>(e:any,  vmap:[string,string][], leftFunc:(x:any) => U ) =>  
    Either.Right<U,any>(e)
      .bind( x => vmap.every( x => e.hasOwnProperty(x[0])) 
                    ? Either.Left(  leftFunc( vmap.reduce( (a,v) =>({...a, [v[1]]:e[v[0]]}),{} ) ) ) 
                    : Either.Right(e) 
      )                  

// Для хэндлера 
const shiftErrInfo = ( errPayload, lev:ErrLevel, desc?:string  )  =>  
    tMonad.of( { level: lev , description: desc } )
      .map( x => errPayload.hasOwnProperty(ERR_SUBLEVEL_PROP) ? ({...x, [ERR_SUBLEVEL_PROP]:errPayload[ERR_SUBLEVEL_PROP] }) : x )   
      .map( x => ({ ...errPayload ,  [ERR_SUBLEVEL_PROP]:x }) )  
      .run()

const ErrLevelToString : ( ( err:IErrLevelInfo) => string  )   = ( err) => 
    err 
      ? "["+ safeGet( err, "level","" ) + "] " + safeGet( err, "description","" )  +
            ( err.hasOwnProperty(ERR_SUBLEVEL_PROP) &&  err[ERR_SUBLEVEL_PROP] 
              ? ErrLevelToString( err[ERR_SUBLEVEL_PROP] )
              : "" ) 
      :"";
///////////////////////////////////////////////////////////////////////

// ---------------------------------------------


@Injectable({
  providedIn: 'root'
})

/*
* Обработчик ошибок на уровне эффектов
*/
export class ErrorHandlerService {
 
  constructor(private store: Store<fromStore.State>) { }

  AnyEntityLevelHandling = ( action : ErrorAnyEntity, options: anyEntityOptions<any>  ) =>
    this.store.select( fromSelectors.selEnvIsAuthed ).pipe( 
      //tap(x=>console.log(x)),
      map( x => !x &&  action.payload && action.payload.status && action.payload.status == 401 ),
      map( x => x 
            ? new AuthStart({
                  fromError: action.payload&&action.payload.status?action.payload.status:undefined,
                  fromSource: action.payload&&action.payload.url?action.payload.url:undefined,
                  tag:undefined 
                }) 
            : new ErrorEnvironment(  shiftErrInfo( action.payload, ErrLevel.Entity,  "Ошибка загрузки: "+ options.name +" из "+ options.location  )  )
      ),
      map( x => [  new ExecItemAction( {itemOption:options , itemAction:new ErrorAnyEntityReset() }) , x] ),
      //tap(x=>console.log(x)),
      mergeMap( x => from(x) ) ,
      //tap(x=>console.log(x))
    )

}

////////////////////////////////////////////////
/*
*  ПАРСИТ ПРОИЗВОЛЬНУЮ ОШИБКУ И ПРИВОДИТ К СТАНДАРТИЗИРОВАННОМУ ВИДУ 
*/

export enum ErrorType { Unknown, Html, Html_Auth } 

export const ErrorTypeIcons : [ErrorType, string] [] =  [ 
    [ErrorType.Html, "error_outline" ],
    [ErrorType.Html_Auth, "no_encryption"],        
];

export const HtmlErrorsConvertor : [ string, ErrorType, string, string ][] =  [  
  [ "401" , ErrorType.Html_Auth , "401 Не авторизован" , "Ресурс к которому вы обратились требует авторизации, выполните вход и попробуйте еще раз."   ]
]

export const translateError: (err:IParsedError ) => IParsedError = (err) =>
    HtmlErrorsConvertor.reduce( (a,x) => err.caption == x[0] ? {...err, type:x[1], caption:x[2], description:x[3]  } :err ,err  ) ;

export interface ISysParsedError {
    status: any
    statusText:string
    location?:string  
    callstackInfo?:string  
    headers?:string[]
}
// Распарсеная ошибка
export interface IParsedError {
    caption:string;
    description:string;
    type:ErrorType;   
}

// Распарсиваемая ошибка
export interface IAppError {
  objectError:any;
  parsedError:IParsedError;
  sysParsedError?:ISysParsedError; 
}

const WWW_AUTH_HEADER = "www-authenticate";
const X_CAP = "Ошибка";
const X_DSC = "Неизвестная ошибка";

/*
* 290720 Функциональная версия ошибки
*/
export const buildParsedError: (err:any) => IAppError =  (err) =>
    Either.Right<IAppError,any>(err)     
      //.tap( x => console.log(x)  )
      .bind( x => tryParseHtmlError(x) )
      .map( x => ( { objectError:x , parsedError:{ caption:X_CAP,  description:X_DSC, type:ErrorType.Unknown  } } ) )  // to Unknown error
      //.tap( x => console.log(x)  )
      .run() ;  
      
export const tryParseHtmlError: (err:any) =>  Either<IAppError,any> =  (err) =>
      Either.Right<IAppError,any>(err) 
      .map( x => ( { err: safeGet(x,"error",x) , opt: safeGet(x,"opt",({})), callstack: safeGet(x,"callstack",({})) }))
      //.tap( x => console.log(x)  )
      .bind( e => 
              safeAllMapM( e.err , [[ "status" ,"caption"],["statusText" ,"description"]] , (x) => <IParsedError>({ ...x , type:ErrorType.Html })) 
                .reverse()
                .map(x => <IAppError>{
                    objectError:err, 
                    parsedError:translateError(x),    
                    sysParsedError: {  
                      status: x.caption,  
                      statusText: x.description , // safeGetFromHeaders(  safeGetChain(e.err,["headers","_headers"],undefined), WWW_AUTH_HEADER, (x)=>"хуй" , "Bearer" ), 
                      location: safeGet( e.opt, "location" ,  safeGet(e.err,"url",undefined)) ,  
                      callstackInfo:safeGet( e.callstack, "description" ,undefined) ,
                      headers: safeGetFromHeaders(  safeGetChain(e.err,["headers","_headers"],undefined), WWW_AUTH_HEADER , headerComplexFunc("Bearer") )    
                            .concat(safeGetFromHeaders(  safeGetChain(e.err,["headers","_headers"],undefined),  "prayer" , headerSimpleFunc("Prayer")  )  )  //test header getting
                    } 
                } )
                
                .tap( x => console.log(x)  )
                .map( x => <IAppError>{ 
                    ...x ,
                    parsedError:{ 
                      ...x.parsedError ,  
                      caption:  getfromParsedHeader(  x.sysParsedError.headers, JWT_HDR_ERR, x.parsedError.caption, addAsAtr  ) ,  //Up JWT Err from header
                      description:  getfromParsedHeader(  x.sysParsedError.headers, JWT_HDR_ERR_DESC, x.parsedError.description  )                             
                     } 
                })  
                .reverse()   
                // getfromParsedHeader(  x.sysParsedError.headers, JWT_HDR_ERR, x.parsedError.caption  )
      )

/*
* Error to Short system string
*/
export const appErrorToShortSys: (err:IAppError) => string = (err) => 
    err.hasOwnProperty("sysParsedError") && err.sysParsedError 
      ? "["+err.sysParsedError.status +"] " + err.sysParsedError.statusText + " on " + err.sysParsedError.location +"..."  
      : "["+err.parsedError.caption +"] " + err.parsedError.description + "..."

const propToStr  : ( obj:any , prop:string, toDef?: (x:any) => string, cap?:string  ) => string    = (o,p,f = (x) => undefined ,c = p ) => 
      tMonad.of(safeGetOrEmpty( o,p, undefined )).map( x => !!x ? c+": "+x+"; " : f(o) ).run()
const propsToStrFoo : ( props:string[], cap?:string ) =>  ((z:any)=>string  )  = ( ps , c = undefined ) => ps.reduceRight( (a,x) => (j) => propToStr(j , x , a , c ) , (y:any) => "" );
const propsToStr: (obj:any, props:string[], cap?:string ) =>  string    = ( o, ps , c = undefined ) => propsToStrFoo(ps,c)(o);

/*
* Sys Error String array caption:message
*/
export const sysErrorToString: (err:ISysParsedError) => string[] = (err) => [
    propToStr(err,"status" ) ,
    propToStr(err,"statusText" ) ,
    propToStr(err,"location" ) ,
    propToStr(err,"callstackInfo" ) //,
    //propsToStr(err,[ "location", "statusText", "status" ]  ) 
];




/*
* Error to DialogData converter
*/
export const appErrorToDialogData: (err:IAppError) => IDialogBoxData = (err) => ({
     Message: err.parsedError.description, 
     Name: err.parsedError.caption , 
     IconName:   ErrorTypeIcons.reduce( (a,x)  => x[0] == err.parsedError.type ? x[1] : a , "error" ),
     Details: ( err.hasOwnProperty("sysParsedError") ? sysErrorToString(err.sysParsedError ) : [] )
              .concat( err.sysParsedError && err.sysParsedError.headers  ? err.sysParsedError.headers.map( x => "Header: " + x ) : [] ) 
});      



// //  Захерим начнем с начала сверьху 
// export class ErrorParsed implements IParsedError {
//   ;
//       private readonly WWW_AUTH_HEADER = "www-authenticate";
//       private readonly X_CAP = "Ошибка";
//       private readonly X_DSC = "Неизвестная ошибка";
  
//       caption:string;
//       description:string;
//       type:ErrorType;   


//       constructor(public objectError:any ) 
//       {
//           this.objectError = safeGet(objectError,"error",objectError);

//           var err = this.parser(objectError);
//           this.caption     = err.caption;
//           this.description = err.description;
//           this.type        = err.type;

//           //this.caption     = this.X_CAP;
//           //this.description = this.X_DSC;
//           //this.TryParseError(this.objectError)

//           this.parser(objectError);

  
//           console.log( this.objectError);
//           console.log( this.caption);
//           console.log( this.description);
//       }

//       iconName = () => this.type == ErrorType.Unknown 
//           ? "error"
//           : "error_outline"
  
//       private TryParseError = (err:any) => this.isHtml(err)? this.tryParseHtml(err) : this.tryParseUnknown(err)
  
//       private tryParseUnknown = (err:any) => {
//           this.caption     = safeGet(err,"Name",this.X_CAP) ;
//           this.description = safeGet(err,"Message",this.X_DSC) ;
//       }
  
//       private tryParseHtmlSimpl = (err:any) => {
//           this.caption  = tMonad.of(safeGet(err,"status",this.X_CAP) )
//               .map( x => x ? x : "Ошибка HTML" )
//               .run();
  
//           this.description = Either.Right<string,any>(safeGet(err,"statusText",this.X_DSC))
//               .LeftIsNotEmptyOrMap( x =>  safeGet(err, ERR_SUBLEVEL_PROP , undefined)  ) 
//               .tap( x => console.log(x)  )
//               .map( ErrLevelToString )
//               .LeftIsNotEmptyOrMap( x => this.X_DSC  ) 
//               .run();
//       }


//       ///////////////////////////////////////////////////////////
//       // Парсеры

//       private isHtml = (err) => err.hasOwnProperty('status') &&  err.hasOwnProperty('statusText') ? true : false ; 
//       private isHtmlWithAuthBearer = (err) => err.hasOwnProperty('headers') &&  err['headers'].hasOwnProperty(this.WWW_AUTH_HEADER) ? true : false ;  
//       private toUnknovn : (x:any) => IParsedError = (x) => ({ caption:this.X_CAP,  description:this.X_DSC, type:ErrorType.Unknown  }) ;
      
      

//       /* 
//       * Базовый парсер
//       */
//       private parser: ( objectError:any ) => IParsedError = (err) =>
//           Either.Right<IParsedError,any>(err)     
//             .bind( x =>  this.ParseHtml(x) )
//             .map( this.toUnknovn)
//             .run() ;

//       /* 
//       * Парсер Html
//       */
//       private ParseHtml: ( objectError:({status:string, statusText:string}) ) => Either<IParsedError,any> = (err) =>
//           Either.Right<IParsedError,any>(err) 
//             .tap( x => console.log(x)  )
//             .bind( x => 
//                 safeAllMapM( x , [ [ "status" ,"caption"],[ "statusText" ,"description"] ] , (x)=><IParsedError>({ ...x , type:ErrorType.Html }) ) 
//             )     
//       ////////////////////////////////////////////////////////////

  
//       private  tryParseHtml = (err) => this.tryParseHtmlSimpl(err)
//           // this.isHtmlWithAuthBearer(err) 
//           // ?    
  
//       toDialogData:() => IDialodBoxData = () => ({ Message: this.description, Name:this.caption , IconName: this.iconName()  });    
      
  
//   }
