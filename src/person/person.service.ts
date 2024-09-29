import { BadRequestException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from './entities/person.entity';
import { Repository } from 'typeorm';
import { CreatePersonDto } from './dtos/create-person.dto';
import { ErrorDto } from 'src/common/dto/ErrorDto.dto';

@Injectable()
export class PersonService {
  constructor(@InjectRepository(Person) private readonly personRepository: Repository<Person>) {}

  // Save Person
  async create(createPersonDto: CreatePersonDto): Promise<Person> {
    try {
      // If not, save person
      const newPerson = this.personRepository.create(createPersonDto);
      // Saving and return Person
      return await this.personRepository.save(newPerson);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        new ErrorDto(`Error saving entity: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR),
      );
    }
  }

  // Find Person By Email
  async findByEmail(email: string): Promise<Person> {
    return await this.personRepository.findOne({ where: { email } });
  }
}
