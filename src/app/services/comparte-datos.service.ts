import { Injectable, Output, EventEmitter} from '@angular/core';
import {Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComparteDatosService {
  @Output() disparadorPartidosLiga: EventEmitter<any> = new EventEmitter();
  private sharingObject: any;
  share: Subject<any> = new Subject();
  private userSubject = new Subject<any>();
  share$: Observable<any> = this.share.asObservable();
  constructor() { }

  sharedDate(data:any) {
    this.share.next(data);
  }
  
  setUser(user: any) {
    this.userSubject.next(user);
  }

  getUser() {
    return this.userSubject.asObservable();
  }
}
