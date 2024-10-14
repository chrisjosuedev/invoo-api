import { BadRequestException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ErrorDto } from 'src/common/dto/error-dto.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { ResponseHandler } from 'src/common/builders/response.builder';
import { PaginationReponse } from 'src/common/interfaces/response.interface';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  // Find User By Id
  async findById(id: string): Promise<User> {
    return await this.userRepository.createQueryBuilder('u').where('u.id = :id', { id }).getOne();
  }

  // Find User By Username
  async findByUsername(username: string): Promise<User> {
    return await this.userRepository.createQueryBuilder('u').where('u.username = :username', { username }).getOne();
  }

  // Find User by Email
  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.createQueryBuilder('u').where('u.email = :email', { email }).getOne();
  }

  // Find all Users
  async findAllUsers(paginationData: PaginationDto): Promise<PaginationReponse<User>> {
    const { itemsPerPage, currentPage, search } = paginationData;

    const userQuery = this.userRepository.createQueryBuilder('u').where(`u.isActive = true`);

    if (search)
      userQuery.andWhere(`u.username ILIKE :search OR CONCAT(u.firstName, ' ', u.lastName) ILIKE :search AND u.isActive = true`, {
        search: `%${search}%`,
      });

    const [users, countUsers] = await userQuery
      .skip((currentPage - 1) * itemsPerPage)
      .take(itemsPerPage)
      .orderBy('u.id', 'DESC')
      .getManyAndCount();

    const paginationResponse = ResponseHandler.paginationBuilder(users, countUsers, itemsPerPage, currentPage);
    return paginationResponse;
  }

  // Get User Profile
  async findByUsernameOrEmail(query: string): Promise<User> {
    // Verify if user exists
    const userByEmail = await this.findByEmail(query);

    if (userByEmail) return userByEmail;

    // If not by email, try with username
    const userByUsername = await this.findByUsername(query);
    if (userByUsername) return userByUsername;

    if (!userByEmail && !userByUsername) throw new NotFoundException(new ErrorDto(HttpStatus.NOT_FOUND, 'User does not exists.'));
  }

  // Creating a New User
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, password, isGoogle, ...rest } = createUserDto;

    // Verify if email already exists
    const emailExists = await this.findByEmail(rest.email);
    if (emailExists) throw new BadRequestException(new ErrorDto(HttpStatus.BAD_REQUEST, 'Email already exists.'));

    // Verify if username already exists
    const existsUsername = await this.findByUsername(username);
    if (existsUsername) throw new BadRequestException(new ErrorDto(HttpStatus.BAD_REQUEST, 'Given username already exists.'));

    try {
      // Encrypt password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create Instance
      const newUser: User = this.userRepository.create({
        ...rest,
        profileUrl: null,
        password: hashedPassword,
        username
      });

      // Save user
      return await this.userRepository.save(newUser);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(new ErrorDto(HttpStatus.INTERNAL_SERVER_ERROR, `Error saving entity: ${error.message}`));
    }
  }

  // Update User
  async update(updateUserDto: UpdateUserDto, id: string): Promise<User> {
    const { username, email, ...rest } = updateUserDto;

    const user = await this.userRepository.preload({
      id,
      ...rest
    })

    if (!user || !user.isActive)
      throw new NotFoundException(new ErrorDto(HttpStatus.NOT_FOUND, 'User does not exists or account was disabled.'));

    // Verify if user exists
    if (username) {
      const usernameExists = await this.findByUsername(username);

      if (usernameExists && usernameExists.id !== user.id)
        throw new BadRequestException(new ErrorDto(HttpStatus.BAD_REQUEST, 'Username already taken.'));

      // Set Username
      user.username = username;
    }

    // Verify if email exists
    if (email) {
      const emailExists = await this.findByEmail(email);
      if (emailExists && emailExists.id !== user.id)
        throw new BadRequestException(new ErrorDto(HttpStatus.BAD_REQUEST, 'Email already taken.'));

      // Set Email
      user.email = email;
    }

    try {
      // Update User
      return await this.userRepository.save(user);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(new ErrorDto(HttpStatus.INTERNAL_SERVER_ERROR, `Error updating entity: ${error.message}`));
    }
  }

  // Active Account
  async activate(id: string) {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException(new ErrorDto(HttpStatus.NOT_FOUND, 'User does not exists.'));

    // change status
    try {
      // Update Person Data
      user.isActive = true;
      await this.userRepository.save(user);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(new ErrorDto(HttpStatus.INTERNAL_SERVER_ERROR, `Error udpating entity: ${error.message}`));
    }
  }

  // Desactivate Account
  async desactivate(id: string) {
    const user = await this.findById(id);

    if (!user || !user.isActive) throw new NotFoundException(new ErrorDto(HttpStatus.NOT_FOUND, 'User does not exists.'));

    // change status
    try {
      // Update User Status
      user.isActive = false;
      await this.userRepository.save(user);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(new ErrorDto(HttpStatus.INTERNAL_SERVER_ERROR, `Error udpating entity: ${error.message}`));
    }
  }
}
