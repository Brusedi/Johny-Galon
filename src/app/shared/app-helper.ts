import { tap } from "rxjs/internal/operators/tap"

export const puk  = (x:any) => console.log(x)
export const fart = tap(puk)