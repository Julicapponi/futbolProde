import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  @Output() disparadorDeId: EventEmitter<any> = new EventEmitter<any>();
  _url = 'http://localhost:4000/api';
  public headers: Headers;
  json: any = JSON;
  constructor(private router: Router, private http: HttpClient) {

  }

  //crear cuenta
  signUp(user){
    return this.http.post<any>(this._url + '/signup', user);
  }

  //iniciar sesion
  signIn(user){
    return this.http.post<any>(this._url + '/signin', user);
  }

  getUsers(){
    return this.http.get<any>(this._url + '/listUsers');
  }

  getUserId(id){
    return this.http.get<any>(this._url + '/getUser/' +id);
  }

  deleteUser(id){
    return this.http.delete<any>(this._url + '/deleteUser/' +id );
  }

  editUser(userEdit){
    console.log(userEdit);
    const id = userEdit._id;
    const name = userEdit.name;
    const userName = userEdit.userName;
    const email = userEdit.email;
    const password = userEdit.password;
    this.json = JSON.stringify({
      name: name,
      userName: userName,
      email: email,
      password: password
    });
    return this.http.post(this._url + '/editUser/' +id , this.json);
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


}
