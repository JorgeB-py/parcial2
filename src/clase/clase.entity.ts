import { BonoEntity } from '../bono/bono.entity';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { Column, Entity, Long, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ClaseEntity {
    @PrimaryGeneratedColumn()
    id: Long;

    @Column()
    codigo: string;

    @Column()
    nombre: string;

    @Column()
    numerocreditos: number;

    @OneToMany(() => BonoEntity, bonos => bonos.clase)
    bonos: BonoEntity[];

    @ManyToOne(() => UsuarioEntity, usuario => usuario.clases)
    usuario: UsuarioEntity;
}