import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromSelectors from '@appStore/selectors/index';
import * as fromStore     from '@appStore/index';
import { Observable, of } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';


const SUB_SOURCE_PARAM_DATA_KEY = 'ServiceLocation';

@Component({
  selector: 'app-jn-root-page',
  templateUrl: './jn-root-page.component.html',
  styleUrls: ['./jn-root-page.component.css']
})
export class JnRootPageComponent implements OnInit {

  public subCaption$ : Observable<string>; 
  public spiner$ : Observable<boolean>; 
  public isAuthButCaption$ : Observable<string>; 

  constructor(private store: Store<fromStore.State>
    ) {
      
  }

  ngOnInit() {
    this.subCaption$ = this.store.select( fromSelectors.selCurItemMetaNote() ); 
    this.spiner$ = this.store.select(  fromSelectors.selIsBuzy() ).pipe( map(x => !x)  );
    this.isAuthButCaption$ = this.store.select(  fromSelectors.selEnvIsAuthed ).pipe( startWith(false),  map( x => !x?'Войти':'Выйти') , tap(console.log) );
    
    this.store.select(  fromSelectors.selectEnvironment ).pipe(tap(console.log)).subscribe(x=>console.log(x));

    //this.store.select(  fromSelectors.selectErrors()).subscribe(x=>console.log(x));
  }

}
