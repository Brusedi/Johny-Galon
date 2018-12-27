import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {MatIconRegistry} from '@angular/material';

import * as fromSelectors from '@appStore/selectors/index';
import * as fromStore     from '@appStore/index';
import { Observable, of } from 'rxjs';
import { delay, startWith, take, map } from 'rxjs/operators';




const SUB_SOURCE_PARAM_DATA_KEY = 'ServiceLocation';

@Component({
  selector: 'app-jn-root-page',
  templateUrl: './jn-root-page.component.html',
  styleUrls: ['./jn-root-page.component.css']
})
export class JnRootPageComponent implements OnInit {

  private subCaption$ : Observable<string>; 
  private spiner$ : Observable<boolean>; 

  constructor(private store: Store<fromStore.State>
    ) {
      
  }

  ngOnInit() {
    this.subCaption$ = this.store.select( fromSelectors.selCurItemMetaNote() ); 
    this.spiner$ = this.store.select(  fromSelectors.selItemsIsLoading() ).pipe(map(x =>!x) );
  }

}
