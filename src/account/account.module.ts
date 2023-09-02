import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { tokensProvider } from '../users/tokens.provider';
import { usersProvider } from '../users/users.provider';
import { UsersService } from '../users/users.service';
import { AccountController } from './account.controller';
import { accProvider } from './account.provider';
import { AccountService } from './account.service';

@Module({
  imports: [DatabaseModule],
  providers: [...accProvider, ...usersProvider, ...tokensProvider, AccountService, UsersService],
  controllers: [AccountController]
})
export class AccountModule {}
