import { BadRequestException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { Repository } from 'typeorm';
import { StoreService } from '../store/store.service';
import { UserService } from 'src/user/user.service';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { ErrorDto } from 'src/common/dto/error-dto.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer) private readonly customerRepository: Repository<Customer>,
    private readonly storeService: StoreService,
    private readonly userService: UserService,
  ) {}

  // Find Customer By Email
  async findByEmail(email: string): Promise<Customer> {
    return await this.customerRepository.findOne({ where: { email, isActive: true } });
  }

  // Create a New Customer
  async create(createCustomerDto: CreateCustomerDto, storeId: number, userId: string): Promise<Customer> {
    const userLogged = await this.userService.findById(userId);

    // Validate if user is active
    if (!userLogged || !userLogged.isActive) throw new NotFoundException(new ErrorDto(HttpStatus.NOT_FOUND, 'User does not exists.'));

    // Get Store Data
    const userStore = await this.storeService.findById(storeId, userLogged.id);

    // Validate if email already exists
    const emailExists = await this.userService.findByEmail(createCustomerDto.email);
    if (emailExists) throw new BadRequestException(new ErrorDto(HttpStatus.BAD_REQUEST, 'Email already exists.'));

    try {
      // New Customer
      const newCustomer = this.customerRepository.create({ ...createCustomerDto, store: userStore });

      return await this.customerRepository.save(newCustomer);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(new ErrorDto(HttpStatus.INTERNAL_SERVER_ERROR, `Error saving entity: ${error.message}`));
    }
  }
}
