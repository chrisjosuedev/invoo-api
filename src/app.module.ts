import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configuration } from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DBConfiguration } from './config/configuration.interface';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UserModule } from './user/user.module';
import { CustomerModule } from './customer/customer.module';
import { StoreModule } from './store/store.module';
import { InvoiceModule } from './invoice/invoice.module';
import { InvoiceDetailModule } from './invoice-detail/invoice-detail.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { ProductImageModule } from './product-image/product-image.module';

@Module({
  imports: [
    // Set Env Config variables
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),

    // Server static files
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),

    // Config Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const dbConfig = config.get<DBConfiguration>('db');
        return {
          type: 'postgres',
          logging: false,
          synchronize: true,
          extra: {
            extensions: ['unaccent'],
          },
          autoLoadEntities: true,
          entities: [__dirname + '/**/*.entity.{js,ts}'],
          ...dbConfig,
        };
      },
    }),

    // Modules
    UserModule,
    CustomerModule,
    StoreModule,
    ProductModule,
    ProductImageModule,
    InvoiceModule,
    InvoiceDetailModule,
    AuthModule,
    ProductModule,
    ProductImageModule,
  ],

  controllers: [],
  providers: [],
})
export class AppModule {}
