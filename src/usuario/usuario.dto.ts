import { IsArray, IsNotEmpty, isNumber, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';
import { Long } from 'typeorm';
import { Role } from './role.enum';

export class UsuarioDto {

    @IsString()
    @IsNotEmpty()
    cedula: string;

    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsString()
    @IsNotEmpty()
    grupoinvestigacion: string;

    @IsNumber()
    @IsNotEmpty()
    extension:number;

    @IsNotEmpty()
    rol: Role;

    @IsNotEmpty()
    jefeId: number;

    @IsOptional()
    @IsArray()
    BonosId: Long[];

    @IsOptional()
    @IsArray()
    clasesId: Long[];
}