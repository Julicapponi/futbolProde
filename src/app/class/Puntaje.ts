import {Entity} from 'typeorm';

@Entity()
export class Puntaje {
    name: string;
    puntos_acumulados:number;
}