import { Column, Entity, Long, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from './role.enum';
import { BonoEntity } from '../bono/bono.entity';
import { ClaseEntity } from '../clase/clase.entity';

@Entity()
export class UsuarioEntity {
    @PrimaryGeneratedColumn()
    id: Long;

    @Column()
    cedula: number;

    @Column()
    nombre: string;

    @Column()
    grupoinvestigacion: string;

    @Column()
    extension: number;

    @Column()
    rol: Role;

    @Column({nullable:true})
    jefeId: number;

    @OneToMany(() => BonoEntity, bonos => bonos.usuario)
    bonos: BonoEntity[];

    @OneToMany(() => ClaseEntity, clases => clases.usuario)
    clases: ClaseEntity[];
}