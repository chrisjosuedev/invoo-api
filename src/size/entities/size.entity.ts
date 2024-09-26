import { Store } from "src/store/entities/store.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sizes')
export class Size {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'size_spec', type: 'varchar', length: 50, nullable: false })
  sizeSpec: string;

  // Relations
  // M:1 Size - Store
  @ManyToOne(() => Store, (store) => store.id)
  @JoinColumn({ name: 'id_store' })
  store: Store;
}
