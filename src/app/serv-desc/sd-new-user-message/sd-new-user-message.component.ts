import { FormGroup }          from '@angular/forms';
import { Component, OnInit }  from '@angular/core';
import { Store }              from '@ngrx/store';
import { Observable, from, Subscription, of  }         from 'rxjs';
import { skipUntil, skip, tap, filter, map, mergeMap, distinctUntilChanged, combineLatest }          from 'rxjs/operators';

import * as fromStore         from '@appStore/index';
import * as fromSelectors     from '@appStore/selectors/index';
import { ExecCurrent, PartLoadByLoc }        from '@appStore/actions/any-entity-set.actions';
import { GetTemplateRowSeed, ChangeRowSeed, AddItem } from '@appStore/actions/any-entity.actions';


const flds = ['RecipientId','EventText','SenderContact','IsConfidential'];
const rowSeedExtFoo = () => ({ EventTypeID:"VoluntaryReportsInfo", CreatedDateTime:new Date() });

@Component({
  selector: 'app-sd-new-user-message',
  templateUrl: './sd-new-user-message.component.html',
  styleUrls: ['./sd-new-user-message.component.css']
})

export class SdNewUserMessageComponent implements OnInit {


  public controls$: Observable<{ questions:any, formGroup:FormGroup} >;
  private subscriptions:                  Subscription[] = [];

  constructor(private store: Store<fromStore.State>) { }

  ngOnInit() {
    this.buildStreams() ;   
    this.buildSubscriptions();
    this.store.dispatch( new ExecCurrent( new GetTemplateRowSeed() ) );
  }

  buildStreams(){
    // Build controls set after getting row template
    this.controls$ = 
      this.store.select( fromSelectors.selCurFormControlsEx( flds ,{})).pipe(
        //this.store.select( fromSelectors.selCurFormControls()).pipe(
         skipUntil( this.store.select( fromSelectors.selCurRowTemplate() ).pipe( skip(1) ) )   //горбатенько немного...
         ,tap(x=>console.log(x) ) 
      );  

  } 

  buildSubscriptions(){
    this.subscriptions.push(
      this.controls$
        .pipe( mergeMap(x => x.formGroup.valueChanges))
        .subscribe( x=> this.store.dispatch(new ExecCurrent( new ChangeRowSeed({...x, ...rowSeedExtFoo()})  ) ))   ///new SetRowSeed(x)
    );
  } 

  ngOnDestroy(){ 
    while(this.subscriptions.length > 0){
      this.subscriptions.pop().unsubscribe(); 
    } 
  }

  // ---------------------
  onSubmit() {
    //по дурацки пока...
     this.store.select(fromSelectors.selCurRowSeed()).subscribe( 
       x => this.store.dispatch(new ExecCurrent( new AddItem(x) ))
     ).unsubscribe();
  }

}
