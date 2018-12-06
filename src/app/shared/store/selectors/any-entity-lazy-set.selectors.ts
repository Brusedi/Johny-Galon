import { createSelector, createFeatureSelector } from "@ngrx/store";
import { AnyEntytyLazySetItemState } from "@appStore/reducers/any-entity-lazy-set.reduser";
import { selectorsFromSelFoo } from "@appStore/reducers/any-entity-lazy.reduser";

export const referencesStore = createFeatureSelector('references');

export const selectReferences = createSelector(
    referencesStore,
    x => x 
); 

export const selectReference = ( id: string ) => 
    createSelector(
        selectReferences,
        references =>   references[id]
);

export const selectReferenceOptions = ( id: string ) => 
    createSelector(
        selectReference(id),
        (reference:AnyEntytyLazySetItemState<any>) =>   reference.option
);

export const selectReferenceSelectors = ( id: string ) => 
    createSelector(
        selectReferenceOptions(id),
        x => selectorsFromSelFoo( x.selectId ).selectAll
);

export const selectReferenceAll = ( id: string ) => 
    createSelector(
        selectReference(id),
        (ref:AnyEntytyLazySetItemState<any>) => selectorsFromSelFoo( ref.option.selectId).selectAll(ref.state)
);

export const selectReferenceItem = ( id: string, key:any ) => 
    createSelector(
        selectReferenceAll(id),
        selectReferenceOptions(id),
        (items, opt ) => items.find( x => opt.selectId(x) ==  key )   
);

export const selectReferenceItemNotFound = ( id: string, key:any ) => 
    createSelector(
        selectReference(id),
        (x:AnyEntytyLazySetItemState<any>) => (x.state.notExistKeys.find( z => z==key ) != undefined)  
);


export const selectItemWasSearhing = ( id: string, key:any ) => 
    createSelector(
        selectReferenceItem(id,key),
        selectReferenceItemNotFound(id,key),
        ( x, y ) => (x != undefined) || y
);



// export const selectRefItems = ( id: string ) => 
//     createSelector(
//         selectReference,
//         references =>   references[id]
// );

// export const selectReference = ( id: string ) => 
//     createSelector(
//          selectReferences,
//          references =>   references[id]
//     );