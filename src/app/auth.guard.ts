import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
// @ts-ignore
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
// UN AUTHGUARD PROTEGE LAS RUTAS DESDE EL FRONTEND, SI EL TOKEN EXISTE CONTINUA A LA RUTA QUE SE QUIERE MOSTRAR

  constructor(private router: Router, private authService: AuthService) {
  }

  canActivate(): boolean{
    if (this.authService.loggedIn()){
      return true;
    }
    this.router.navigate(['/logueoPage']);
    return false;
  }
}
