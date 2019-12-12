import { Component, OnInit, Input } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { AnyEntity } from '@appModels/any-entity';
import { FormGroup } from '@angular/forms';
import { take } from 'rxjs/operators';
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

  constructor(private store: Store<fromStore.State>) { }

  ngOnInit() {


  }

  onSubmit() {
    // this.store.select(fromSelectors.selCurRowSeed()).subscribe( 
    //   x => this.store.dispatch( new ExecItemAction( {itemOption:opt , itemAction: new ChangeRowSeed(x) })  new ExecCurrent( new AddItem(x) )  )
    // ).unsubscribe();
  }  
}
