import { Item } from "src/item/entities/item.entity";
import { Store } from 'src/store/entities/store.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('brand')
export class Brand {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  brand: string;

  // Relations
  // M:1 Brand - Store
  @ManyToOne(() => Store, (store) => store.id)
  @JoinColumn({ name: 'id_store' })
  store: Store;

  // 1:N Brand - Item
  @OneToMany(() => Item, (item) => item.brand, { lazy: true })
  items: Item[];
}
