import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/response-user.dto';
import { BcryptService } from 'src/bcypt/bcrypt.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private readonly bcryptService: BcryptService,
  ) {}

  // register
  async create(createUserDto: CreateUserDto) {
    const { password, ...rest } = createUserDto;
    const hashedPassword = await this.bcryptService.hashPassword(password);
    return this.prisma.user.create({
      data: {
        ...rest,
        password: hashedPassword,
      },
    });
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      throw new NotFoundException(`User with id #${id} not found`);
    }

    return user;
  }

  async findOneByEmail(email: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new NotFoundException(`User with email "${email}" not found`);
    }
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      hashedPassword: user.password,
      imageUrl: user.imageUrl,
    };
  }
  async update(id: number, updateUserDto: UpdateUserDto) {
    // try {
    //   const updateUser = await this.prisma.user.update({
    //     where: {
    //       id,
    //     },
    //     data: {
    //       ...updateUserDto,
    //     },
    //   });
    //   return updateUser;
    // } catch (error) {
    //   console.log(error);
    // }

    const updateUser = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        ...updateUserDto,
      },
    });
    return updateUser;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
