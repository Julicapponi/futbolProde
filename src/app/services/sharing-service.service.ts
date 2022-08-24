import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {Comp} from "../class/Comp";

@Injectable({
  providedIn: 'root'
})
export class SharingServiceService {

  private myDataPartidos: BehaviorSubject<any> = new BehaviorSubject<any>([]);

  get obtenerPartidos() {
    return this.myDataPartidos.asObservable();
  }

  set setearPartidos(partidos: Comp){
    this.myDataPartidos.next(partidos);
  }


}
