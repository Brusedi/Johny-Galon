import { createFeatureSelector, createSelector, MemoizedSelector, select } from "@ngrx/store";
import { AnyEntytySetItemState, State } from "@appStore/reducers/any-entity-set.reduser";
import { of, Observable } from "rxjs";

import { fldDescsToQuestions,toFormGroup, toFormGroup$ } from "../../question/adapters/question-adapt.helper";
//import { _Start } from "@angular/cdk/scrolling";
import { getLocationMacros, locationToName, locationInfo, fillLocationMacros, isFullIndepended } from "app/shared/services/foregin/foreign-key.helper";
import { getMdOptons, getMdOptonsFromDict, getRowVal } from "app/shared/services/metadata/metadata.helper";
import { EntityAdapter } from "@ngrx/entity";
import { map, filter, switchMap, tap } from "rxjs/operators";
import { and } from "@angular/router/src/utils/collection";
import { BackContextMode } from "@appModels/any-entity";
import { QuestionBase } from "app/shared/question/question-base";
import { FormGroup } from "@angular/forms";
import { FieldDescribe } from "@appModels/metadata";

///////// HELPERS /////////////////////////////////////////////////////

// AnyEntytySetItemState Interface props
const ENTITY_PROPS = ["state","option","action"];

// Check props of object  
const instOf = ( obj:any ,props:Array<string> ) =>  props.reduce( (a,i) => a && obj && obj.hasOwnProperty(i) , true )

// Object is instance  AnyEntytySetItemState
const instOfAnyEntytySet = (obj:any) => instOf(obj,ENTITY_PROPS)

const extractEntities:((obj:any) => AnyEntytySetItemState<any>[])  = (obj) => 
     obj && obj.items
        ? Object.keys( obj.items ).map(x => obj.items[x]).filter(x => instOfAnyEntytySet(x) )
        : []

/////////////////////////////////////////////////////////////////////////

export const dataStore = createFeatureSelector<State>('data');

export const selectDatas = createSelector(
    dataStore,
    (x:State) => x 
); 


export const selectErrors = ()=> 
    createSelector(
        dataStore,
        (x:State) => x.error 
); 

// MANAGEMENT 
export const selectIsExist = ( id: string ) => 
    createSelector(
        selectDatas,
        dt =>  (id in dt.items)
);

// Загруженны ли данные
export const selectIsDataLoaded = ( id: string ) => 
    createSelector(
        selectDatas,
        selectIsExist(id),
        (dt, is) =>  is && dt.items[id].state.loaded
);

// Загруженны ли метаданные
export const selectIsMetadataLoaded = ( id: string ) => 
    createSelector(
        selectDatas,
        selectIsExist(id),
        (dt, is) =>  is && dt.items[id].state.metaLoaded
);

// Загруженна ли запись данных
export const selectIsRowLoaded = ( id: string, idRow:any ) => 
    createSelector(
        selectData(id),
        dt => dt && dt.state && dt.state.entities &&  dt.state.entities[idRow] 
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
        dt =>  id in dt.items ?  dt.items[id] : null
);

// export const selectById2 = ( id: string, idRow: any ) => 
//     createSelector(
//         selectData(id),
//         dt =>   dt && dt.state ? dt.state : undefined
//         );


export const selectById = ( id: string, idRow: any ) => 
     createSelector(
        selectData(id),
        dt => dt && dt.state && dt.state.entities &&  dt.state.entities[idRow] ? dt.state.entities[idRow] : undefined
 );

 
 export const selectDataItems = ( id: string) => 
     createSelector(
        selectData(id),
        dt => dt && dt.state && dt.state.entities ? Object.keys(dt.state.entities).map(x=> dt.state.entities[x] )   : undefined
 );





// export const selectById = ( id: string, idRow: any ) => 
//     createSelector(
//         selectData(id),
//         dt => dt && dt.hasOwnProperty(idRow)?dt[idRow]:undefined        
// );

// export const selectByIdAsName = ( id: string, idRow: any ) => 
//     createSelector(
//         selectById(id,idRow),
//         dt => 
// );

export const selectDataOptions = ( id: string ) => 
    createSelector(
        selectData(id),
        (items:AnyEntytySetItemState<any>) => items&&items.hasOwnProperty('option') ? items.option : null
        //{  console.log(id);return items&&items.hasOwnProperty('option') ? items.option : null }//console.log(id)}
);

export const selectDataMetadata = ( id: string ) => 
    createSelector(
        selectData(id),
        (items:AnyEntytySetItemState<any>) => items&&items.state ? items.state.metadata : null
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

//Error of entity
export const selectEntityError = ( id: string ) => 
    createSelector(
        selectData(id),
        (items:AnyEntytySetItemState<any>) => items.state.error
);

//Is Error of entity
export const selectEntityIsError = ( id: string ) => 
    createSelector(
        selectData(id),
        (items:AnyEntytySetItemState<any>) => !!items.state.error
);

//Is Error is can fixeble
// export const selectEntityIsFixebleError = ( id: string ) => 
//     createSelector(
//         selectData(id),
//         (items:AnyEntytySetItemState<any>) => 
//         { 
//             // console.log(items.state.error );
//             // console.log(  (!!items.state.error ) 
//             //                     ? items.state.error.hasOwnProperty("status") && items.state.error["status"] == 401 
//             //                         ? true
//             //                         : false
//             //                     : undefined    );

//             return  (!!items.state.error ) 
//                         ? items.state.error.hasOwnProperty("status") && items.state.error["status"] == 401 
//                             ? true
//                             : false
//                         : undefined   
            
//         }
// );

// Комплексный селектор состояния Entity
// 
// export const selectEntityStateResume = ( id: string, mode:BackContextMode ) => 
//     selectData(id),
//     (items:AnyEntytySetItemState<any>) =>({
//         isLoaded:      mode == BackContextMode.Data 
//                             ? items.state.loaded 
//                             : mode == BackContextMode.Metadata 
//                                 ? items.state.metaLoaded
//                                 : items.state.metaLoaded,
//         isLoading:     
//     })    



// 
// export const selectEntity = ( id: string ) => 
//     createSelector(
//         selectData(id),
//         (items:AnyEntytySetItemState<any>) => items.state.error
// );



// Questions seet
// export const selectQuestions = ( id: string, rowSeed:Observable<{}> ) => 
//     createSelector(
//         selectFieldDescribes(id),
//         (items) =>  fldDescsToQuestions( items, rowSeed )        
        
// );

// export const selectFormGroup = ( id: string, rowSeed:Observable<{}> ) => 
//     createSelector(
//         selectQuestions(id,rowSeed),
//         (items) =>  toFormGroup( items, rowSeed )        
// );

// Controls data for form
// export const selectFormControls = (id: string, rowSeed:Observable<{}>) =>
//     createSelector( 
//         selectQuestions(id,rowSeed),
//         (items) =>  ({ questions:items, formGroup:toFormGroup( items, rowSeed ) })       
// );    
    
export const selectTemplate = (id: string) =>
    createSelector( 
        selectData(id),
        (x:AnyEntytySetItemState<any>) => x.state.template
);    


//
export const selectIsDataLoading = (id: string) =>
    createSelector( 
        selectData(id),
        (x:AnyEntytySetItemState<any>) => x.state.loading 
);    

export const selectIsMetaLoading = (id: string) =>
    createSelector( 
        selectData(id),
        (x:AnyEntytySetItemState<any>) => x.state.metaLoading
);    


/**
 *  item is Loading (buzy)
 */
export const selectIsLoading = (id: string) =>
    createSelector( 
        selectData(id),
        (x:AnyEntytySetItemState<any>) => x.state.loading || x.state.metaLoading
);    

/**
 *  item is Prepared
 */
export const selectIsPrepared = (id: string) =>
    createSelector( 
        selectData(id),
        (x:AnyEntytySetItemState<any>) => (x && x.state.metaLoaded )
);    


// ---------NEW 291119 -----------

export const selFieldDescribes = (id:string) =>  
    createSelector(  selectDataMetadata(id), x => {   
        //console.log(x.fieldsDesc)
        return !x ? undefined : Object.keys(x.fieldsDesc)
                                    .map(y => x.fieldsDesc[y])
                                    .sort( (a, b) => a.order - b.order  )
    });  

export const selFieldDescribe = (id:string, fldName:string ) =>  
    createSelector(   
        selFieldDescribes(id),   
            xs =>  {
                return xs.reduce(  (a:FieldDescribe,i:FieldDescribe) => !a && i.id == fldName  ? i : a  , null ) ;
            }                
        );     


export const selRowTemplate = (id:string) =>
    createSelector( selectDatas, x => 
        ! x.items[id] ? null : 
            ! x.items[id].state.template ? {} :
                x.items[id].state.template 
    );  

export const selRowSeed = (id:string) =>
    createSelector( selectDatas, x =>  
        !! (x.items[id]) && !!(x.items[id].state.rowSeed) 
            ? x.items[id].state.rowSeed 
            : null
    );   
    
export const selQuestionsEx = (id:string, flds:string[], rowSeed$:Observable<{}>) =>  
    createSelector( 
        selFieldDescribes(id), 
        (x) => {
            //console.log(x);
            return !x ? undefined :  
                fldDescsToQuestions(  flds.map( y => x.find( (e,i,a)=> (e.id == y)  )), rowSeed$) 
        }            
    );   

/**
 *  Return джентельменский набор контролов для редактирования в форме   !!!!!
 */     
export const selFormControlsEx$: ( id:string, flds:string[] , rowSeed$:Observable<{}> ) => MemoizedSelector<object,Observable< {questions:QuestionBase<any>[] ,formGroup:FormGroup }>> =  // 180820 []

    ( id:string, flds:string[] , rowSeed$:Observable<{}> ) =>   //, rowSeed$:Observable<{}>
    createSelector(
        selQuestionsEx(id,flds,rowSeed$),
        selectIsMetadataLoaded(id),
        (qn, isL) => qn && isL ?  toFormGroup$(qn,rowSeed$).pipe( map(fg => ({questions: qn , formGroup:fg}) ))  :  of(null)  
    );    



    

/**
 *  Select all Entities 
 */    
export const selEntities = () => createSelector( selectDatas, extractEntities )    

/**
 *  Select all Entities  Errors
 */    
export const selEntitiesErrors = () =>  
    createSelector(
        selEntities(),
        (ents) => ents.map(x  => x && x.state &&  x.state.error ? ({error:x.state.error, opt:x.option }) :null).filter( x => !!x  )
    )

export const selectDataMetadataHeader = ( id: string ) => 
    createSelector(
        selectDataMetadata(id),
        (x => ({ caption: x&&x.table ? x.table.DisplayName : undefined , description:  x&&x.table ? x.table.Description : undefined      }) )
);    


// ANONIMUS SELECTOR --------------------------------------------------------------------------
export const selCurName = () => 
    createSelector( selectDatas, x => x.currentId ) ;

export const selCurItem = () => 
     createSelector(selectDatas, x => x.items[x.currentId] );  //x.currentId ? x.items[x.currentId] : null ); 

export const selCurItemData = () => 
    createSelector(selectDatas, x => 
         !x.currentId ? undefined :
             x.items[x.currentId].state.entities
     ); 

export const selCurItemIds = () => 
     createSelector(selectDatas, x => 
          !x.currentId ? undefined :
              x.items[x.currentId].state.ids
      );  

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

export const selCurIsDataLoaded = () =>  createSelector(selectDatas, x => x.currentId ? x.items[x.currentId].state.loaded : false);  
export const selCurIsMetaLoaded = () =>  createSelector(selectDatas, x => x.currentId ? x.items[x.currentId].state.metaLoaded : false);  

export const selCurRowSeed = () =>
    createSelector( selectDatas, x => 
        ! x.currentId ? null : 
            ! x.items[x.currentId].state.rowSeed ? {} :
                x.items[x.currentId].state.rowSeed 
    );        

// cur entity error    
export const selCurError = () => 
    createSelector( selectDatas, x => 
        ! x.currentId ? null : x.items[x.currentId].state.error
    );        
    

//item    
export const selCurItemById = (id:any) => 
    createSelector(selCurItemData(), 
        x => x && (id in x) ?  x[id] : undefined 
    ); 

//---------
// 180419 Susses Insert completed InsertedId
export const selCurInsertedId = () => 
    createSelector(selCurItem(), 
        x => x ?  x.state.insertedId : undefined 
    ); 
    
export const selCurInsertedRec = () => 
    createSelector(selCurItem(), 
        x => x && x.state.insertedId && x.state.entities[x.state.insertedId]
            ? x.state.entities[x.state.insertedId]
            : undefined 
); 


//Question Current------------------------------------------------------------------------------------------------------------------
// FieldDescribes[]
export const selCurFieldDescribes = () =>  
    createSelector(  selCurItemMeta(), x => {   
        //console.log(x.fieldsDesc)
        return !x ? undefined : Object.keys(x.fieldsDesc)
                                    .map(y => x.fieldsDesc[y])
                                    .sort( (a, b) => a.order - b.order  )
    });     

export const selCurQuestions = () =>  
    createSelector( 
        selCurFieldDescribes(), 
        selCurRowTemplate(),
        (x, t) => !x ? undefined : fldDescsToQuestions( Object.keys(x).map(y => x[y]) , t ) 
        
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

// Ex vith filter 020419
export const selCurQuestionsEx = (flds:string[] , rowSeed:{} ) =>  
    createSelector( 
        selCurFieldDescribes(), 
        selCurRowTemplate(),
        (x, t) => !x ? undefined :  
            fldDescsToQuestions(  flds.map( y => x.find( (e,i,a)=> (e.id == y)  )), of({...t, ...rowSeed}))   // of()  201020
    );    

export const selCurFormGroupEx = ( flds:string[] , rowSeed:{} ) => 
    createSelector(
        selCurQuestionsEx(flds,rowSeed),
        selCurRowTemplate(),
        (x, t) =>  toFormGroup( x, {...t, ...rowSeed})        
    );


export const selCurFormControlsEx = (flds:string[] , rowSeed:{}) =>
    createSelector( 
        selCurQuestionsEx(flds,rowSeed),
        selCurFormGroupEx(flds,rowSeed),
        (x,y) =>  ({questions:x, formGroup:y})       
    );    


// Rebuild 201020 for rowseed stream ////////////////////////////////////////////////////////////////////////////
export const selCurTemplRowSeed$ = ( rowSeed$:Observable<{}> ) => 
    createSelector(
        selCurRowTemplate(),
        (t) =>   rowSeed$.pipe(  map( x=>  ({...t, ...x})))     
    );

export const selCurQuestionsExS = (flds:string[] , rowSeed$:Observable<{}> ) =>  
    createSelector( 
        selCurTemplRowSeed$( rowSeed$ ),
        selCurFieldDescribes(), 
        (rst, x) => ({  
            questions    : !x ? undefined :  fldDescsToQuestions(  flds.map( y => x.find( (e,i,a) => (e.id == y) )), rst )  ,
            rowSeedTmp$  :  rst
        }) 
    );    

export const selCurFormControlsExS = (flds:string[] , rowSeed$:Observable<{}>) =>
    createSelector( 
        selCurQuestionsExS(flds,rowSeed$),
        (x) =>  ({
                questions:x.questions, 
                formGroup: toFormGroup$(x.questions, x.rowSeedTmp$ ) 
        })       
    );    
////////////////////////////////////////////////////////////////////////////////////////////////////




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
                .filter( (e,i,a) =>  i === a.indexOf(e) )  // ? убираем повторы штоли 
        )

// Список есть (это контролы изменения знач которых мы отслеживаем)
// Так же необходимо отслеживать ключи для соответстующих запросов 
// Типа на выхде нужно иметь не обработанный локйшн
// тута нада на выходе штото вроде: [ { f1, [rloc1, rloc2, ....] }, { f2, [ rl2, rl3, ...] } ]
// иля даже точнее { [fieldName:string]:(refs:string[]) }
/**
 *  Return object contains depend fields as props of array of location as value:
 *  { 
 *      [fieldName:string]:string[] // list locations
 *  }
 */
export const selCurMacroParentFieldsWithLocs = () => 
    createSelector(
        selCurFieldDescribes(),
        x => {
            const foo = ( l:string, f:string[] , ret: { [fieldName:string]:string[] } ) => {
                const addLoc = ( l1:string, fn:string , r:{} ) => fn in r ? { ...r, [fn]:[...r[fn], l1]} : {...r, [fn]:[l1] } 
                return f.reduce( (a,i) => addLoc(l,i,a) , ret  )
            }
            return  x
                .map( y => y.foreignKey)
                .filter( x => !! x )
                .map(x => ({loc:x,  mac:getLocationMacros(x)}))  
                .reduce(  (a,i) => foo(i.loc, i.mac, a) ,{})
        }    
    )

// Controls data for form
export const selCurJab = () =>
    createSelector( 
        selCurItem(), x=> x.state.jab
    );    


/// COMMON SELECTORS------------------------------------------------------------------------------------------------------

/**
 *  Foreign is Prepared (buzy)
 */
export const selForeignIsPreparing = () =>
    createSelector( 
        selectDatas,
        (dt) => dt.prepareQueue.length > 0 && dt.preparing != null    
    )        

/**
 *  items is Loading (buzy)
 */
export const selItemsIsLoading = () =>
    createSelector( 
        selectDatas,
        (dt) => Object.keys(dt.items).reduce( (a,i) => a || dt.items[i].state.loading || dt.items[i].state.metaLoading ,false ) 
);    

/**
 *  items is Uploading (buzy)
 */
export const selItemsIsUploading = () =>
    createSelector( 
        selectDatas,
        (dt) => Object.keys(dt.items).reduce( (a,i) => a || dt.items[i].state.uploading ,false ) 
);    


export const selIsBuzy = () =>
    createSelector( 
        selItemsIsLoading(),
        selForeignIsPreparing(),
        selItemsIsUploading(),
        (x,y,z) => x || y || z
);    

export interface BusyInfo{
    act:string,
    obj:string
}

// BUSY INFO
// 
export const selBusyPreparingInfo = () =>
    createSelector( 
        selectDatas,
        (dt) => 
            dt.prepareQueue.length > 0 && dt.preparing != null 
                ? ({act:"Подготавливаю вторичные данные", obj:dt.preparing?dt.preparing: dt.prepareQueue[0]})
                : null   
    )        

export const selBusyLoadingInfo = () =>
    createSelector( 
        selectDatas,
        (dt) => Object.keys(dt.items)
            .reduce( (a,i) => 
                a?a:dt.items[i].state.loading 
                       ? {act:"Загружаю данные", obj:i}
                       :  dt.items[i].state.metaLoading 
                            ? {act:"Загружаю метаданные", obj:i}
                            : null
                ,null                        
            ) 
); 

export const selBusyUploadingInfo = () =>
    createSelector( 
        selectDatas,
        (dt) => Object.keys(dt.items)
            .reduce( (a,i) => 
                a?a: dt.items[i].state.uploading 
                    ? {act:"Выгружаю данные", obj:i}
                    : null
                ,null 
            ) 
);    

export const selBuzyInfo = () =>
    createSelector( 
        selBusyPreparingInfo(),
        selBusyLoadingInfo(),
        selBusyUploadingInfo(),
        (x,y,z) => x?x:y?y:z?z:null
);  


/// FOREIGN DATA SELECTORS ========================================================================================================

/**
*   Select datas state if exist else null
*/
export const selectStateIfExist = ( id: string ) =>
    createSelector(
        selectDatas,
        dt =>  (id in dt.items) ? dt.items[id] : null
    );

/**
*   Select entytes by location if exist & loading
*/
export const selectDataIfExist = ( id: string ) =>
    createSelector(
        selectStateIfExist(id),
        (x) => x ? ( x.state.loaded ? x.state.entities : null ) : null
    );
/**
*   Select entyty row  by location and key if exist & loading
*/
export const selectDataRowIfExist = ( id: string, key:any ) =>
    createSelector(
        selectStateIfExist(id),
        (x) => x ? (  x.state.entities ? x.state.entities[key] : null ) : null
    );



/**
*   Select entytes & metadata if exist & loading 
*/
export const selectDataAndMetaIfExist = ( id: string ) =>
    createSelector(
        selectStateIfExist(id),
        (x) => x ? ( x.state.loaded &&  x.state.metaLoaded ? ({ data: (x.state.entities), meta:(x.state.metadata ) }) : null ) : null
    );

/**
*   Select entytes & partLoaded dictionary
*/
export const selectDataAndPartLoadedIfExist = ( id: string ) =>
    createSelector(
        selectStateIfExist(id),
        (x) => (x && Object.keys(x.state.partLoaded).length > 0) ? ({ data: (x.state.entities), parts:(x.state.partLoaded) }) : null  
    );




export const selectIsExistByLoc = ( loc: string ) => selectIsExist( locationToName(loc) ) ;

export const selectIsPreparedByLoc = ( loc: string ) => selectIsMetadataLoaded( locationToName(loc) ) ;

export const selectDataOptionsByLoc = ( loc: string ) => selectDataOptions( locationToName(loc) ) ;

export const selInsertedId = (id: string) => 
    createSelector(
        selectStateIfExist(id),
        x => x ?  x.state.insertedId : null 
    ); 

///////////////////////////////////////////////////////////////////////////////////////////////////
/**
*   Select dropDown option by id (Full independed)
*/
export const selectOptions = ( id: string ) => 
    createSelector(
        selectDataAndMetaIfExist(id),
        (x) => !!x?getMdOptonsFromDict( x.data, x.meta.table): null 
    );  //[{key:undefined, value:'Загруз...'} ]

export const selectOptionsByLoc = ( loc: string ) => selectOptions( locationToName(loc) ) ;

/**
*   Select part independed dropDown option by location
*   Селеектор с разрешенными макросами либо тн PartIndepended
*/
export const selPartIndOptions = ( resolvedLoc: string ) => 
    createSelector(
        selectDataAndPartLoadedIfExist(locationToName(resolvedLoc)),
        (cntr) => !cntr || !(resolvedLoc in cntr.parts) ? null: 
            cntr.parts[resolvedLoc].reduce( (a,x) => ({...a, [x]:cntr.data[x]}) , {} )
    );  

/**
*  Select resolved location by location
*  TODO Chek if empty...
*/
export const selectResolvedLoc =  ( loc: string ) => 
    createSelector( 
        selCurRowSeed(),
        x => fillLocationMacros(loc,x)
    );  



/**
*  Select resolved location by location
*  TODO Chek if empty...
*/
export const selectResolvedLocFromTemplate =  ( loc: string ) => 
    createSelector( 
        selCurRowTemplate(),
        x => fillLocationMacros(loc,x)
    );      

/**
*   180119 Сложный депенденс-дропдаун-оптион селектор 
*   Возможен только относительно лукашина, начну сразу с депенденса    
*   Сделать через два готовых селектора передав результат одного в качестве параметра другого не вышло - пока не парюся....    
*/
export const selectForeignOptionsByLoc$ = ( loc: string , rowSeed$:Observable<{}> ) => 
    createSelector(
        selectStateIfExist(locationToName(loc)),
        (dt) => (rowSeed$? rowSeed$:of({}) ).pipe(  
            map( x => dt 
                    ? ({
                        data: (dt.state.entities), 
                        parts: ( Object.keys(dt.state.partLoaded).length > 0) ? (dt.state.partLoaded):null, 
                        meta: dt.state.metadata,
                        rowSeed:x,
                        resLoc: fillLocationMacros(loc,x)
                    })
                    :null
            ), 
            map( x => x 
                    ? ({
                        meta: x.meta,
                        data: isFullIndepended(loc)  
                            ? x.data
                            : x.data && x.parts && (x.resLoc in x.parts) 
                                ? x.parts[x.resLoc].reduce( (a,i) => ({...a, [i]:x.data[i]}) , {} ) 
                                : null
                    })                        
                    :null 
            ),
            //tap(  x => console.log(x)  ),
            map( x => x && x.data && x.meta && x.meta.table ? getMdOptonsFromDict(x.data, x.meta.table ):null    )
        )
    );    

            
export const selectForeignOptionsByLoc = ( loc: string ) => 
    createSelector(
        selectStateIfExist(locationToName(loc)),
        selectResolvedLoc(loc),
        (x,l) => {
            console.log(l);
            const dap = x ? ({ data: (x.state.entities), parts: ( Object.keys(x.state.partLoaded).length > 0) ? (x.state.partLoaded):null, meta:x.state.metadata }) : null ;
            const selData = !x ? null:(
                isFullIndepended(loc) ? dap.data :(
                    !dap || !dap.parts ? null :(
                            !(l in dap.parts)? null: 
                            dap.parts[l].reduce( (a,x) => ({...a, [x]:dap.data[x]}) , {} )
            )));
            const ret = selData && dap && dap.meta && dap.meta.table ? getMdOptonsFromDict(selData, dap.meta.table ):null;             
            return ret;
        }
    );
    

export const selectForeignDataByLoc = ( loc: string ) => 
    createSelector(
        selectStateIfExist(locationToName(loc)),
        selectResolvedLoc(loc),
        (x,l) => {
            const dap = x ? ({ data: (x.state.entities), parts: ( Object.keys(x.state.partLoaded).length > 0) ? (x.state.partLoaded):null, meta:x.state.metadata }) : null ;

            const selData = !x ? null:(
                isFullIndepended(loc) ? dap.data :(
                    !dap || !dap.parts ? null :(
                            !(l in dap.parts)? null: 
                            dap.parts[l].reduce( (a,x) => ({...a, [x]:dap.data[x]}) , {} )
            )));
            return selData;
        }
    ); 


/**
 * Select frendly row value
 */
export const selectCurRowVal = ( key:string , rowId:any ) =>
    createSelector(
        selCurItem(),
        selectDatas,
        (x,d) => { 
            const selData = (l) =>  locationToName(l);
            const getFrgn = (l) => d.items[selData(l)];
            const fk = x&&x.hasOwnProperty('state')&&x.state.metaLoaded? x.state.metadata.fieldsDesc[key].foreignKey : undefined ;
            const vl = x.state.entities.hasOwnProperty(rowId) ? x.state.entities[rowId][key]:undefined;
            return !x ? undefined
                : !fk
                    ? vl 
                    : getRowVal(vl, getFrgn(fk).state.entities, getFrgn(fk).state.metadata )
        }                
    )    
        
/**
 * Select selected partLocation
 */
export const selectPartLocationByLoc = ( loc: string ) => 
    createSelector(
        selectStateIfExist(locationToName(loc)),
        x => x && x.state.partLoaded ? Object.keys(x.state.partLoaded) : []
    );

/**
 * Select selected partLocation if notExist
 */
export const selectPartLocationIfNotExist = ( loc: string ) => 
    createSelector(
        selectPartLocationByLoc(loc),
        x => x.indexOf(loc) >= 0 ?  null : loc
    );    

    
//260620 --- Не знаю с чего начать ... воще нужны контролы на форму для новой записи.... 
// Начать отработку вероятно надо не с виртуальных сущностей, а потом уже переходить к виртуальным...
// 


//selectDataMetadata


///////////////////////////////////////////////////////    
