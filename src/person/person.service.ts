import { BadRequestException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from './entities/person.entity';
import { Repository } from 'typeorm';
import { CreatePersonDto } from './dtos/create-person.dto';
import { ErrorDto } from 'src/common/dto/error-dto.dto';
import { UpdatePersonDto } from './dtos/update-person.dto';

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

  // Save Person
  async create(createPersonDto: CreatePersonDto): Promise<Person> {
    try {
      // If not, save person
      const newPerson = this.personRepository.create(createPersonDto);
      // Saving and return Person
      return await this.personRepository.save(newPerson);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(new ErrorDto(`Error saving entity: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR));
    }
  }

  // Update Person
  async update(updatePersonDto: UpdatePersonDto, id: number): Promise<Person> {
    try {
      // Saving and return Person
      const person = await this.personRepository.preload({
        id,
        ...updatePersonDto,
      });

      return await this.personRepository.save(person);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(new ErrorDto(`Error udpating entity: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR));
    }
  }
}
