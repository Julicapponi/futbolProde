import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  /*
  private isOpen = false;
  private db: SQLiteObject;
  constructor(private platform: Platform, private sqlite: SQLite) { }

  private open(){
    return new Promise((resolve, reject) => {
      this.platform.ready().then(() => {
        if(this.isOpen){
          return(this.isOpen);
        } else {
          this.sqlite.create({
            name: 'data.db',
            location: 'default'
          }).then((db: SQLiteObject) => {
            this.db = db;J
            this.isOpen = true;
          }).catch(e => reject(e));
        }
      }).catch(e => reject(e));
    })
  }

  executeBatch(params: any) {
    return new Promise((resolve, reject) => {
     this.open().then(() =>{
      this.db.sqlBatch(params).then((response) => {
        resolve(response);
      }).catch(e => reject(e));
     }).catch(e => reject(e));
    })
  }

  execute(query: string, params: any) {
    return new Promise((resolve, reject) => {
      this.open().then(() =>{
        this.db.executeSql(query, params).then((response) => {
          resolve(response);
        }).catch(e => reject(e));
      }).catch(e => reject(e));
    })
  }

  getData(query: string, params: any) {
    return new Promise((resolve, reject) => {
      this.open().then(() =>{
        this.db.executeSql(query, params).then((response) => {
          const items = [];
          for (let i = 0; i < response.rows.length; i++) {
            const element = response.rows.item(i);
            items.push(element);
          }
          resolve(items);
        }).catch(e => reject(e));
      }).catch(e => reject(e));
    })
  }
*/
}
