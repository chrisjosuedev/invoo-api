import { Brand } from "src/brand/entities/brand.entity";
import { Store } from "src/store/entities/store.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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
  
  @Column({ name:'is_active' , type: 'boolean', default: true })
  isActive: boolean;

  // Relations
  // M:1 Item - Store
  @ManyToOne(() => Store, (store) => store.id)
  @JoinColumn({ name: 'id_store '})
  store: Store;
  
  // M:1 Item - Brand
  @ManyToOne(() => Brand, (brand) => brand.id)
  @JoinColumn({ name: 'id_brand '})
  brand: Brand;
}
