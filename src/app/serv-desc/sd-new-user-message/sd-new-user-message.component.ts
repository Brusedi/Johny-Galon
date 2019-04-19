import { FormGroup }          from '@angular/forms';
import { Component, OnInit }  from '@angular/core';
import { Store }              from '@ngrx/store';
import { Observable, from, Subscription, of  }         from 'rxjs';
import { skipUntil, skip, tap, filter, map, mergeMap, distinctUntilChanged, combineLatest, skipWhile, takeLast, take }          from 'rxjs/operators';

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
  private buzy$:Observable<boolean>;
  private complete$ :Observable<boolean>;
  private isComplete: boolean; 
  private fGroup:FormGroup; 
  private fQuestions:FormGroup; 

  private subscriptions:Subscription[] = [];


  constructor(private store: Store<fromStore.State>) { }

  ngOnInit() {
    this.isComplete= false;
    this.buildStreams() ;   
    this.buildSubscriptions();
    this.store.dispatch( new ExecCurrent( new GetTemplateRowSeed() ) );
  }

  buildStreams(){

    // Build controls set after getting row template
    this.controls$ = 
      this.store.select( fromSelectors.selCurFormControlsEx( flds ,{})).pipe(
         skipUntil( this.store.select( fromSelectors.selCurRowTemplate() ).pipe( skip(1) ) )   //горбатенько немного...
      );  

   
    this.buzy$ = this.store.select( fromSelectors.selCurItem( )).pipe(
        map( x => x.state.uploading ),
        distinctUntilChanged()
    );

    // тригерный требует переподписи в случае ресета
    this.complete$ = 
      this.store.select( fromSelectors.selCurInsertedId()).pipe(
        skipWhile( x => !!x ),
        filter( x => !!x ),
      )
  } 

  buildSubscriptions(){

    // push control changes to store
    this.subscriptions.push(
      this.controls$
        .pipe( mergeMap(x => x.formGroup.valueChanges))
        .subscribe( x=> this.store.dispatch(new ExecCurrent( new ChangeRowSeed({...x, ...rowSeedExtFoo()})  ) ))   ///new SetRowSeed(x)
    );

    // formGroup to loc var  
    this.subscriptions.push(
       this.controls$.pipe( filter (x => !!x.formGroup )).subscribe( x => { this.fGroup = x.formGroup; this.fQuestions = x.questions } )
    );

    // formGroup disabled while inserting
    this.subscriptions.push(  
      this.buzy$.subscribe( x => 
        !this.fGroup 
          ? null  
          : x && this.fGroup.enabled 
              ?  this.fGroup.disable() 
              :  !x &&  this.fGroup.disabled ?  this.fGroup.enable() : null 
    ));

    //Complete flag
    this.complete$.subscribe(x => this.isComplete = true ); //TODO
    //this.store.select( fromSelectors.selCurInsertedRec() ).subscribe( x => this.isComplete = true );

  } 

  ngOnDestroy(){ 
    while(this.subscriptions.length > 0){
      this.subscriptions.pop().unsubscribe(); 
    } 
  }

  // ---------------------
  onSubmit() {
    // надо задисаблить кнопку и ждать

    //по дурацки пока...
     this.store.select(fromSelectors.selCurRowSeed()).pipe(take(1)).subscribe( 
       x => {console.log(x) ;this.store.dispatch(new ExecCurrent( new AddItem(x) ))}
     ).unsubscribe();
  }

  onAddNextMessageClick(){
    this.isComplete = false;
  }

}
