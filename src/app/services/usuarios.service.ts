import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Constantes} from "../Constantes";

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  _url = Constantes.URL+'usuarios/';
  constructor(private http: HttpClient) {
  }

  obtenerUsuarios() {
    let header = new HttpHeaders().set('Type-content','application/json');
    return this.http.get(this._url,{
      headers: header
    });
  }

  editarUsuarios() {
    let header = new HttpHeaders().set('Type-content','application/json');
    return this.http.put(this._url,{
      headers: header
    });
  }

  eliminarUsuarios() {
    let header = new HttpHeaders().set('Type-content','application/json');
    return this.http.delete(this._url,{
      headers: header
    });
  }
}
