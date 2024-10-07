import { BadRequestException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from './entities/person.entity';
import { Repository } from 'typeorm';
import { CreatePersonDto } from './dtos/create-person.dto';
import { ErrorDto } from 'src/common/dto/error-dto.dto';

@Injectable()
export class PersonService {
  constructor(@InjectRepository(Person) private readonly personRepository: Repository<Person>) {}

  // Find Person By Id
  async findById(id: number): Promise<Person> {
    return await this.personRepository.findOneBy({ id });
  }

  // Find Person By Email
  async findByEmail(email: string): Promise<Person> {
    return await this.personRepository.findOne({ where: { email }, relations: ['user'] });
  }

  // Create a Person Instance
  create(createPersonDto: CreatePersonDto): Person {
    try {
      // If not, save person
      return this.personRepository.create(createPersonDto);
      // Saving and return Person
      // return await this.personRepository.save(newPerson);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(new ErrorDto(`Error creating instance of entity: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR));
    }
  }
}
