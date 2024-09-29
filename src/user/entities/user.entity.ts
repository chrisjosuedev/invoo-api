import { Person } from 'src/person/entities/person.entity';
import { Store } from 'src/store/entities/store.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 64, nullable: false, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 70, nullable: false })
  password: string;

  @Column({ name: 'is_google', type: 'boolean', nullable: true, default: false })
  isGoogle: boolean;

  // Relations
  // 1:1 Person - User
  @OneToOne(() => Person, (person) => person.id, { eager: true })
  @JoinColumn({ name: 'id_person' })
  person: Person;

  // 1:N User - Stores
  @OneToMany(() => Store, (store) => store.user)
  stores: Store[];
}
