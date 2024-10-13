import { Product } from "src/product/entities/product.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('product_images')
export class ProductImage {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'image_url', type: 'text', nullable: true })
  imageUrl: string;

  // Relations
  // M:1 ProductImage - Product
  @ManyToOne(() => Product, (product) => product.id)
  @JoinColumn({ name: 'id_product' })
  product: Product;
}
