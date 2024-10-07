import { BadRequestException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PersonService } from 'src/person/person.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ErrorDto } from 'src/common/dto/error-dto.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly personService: PersonService,
    private readonly ds: DataSource,
  ) {}

  // Find User By Id
  private async findById(id: number): Promise<User> {
    return await this.userRepository.findOne({ where: { person_id: id }, relations: ['person'] });
  }

  // Find User By Username
  async findByUsername(username: string): Promise<User> {
    return await this.userRepository.findOne({ where: { username }, relations: ['person'] });
  }

  // Find all Users
  async findAllUsers(paginationData: PaginationDto): Promise<any> {
    const { itemsPerPage, currentPage, search } = paginationData;

    const userQuery = this.userRepository.createQueryBuilder('u').innerJoinAndSelect('u.person', 'p');

    if (search)
      userQuery.where(`u.username ILIKE :search OR CONCAT(p.firstName, ' ', p.lastName) ILIKE :search`, {
        search: `%${search}%`,
      });

    const [users, countUsers] = await userQuery
      .skip((currentPage - 1) * itemsPerPage)
      .take(itemsPerPage)
      .orderBy('u.id', 'DESC')
      .getManyAndCount();

    return {
      totalUsers: countUsers,
      totalCurrent: users.length,
      data: users,
    };
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

    if (!userByEmail && !userByUsername) throw new NotFoundException(new ErrorDto('User does not exists.', HttpStatus.NOT_FOUND));
  }

  // Creating a new User
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, password, isGoogle, ...person } = createUserDto;

    // Verify if email already exists
    const emailExists = await this.personService.findByEmail(person.email);
    if (emailExists) throw new BadRequestException(new ErrorDto('Email already exists.', HttpStatus.BAD_REQUEST));

    // Verify if username already exists
    const existsUsername = await this.findByUsername(username);
    if (existsUsername) throw new BadRequestException(new ErrorDto('Given username already exists.', HttpStatus.BAD_REQUEST));

    // Saving new user in person table
    const savedPerson = await this.personService.create(person);

    try {
      // TODO: Encrypt password
      const newUser: User = this.userRepository.create({
        username,
        password,
        isGoogle: isGoogle || false,
        person: savedPerson,
      });

      // Save user
      return await this.userRepository.save(newUser);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(new ErrorDto(`Error saving entity: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR));
    }
  }

  // Update User
  async update(updateUserDto: UpdateUserDto, id: number): Promise<User> {
    const { username, ...person } = updateUserDto;
    const { email } = person;

    //const user = await this.findByPersonId(id);
    const user = await this.userRepository.preload({
      person_id: id,
      ...person
    });

    if (!user) throw new NotFoundException(new ErrorDto('User does not exists.', HttpStatus.NOT_FOUND));

    // Verify if user exists
    if (username) {
      const usernameExists = await this.findByUsername(username);
      if (usernameExists && usernameExists.person_id !== user.person_id)
        throw new BadRequestException(new ErrorDto('Username already taken.', HttpStatus.BAD_REQUEST));

      // Set Username
      user.username = username;
    }

    // Verify if email exists
    if (email) {
      const emailExists = await this.personService.findByEmail(email);
      if (emailExists && emailExists.user.person_id !== user.person_id) throw new BadRequestException(new ErrorDto('Email already taken.', HttpStatus.BAD_REQUEST));

      // Set Email
      user.person.email = email;
    }

    try {
      // Update Person Data
      //await this.personService.update(person, user.person.id);

      console.log(user)

      // Update User
      //return await this.userRepository.save(user);
      return;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(new ErrorDto(`Error udpating entity: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR));
    }
  }
}
