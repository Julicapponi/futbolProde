import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { Comp } from '../class/Comp';
import { Observable } from 'rxjs';
import {Competencia} from "../class/Competencia";
import {Enfrentamiento} from "../class/Enfrentamiento";

@Injectable({
  providedIn: 'root'
})
export class CompetenciaService {
  _url = 'http://localhost:5000/api/competitions';
  _urlEnfrentamientos = 'http://localhost:5000/api/enfrentamientos';
  public headers: Headers;
  json: any = JSON;
  seasons: any = Array;
  temporadaActual: boolean;
  fechaActual: Date;
  anioActual: number;
  fechaHoy: string;
    fechaHoys: string[];
    repuestaFallida: any = JSON;
  constructor(private router: Router, private http: HttpClient) {
  }

  getCompetencias(){
    return this.http.get<any>(this._url + '/listCompetitions');
  }
  
  getLigas(){
    return this.http.get<any>(this._url + '/');
  }

    padTo2Digits(num: number) {
        return num.toString().padStart(2, '0');
    }

    // 👇️ format as "YYYY-MM-DD hh:mm:ss"
    // You can tweak formatting easily
    formatDate(date: Date) {
        return (
            [
                date.getFullYear(),
                this.padTo2Digits(date.getMonth() + 1),
                this.padTo2Digits(date.getDate()),
            ].join('-') +
            ' ' +
            [
                this.padTo2Digits(date.getHours()),
                this.padTo2Digits(date.getMinutes()),
                this.padTo2Digits(date.getSeconds()),
            ].join(':')
        );
    }

   
    
    editStateCompetition(comp: Competencia, estaCheckeada: any) {
        console.log(comp);
        const idComp = comp.league.id;
        this.seasons = comp.seasons;
        /*
        const result = this.formatDate(new Date());
        let fechaFormat = result.split(' ')
        this.fechaHoy= fechaFormat[0];
         */
        const date = new Date();
        this.anioActual = date.getFullYear();
        for(let season of this.seasons){
            //season.current = true es la temporada actual / solo se va a poder activar las actuales
           // if(season.current && season.year == this.anioActual){
            if(season.current){
                this.temporadaActual = true;
                this.json = {
                    id: comp.league.id,
                    name: comp.league.name,
                    anio: season.year
                };
            } else {
                this.temporadaActual = false;
            }
        }
        console.log(this.json);
        //fue checkeada, por lo tanto se agrega a la tabla de activas
        if (this.temporadaActual) {
            if (estaCheckeada == true) {
                return this.http.delete(this._url + '/' + idComp);
            } else {
                return this.http.post<any>(this._url + '/', this.json);
        
            }
        }
    }
        
    //obtengo los enfrentamientos desde la BD desde la tarea programada
      getEnfrentamientos(idCompetencia, anioCompetencia){
        console.log(idCompetencia, 'y el anio:', anioCompetencia);
        return this.http.get<any>(this._urlEnfrentamientos + '/'+idCompetencia + '/'+anioCompetencia+ '/');
      }
      
        getEnfrentamientosPronosticados(idCompetencia, userId){
            console.log('obtenemos pronosticos de idCompetencia la competencia'+ idCompetencia +'hechos por el usuario con id:', userId);
            return this.http.get<any>(this._urlEnfrentamientos + '/pronosticados/'+idCompetencia + '/'+userId+ '/');
        }

    guardarPronosticos(part:Enfrentamiento){
        let idUser = localStorage.getItem('idUser');
        this.json = {
            golesLocal: part.golesLocalPronosticado,
            golesVisit: part.golesVisitPronosticado,
            idUser: idUser,
            idEnfrentamiento: part.idEnfrentamiento
        };
        return this.http.post<any>(this._urlEnfrentamientos + '/guardar/pronostico/', this.json);
    }
   
      getCompetenciasActivas(){
        return this.http.get<any>(this._url + '/list/activas/');
      }

    deshabilitarCompetencia(idCompetencia){
        return this.http.delete(this._url + '/'+idCompetencia);
    }
}

