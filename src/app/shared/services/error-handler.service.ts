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
                  tag:'NVAVIA' 
                }) 
            : new ErrorEnvironment(action.payload)
      ),
      map( x => [  new ExecItemAction( {itemOption:options , itemAction:new ErrorAnyEntityReset() }) , x] ),
      mergeMap( x => from(x) ) ,
      //tap(x=>console.log(x))
    )

}
