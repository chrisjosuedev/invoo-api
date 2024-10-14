import { Store } from 'src/store/entities/store.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'first_name', type: 'varchar', length: 50, nullable: false })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 50, nullable: false })
  lastName: string;

  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ name: 'profile_url', type: 'text', nullable: true })
  profileUrl: string;
  
  @Column({ type: 'varchar', length: 64, nullable: false, unique: true })
  username: string;
  
  @Column({ type: 'varchar', length: 70, nullable: false })
  password: string;
  
  @Column({ name: 'is_google', type: 'boolean', nullable: true, default: false })
  isGoogle: boolean;

  @Column({ name: 'is_verified', type: 'boolean', default: false })
  isVerified: boolean;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;
  
  // 1:N User - Stores
  @OneToMany(() => Store, (store) => store.user)
  stores: Store[];
}
