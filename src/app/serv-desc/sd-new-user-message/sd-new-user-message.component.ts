import { FormGroup }          from '@angular/forms';
import { Component, OnInit }  from '@angular/core';
import { Store }              from '@ngrx/store';
import { Observable }         from 'rxjs';
import { skipUntil, skip, tap }          from 'rxjs/operators';

import * as fromStore        from '@appStore/index';
import * as fromSelectors from '@appStore/selectors/index';
import { ExecCurrent } from '@appStore/actions/any-entity-set.actions';
import { GetTemplateRowSeed } from '@appStore/actions/any-entity.actions';



@Component({
  selector: 'app-sd-new-user-message',
  templateUrl: './sd-new-user-message.component.html',
  styleUrls: ['./sd-new-user-message.component.css']
})
export class SdNewUserMessageComponent implements OnInit {

  public controls$: Observable<{ questions:any, formGroup:FormGroup} >;


  constructor(private store: Store<fromStore.State>) { }

  ngOnInit() {
    console.log('eee');
    this.buildStreams() ;   
    //this.buildSubscriptions();
    this.store.dispatch( new ExecCurrent( new GetTemplateRowSeed() ) );
  }

  buildStreams(){
    // Build controls set after getting row template
    this.controls$ = 
      this.store.select( fromSelectors.selCurFormControls()).pipe(
         skipUntil( this.store.select( fromSelectors.selCurRowTemplate() ).pipe( skip(1) ) )   //горбатенько немного...
         ,tap(x=>console.log(x) ) 
      );  

  } 


}
