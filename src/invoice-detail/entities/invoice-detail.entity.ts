import { Invoice } from "src/invoice/entities/invoice.entity";
import { Product } from "src/product/entities/product.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('invoice_details')
export class InvoiceDetail {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'integer', nullable: false })
  quantity: number;

  @Column({ name: 'unit_price', type: 'decimal', nullable: false })
  unitPrice: number;

  @Column({ type: 'decimal', nullable: false })
  discount: number;

  @Column({ type: 'decimal', nullable: false })
  subtotal: number;

  // Relations
  // M:1 InvoiceDetail - Product
  @ManyToOne(() => Product, (product) => product.id)
  @JoinColumn({ name: 'id_product' })
  product: Product;

  // M:1 InvoiceDetail - Invoice
  @ManyToOne(() => Invoice, (invoice) => invoice.id)
  @JoinColumn({ name: 'id_invoice' })
  invoice: Invoice;
}
