import { Injectable, Output, EventEmitter} from '@angular/core';
import {Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComparteDatosService {
  @Output() disparadorPartidosLiga: EventEmitter<any> = new EventEmitter();
  private sharingObject: any;
  share: Subject<any> = new Subject();
  share$: Observable<any> = this.share.asObservable();
  constructor() { }

  sharedDate(data:any) {
    this.share.next(data);
  }
}
