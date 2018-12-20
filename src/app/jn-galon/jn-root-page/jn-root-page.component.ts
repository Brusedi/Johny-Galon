import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromSelectors from '@appStore/selectors/index';
import * as fromStore     from '@appStore/index';


const SUB_SOURCE_PARAM_DATA_KEY = 'ServiceLocation';

@Component({
  selector: 'app-jn-root-page',
  templateUrl: './jn-root-page.component.html',
  styleUrls: ['./jn-root-page.component.css']
})
export class JnRootPageComponent implements OnInit {

  private subCaption : string; 

  constructor(private store: Store<fromStore.State>
    ) {
      
  }

  ngOnInit() {

    this.subCaption = "";
    this.store.select( fromSelectors.selCurItemMetaNote() ).subscribe(x => this.subCaption = x);
    
    //console.log(this.store);
    //this.store.pipe(tap( x => console.log(x) ) );

    //this.store.dispatch(new RouterActions.Go({ path:['tutoral/sd']}));
    //this.store.dispatch(new RouterActions.Back());
  }

}
