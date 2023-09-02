import { Connection } from 'typeorm';
import { account } from '../entity/account';

export const accProvider = [
    {
      provide: 'ACC_REPOSITORY',
      useFactory: (connection: Connection) => connection.getRepository(account),
      inject: ['DATABASE_CONNECTION'],
    },
 ];