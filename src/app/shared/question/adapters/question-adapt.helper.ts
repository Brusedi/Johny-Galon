import { Observable, from } from "rxjs";
import { FieldDescribe } from "@appModels/metadata";
import { QuestionBase } from "../question-base";
import { filter, map, tap } from "rxjs/operators";
import { TextboxQuestion } from "../question-textbox";
import { DropdownQuestion } from "../question-dropdown";
import { DateTimePickerQuestion } from "../question-datetimepicker";
import { DatePickerQuestion } from "../question-datepicker";
import { TextareaQuestion } from "../question-textarea";
import { CheckboxQuestion } from "../question-checkbox";
import { FormControl, FormGroup } from "@angular/forms";

/**
 *  Form Question adapter 
 *  111218
 */

const  BKND_DATE_DATATYPE_NAME = "Date";
const  BKND_DATE_DATATYPE_NAME_NULABLE = "Date?";
const  BKND_DATETIME_DATATYPE_NAME = "DateTime";
const  BKND_TEXT_DATATYPE_NAME = "Text";
const  BKND_BOOL_DATATYPE_NAME = "boolean";
const  BKND_BOOL_DATATYPE_NAME_NULABLE = "boolean?";

interface cdata { descr:FieldDescribe ; ctrl?:QuestionBase<any>; rowSeed$:Observable<{}> } ;    // контейнер для конвеера
type cfactory =  (descr:FieldDescribe,  rowSeed$:Observable<{}> ) => QuestionBase<any> ;      
const ifEmptyAnd = ( c:( (x:cdata) => boolean ) , f:cfactory)  =>  ( (x:cdata) =>  x.ctrl || ! c(x) ? x : { descr:x.descr, ctrl:f(x.descr, x.rowSeed$), rowSeed$:x.rowSeed$ } );

 /**
 * Возвращает сет со списком полей изменения которых надо отслеживать  
 */ 
// export const dbItemQuestionsWithDepFields$ = (dataSourse:Db, rowSeed:Observable<{}>) =>
//      this.dbItemQuestions$(dataSourse,rowSeed)
//      .combineLatest( this.getDependedOwnerFields$( dataSourse), (q,f) => ({ questions:q , fields:f }) )


/**
* Build Item Question set for dbsource
* @param dataSourse 
*/
export const fldDescsToQuestions = (flds:FieldDescribe[],rowSeed:Observable<{}>) => {
    const toCdata = ( d:FieldDescribe) => ( { descr:d , ctrl:null, rowSeed$:rowSeed } as cdata ); 
    const fromCdata = ( d:cdata) =>  d.ctrl ;
    const toQuest = (fld:FieldDescribe, rowSeed:Observable<{}> ) => {
        if( fld.foreignKey) {
            return toDropDown(fld, rowSeed)
        }
        else{
            switch(fld.type){
                case BKND_DATETIME_DATATYPE_NAME: 
                    return toDateTimePicker(fld, rowSeed);
                case BKND_DATE_DATATYPE_NAME: 
                    return toDateTimePicker(fld, rowSeed);
                case BKND_DATE_DATATYPE_NAME_NULABLE: 
                    return toDateTimePicker(fld, rowSeed);
                case BKND_TEXT_DATATYPE_NAME: 
                    return toDateTimePicker(fld, rowSeed);
                case BKND_BOOL_DATATYPE_NAME: 
                    return toDateTimePicker(fld, rowSeed);
                case BKND_BOOL_DATATYPE_NAME_NULABLE: 
                    return toDateTimePicker(fld, rowSeed);
                default: 
                    return toTextBox(fld, rowSeed);
            }

        }
    } 
    return flds
            .filter( x => ( x.visible != false ))
            .map(x => toQuest(x, rowSeed));
}

/******************************************************************************************************* */
const buildQuestionBaseOption = (x:FieldDescribe, rowSeed$:Observable<{}>) => ({  
    key: x.altId,
    label:x.name, 
    required:!!x.required, 
    hint: x.description,
    validators: x.validators,
    validationMessages: x.validationMessages,
    order: x.order,
    disabled: !x.editable 
});


const toTextBox = (x:FieldDescribe, rowSeed$:Observable<{}>) => 
    new TextboxQuestion(  
        buildQuestionBaseOption(x, rowSeed$ ) 
  );
    
const toDropDown = (x:FieldDescribe, rowSeed$:Observable<{}>) => { 
    const buildOptions = (loc:string, rs$:Observable<{}> ) =>  ({})//this.fkEngin.getForeginList$(loc, rs$ ) ;
    const buildBaseOption = (x:FieldDescribe, rowSeed$:Observable<{}>) => {
        var ret = buildQuestionBaseOption(x, rowSeed$ );
        ret['options$'] = buildOptions(x.foreignKey, rowSeed$);      
        return ret;
    }
  return new DropdownQuestion(buildBaseOption(x,rowSeed$)) ; 
}

const toDateTimePicker = (x:FieldDescribe, rowSeed$:Observable<{}>) => { 
    //console.log("toDateTimePicker")
    return new DateTimePickerQuestion(
        buildQuestionBaseOption(x, rowSeed$ ) 
    ); 
}

const toDatePicker = (x:FieldDescribe, rowSeed$:Observable<{}>) => { 
    //console.log("toDatePicker")
    return new DatePickerQuestion(
        buildQuestionBaseOption(x, rowSeed$ ) 
    ); 
}

const toTextArea = (x:FieldDescribe, rowSeed$:Observable<{}>) => { 
    //console.log("TextareaQuestion")
    return new TextareaQuestion(
        buildQuestionBaseOption(x, rowSeed$ ) 
    ); 
}

const toCheckbox = (x:FieldDescribe, rowSeed$:Observable<{}>) => { 
    //console.log("toDatePicker")
    return new CheckboxQuestion(
        buildQuestionBaseOption(x, rowSeed$ ) 
    ); 
}


//***********************************************************************************************************************/
/**
   * Convert  question set to angular FormGroup  
   * @param questions 
   * @param rowSeed  - INIT VALUES
   */
  export const toFormGroup = (questions: QuestionBase<any>[], rowSeed:{}) => {
    let group: any = {};

    questions
      .forEach(question => {
        //console.log(question);  
        const cutSecondTailMatch = (x) =>  x.match(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d/) ;
        const cutSecondTailMatchCheck = (x,def) => ( x != null && x.length > 0 ) ? x[0] : def ;
        const cutSecondTail = (x) => (typeof x === "string") ? cutSecondTailMatchCheck( cutSecondTailMatch(x), x ) : x ;

        const initVal =
          (question.constructor.name == "DateTimePickerQuestion") 
            ? cutSecondTail(rowSeed[question.key])
            : (  rowSeed[question.key] != null ?  rowSeed[question.key] : question.value || '' ) ; 

        const cntrl = new FormControl( initVal, question.validators);    
        
        if( question.disabled ){
          cntrl.disable();    
        }  

        group[question.key] = cntrl;    
    });
    return new FormGroup(group);

  }  