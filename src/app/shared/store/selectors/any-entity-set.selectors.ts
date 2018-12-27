import { createFeatureSelector, createSelector, MemoizedSelector } from "@ngrx/store";
import { AnyEntytySetItemState, State } from "@appStore/reducers/any-entity-set.reduser";
import { of, Observable } from "rxjs";

import { fldDescsToQuestions,toFormGroup } from "../../question/adapters/question-adapt.helper";
import { _Start } from "@angular/cdk/scrolling";
import { getLocationMacros } from "app/shared/services/foregin/foreign-key.helper";

export const dataStore = createFeatureSelector<State>('data');

export const selectDatas = createSelector(
    dataStore,
    (x:State) => x 
); 

// MANAGEMENT 
export const selectIsExist = ( id: string ) => 
    createSelector(
        selectDatas,
        dt =>  (id in dt.items)
);

// Загруженны ли метаданные
export const selectIsMetadataLoaded= ( id: string ) => 
    createSelector(
        selectDatas,
        selectIsExist(id),
        (dt, is) =>  is && dt.items[id].state.metaLoaded
);

// пукалка
export const selectJab = () => 
    createSelector(
        selectDatas,
        dt =>  dt.jab
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


/**
 *  item is Loading (buzy)
 */
export const selectIsLoading = (id: string) =>
    createSelector( 
        selectData(id),
        (x:AnyEntytySetItemState<any>) => x.state.loading || x.state.metaLoading
);    



// ANONIMUS SELECTOR --------------------------------------------------------------------------
export const selCurName = () => 
    createSelector( selectDatas, x => x.currentId ) ;

export const selCurItem = () => 
    createSelector(selectDatas, x => x.items[x.currentId] );  //x.currentId ? x.items[x.currentId] : null ); 

export const selCurItemMeta = () => 
    createSelector(selectDatas, x => 
        !x.currentId ? undefined :
            x.items[x.currentId].state.metadata 
    ); 

export const selCurItemMetaNote = () => 
    createSelector(selectDatas, x => 
        ! x.currentId ? "" : 
            ! x.items[x.currentId].state.metaLoaded ? x.currentId :
                !x.items[x.currentId].state.metadata.table.hasOwnProperty("DisplayName") ? x.currentId :
                    x.items[x.currentId].state.metadata.table["DisplayName"]
    );  

export const selCurRowTemplate = () =>
    createSelector( selectDatas, x => 
        ! x.currentId ? null : 
            ! x.items[x.currentId].state.template ? {} :
                x.items[x.currentId].state.template 
    );        

export const selCurIsMetaLoaded = () =>  createSelector(selectDatas, x => x.currentId ? x.items[x.currentId].state.loaded : false);  

//Question Current------------------------------------------------------------------------------------------------------------------
// FieldDescribes[]
export const selCurFieldDescribes = () =>  
    createSelector(  selCurItemMeta(), x =>   
        !x ? undefined :  Object.keys(x.fieldsDesc).map(y => x.fieldsDesc[y]) 
    ) ;     

export const selCurQuestions = () =>  
    createSelector( 
        selCurFieldDescribes(), 
        selCurRowTemplate(),
        (x, t) => !x ? undefined : 
            fldDescsToQuestions( Object.keys(x).map(y => x[y]) , t ) 
    );     

export const selCurFormGroup = ( ) => 
    createSelector(
        selCurQuestions(),
        selCurRowTemplate(),
        (x, t) =>  toFormGroup( x, t )        
    );

// Controls data for form
export const selCurFormControls = () =>
    createSelector( 
        selCurQuestions(),
        selCurFormGroup(),
        (x,y) =>  ({ questions:x, formGroup:y})       
    );    

/**
 * список полей изменения которых влияют на значения списков вторичных ключей    
 * т.е. формальным языком которые упоминаются как макросы в FK-выражениях 
 */    
export const selCurMacroParentFields = () => 
        createSelector(
            selCurFieldDescribes(),
            x => x.map( y => y.foreignKey)
                .filter( x => !! x )
                .map(x => getLocationMacros(x))
                .reduce( (a,i) => [...a,...i] , [] )
                .filter( (e,i,a) =>  i === a.indexOf(e) )
        )

// Controls data for form
export const selCurJab = () =>
    createSelector( 
        selCurItem(), x=> x.state.jab
    );    


/// COMMON SELECTORS------------------------------------------------------------------------------------------------------

/**
 *  items is Loading (buzy)
 */
export const selItemsIsLoading = () =>
    createSelector( 
        selectDatas,
        (dt) => Object.keys(dt.items).reduce( (a,i) => a || dt.items[i].state.loading || dt.items[i].state.metaLoading ,false ) 
);    


// // Controls data for form
// export const selectCurentFormControls = () =>
//     createSelector( 

//         selectCurentName,
//         selectCurentRowTemplate,


//         selectFormControls

//         (items) =>  ({ questions:items, formGroup:toFormGroup( items, rowSeed ) })       
// );


// Controls data for form
// export const selectCurentFormControls = (id: string, rowSeed:Observable<{}>) =>
//     createSelector( 
//         selectQuestions(id,rowSeed),
//         (items) =>  ({ questions:items, formGroup:toFormGroup( items, rowSeed ) })       
// );    

// export const selectCurentNote = () => 
//     createSelector(selectDatas, x => 
//         !x.currentId ?  "" : (
//             !x.items[x.currentId].state.metaLoaded ? "" :
//                 x.items[x.currentId].state.metadata.
//         )
            
//            // x.items[x.currentId].state.loaded : 
//     );  

