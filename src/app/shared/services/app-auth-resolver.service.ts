import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { of } from 'rxjs';
import { tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppAuthResolverService implements Resolve<any> {

  constructor() { }

  resolve(route: ActivatedRouteSnapshot, state:RouterStateSnapshot) {
    of("AppAuthResolverService").pipe(
        tap(console.log),
        map(x => x + "4" )
    ).subscribe( console.log );
  }

}
