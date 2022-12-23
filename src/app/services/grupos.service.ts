import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {catchError, map, timeout} from "rxjs/operators";
import {Grupo} from "../class/Grupo";

@Injectable({
  providedIn: 'root'
})
export class GruposService {
  _url = 'http://localhost:5000/api/groups';
  public headers: HttpHeaders;
  TAG = 'grupos.services.ts';
  json: any = JSON;
  constructor(private router: Router, private http: HttpClient) { 
    
  }

  createGroup(group){
    console.log('Grupo a crear:', group);
    let idUserGreaGrupo = localStorage.getItem('idUser');
    group.idUserCreador = idUserGreaGrupo;
    this.json = {
      nameGrupo: group.nameGrupo,
      idUserGreaGrupo: group.idUserCreador
    };
    return this.http.post<any>(this._url + '/crear/', this.json);
  }

  buscarGroup(nameGroup){
    console.log('Grupo a buscar:', nameGroup);
    let url = this._url + '/buscar/'+nameGroup;
    console.log(url);
    return this.http.get(url).pipe(timeout(100000), map((response) => <Grupo[]>this.extractData(response)),// this.extractDataZip(response)))this.extractData(response))
        catchError(this.handleError));
  }

  unirseGroup(group){
    let idUser= localStorage.getItem('idUser');
    console.log('Grupo a unirse:', group);
    let url = this._url + '/agregar/user/';
    this.json = {
      userId: idUser,
      groupId: group.idgrupo,
    };
    return this.http.post<any>(url, this.json);
  }

    salirDelGrupo(group){ 
    let idUser= localStorage.getItem('idUser');
    console.log('Grupo a unirse:', group);
    let url = this._url + '/eliminar/';
    this.json = {
      userId: idUser,
      groupId: group.idgrupo,
    };
    return this.http.post(url, this.json);
  }

  borrarGrupo(group){
    console.log('Grupo a unirse:', group);
    let url = this._url + '/eliminar/';
    this.json = {
      groupId: group.idgrupo,
    };
    return this.http.post(url, this.json);
  }

  private handleError(error:  any) {
    console.log(this.TAG, 'error-> error.status ' , JSON.stringify(error));    // return throwError(error); // <= B
    return throwError(error);
  }
  
  getGruposPorUser(id): Observable<Object[]> {
    let url = this._url + '/'+id;
    return this.http.get(url).pipe(timeout(100000), map((response) => <Grupo[]>this.extractData(response)),// this.extractDataZip(response)))this.extractData(response))
            catchError(this.handleError));
  }

  extractData(res: any) {
    const body = res;
    return body || {};
  }
  
  getUsersPorGroup(groupId){
    console.log('Buscando usuarios del grupo con id:', groupId);
    return this.http.get<any>(this._url + '/listar/user/', groupId);
  }
}