import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromSelectors from '@appStore/selectors/index';
import * as fromStore     from '@appStore/index';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';





const SUB_SOURCE_PARAM_DATA_KEY = 'ServiceLocation';

@Component({
  selector: 'app-jn-root-page',
  templateUrl: './jn-root-page.component.html',
  styleUrls: ['./jn-root-page.component.css']
})
export class JnRootPageComponent implements OnInit {

  public subCaption$ : Observable<string>; 
  public spiner$ : Observable<boolean>; 

  constructor(private store: Store<fromStore.State>
    ) {
      
  }

  ngOnInit() {
    this.subCaption$ = this.store.select( fromSelectors.selCurItemMetaNote() ); 
    this.spiner$ = this.store.select(  fromSelectors.selIsBuzy() ).pipe( map(x => !x)  );

    this.store.select(  fromSelectors.selectErrors()).subscribe(x=>console.log(x));

    //this.spiner$.subscribe(x=>console.log(x));
   
    // this.store.dispatch( new PrepareByLoc( './Ax/Enum/NVASDServiceDesc' )  );
    // this.store.dispatch( new PrepareByLoc( './Ax/NvaSdEventType?servicedescid={ServiceDescID}' )  );

    // this.store.dispatch( new PrepareByLoc( './Ax/Enum/NVASDServiceDesc' )  );
    // this.store.dispatch( new PrepareByLoc( './Ax/NvaSdEventType?servicedescid={ServiceDescID}' )  );

    // this.store.dispatch( new PrepareByLoc( './Ax/Enum/NVASDServiceDesc' )  );
    // this.store.dispatch( new PrepareByLoc( './Ax/NvaSdEventType?servicedescid={ServiceDescID}' )  );

  }

}
