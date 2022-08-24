import {Fixture, Goals, League, Score, Teams} from "./Comp";
import {Entity} from 'typeorm';

@Entity()
export class Partido {
  idPartido: number;
  userName: string;
  userId: number;
  idEquipoLocal: number;
  nombreEquipoLocal: string;
  idEquipoVisitante: number;
  nombreEquipoVisitante: string;
  ganaLocal: boolean;
  ganaVisitante: boolean;
  golLocal: number;
  golVisitante: number;
}

/*
import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
@Entity('results')
export class Partido {
  @PrimaryColumn("int", { generated: true })
    id: number;
  @Column()
  idPartido: number;
  @Column()
  userName: string;
  @Column()
  userId: number;
  @Column()
  email: string;
  @Column()
  idEquipoLocal: number;
  @Column()
  nombreEquipoLocal: string;
  @Column()
  idEquipoVisitante: number;
  @Column()
  nombreEquipoVisitante: string;
  @Column()
  ganaLocal: boolean;
  @Column()
  ganaVisitante: boolean;
  @Column()
  golLocal: number;
  @Column()
  golVisitante: number;
}
*/
