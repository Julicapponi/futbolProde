import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ResultsService {
  _url = 'http://localhost:4000/api';
  constructor(private router: Router, private http: HttpClient) {

  }

  altaResultado(resultado){
    return this.http.post<any>(this._url + '/altaResultado', resultado);
  }

  getMatchs(){
    return this.http.get<any>(this._url + '/football');
  }


}
