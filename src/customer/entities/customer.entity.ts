import { Person } from 'src/person/entities/person.entity';
import { Store } from 'src/store/entities/store.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 14, nullable: true })
  rtn?: string;

  @Column({ type: 'decimal', default: 0 })
  discount: number;

  // Relations
  // 1:1 Person - Customer
  @OneToOne(() => Person, (person) => person.id)
  @JoinColumn({ name: 'id_person' })
  person: Person;

  // M:1 Customer - Store
  @ManyToOne(() => Store, (store) => store.user)
  @JoinColumn({ name: 'id_store' })
  store: Store;
}
