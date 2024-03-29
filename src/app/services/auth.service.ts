import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {Constantes} from "../Constantes";
import {Grupo} from "../class/Grupo";
import {catchError, timeout} from "rxjs/operators";
import {User} from "../class/User";
import {throwError} from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  @Output() disparadorDeId: EventEmitter<any> = new EventEmitter<any>();
  _url = Constantes.URL+'users';
  _url_prod = Constantes.URL_PROD+'users';
  TAG = 'auth.services.ts';
  public headers: Headers;
  json: any = JSON;
  constructor(private router: Router, private http: HttpClient) {

  }

  //crear cuenta
  signUp(user){
    console.log('Usuario a registrar:', user);
    return this.http.post<any>(this._url, user);
  }

  signIn(user,pass){
    console.log(user);
    const requestOptions = {
      headers: new HttpHeaders()
    }
    this.json = {
      username: user,
      password : pass
    };
    return this.http.post<any>(this._url + '/signin/user/', this.json , requestOptions);
  }

  private handleError(error:  any) {
    console.log(this.TAG, 'error-> error.status ' , JSON.stringify(error));    // return throwError(error); // <= B
    return throwError(error);
  }

  getUsers(){
    return this.http.get<any>(this._url + '/');
    return this.http.get<User[]>(this._url + '/').pipe(
        timeout(100000),
        catchError(this.handleError)
    );
  }

  getUserId(id){
    return this.http.get<any>(this._url + '/' +id);
  }

  deleteUser(id){
    return this.http.delete<any>(this._url + '/' +id );
  }

  editUser(userEdit){
    console.log(userEdit);
    const id = userEdit.iduser;
    const name = userEdit.name;
    const userName = userEdit.userName;
    const email = userEdit.email;
    const password = userEdit.password;
    this.json = {
      name: name,
      userName: userName,
      email: email,
      password: password
    };
    return this.http.put(this._url + '/' +id , this.json);
  }

  getMatch(){
    return this.http.get<any>(this._url + '/');
  }

  //cerrar sesion
  loggedIn(){
    //el token existe si o no
    if (localStorage.getItem('token')){
      return true;
    } else {
      return false;
    }
  }

  getToken(){
    return localStorage.getItem('token');
  }

  //cerrar sesion
  logout(){
    localStorage.removeItem('token');
    //borra todos los datos
    localStorage.clear();
    this.router.navigate(['/home']);
  }

  resetPassword(email){
    const requestOptions = {
      headers: new HttpHeaders()
    }
    this.json = {
      email: email
    };
    return this.http.post<any>(this._url + '/recuperarPass/', this.json , requestOptions);
  }
  
}
