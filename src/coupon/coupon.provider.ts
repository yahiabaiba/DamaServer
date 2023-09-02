import { Connection } from 'typeorm';
import { coupon } from '../entity/coupon';

export const coupProvider = [
    {
      provide: 'COUP_REPOSITORY',
      useFactory: (connection: Connection) => connection.getRepository(coupon),
      inject: ['DATABASE_CONNECTION'],
    },
 ];