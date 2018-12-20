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
import { tap, map } from 'rxjs/operators';
import { Exec, AddItem, SetCurrent } from '@appStore/actions/any-entity-set.actions';
import { anyEntityOptions, AnyEntityId, AnyEntity } from '@appModels/any-entity';
import { GetItemsMeta } from '@appStore/actions/any-entity.actions';



const MODULE_NAME = 'John Galon';
const COMPONENT_NAME = 'Root';
const log = (msg:any) => ( console.log("["+MODULE_NAME+"]"+"["+COMPONENT_NAME+"] " + msg )  );

const OPTION_PARAM_DATA_KEY = 'option';

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

    //this.store.select( fromSelectors.selectDatas ).subscribe(x=>console.log(x))

    //this.route.data.subscribe( x => console.log(x ) );
 
    //this.store.select( fromSelectors.selectIsMetaLoaded()).subscribe(x=>console.log(x))

    // route.data.pipe(
    //      map(x => x.option )
    //    ).subscribe(x=>console.log(x.name));

    // route.data.pipe(
    //   map(x => x[OPTION_PARAM_DATA_KEY] )
    // ).subscribe(
    //   (x:anyEntityOptions<AnyEntity>) => {
    //     store.dispatch( new AddItem(x) );
    //     store.dispatch( new SetCurrent(x.name) );
    //     store.dispatch( new Exec( {name:x.name , itemAction: new GetItemsMeta() }) )
    //   }
    // ) 


    // const NvaSdEventTypeOption:anyEntityOptions<AnyEntityId> = {
    //   name: "JgMockTable", 
    //   location:"/NvaSd2/JgMockTable", 
    //   selectId: (x) => x.id,
    //   selBack: (x:string) => ("?ID=" + x )
    // };
    
    // store.dispatch( new AddItem( NvaSdEventTypeOption) )
    // store.dispatch( new Exec( {name:"JgMockTable" , itemAction: new GetItemsMeta() }) )
  }

  onClickMe() {
    //this.store.dispatch( new JnChangeSource('/NvaSd2/NvaSdIncoming' )  );
  }  

  ngOnInit() {
      //this.store.subscribe(x=>console.log(x));
  }

  ngOnDestroy(){
    //this.subscr.unsubscribe();
  }

}
