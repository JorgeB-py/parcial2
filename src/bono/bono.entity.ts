import { ClaseEntity } from '../clase/clase.entity';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { Column, Double, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Long } from 'typeorm';

@Entity()
export class BonoEntity {
    @PrimaryGeneratedColumn()
    id: Long;

    @Column()
    monto: number;

    @Column({ type: 'decimal', nullable: false })
    calificacion: number;

    @Column()
    palabraclave: string;

    @ManyToOne(() => ClaseEntity, clase => clase.bonos)
    clase: ClaseEntity;

    @ManyToOne(() => UsuarioEntity, usuario => usuario.bonos)
    usuario: UsuarioEntity;

}