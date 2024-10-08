import { BadRequestException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { PersonService } from 'src/person/person.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ErrorDto } from 'src/common/dto/error-dto.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { ResponseHandler } from 'src/common/builders/response.builder';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly personService: PersonService,
  ) {}

  // Find User By Id
  private async findById(id: number): Promise<User> {
    return await this.userRepository
      .createQueryBuilder('u')
      .innerJoinAndSelect('u.person', 'p')
      .where('u.person_id = :id AND p.isActive = true', { id })
      .getOne();
  }

  // Find User By Username
  async findByUsername(username: string): Promise<User> {
    return await this.userRepository
      .createQueryBuilder('u')
      .innerJoinAndSelect('u.person', 'p')
      .where('u.username = :username', { username })
      .getOne();
  }

  // Find all Users
  async findAllUsers(paginationData: PaginationDto): Promise<any> {
    const { itemsPerPage, currentPage, search } = paginationData;

    const userQuery = this.userRepository.createQueryBuilder('u').innerJoinAndSelect('u.person', 'p').where(`p.isActive = true`);

    if (search)
      userQuery.andWhere(`u.username ILIKE :search OR CONCAT(p.firstName, ' ', p.lastName) ILIKE :search AND p.isActive = true`, {
        search: `%${search}%`,
      });

    const [users, countUsers] = await userQuery
      .skip((currentPage - 1) * itemsPerPage)
      .take(itemsPerPage)
      .orderBy('u.person_id', 'DESC')
      .getManyAndCount();

    const paginationResponse = ResponseHandler.paginationBuilder(users, countUsers, itemsPerPage, currentPage);
    return paginationResponse;
  }

  // Get User Profile
  async findByUsernameOrEmail(query: string): Promise<User> {
    // Verify if user exists
    const userByEmail = await this.personService.findByEmail(query);

    if (userByEmail) {
      const foundUser = await this.findById(userByEmail.id);
      return foundUser;
    }

    const userByUsername = await this.findByUsername(query);
    if (userByUsername) return userByUsername;

    if (!userByEmail && !userByUsername) throw new NotFoundException(new ErrorDto(HttpStatus.NOT_FOUND, 'User does not exists.'));
  }

  // Creating a New User
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, password, isGoogle, ...person } = createUserDto;

    // Verify if email already exists
    const emailExists = await this.personService.findByEmail(person.email);
    if (emailExists) throw new BadRequestException(new ErrorDto(HttpStatus.BAD_REQUEST, 'Email already exists.'));

    // Verify if username already exists
    const existsUsername = await this.findByUsername(username);
    if (existsUsername) throw new BadRequestException(new ErrorDto(HttpStatus.BAD_REQUEST, 'Given username already exists.'));

    try {
      // Saving new user in person table
      const newPerson = this.personService.create(person);

      // Encrypt password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create Instance
      const newUser: User = this.userRepository.create({
        username,
        password: hashedPassword,
        isGoogle: isGoogle || false,
        person: newPerson,
      });

      // Save user
      return await this.userRepository.save(newUser);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(new ErrorDto(HttpStatus.INTERNAL_SERVER_ERROR, `Error saving entity: ${error.message}`));
    }
  }

  // Update User
  async update(updateUserDto: UpdateUserDto, id: number): Promise<User> {
    const { username, ...person } = updateUserDto;
    const { email, ...restPerson } = person;

    const user = await this.findById(id);

    if (!user) throw new NotFoundException(new ErrorDto(HttpStatus.NOT_FOUND, 'User does not exists.'));

    // Verify if user exists
    if (username) {
      const usernameExists = await this.findByUsername(username);

      if (usernameExists && usernameExists.person_id !== user.person_id)
        throw new BadRequestException(new ErrorDto(HttpStatus.BAD_REQUEST, 'Username already taken.'));

      // Set Username
      user.username = username;
    }

    // Verify if email exists
    if (email) {
      const emailExists = await this.personService.findByEmail(email);
      if (emailExists && emailExists.user.person_id !== user.person_id)
        throw new BadRequestException(new ErrorDto(HttpStatus.BAD_REQUEST, 'Email already taken.'));

      // Set Email
      user.person.email = email;
    }

    try {
      // Update Person Data
      user.person = { ...user.person, ...restPerson };
      // Update User
      return await this.userRepository.save(user);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(new ErrorDto(HttpStatus.INTERNAL_SERVER_ERROR, `Error updating entity: ${error.message}`));
    }
  }

  // Desactivate Account
  async desactivate(id: number) {
    const user = await this.findById(id);

    if (!user) throw new NotFoundException(new ErrorDto(HttpStatus.NOT_FOUND, 'User does not exists.'));

    // change status

    try {
      // Update Person Data
      await this.personService.delete(user.person);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(new ErrorDto(HttpStatus.INTERNAL_SERVER_ERROR, `Error udpating entity: ${error.message}`));
    }
  }
}
