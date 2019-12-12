import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromStore from '@appStore/index';
import * as fromSelectors from '@appStore/selectors/index';
import { BackICommonError, BackICommonErrorEx } from '@appModels/any-entity';
import { of, Observable } from 'rxjs';
import { ErrorAnyEntity } from '@appStore/actions/any-entity.actions';
import { combineLatest, map, switchMap, mergeMap } from 'rxjs/operators';



/**
* BACK - SEPTOR  Error Handler 
*/


const isBackICommonError = (x:any) => 
    x.hasOwnProperty('Name') &&
    x.hasOwnProperty('Message') &&
    x.hasOwnProperty('Code') &&
    x.hasOwnProperty('Data') ;

const unknownError = (data:any) =>({
        Name:"Ошибка", 
        Message: "Неизвестная ошибка",
        Code:0,
        StatusCode:0,
        Data:data 
});

const newErrorId = () => `err${(+new Date).toString(16)}`

interface buildErr{
     val:any   
     error:BackICommonError
}


/**
 * BuildError monad  
 */
export class errBuilder {
    static of  = (x:any) => new errBuilder({val:x, error:null })
    static error = (x:BackICommonError) => new errBuilder({val:null, error:x })
    private constructor(public data:buildErr) { }

    public bind:((f:((data:any) => errBuilder)) => errBuilder ) = (f) => this.data.error ? this : f(this.data.val) ;
    public ret = ( defError:BackICommonError ) =>   this.data.error ? this.data.error : defError ;

    public ifError = (f:( (x:any)=>boolean )) => this.bind( y => f(y) ?   errBuilder.error(y) : errBuilder.of(y)  ); 
    public map = (f:((x:any)=>any )) => this.bind( y => errBuilder.of( f(y)) );  
    public tap = (f:((x:any)=>any )) => { f(this.data.error?this.data.error:this.data.val ); return this;}   
    
}  

@Injectable({
  providedIn: 'root'
})

export class BackProvService {

    constructor( private store: Store<fromStore.State>) { }

    /**
     *  parse Error from CRUD Back responce
     */
    private backErrorHandler:( (responce:Response) => BackICommonError ) = (responce) => 
        errBuilder
          .of(responce)
          .ifError( x => isBackICommonError(x) )
          .map( x => x.hasOwnProperty('_body') ? JSON.parse(x['_body']) : x  )
          .ifError( x => isBackICommonError(x) )
          .ret(unknownError(responce))

    /**
     * Convert error responce to Error Entity action
     */      
    public actionErrorfromResponse$ =  (responce:Response)  => 
        this.errorPreHandler$(this.backErrorHandler(responce)).pipe(
            map( x => new ErrorAnyEntity(x ) )    
        )

    /**
     *  Error pre handler
     */    
    private errorPreHandler$:((err:BackICommonError) => Observable<BackICommonErrorEx> ) = (err) =>  
        this.isErrorRetriable$(err).pipe(
            map( x => ({...err , Id:newErrorId() , Retriable:x  }))
        )

    /**
     *  Check is error retryable
     */    
    private isErrorRetriable$ =   (err:BackICommonError)  => of( !!(err.StatusCode == 500 ))
          
}
