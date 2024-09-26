import { Controller } from '@nestjs/common';
import { ItemImageService } from './item_image.service';

@Controller('item-image')
export class ItemImageController {
  constructor(private readonly itemImageService: ItemImageService) {}
}
