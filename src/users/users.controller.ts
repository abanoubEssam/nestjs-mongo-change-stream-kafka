import { Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private _usersService: UsersService) {}

  @Post()
  async createUser() {
    return await this._usersService.createUser();
  }
}
