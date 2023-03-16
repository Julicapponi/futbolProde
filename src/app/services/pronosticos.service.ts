import { Injectable } from '@angular/core';
import { Comp } from '../class/Comp';
import { DbService } from './db.service';
import {Partido} from "../class/Partido";

@Injectable({
  providedIn: 'root'
})
export class PronosticosService {

  constructor(private db: DbService ) {

  }
/*
  create() {
    const query = 'CREATE TABLE IF NOT EXISTS PRONOSTICOS (idPartido NUMBER, userName TEXT, userId NUMERIC, idEquipoLocal NUMERIC, nombreEquipoLocal TEXT, idEquipoVisitante NUMERIC, nombreEquipoVisitante TEXT, ganaLocal BOOLEAN, ganaVisitante BOOLEAN, golLocal NUMERIC, golVisitante NUMERIC)';
    return this.db.execute(query, []);
  }

  drop(){
    const query = 'DROP TABLE IF EXISTS PRONOSTICOS';
    return this.db.execute(query, []);
  }

  get(){
    const query = 'SELECT * FROM PRONOSTICOS';
    return this.db.getData(query, []);
  }

  multipleInserts(params: Partido[]){
    const query = 'INSERT INTO PRONOSTICOS (idPartido, userName, userId, idEquipoLocal, nombreEquipoLocal, idEquipoVisitante, nombreEquipoVisitante, ganaLocal, ganaVisitante, golLocal, golVisitante) VALUES (idPartido, userName, userId, idEquipoLocal, nombreEquipoLocal, idEquipoVisitante, nombreEquipoVisitante, ganaLocal, ganaVisitante, golLocal, golVisitante)';
    const data = params.map((p: Partido) => {
    const values = [];
    values.push(query);
      values.push([
        p.idPartido, p.userName, p.userId, p.idEquipoLocal, p.nombreEquipoLocal, p.idEquipoVisitante, p.nombreEquipoVisitante, p.ganaLocal, p.ganaVisitante, p.golLocal, p.golVisitante
      ])
      return values;
    });
    return this.db.executeBatch(data)
  }

  sync(params: Partido[]){
      return new Promise((resolve, reject) => {
        this.drop().then(() => {
          this.create().then(() => {
            this.multipleInserts(params).then((data) => {
              resolve(data);
            }).catch(e => reject(e));
          }).catch(e => reject(e));
        }).catch(e => reject(e));
      })
  }

 */
}
