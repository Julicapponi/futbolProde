import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import { Comp } from '../class/Comp';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompetenciaService {
  _url = 'http://localhost:4000/api';
  public headers: Headers;
  json: any = JSON;
  constructor(private router: Router, private http: HttpClient) {
  }

  getCompetencia(){
    return this.http.get<any>(this._url + '/obtener/league/england');
  }

  getCompetencias(){
    return this.http.get<any>(this._url + '/listCompetitions');
  }

  editStateCompetition(idComp, activaComp){
    if(activaComp == false || !(activaComp == null) || !(activaComp == undefined)){
      activaComp = false;
    } else {
      activaComp = true;
    }
    this.json = JSON.stringify({
      activa: activaComp
    });
    return this.http.post(this._url + '/editStateCompetition/' +idComp, this.json);
  }

  getEnfrentamientos(idCompetencia, anioCompetencia){
    console.log(idCompetencia, 'y el anio:', anioCompetencia);
    return this.http.get<any>(this._url + '/obtener/enfrentamientos/'+idCompetencia + '/'+anioCompetencia);
  }

  getCompetenciasActivas(){
    return this.http.get<any>(this._url + '/listCompetitionsActivates');
  }


}

