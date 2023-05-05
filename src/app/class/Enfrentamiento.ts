import {Entity} from 'typeorm';

@Entity()
export class Enfrentamiento {
    idEnfrentamiento: number;
    fechaEnfrentamiento: Date;
    short: string;
    idLiga: number;
    nameLiga: string;
    anioLiga: string;
    round: string;
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
    isModificado; 
    isComparado:number;
    golesLocalPronosticado: number;
    golesVisitPronosticado: number;
    estadoFecha: number;
    puedePronosticar:Boolean;
    elapsed:string;
    long: string;
    estadoPartido: string;
    puntosSumados:number;
    modificoDatos: boolean;
    idCompetencia: string;
    status : number;
}