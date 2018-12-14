import { createFeatureSelector, createSelector, MemoizedSelector } from "@ngrx/store";
import { AnyEntytySetItemState, State } from "@appStore/reducers/any-entity-set.reduser";
import { of, Observable } from "rxjs";

import { fldDescsToQuestions,toFormGroup } from "../../question/adapters/question-adapt.helper";
import { _Start } from "@angular/cdk/scrolling";

export const dataStore = createFeatureSelector<State>('data');

export const selectDatas = createSelector(
    dataStore,
    x => x 
); 

// MANAGEMENT 
export const selectIsExist = ( id: string ) => 
    createSelector(
        selectDatas,
        dt =>  (id in dt.items)
);

// NAMED SELECTORS -----------------------------------------------------
export const selectData = ( id: string ) => 
    createSelector(
        selectDatas,
        dt =>  dt.items[id]
);

export const selectDataOptions = ( id: string ) => 
    createSelector(
        selectData(id),
        (items:AnyEntytySetItemState<any>) =>   items.option
);

export const selectDataMetadata = ( id: string ) => 
    createSelector(
        selectData(id),
        (items:AnyEntytySetItemState<any>) =>   items.state.metadata
);

export const selectMetadataIterable = ( id: string ) => 
    createSelector(
        selectDataMetadata(id),
        (items) =>  of(Object.keys(items))
);

// FieldDescribes[]
export const selectFieldDescribes = ( id: string ) => 
    createSelector(
        selectDataMetadata(id),
        (items) =>  Object.keys(items).map(x=>items[x] )
);

// Questions seet
export const selectQuestions = ( id: string, rowSeed:Observable<{}> ) => 
    createSelector(
        selectFieldDescribes(id),
        (items) =>  fldDescsToQuestions( items, rowSeed )        
        
);

export const selectFormGroup = ( id: string, rowSeed:Observable<{}> ) => 
    createSelector(
        selectQuestions(id,rowSeed),
        (items) =>  toFormGroup( items, rowSeed )        
);

// Controls data for form
export const selectFormControls = (id: string, rowSeed:Observable<{}>) =>
    createSelector( 
        selectQuestions(id,rowSeed),
        (items) =>  ({ questions:items, formGroup:toFormGroup( items, rowSeed ) })       
);    
    
export const selectTemplate = (id: string) =>
    createSelector( 
        selectData(id),
        (x:AnyEntytySetItemState<any>) => x.state.template
);    

// ANONIMUS SELECTOR --------------------------------------------------------------------------

export const selectCurentName = () => 
    createSelector( selectDatas, x => x.currentId ) ;

export const selectCurentItem = () => 
    createSelector(selectDatas, x => x.items[x.currentId] );  //x.currentId ? x.items[x.currentId] : null ); 

export const selectIsMetaLoaded = () => 
    createSelector(selectDatas, x => x.currentId ? x.items[x.currentId].state.loaded : false);  


