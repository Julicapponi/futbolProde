import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-detalle-partido',
  templateUrl: './detalle-partido.page.html',
  styleUrls: ['./detalle-partido.page.scss'],
})
export class DetallePartidoPage implements OnInit {
  @Input() dataEntrante: any;
  constructor() { }

  ngOnInit() {
  }

}
