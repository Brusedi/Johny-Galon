import { Action } from "@ngrx/store";

export enum AnyEntityLazyActionTypes {
    GET_ITEM           = '[Entity lazy] Load item',
    GET_ITEM_SUCCESS   = '[Entity lazy] Item loaded success ',
    GET_ITEM_NOT_FOUND = '[Entity lazy] Item not found ',
    EROR_ANY_ENTITY    = '[Entity lazy] Error'
}

export class GetItem implements Action {
    readonly type = AnyEntityLazyActionTypes.GET_ITEM;
    constructor(public payload: any ) {}
}

export class GetItemSuccess<T> implements Action {
    readonly type = AnyEntityLazyActionTypes.GET_ITEM_SUCCESS;
    constructor(public payload: T ) {}
}

export class GetItemNotFound implements Action {
    readonly type = AnyEntityLazyActionTypes.GET_ITEM_NOT_FOUND;
    constructor(public payload: any) {}
}  

export class ErrorAnyEntity implements Action {
    readonly type = AnyEntityLazyActionTypes.EROR_ANY_ENTITY;
    constructor(public payload: any) {}
}  

export type anyEntityLazyActions =
  | GetItem
  | GetItemSuccess<any>
  | GetItemNotFound
  | ErrorAnyEntity
  ;