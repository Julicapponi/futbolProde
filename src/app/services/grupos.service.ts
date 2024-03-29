import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {catchError, map, timeout} from "rxjs/operators";
import {Grupo} from "../class/Grupo";
import {Puntaje} from "../class/Puntaje";
import {Constantes} from "../Constantes";
import {Competencia} from "../class/Competencia";
import {User} from "../class/User";

@Injectable({
  providedIn: 'root'
})
export class GruposService {
  _url = Constantes.URL+'groups';
  _url_prod_groups = Constantes.URL_PROD+'groups';
  public headers: HttpHeaders;
  TAG = 'grupos.services.ts';
  json: any = JSON;
   idUser: string;
  constructor(private router: Router, private http: HttpClient) { 
    
  }

  createGroup(group){
    console.log('Grupo a crear:', group);
    let idUserGreaGrupo = localStorage.getItem('idUser');
    group.idUserCreador = idUserGreaGrupo;
    this.json = {
      nameGrupo: group.nameGrupo,
      idUserGreaGrupo: group.idUserCreador,
      idCompetencia: group.idCompetencia
    };
    return this.http.post<any>(this._url + '/crear/', this.json);
  }

  buscarGroup(nameGroup){
    let idUser = localStorage.getItem('idUser');
    console.log('Grupo a buscar:', nameGroup,);
    let url = this._url + '/buscar/'+nameGroup+'/'+idUser;
    console.log(url);
    return this.http.get(url).pipe(timeout(100000), map((response) => <Grupo[]>this.extractData(response)),// this.extractDataZip(response)))this.extractData(response))
        catchError(this.handleError));
  }

  postularAlGroup(group){
    let idUser= localStorage.getItem('idUser');
    console.log('Grupo a unirse:', group);
    let url = this._url + '/postular/user/';
    this.json = {
      userId: idUser,
      groupId: group.idgrupo,
    };
    return this.http.post<any>(url, this.json);
  }

  despostularUserGroup(group){
    let idUser= localStorage.getItem('idUser');
    console.log('Grupo a despostularse:', group);
    let url = this._url + '/borrar/postulacion/';
    this.json = {
      userId: idUser,
      groupId: group.idgrupo,
    };
    return this.http.post<any>(url, this.json);
  }
  
  addPostulante(idUser, idGroup){
    let url = this._url + '/aceptar/postulante/';
    this.json = {
      userId: idUser,
      groupId: idGroup,
    };
 
    return this.http.post<any>(url, this.json);
  }
  
  rechazoPostulante(idUser, idGroup){
    let url = this._url + '/rechazar/postulante/';
    this.json = {
      userId: idUser,
      groupId: idGroup,
    };
    return this.http.post<any>(url, this.json);
  }
  
  agregarPostulanteAlGrupo(idUser, idGroup){
    let url = this._url + '/agregar/user/';
    this.json = {
      userId: idUser,
      groupId: idGroup,
    };
    return this.http.post<any>(url, this.json);
  }

  borrarPostulacion(idUser, idGroup){
    let url = this._url + '/borrar/postulacion/';
    this.json = {
      userId: idUser,
      groupId: idGroup,
    };
    return this.http.post<any>(url, this.json);
  }

  getPostulaciones(idUser){
    let url = this._url + '/postulaciones'+'/'+idUser;
    return this.http.get(url).pipe(timeout(100000), map((response) => <any[]>this.extractData(response)),// this.extractDataZip(response)))this.extractData(response))
        catchError(this.handleError));
  }

    salirDelGrupo(group){ 
    let idUser= localStorage.getItem('idUser');
    console.log('Grupo a unirse:', group);
    let url = this._url + '/salir/';
    this.json = {
      userId: idUser,
      groupId: group.idgrupo,
    };
    return this.http.post(url, this.json);
  }

  editarGrupo(group) {
    console.log('Grupo a editar:', group);
    let url = this._url + '/editar/';
    this.json = {
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
  
  getPostulacionesPendientesDeAceptar(idUser): Observable<Object[]> {
    let url = this._url + '/postulaciones/pendientes'+'/'+idUser;
    return this.http.get(url).pipe(timeout(100000), map((response) => <any[]>this.extractData(response)),// this.extractDataZip(response)))this.extractData(response))
        catchError(this.handleError));
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

  getPuntajesGeneralPorGrupo(idUser, idGrupo): Observable<Puntaje[]> {
    let url = this._url + '/puntajes/general/'+idUser+'/'+idGrupo;
    return this.http.get(url).pipe(timeout(100000), map((response) => <any[]>this.extractData(response)),// this.extractDataZip(response)))this.extractData(response))
        catchError(this.handleError));
  }

  getCompetenciaDelGrupo(idGrupo): Observable<Competencia[]> {
    let url = this._url + '/competencia/'+idGrupo;
    return this.http.get(url).pipe(timeout(100000), map((response) => <any[]>this.extractData(response)),// this.extractDataZip(response)))this.extractData(response))
        catchError(this.handleError));
  }
  getPuntajesFechasPorGrupo(idGrupo): Observable<Puntaje[]> {
    let url = this._url + '/puntajes/fechas/'+idGrupo+'/';
    return this.http.get(url).pipe(timeout(100000), map((response) => <any[]>this.extractData(response)),// this.extractDataZip(response)))this.extractData(response))
        catchError(this.handleError));
  }

  extractData(res: any) {
    const body = res;
    return body || {};
  }
  
  getUsersPorGroup(groupId): Observable<User[]>{
    console.log('Buscando usuarios del grupo con id:', groupId);
    return this.http.get<User[]>(this._url + '/listar/user/'+ groupId+ '/').pipe(
        timeout(100000),
        catchError(this.handleError)
    );
  }




  reporteGrupos(): Observable<Grupo[]> {
    return this.http.get<Grupo[]>(this._url + '/reporte/').pipe(
        timeout(100000),
        catchError(this.handleError)
    );
  }


  editGroup(nameEdit:string, groupEdit :any) {
    console.log(groupEdit);
    const id = groupEdit.idgrupo;
    const name = nameEdit;
    this.json = {
      name: name
    };
    return this.http.put(this._url + '/' +id , this.json);
  }
}
