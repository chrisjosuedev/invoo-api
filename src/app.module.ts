import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configuration } from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DBConfiguration } from './config/configuration.interface';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PersonModule } from './person/person.module';
import { UserModule } from './user/user.module';
import { CustomerModule } from './customer/customer.module';
import { StoreModule } from './store/store.module';
import { BrandModule } from './brand/brand.module';
import { SizeModule } from './size/size.module';
import { ItemModule } from './item/item.module';
import { InvoiceModule } from './invoice/invoice.module';
import { InvoiceDetailModule } from './invoice-detail/invoice-detail.module';
import { ItemImageModule } from "./item-image/item_image.module";

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
    PersonModule,
    UserModule,
    CustomerModule,
    StoreModule,
    BrandModule,
    SizeModule,
    ItemModule,
    ItemImageModule,
    InvoiceModule,
    InvoiceDetailModule
  ],

  controllers: [],
  providers: [],
})
export class AppModule {}
