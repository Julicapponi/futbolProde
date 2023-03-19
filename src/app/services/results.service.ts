import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {Constantes} from "../Constantes";

@Injectable({
  providedIn: 'root'
})
export class ResultsService {
  _url = Constantes.URL+'api';
  constructor(private router: Router, private http: HttpClient) {

  }

  altaResultado(resultado){
    return this.http.post<any>(this._url + '/altaResultado', resultado);
  }
  


}
