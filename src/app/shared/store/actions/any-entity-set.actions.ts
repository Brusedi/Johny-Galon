import { Action } from '@ngrx/store';

import { anyEntityOptions } from '@appModels/any-entity';
import { anyEntityActions } from './any-entity.actions';



export enum AnyEntitySetActionTypes {
    ADD_ANY_ENTITY                      = '[Entity set] Add any entity',
    SET_CURRENT                         = '[Entity set] Set current entity',  
    EXEC_CURENT                         = '[Entity set] Execute current entity' ,
    EXEC                                = '[Entity set] Execute' ,
    EXEC_ANY_ENTITY_ACTION              = '[Entity set] Entyty action executing' ,
    COMPLETE_ANY_ENTITY_ACTION          = '[Entity set] Entyty action chain completed' ,
    EROR_ANY_ENTITY_SET                 = '[Entity set] Error' ,
    JAB_STATE                           = '[Entity set] Jab (pure state change)' 
}

export class Jab implements Action {
    readonly type = AnyEntitySetActionTypes.JAB_STATE
    constructor( )  { }
}

export class AddItem implements Action {
    readonly type = AnyEntitySetActionTypes.ADD_ANY_ENTITY
    constructor(public payload: anyEntityOptions<any> )  { }
}

export class SetCurrent implements Action {
    readonly type = AnyEntitySetActionTypes.SET_CURRENT
    constructor(public payload: string )  { }
}

export class Exec implements Action {
    readonly type = AnyEntitySetActionTypes.EXEC
    reduserData: anyEntityOptions<any>;
    constructor(public payload: {name:string, itemAction: anyEntityActions  } ) {}
}

export class ExecCurrent implements Action {
    readonly type = AnyEntitySetActionTypes.EXEC_CURENT
    reduserData: string; // курент
    constructor(public payload: anyEntityActions  ) {}
}

export class ExecItemAction implements Action {
    readonly type = AnyEntitySetActionTypes.EXEC_ANY_ENTITY_ACTION
    constructor(public payload: {itemOption:anyEntityOptions<any> , itemAction: anyEntityActions  } ) {}
}

export class CompleteItemAction implements Action {
    readonly type = AnyEntitySetActionTypes.COMPLETE_ANY_ENTITY_ACTION
    constructor(public payload: {name:string} ) {}
}

export class ErrorAnyEntitySet implements Action {
    readonly type = AnyEntitySetActionTypes.EROR_ANY_ENTITY_SET;
    constructor(public payload: any) {}
}  

export type AnyEntitySetAction =
  | Exec
  | ExecCurrent
  | AddItem
  | SetCurrent
  | ExecItemAction
  | CompleteItemAction
  | ErrorAnyEntitySet  
  | Jab
;