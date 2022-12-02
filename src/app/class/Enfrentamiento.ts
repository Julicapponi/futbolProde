import {Entity} from 'typeorm';

@Entity()
export class Partido {
    idEnfrentamiento: number;
    fechaEnfrentamiento: string;
    idLiga: number;
    nameLiga: number;
    anioLiga: number;
    idLocal: number;
    nameLocal: string;
    logoLocal: string;
    idVisit: number;
    nameVisit: string;
    logoVisit: string;
    golLocal: number;
    golVisit: number;
    isModificado: boolean;
}

export class Enfrentamiento {
}