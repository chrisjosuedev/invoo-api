import { Brand } from 'src/brand/entities/brand.entity';
import { InvoiceDetail } from 'src/invoice-detail/entities/invoice-detail.entity';
import { ItemImage } from 'src/item-image/entities/item-image.entity';
import { Size } from 'src/size/entities/size.entity';
import { Store } from 'src/store/entities/store.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('items')
export class Item {
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

  // M:1 Item - Brand
  @ManyToOne(() => Brand, (brand) => brand.id)
  @JoinColumn({ name: 'id_brand' })
  brand: Brand;

  // N:M Item - Size
  @ManyToMany(() => Size, (size) => size.items)
  @JoinTable({
    name: 'items_sizes',
    joinColumn: { name: 'id_item', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'id_size', referencedColumnName: 'id' },
  })
  sizes: Size[];

  // 1:N Item - ItemImages
  @OneToMany(() => ItemImage, (itemImage) => itemImage.item)
  itemImages: ItemImage[];

  // 1:N Item - InvoiceDetail
  @OneToMany(() => InvoiceDetail, (invoiceDetail) => invoiceDetail.item, { lazy: true })
  InvoiceDetail: InvoiceDetail[];
}
