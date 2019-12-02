import { Component, OnInit, Input } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { AnyEntity } from '@appModels/any-entity';
import { FormGroup } from '@angular/forms';
import { take } from 'rxjs/operators';



interface jnForm { questions:any, formGroup:FormGroup} ;

@Component({
  selector: 'app-jn-new-item-content',
  templateUrl: './jn-new-item-content.component.html',
  styleUrls: ['./jn-new-item-content.component.css']
})

export class JnNewItemContentComponent implements OnInit {

  @Input() item$:Observable<AnyEntity>;
  @Input() controls$: Observable<jnForm>;

  //private formDataSubj$ = new BehaviorSubject<jnForm>( undefined );

  //public  formDataSubj$ = this.formDataSubj.asObservable(); 

  constructor() { }

  ngOnInit() {

    //this.item$.subscribe(x=> console.log(x)  )
    //this.controls$.pipe(take(1)).subscribe(x=> this.formDataSubj$.next(x) )

    //this.formDataSubj$.subscribe(x=> console.log(x));

  }

}
