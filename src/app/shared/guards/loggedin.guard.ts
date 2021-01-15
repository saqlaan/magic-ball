import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';

import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class loggedInGuard implements CanActivate {
  constructor(private router: Router) {
  }

  canActivate() {
    const user = localStorage.getItem('user');
    if (user !== null) {
      this.router.navigateByUrl('/hostdashboard');;
    }
    return true;
  }
}
