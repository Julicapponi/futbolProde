import { Injectable } from '@angular/core';
import {HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import { AuthService } from '../services/auth.service';
@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor{
  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler){
    const tokenizeReq = req.clone({
      setHeaders:{
        Authorization: `Bearer ${this.authService.getToken()}`
      }
    })
    return next.handle(tokenizeReq);
  }


}
