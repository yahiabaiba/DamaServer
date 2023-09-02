import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { SessionModule } from './session/session.module';
import { JoinModule } from './join/join.module';
import { MoveModule } from './move/move.module';
import { ResultModule } from './result/result.module';
import { GameModule } from './game/game.module';
import { TournamentModule } from './tournament/tournament.module';
import { RatingModule } from './rating/rating.module';
import { ConfigModule } from '@nestjs/config';
import { AccountModule } from './account/account.module';
import { CouponModule } from './coupon/coupon.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true
  }),DatabaseModule, UsersModule, AuthModule, SessionModule, JoinModule, MoveModule, ResultModule, GameModule, TournamentModule, RatingModule, AccountModule, CouponModule],
  controllers: [AppController]
})
export class AppModule {}
