import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.usersRepository.create(createUserDto);
  }

  async findAll(): Promise<UserResponseDto[]> {
    return this.usersRepository.findAll();
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOne(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const result = await this.usersRepository.update(id, updateUserDto);
    if (!result) throw new NotFoundException('User not found');
    return result;
  }

  async remove(id: string): Promise<{ success: boolean }> {
    const success = await this.usersRepository.remove(id);
    if (!success) throw new NotFoundException('User not found');
    return { success: true };
  }
}
