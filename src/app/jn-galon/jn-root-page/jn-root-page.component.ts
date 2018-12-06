import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs/operators';

import * as RouterActions from '@appStore/actions/router.actions';
import * as fromStore from '@appStore/index';

const SUB_SOURCE_PARAM_DATA_KEY = 'ServiceLocation';

@Component({
  selector: 'app-jn-root-page',
  templateUrl: './jn-root-page.component.html',
  styleUrls: ['./jn-root-page.component.css']
})
export class JnRootPageComponent implements OnInit {

  constructor(private store: Store<fromStore.State>
    ) {
      
  }

  ngOnInit() {
   
    //console.log(this.store);
    //this.store.pipe(tap( x => console.log(x) ) );

    //this.store.dispatch(new RouterActions.Go({ path:['tutoral/sd']}));
    //this.store.dispatch(new RouterActions.Back());
  }

}
