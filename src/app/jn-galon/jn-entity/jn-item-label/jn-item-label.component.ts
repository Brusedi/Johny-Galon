import { Component, OnInit, Input } from '@angular/core';

import { Store } from '@ngrx/store';
import * as fromStore from '@appStore/index';
import * as fromSelectors from '@appStore/selectors/index';
import { AnyEntity } from '@appModels/any-entity';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


const f = (n,k) => {
  console.log(n);
  console.log(k);
  return n==0 && k==0 
        ? 1
        : n!==0 && k==0 
          ? 0
          : k > n 
            ? f( n , n) 
            : f(n,k-1)+f(n-k,k)   
}


@Component({
  selector: 'app-jn-item-label',
  templateUrl: './jn-item-label.component.html',
  styleUrls: ['./jn-item-label.component.css']
})

export class JnItemLabelComponent implements OnInit {

  @Input() key: string;
  @Input() recId: any;

  public value$: Observable<string>;
  public label$: Observable<string>;
  public type$: Observable<string>;

  constructor( private store: Store<fromStore.State>
    ) { 

      //f(3,3);
    }

  ngOnInit() {
    //console.log(this.key)
    //console.log(this.recId)
    this.value$ = this.store.select( fromSelectors.selectCurRowVal(this.key, this.recId ))
    this.label$ = this.store.select( fromSelectors.selCurFieldDescribes( )).pipe(
      map(x => x.find( (e) => e.id == this.key )),
      map(x => x&&x.hasOwnProperty('name')&&x.name ? x.name : this.key)
    );
    this.type$ = this.store.select( fromSelectors.selCurFieldDescribes( )).pipe(
      map(x => x.find( (e) => e.id == this.key )),
      map(x => x&&x.hasOwnProperty('type')&&x.type ? x.type : this.key)
    );

    this.value$.subscribe(x=> console.log(x));
  }



}
