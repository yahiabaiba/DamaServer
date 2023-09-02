import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { tokensProvider } from '../users/tokens.provider';
import { usersProvider } from '../users/users.provider';
import { UsersService } from '../users/users.service';
import { CouponController } from './coupon.controller';
import { coupProvider } from './coupon.provider';
import { CouponService } from './coupon.service';

@Module({
  imports: [DatabaseModule],
  providers: [...coupProvider, ...usersProvider, ...tokensProvider, CouponService, UsersService],
  controllers: [CouponController]
})
export class CouponModule {}
