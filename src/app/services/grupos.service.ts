import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class GruposService {
  _url = 'http://localhost:5000/api/groups';
  constructor(private router: Router, private http: HttpClient) { 
    
  }

  createGroup(group){
    console.log('Grupo a crear:', group);
    return this.http.post<any>(this._url + '/', group);
  }

  saveUserGroup(user, groupId){
    console.log('Agrega usuario:' + user + ' al grupo'+ groupId);
    return this.http.post<any>(this._url + '/guardar/user/', user, groupId);
  }

  gruposPorUser(user){
    console.log('Usuario :', user );
    return this.http.post<any>(this._url + '/listar/gruposPorUser/', user);
  }
  
  getUsersGroup(groupId){
    console.log('Buscando usuarios del grupo con id:', groupId);
    return this.http.get<any>(this._url + '/listar/user/', groupId);
  }
}
