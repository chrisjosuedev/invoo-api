import { Brand } from 'src/brand/entities/brand.entity';
import { Customer } from 'src/customer/entities/customer.entity';
import { Invoice } from 'src/invoice/entities/invoice.entity';
import { Item } from 'src/item/entities/item.entity';
import { Size } from 'src/size/entities/size.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('stores')
export class Store {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'store_name', type: 'varchar', length: 100, nullable: false, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ name: 'logo_picture_url', type: 'text', nullable: true })
  logoPicture: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  // Relations
  // M:1 Store - User
  @ManyToOne(() => User, (user) => user.person_id, { eager: true })
  @JoinColumn({ name: 'id_user' })
  user: User;

  // 1:N Store - Customer
  @OneToMany(() => Customer, (customer) => customer.id, { lazy: true })
  customer: Customer[];

  // 1:N Store - Brand
  @OneToMany(() => Brand, (brand) => brand.store, { lazy: true })
  brands: Brand[];

  // 1:N Store - Sizes
  @OneToMany(() => Size, (size) => size.store, { lazy: true })
  sizes?: Size[];

  // 1:N Store - Item
  @OneToMany(() => Item, (item) => item.store, { lazy: true })
  items: Item[];

  // 1:N Store - Invoice
  @OneToMany(() => Invoice, (invoice) => invoice.store, { lazy: true })
  invoices: Invoice[];
}
