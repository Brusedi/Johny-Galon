import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromStore from '@appStore/index';
import * as fromSelectors from '@appStore/selectors/index';
import { filter, take, map, tap, combineLatest, startWith } from 'rxjs/operators';
import { of, interval, pipe } from 'rxjs';
import { anyEntityOptions, AnyEntity } from '@appModels/any-entity';
import { GetItemsMeta } from '@appStore/actions/any-entity.actions';
import { SetCurrent, Exec, AddItem } from '@appStore/actions/any-entity-set.actions';

const OPTION_PARAM_DATA_KEY = 'option';

@Injectable({
  providedIn: 'root'
})
export class AppResolverService implements Resolve<any> {

  constructor(private store: Store<fromStore.State>) { }

  /**
   *  Воще наверное цепь должна делатся через эффекты,
   *  Но для отработки попробуем в ручную ...
   */
  resolve(route: ActivatedRouteSnapshot, state:RouterStateSnapshot) {
    const opt:anyEntityOptions<AnyEntity> = route.data[OPTION_PARAM_DATA_KEY];
    
    return this.store.select( fromSelectors.selectIsExist(opt.name)).pipe(
        tap( x => !x ?  this.store.dispatch( new AddItem(opt)) : null ),
        filter( x => x ),
        combineLatest( this.store.select( fromSelectors.selectIsMetadataLoaded(opt.name)), (x,y)=> y ), 
        tap( x => !x ?  this.store.dispatch( new Exec( {name:opt.name , itemAction: new GetItemsMeta() }) ) : null ),
        filter( x => x ),
        combineLatest( this.store.select( fromSelectors.selCurName()), (x,y)=> y ), 
        tap(x => x != opt.name ? this.store.dispatch( new SetCurrent(opt.name) ) : null ),
        filter( x => x == opt.name ),
        map( x => !!x ),
      ).pipe(
        startWith(false),
        take(2)
      );
  }
}
