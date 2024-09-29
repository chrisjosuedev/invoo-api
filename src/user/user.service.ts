import { BadRequestException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PersonService } from 'src/person/person.service';
import { ErrorDto } from 'src/common/dto/ErrorDto.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly personService: PersonService,
  ) {}

  // Creating a new User
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, password, isGoogle, ...person } = createUserDto;

    // Verify if email already exists
    const emailExists = await this.personService.findByEmail(person.email);
    if (emailExists)
      throw new BadRequestException(new ErrorDto('Email already exists.', HttpStatus.BAD_REQUEST));

    // Verify if username already exists
    const existsUsername = await this.findByUsername(username);
    if (existsUsername)
      throw new BadRequestException(new ErrorDto('Given username already exists.', HttpStatus.BAD_REQUEST));

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
      throw new InternalServerErrorException(
        new ErrorDto(`Error saving entity: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR),
      );
    }
  }

  // Find User By Username
  async findByUsername(username: string): Promise<User> {
    return await this.userRepository.findOne({ where: { username } });
  }
}
