import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {Comp} from "../class/Comp";
import {Enfrentamiento} from "../class/Enfrentamiento";

@Injectable({
  providedIn: 'root'
})
export class SharingServiceService {

  private myDataPartidos: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  private myDataTabla: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  get obtenerPartidos() {
    return this.myDataPartidos.asObservable();
  }

  set setearPartidos(partidos: Enfrentamiento){
    this.myDataPartidos.next(partidos);
  }

  get obtenerTablaPosiciones() {
    return this.myDataTabla.asObservable();
  }
  
  set setearTablaPosiciones(equipos: Enfrentamiento){
    this.myDataTabla.next(equipos);
  }


}
