import {Entity} from 'typeorm';

@Entity()
export class Enfrentamiento {
    idEnfrentamiento: number;
    fechaEnfrentamiento: string;
    short: string;
    idLiga: number;
    nameLiga: string;
    anioLiga: string;
    round:string;
    idLocal: number;
    nameLocal: string;
    logoLocal: string;
    ganaLocal: number;
    idVisit: number;
    nameVisit: string;
    logoVisit: string;
    ganaVisit: number;
    golLocal: number;
    golVisit: number;
    penalesLocal: number;
    penalesVisit: number;
    isModificado: boolean; 
    isComparado: boolean;
    golesLocalPronosticado: number;
    golesVisitPronosticado: number;

}