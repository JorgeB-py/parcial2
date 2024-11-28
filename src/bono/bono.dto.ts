import { IsNotEmpty, isNumber, IsNumber, IsString, IsUrl } from 'class-validator';
import { Long } from 'typeorm';

export class BonoDto {

    @IsNumber()
    @IsNotEmpty()
    monto: number;

    @IsNumber()
    @IsNotEmpty()
    calificacion: number;

    @IsString()
    @IsNotEmpty()
    palabraclave: string;

    @IsNumber()
    @IsNotEmpty()
    claseId: number;

    @IsNumber()
    @IsNotEmpty()
    usuarioId: number;
}