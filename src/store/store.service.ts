import { BadRequestException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginationReponse } from 'src/common/interfaces/response.interface';
import { ResponseHandler } from 'src/common/builders/response.builder';
import { CreateStoreDto } from './dtos/create-store.dto';
import { ErrorDto } from 'src/common/dto/error-dto.dto';
import { UpdateStoreDto } from './dtos/update-store.dto';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store) private readonly storeRepository: Repository<Store>,
    private readonly userService: UserService,
  ) {}

  // Find By Id
  async findById(storeId: number, userId: number): Promise<Store> {
    const storeFound = await this.storeRepository
      .createQueryBuilder('s')
      .innerJoinAndSelect('s.user', 'u')
      .where(`s.id = :id AND s.isActive = true AND u.person_id = :userId`, {
        id: storeId,
        userId,
      })
      .getOne();

    if (!storeFound) throw new NotFoundException(new ErrorDto(HttpStatus.NOT_FOUND, 'Store does not exists.'));

    return storeFound;
  }

  // Get User Stores
  async findAllStores(paginationDto: PaginationDto, userId: number): Promise<PaginationReponse<Store>> {
    const { itemsPerPage, currentPage, search } = paginationDto;

    const storeQuery = this.storeRepository
      .createQueryBuilder('s')
      .innerJoinAndSelect('s.user', 'u')
      .where('s.isActive = true AND u.person_id = :id', { id: userId });

    if (search) storeQuery.andWhere(`s.name ILIKE :search AND s.isActive = true`, { search: `%${search}%` });

    const [stores, countStores] = await storeQuery
      .skip((currentPage - 1) * itemsPerPage)
      .take(itemsPerPage)
      .orderBy('s.id', 'DESC')
      .getManyAndCount();

    const paginationResponse = ResponseHandler.paginationBuilder(stores, countStores, itemsPerPage, currentPage);

    return paginationResponse;
  }

  // Find Store By Name
  async findByName(storeName: string, userId: number): Promise<Store> {
    return await this.storeRepository
      .createQueryBuilder('s')
      .innerJoinAndSelect('s.user', 'u')
      .where(`s.name ILIKE :name AND u.person_id = :id`, {
        name: `%${storeName}%`,
        id: userId,
      })
      .getOne();
  }

  // Create a new User Store
  async create(createStoreDto: CreateStoreDto, userId: number): Promise<Store> {
    const existStoreName = await this.findByName(createStoreDto.name, userId);
    if (existStoreName) throw new BadRequestException(new ErrorDto(HttpStatus.BAD_REQUEST, 'Store name is already taken.'));

    // Get User in Session
    const userInSession = await this.userService.findById(userId);
    if (userInSession && !userInSession.person.isActive)
      throw new NotFoundException(new ErrorDto(HttpStatus.NOT_FOUND, 'User does not exists.'));

    // Save store
    try {
      const newStore = this.storeRepository.create({
        ...createStoreDto,
        user: userInSession,
      });
      return await this.storeRepository.save(newStore);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(new ErrorDto(HttpStatus.INTERNAL_SERVER_ERROR, `Error saving entity: ${error.message}`));
    }
  }

  // Update User Store Data
  async update(updateStoreDto: UpdateStoreDto, id: number, userId: number): Promise<Store> {
    // Find Store
    const storeFound = await this.findById(id, userId);

    if (!storeFound) throw new NotFoundException(new ErrorDto(HttpStatus.NOT_FOUND, 'Store does not exists.'));

    // Update store
    try {
      return await this.storeRepository.save({ ...storeFound, ...updateStoreDto });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(new ErrorDto(HttpStatus.INTERNAL_SERVER_ERROR, `Error saving entity: ${error.message}`));
    }
  }

  // Delete User Store
  async delete(id: number, userId: number) {
    // Find Store
    const storeFound = await this.findById(id, userId);
    if (!storeFound || !storeFound.isActive) throw new NotFoundException(new ErrorDto(HttpStatus.NOT_FOUND, 'Store does not exists.'));

    // Update store
    try {
      storeFound.isActive = false;
      await this.storeRepository.save(storeFound);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(new ErrorDto(HttpStatus.INTERNAL_SERVER_ERROR, `Error saving entity: ${error.message}`));
    }
  }
}
