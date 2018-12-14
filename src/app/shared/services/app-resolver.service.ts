import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromStore from '@appStore/index';
import * as fromSelectors from '@appStore/selectors/index';
import { filter, take, map, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { anyEntityOptions, AnyEntity } from '@appModels/any-entity';
import { GetItemsMeta } from '@appStore/actions/any-entity.actions';
import { SetCurrent, Exec, AddItem } from '@appStore/actions/any-entity-set.actions';

const OPTION_PARAM_DATA_KEY = 'option';

@Injectable({
  providedIn: 'root'
})
export class AppResolverService implements Resolve<any> {

  constructor(private store: Store<fromStore.State>) { }

  resolve(route: ActivatedRouteSnapshot, state:RouterStateSnapshot) {
      const loadData = ( opt:anyEntityOptions<AnyEntity> ) => {
        const load = () => {
          this.store.dispatch( new Exec( {name:opt.name , itemAction: new GetItemsMeta() }) ) ;
          this.store.dispatch( new SetCurrent(opt.name) );
        } 
        
        this.store.select( fromSelectors.selectIsExist(opt.name))
          //.pipe(take(1))
          .pipe( tap( x => console.log(x) ) )
          .subscribe( 
            x => !x ?  this.store.dispatch( new AddItem(opt)) : load()         
          )
      }
      loadData(route.data[OPTION_PARAM_DATA_KEY]);
      
    return of(true);
      // return this.store.select( fromSelectors.selectIsMetaLoaded()).pipe( 
      //     filter( loaded => loaded ),
      //     take(1)
      // ); 
  }
}
