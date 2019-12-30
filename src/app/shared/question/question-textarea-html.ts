import { QuestionBase } from './question-base';

export class TextareaHtmlQuestion extends QuestionBase<string> {
  controlType = 'textarea_html';
  type: string;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}

/*
Copyright 2017-2018 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/