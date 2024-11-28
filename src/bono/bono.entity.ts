import { ClaseEntity } from 'src/clase/clase.entity';
import { UsuarioEntity } from 'src/usuario/usuario.entity';
import { Column, Double, Entity, Long, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

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