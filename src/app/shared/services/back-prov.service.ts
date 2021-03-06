import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromStore from '@appStore/index';
import * as fromSelectors from '@appStore/selectors/index';
import { BackICommonError, BackICommonErrorEx } from '@appModels/any-entity';
import { of, Observable } from 'rxjs';
import { ErrorAnyEntity } from '@appStore/actions/any-entity.actions';
import { combineLatest, map, switchMap, mergeMap, tap, take } from 'rxjs/operators';



/**
* BACK - SEPTOR  Error Handler 
*/


const isBackICommonError = (x:any) => 
    x &&
    x.hasOwnProperty('Name') &&
    x.hasOwnProperty('Message') &&
    x.hasOwnProperty('Code') &&
    x.hasOwnProperty('Data') ;

const isJSMessageError = (x:any) => 
    x &&
    x.hasOwnProperty('message') &&
    x.hasOwnProperty('stack')    

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

    public map = (f:((x:any)=>any )) => this.bind( y => errBuilder.of( f(y)) );  
    public tap = (f:((x:any)=>any )) => { f(this.data.error?this.data.error:this.data.val ); return this;}   

    public toError = ( defError:BackICommonError ) =>   this.data.error ? this.data.error : defError ;
    public ifError = (f:( (x:any)=>boolean )) => this.bind( y => f(y) ?   errBuilder.error(y) : errBuilder.of(y)  ); 
    public ifMap = (fCheck:( (x:any)=>boolean ), fmap:( (x:any)=>BackICommonError  )  ) => this.bind( y => fCheck(y) ?   errBuilder.error(fmap(y)) : errBuilder.of(y)  ); 

    
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
          .map( x => x&&x.hasOwnProperty('_body') ? JSON.parse(x['_body']) : x  )
          .ifError( x => isBackICommonError(x) )
          .ifMap(isJSMessageError, x => ({ 
                    Name: x.message, 
                    Message: x.stack,
                    Code:0,
                    StatusCode:0,
                    Data:x 
                })
            )
          .toError(unknownError(responce))

    /**
     * Convert error responce to Error Entity action
     */      
    public actionErrorfromResponse$ =  (responce:Response)  => 
        this.errorPreHandler$(this.backErrorHandler(responce)).pipe(
            map( x => new ErrorAnyEntity(x) ) ,   
        )

    /**
     * Convert error responce to Error Entity action
     */      
    public actionErrorfromAny$ =  (responce:any)  => this.actionErrorfromResponse$(responce).pipe(tap(x=>console.log(x))) ;


     /**
     * Convert error responce to Error Entity action
     */      
    public actionErrorfromCatch$ = (error:any)  =>  this.actionErrorfromResponse$(error).pipe(tap(x=>console.log(x)))    ;
        // of(error).pipe(
        //     tap( x => console.log(x) ),
        //     map( x => new ErrorAnyEntity(x ) )
        // )
        


    /**
     * Convert error responce to Error Entity action as Value
     */      
    // public actionErrorfromResponse =  (responce:Response)  => {
    //     this.actionErrorfromResponse$(responce).pipe(
    //         take(1)
    //     ).subscribe( )            

    // }
        


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
