import { Component, OnInit, Input } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { AnyEntity } from '@appModels/any-entity';
import { FormGroup, Validators } from '@angular/forms';
import { filter, map, mergeMap, switchMap, take, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import * as fromStore from '@appStore/index';
import * as fromSelectors from '@appStore/selectors/index';
import { ExecCurrent } from '@appStore/actions/any-entity-set.actions';

interface jnForm { questions:any, formGroup:FormGroup} ;

@Component({
  selector: 'app-jn-new-item-content',
  templateUrl: './jn-new-item-content.component.html',
  styleUrls: ['./jn-new-item-content.component.css']
})

export class JnNewItemContentComponent implements OnInit {

  //@Input() item$:Observable<AnyEntity>;
  @Input() controls$: Observable<jnForm>;

  //public controls: { questions:any, formGroup:FormGroup}; 

  constructor(private store: Store<fromStore.State>) { }

  ngOnInit() {

    //this.buildSubscriptions();

    //this.controls$.pipe( tap( x => x["formGroup"]["valueChanges"].subscribe(x=> console.log(x)) ));

    // this.controls$.subscribe(x=> console.log(x))

    // this.controls$.pipe(
    //    map( x => x["formGroup"]["controls"] ),  
    //    map( x => { x.hasOwnProperty("AirCraft") ? x["AirCraft"].setValidators([Validators.required]) : console.log("222");  return x }),
    //    map( x => x.hasOwnProperty("AirCraft") ? (x["AirCraft"].validator)(x["AirCraft"]) : "eeee"  ),
    //   // map( x => { x.hasOwnProperty("AirCraft") ? x["AirCraft"].setValidators([Validators.required]) : console.log(x);  return null }),
    //    //filter ( x => !!x  )

    // //   //map( (x) => x[2])
    //   ).subscribe(x=> console.log(x))

  }

  ngAfterViewInit(){
    //this.controls$.pipe( tap( x =>  x.formGroup.get('FlightRoute').valueChanges.subscribe(x=> console.log(x)) ));

    //this.controls$.pipe()

    // this.valid$ = this.freeControls$.pipe(
    //   filter(x=>!!x),
    //   tap( x => x.formGroup.get('FlightRoute').valueChanges.subscribe( y => console.log(y)))
    // );

    // this.valid$.subscribe( x => console.log(x));

    //this.valid$ = this.freeControls$.pipe( tap( x => x.formGroup.get('FlightRoute').valueChanges.subscribe( y => console.log(y))));

  }

  buildSubscriptions(){

    // push control changes to store
    
      // this.controls$
      //   .pipe( 
      //     tap(x => console.log(x)),
      //     mergeMap(x => x.formGroup.valueChanges)
      //     )
      //   .subscribe( x => console.log(x))   ///new SetRowSeed(x)

      //   this.controls$.pipe( filter (x => !!x.formGroup&&x.questions ), take(1))
      //   .subscribe( x => this.controls = x )
  };


  onSubmit() {
    // this.store.select(fromSelectors.selCurRowSeed()).subscribe( 
    //   x => this.store.dispatch( new ExecItemAction( {itemOption:opt , itemAction: new ChangeRowSeed(x) })  new ExecCurrent( new AddItem(x) )  )
    // ).unsubscribe();
  }  
}
