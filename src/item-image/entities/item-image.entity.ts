import { Item } from 'src/item/entities/item.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('item_images')
export class ItemImage {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'text', nullable: true })
  imageUrl: string;

  // Relations
  // M:1 ItemImage - Item
  @ManyToOne(() => Item, (item) => item.id)
  @JoinColumn({ name: 'id_item' })
  item: Item;
}
