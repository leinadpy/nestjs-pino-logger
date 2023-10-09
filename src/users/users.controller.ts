import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    this.logger.log('Creating a new user in Controller');
    const user = this.usersService.create(createUserDto);
    this.logger.log('Finishing a new user in Controller');

    return user;
  }

  @Get()
  findAll() {
    this.logger.log('Este es un log');
    this.logger.debug('Este es un debug');
    this.logger.error('Este es un error');
    this.logger.verbose('Este es un verbose');
    this.logger.warn('Este es un warn');
    this.logger.fatal('Este es un fatal');
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
