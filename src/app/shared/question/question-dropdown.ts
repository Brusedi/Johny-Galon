import { QuestionBase } from './question-base';
import { Observable } from 'rxjs';
//import { locationToEntityOption, locationInfo } from '../services/foregin/foreign-key.helper';

export class DropdownQuestion extends QuestionBase<string> {
  controlType = 'dropdown';
  options: {key: string, value: string}[] = [];
  options$: Observable<{key: string, value: string}[]> = null;
  optionsRefLoc: string = null;

  constructor(options: {} = {} ) {
    super(options);

    this.options = options['options'] || [];
    this.options$ = options['options$'] || null;
    this.optionsRefLoc = options['optionsRefLoc'] || null;

    //
    //const a = this.optionsRefLoc ? locationToEntityOption(this.optionsRefLoc) : null ;
    //if(this.optionsRefLoc){console.log(locationInfo(this.optionsRefLoc )) }
    //console.log(this.order);
    
  }
}


/*
Copyright 2017-2018 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/