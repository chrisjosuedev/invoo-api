import { InvoiceDetail } from 'src/invoice-detail/entities/invoice-detail.entity';
import { ProductImage } from 'src/product-image/entities/product-image.entity';
import { Store } from 'src/store/entities/store.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  description?: string;

  @Column({ type: 'integer', nullable: true, default: 0 })
  stock: number;

  @Column({ type: 'decimal', nullable: true, default: 0 })
  price: number;

  @Column({ type: 'decimal', nullable: true, default: 0 })
  discount: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  // Relations
  // M:1 Item - Store
  @ManyToOne(() => Store, (store) => store.id)
  @JoinColumn({ name: 'id_store ' })
  store: Store;

  // 1:N Product - ItemProduct
  @OneToMany(() => ProductImage, (productImage) => productImage.product)
  productImages: ProductImage[];

  // 1:N Item - InvoiceDetail
  @OneToMany(() => InvoiceDetail, (invoiceDetail) => invoiceDetail.product, { lazy: true })
  InvoiceDetail: InvoiceDetail[];
}
