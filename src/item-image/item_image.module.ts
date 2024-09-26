import { Module } from '@nestjs/common';
import { ItemImageService } from './item_image.service';
import { ItemImageController } from './item_image.controller';

@Module({
  controllers: [ItemImageController],
  providers: [ItemImageService],
})
export class ItemImageModule {}
