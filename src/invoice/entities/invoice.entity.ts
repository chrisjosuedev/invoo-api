import { Customer } from 'src/customer/entities/customer.entity';
import { InvoiceDetail } from 'src/invoice-detail/entities/invoice-detail.entity';
import { Store } from 'src/store/entities/store.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'sale_date', type: 'timestamp', nullable: false })
  saleDate: Date;

  @Column({ type: 'timestamp', nullable: false })
  total: number;

  // Relations
  // M:1 Invoice - Store
  @ManyToOne(() => Store, (store) => store.id)
  @JoinColumn({ name: 'id_store' })
  store: Store;

  // M:1 Invoice - Customer
  @ManyToOne(() => Customer, (customer) => customer.id)
  @JoinColumn({ name: 'id_customer' })
  customer: Customer;

  // 1:N Item - InvoiceDetail
  @OneToMany(() => InvoiceDetail, (invoiceDetail) => invoiceDetail.invoice)
  InvoiceDetails: InvoiceDetail[];
}
