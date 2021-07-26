import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Status } from '../../../Share/Enums';

@Entity('user_details')
export class UserDetails extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  lastname: string;

  @Column({ type: 'varchar', default: Status.ACTIVE, length: 8 })
  status: string;
}
