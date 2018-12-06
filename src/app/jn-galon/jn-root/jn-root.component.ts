/** / \/ |( / |/ /_\    
*   \/\/\_\/\/\_\__/
*  280418-220518 Presentation entity root compnent
*/

import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store} from '@ngrx/store';
import { Subscription } from 'rxjs';
import * as fromStore from '@appStore/index';

import * as fromSelectors from '@appStore/selectors/index';
import { tap } from 'rxjs/operators';



const MODULE_NAME = 'John Galon';
const COMPONENT_NAME = 'Root';
const log = (msg:any) => ( console.log("["+MODULE_NAME+"]"+"["+COMPONENT_NAME+"] " + msg )  );

const SUB_SOURCE_PARAM_DATA_KEY = 'ServiceLocation';

@Component({
  selector: 'app-jn-root',
  templateUrl: './jn-root.component.html',
  styleUrls: ['./jn-root.component.css']
})

export class JnRootComponent implements OnInit , OnDestroy {

  private subscr:Subscription;
  //private db:Db ;
  //db:Db ;

  constructor(
    private route: ActivatedRoute,
    private store: Store<fromStore.State>
  ){

    //console.log(route) ; 
    //store.select( fromSelectors.getRouterInfo ).pipe(tap(x=>console.log(x)));
    
    // route.data
    //   .map(x => x.data[SUB_SOURCE_PARAM_DATA_KEY] );

    // this.subscr  =  
    //   route.data
    //     .map(x => x.data[SUB_SOURCE_PARAM_DATA_KEY] )
    //     .subscribe( x => store.dispatch(  new JnChangeSource(x) ));

    // this.store.pipe( select(fromSelectors.getLocation) ).subscribe( x=> console.log(x));    
    

    // this.db = dbEng.db( 
    //   this.store
    //     .pipe( select(fromSelectors.getLocation) )
    //     .filter( x => x!='') 
    // );

    // посконный релиз    
    // this.db = dbEng.db( 
    //     route.data.map(x => x.data[SUB_SOURCE_PARAM_DATA_KEY] ) 
    // );
    
  }

  onClickMe() {
    //this.store.dispatch( new JnChangeSource('/NvaSd2/NvaSdIncoming' )  );
  }  

  ngOnInit() {

  }

  ngOnDestroy(){
    //this.subscr.unsubscribe();
  }

}
