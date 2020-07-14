import { Component, OnInit } from '@angular/core';
import { EntityProvService } from 'app/shared/services/entity-prov.service';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import * as fromStore from '@appStore/index';
import * as fromSelectors from '@appStore/selectors/index';
import { Observable } from 'rxjs';
import { RiskExamItemsOption } from '@appModels/entity-options';


@Component({
  selector: 'app-jn-risk-exam',
  templateUrl: './jn-risk-exam.component.html',
  styleUrls: ['./jn-risk-exam.component.css']
})

export class JnRiskExamComponent implements OnInit {

  controls$:  Observable<any>;

  constructor(private entityProv: EntityProvService, private route: ActivatedRoute ,private store: Store<fromStore.State>) { }

  ngOnInit() {
    //this.controls$ =  this.entityProv.controlsForEditEx$( RiskExamItemsOption, x , FIELDS_LIST ) )   )  

    // this.controls$ = 
    //    this.store.select( fromSelectors.selCurFormControlsEx( flds ,{})).pipe(
    //     skipUntil( this.store.select( fromSelectors.selCurRowTemplate() ).pipe( skip(1) ) )   //горбатенько немного...
    //  );  

    this.controls$ = this.entityProv.controlsForEntityDefTempl$(RiskExamItemsOption,[]);

    this.controls$.subscribe( x=> console.log(x));

  }

}
