import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap, map, filter, tap, combineLatest } from 'rxjs/operators';
import { Observable} from 'rxjs';
import { EntityProvService } from 'app/shared/services/entity-prov.service';
import { ActionContent } from '@appModels/entity-options';
import { Store } from '@ngrx/store';


import * as fromStore from '@appStore/index';
import * as fromSelectors from '@appStore/selectors/index';
import { ExecItemAction } from '@appStore/actions/any-entity-set.actions';
import { ChangeRowSeed, SetRowSeed } from '@appStore/actions/any-entity.actions';


const FIELDS_LIST =  [
        "Name",
        "Description",
        "Owner",
        "IsActive",
        "OrderKey",
        "Content",
        "CntSubHdr",
        "CntFooter",
        "ImageKey",
        "IsExStyle",
        "QRUrl"
      ];

@Component({
  selector: 'app-jn-web-cnt-item',
  templateUrl: './jn-web-cnt-item.component.html',
  styleUrls: ['./jn-web-cnt-item.component.css']
})

export class JnWebCntItemComponent implements OnInit {

  
  controls$:  Observable<any>;
  isValid$:   Observable<Boolean>;
  header$:   Observable<{caption:string ; description:string ; id:any  }>;

  constructor(private entityProv: EntityProvService, private route: ActivatedRoute ,private store: Store<fromStore.State>) { }

  ngOnInit() {

    const item$ = this.route.paramMap.pipe(
       map((params: ParamMap) => params.get('id') ),
       switchMap( id => this.entityProv.itemData$( ActionContent, id ) ),
       filter(x => !!x )
    );

    const rowseed$ = this.store.select( fromSelectors.selRowSeed( ActionContent.name) ).pipe(filter(x=>!!x));

    this.header$ = this.store.select( fromSelectors.selectDataMetadataHeader( ActionContent.name) ).pipe(
        combineLatest( item$, (x,y)=> ({...x , id:y.id }) ),
        combineLatest( rowseed$, (x,y)=> ({...x , caption:x.caption + " [ " + y.Name +" ] "  })  )
    )
   
    this.controls$ = this.route.paramMap.pipe(
       map((params: ParamMap) => params.get('id') ),
       switchMap( x =>  this.entityProv.controlsForEditEx$( ActionContent, x , FIELDS_LIST ) ) 
    )  

    this.isValid$ =  this.controls$.pipe( map( x => x.formGroup.valid) )
    
    }

  Save() {
    this.entityProv.updateItemByRowSeed(ActionContent).unsubscribe();
  }  

}
