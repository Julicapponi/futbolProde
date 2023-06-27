import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { Comp } from '../class/Comp';
import {Observable, throwError} from 'rxjs';
import {Competencia} from "../class/Competencia";
import {Enfrentamiento} from "../class/Enfrentamiento";
import {Constantes} from "../Constantes";
import {Puntaje} from "../class/Puntaje";
import {catchError, map, timeout} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class CompetenciaService {
  _url = Constantes.URL+'competitions';
  _url_prod_competitions = Constantes.URL_PROD+'competitions';
  _urlEnfrentamientos = Constantes.URL+'enfrentamientos';
  _url_prod_enfrentamientos = Constantes.URL_PROD+'enfrentamientos';
  public headers: Headers;
  json: any = JSON;
  seasons: any = Array;
  temporadaActual: boolean;
  fechaActual: Date;
  anioActual: number;
  fechaHoy: string;
  TAG = 'competencia.services.ts';
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



    altaOBajaService(comp: Competencia, estaCheckeada: any) {
        const idComp = comp.league.id;
        this.seasons = comp.seasons;
        const date = new Date();
        this.anioActual = date.getFullYear();
        for(let season of this.seasons){
            if(season.current){
                this.temporadaActual = true;
                //Armado de Json que se envia en la solicitud http
                this.json = {
                    idcompetition: comp.league.id,
                    name: comp.league.name,
                    anio: season.year
                };
            } else {
                this.temporadaActual = false;
            }
        }
        // peticiones
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

    //obtengo los enfrentamientos desde la API 
    getEnfrentamientosApi(idCompetencia, anioCompetencia){
        console.log(idCompetencia, 'y el anio:', anioCompetencia);
        return this.http.get<any>(this._urlEnfrentamientos + '/list/'+idCompetencia + '/'+anioCompetencia+ '/');
    }

    getTablaDePosicionesPorCompetencia(idCompetencia, anioCompetenciaSeleccionada: string){
        return this.http.get<any>(this._urlEnfrentamientos + '/tabla/posiciones/'+idCompetencia + '/' +anioCompetenciaSeleccionada);
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
            idEnfrentamiento: part.idEnfrentamiento,
            idLiga : part.idCompetencia
        };
        return this.http.post<any>(this._urlEnfrentamientos + '/guardar/pronostico/', this.json);
    }

        getCompetenciasAltas(){
            return this.http.get<any>(this._url + '/list/altas/');
        }
    
      getCompetenciasActivas(){
        return this.http.get<any>(this._url + '/list/activas/');
      }

    habilitarCompetencia(idCompetencia){
        const id = idCompetencia;
        this.json = {
            activa: 1,
        };
        return this.http.put(this._url + '/estado/' +id , this.json);
    }
    
    deshabilitarCompetencia(idCompetencia){
        const id = idCompetencia;
        this.json = {
            activa: 0,
        };
        return this.http.put(this._url + '/estado/' +id , this.json);
    }

    eliminarCompetencia(idComp){
        return this.http.delete(this._url + '/' + idComp);
    }

    editCompetition(compEditada: Competencia) {
        const id = compEditada.idcompetition;
        const nameEdit = compEditada.name;
        const anioComp = compEditada.anio;
        const activa = compEditada.activa;
        //armo json para peticion
        this.json = {
            idcompetition: id,
            name: nameEdit,
            anio: anioComp,
            activa: activa
        };
        return this.http.put(this._url + '/' +id , this.json);
    }

    editEnfrentamiento(enfrentamiento: Enfrentamiento) {
        const id = enfrentamiento.idEnfrentamiento;
        this.json = {
            id: enfrentamiento.idEnfrentamiento,
            nameLocal: enfrentamiento.nameLocal,
            nameVisit: enfrentamiento.nameVisit,
            golLocal: enfrentamiento.golLocal,
            golVisit: enfrentamiento.golVisit,
            isModificado : true
        };
        return this.http.put(this._urlEnfrentamientos + '/' +id , this.json);
    }
    actualizacionPartidos(): Observable<Enfrentamiento> {
        let url = this._urlEnfrentamientos + '/guardar/enfrentamientos/';
        return this.http.get(url).pipe(timeout(100000), map((response) => <any>this.extractData(response)),
            catchError(this.handleError));
    }

    private handleError(error:  any) {
        console.log(this.TAG, 'error-> error.status ' , JSON.stringify(error));
        return throwError(error);
    }
    
    extractData(res: any) {
        const body = res;
        return body || {};
    }
}

