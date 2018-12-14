import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromStore from '@appStore/index';

@Injectable({
  providedIn: 'root'
})


export class QuestionAdaptService {

  constructor(
    private store: Store<fromStore.State>
    ) { }

    
}
