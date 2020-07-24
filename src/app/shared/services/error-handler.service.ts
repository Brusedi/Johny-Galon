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

// РАЗНАЯ НУЖНАЯ ШНЯГА
const ERR_SUBLEVEL_PROP = "callstack";

export enum ErrLevel { Environment, EntitySet, Entity  }  ;

export interface IErrLevelInfo {
    level :  ErrLevel 
    description? : string 
    [ERR_SUBLEVEL_PROP]?: IErrLevelInfo
}

export const isEmpty = (x:any) => !!x

export const safeGet = (e,p,d) => e && e.hasOwnProperty(p) ? e[p] : d; 

// 
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
      tap(x=>console.log(x)),
      mergeMap( x => from(x) ) ,
      //tap(x=>console.log(x))
    )

}

////////////////////////////////////////////////
/*
*  ПАРСИТ ПРОИЗВОЛЬНУЮ ОШИБКУ И ПРИВОДИТ К СТАНДАРТИЗИРОВАННОМУ ВИДУ 
*/
export class ErrorParsed {
  ;
      private readonly WWW_AUTH_HEADER = "www-authenticate";
      private readonly X_CAP = "Ошибка";
      private readonly X_DSC = "Неизвестная ошибка";
  
      
      private isHtml = (err) => err.hasOwnProperty('status') &&  err.hasOwnProperty('statusText') ? true : false ; 
      private isHtmlWithAuthBearer = (err) => err.hasOwnProperty('headers') &&  err['headers'].hasOwnProperty(this.WWW_AUTH_HEADER) ? true : false ;  
  
      caption:string;
      description:string;
      
      constructor(public objectError:any ) 
      {
          this.objectError = safeGet(objectError,"error",objectError);
          this.caption     = this.X_CAP;
          this.description = this.X_DSC;
          this.TryParseError(this.objectError)
  
          console.log( this.objectError);
          console.log( this.caption);
          console.log( this.description);
      }
  
      private TryParseError = (err:any) => this.isHtml(err)? this.tryParseHtml(err) : this.tryParseUnknown(err)
  
      private tryParseUnknown = (err:any) => {
          this.caption     = safeGet(err,"Name",this.X_CAP) ;
          this.description = safeGet(err,"Message",this.X_DSC) ;
      }
  
      private tryParseHtmlSimpl = (err:any) => {
          this.caption  = tMonad.of(safeGet(err,"status",this.X_CAP) )
              .map( x => x ? x : "Ошибка HTML" )
              .run();
  
          this.description = Either.Right<string,any>(safeGet(err,"statusText",this.X_DSC))
              .LeftIsNotEmptyOrMap( x =>  safeGet(err, ERR_SUBLEVEL_PROP , undefined)  ) 
              .tap( x => console.log(x)  )
              .map( ErrLevelToString )
              .LeftIsNotEmptyOrMap( x => this.X_DSC  ) 
              .run();

      }
  
  
      private  tryParseHtml = (err) => this.tryParseHtmlSimpl(err)
          // this.isHtmlWithAuthBearer(err) 
          // ?    
  
      toDialogData = () => ({ Message: this.description, Name:this.caption });    
      
  
  }
