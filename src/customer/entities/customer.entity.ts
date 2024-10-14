import { Invoice } from 'src/invoice/entities/invoice.entity';
import { Store } from 'src/store/entities/store.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, } from 'typeorm';

@Entity('customers')
export class Customer {
  @PrimaryColumn({type: 'varchar', length: 13, nullable: false})
  id: string;

  @Column({ name: 'fullname', type: 'varchar', length: 50, nullable: false })
  fullName: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone?: string;

  @Column({ type: 'varchar', length: 14, nullable: true })
  rtn?: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  // M:1 Customer - Store
  @ManyToOne(() => Store, (store) => store.user)
  @JoinColumn({ name: 'id_store' })
  store: Store;

  // 1:N Store - Invoice
  @OneToMany(() => Invoice, (invoice) => invoice.customer, { lazy: true })
  invoices: Invoice[];
}
