import { Brand } from 'src/brand/entities/brand.entity';
import { Customer } from 'src/customer/entities/customer.entity';
import { Invoice } from "src/invoice/entities/invoice.entity";
import { Item } from "src/item/entities/item.entity";
import { Size } from 'src/size/entities/size.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('stores')
export class Store {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'store_name', type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  phone: string;

  @Column({ name: 'logo_picture_url', type: 'text', nullable: true })
  logoPicture: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: string;

  // Relations
  // M:1 Store - User
  @ManyToOne(() => User, (user) => user.person_id)
  @JoinColumn({ name: 'id_user' })
  user: User;

  // 1:N Store - Customer
  @OneToMany(() => Customer, (customer) => customer.id)
  customer: Customer[];

  // 1:N Store - Brand
  @OneToMany(() => Brand, (brand) => brand.store)
  brands: Brand[];

  // 1:N Store - Sizes
  @OneToMany(() => Size, (size) => size.store)
  sizes?: Size[];

  // 1:N Store - Item
  @OneToMany(() => Item, (item) => item.store, { lazy: true })
  items: Item[];

  // 1:N Store - Invoice
  @OneToMany(() => Invoice, (invoice) => invoice.store)
  invoices: Invoice[];
}
