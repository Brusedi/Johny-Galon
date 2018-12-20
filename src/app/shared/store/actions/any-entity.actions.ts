import { Action } from "@ngrx/store";
//import { FieldDescribes } from "@appModels/metadata";


export enum AnyEntityActionTypes {
    GET_ITEMS               = '[Entity] Load item',
    GET_ITEMS_SUCCESS       = '[Entity] Item loaded success ',

    GET_ITEMS_META          = '[Entity] Load items medadata',
    GET_ITEMS_META_SUCCESS  = '[Entity] Item medadata loaded success',

    ADD_ITEM                =  '[Entity] Add item',
    ADD_ITEM_SUCCESS        =  '[Entity] Item added success',

    GET_TEMPLATE            = '[Entity] Load template',
    GET_TEMPLATE_SUCCESS    = '[Entity] Item template loaded success',

    SET_ROW_SEED            = '[Entity] Item rowseed set (changed)',    

    EROR_ANY_ENTITY         = '[Entity] Error'
}

export class GetItems implements Action {
    readonly type = AnyEntityActionTypes.GET_ITEMS;
    constructor(public payload: any ) {}
}
export class GetItemsSuccess<T> implements Action {
    readonly type = AnyEntityActionTypes.GET_ITEMS_SUCCESS;
    constructor(public payload: T[] ) {}
}

export class AddItem<T> implements Action {
    readonly type = AnyEntityActionTypes.ADD_ITEM;
    constructor(public payload: T ) {}
}
export class AddItemSuccess<T> implements Action {
    readonly type = AnyEntityActionTypes.ADD_ITEM_SUCCESS;
    constructor(public payload: T ) {}
}

export class GetItemsMeta implements Action {
    readonly type = AnyEntityActionTypes.GET_ITEMS_META;
    constructor() {}
}
export class GetItemsMetaSuccess implements Action {
    readonly type = AnyEntityActionTypes.GET_ITEMS_META_SUCCESS;
    constructor(public payload: any  ) {}  //FieldDescribes
}

export class GetTemplate implements Action {
    readonly type = AnyEntityActionTypes.GET_TEMPLATE;
    constructor() {}
}

export class GetTemplateSuccess<T> implements Action {
    readonly type = AnyEntityActionTypes.GET_TEMPLATE_SUCCESS;
    constructor(public payload: T  ) {}  
}

export class SetRowSeed<T> implements Action {
    readonly type = AnyEntityActionTypes.SET_ROW_SEED;
    constructor(public payload: T  ) {}  
}

export class ErrorAnyEntity implements Action {
    readonly type = AnyEntityActionTypes.EROR_ANY_ENTITY;
    constructor(public payload: any) {}
}  

export type anyEntityActions =
  | GetItems
  | GetItemsSuccess<any>
  | GetItemsMeta
  | GetItemsMetaSuccess
  | AddItem<any>
  | AddItemSuccess<any>
  | GetTemplate
  | GetTemplateSuccess<any>
  | SetRowSeed<any>
  | ErrorAnyEntity
  ;