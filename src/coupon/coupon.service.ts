import { HttpStatus, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { getRepository, Repository } from 'typeorm';
import { coupon } from '../entity/coupon';
import { Coupon } from '../interfaces/coupon.interface';
import { Payment } from '../interfaces/payment.interface';

@Injectable()
export class CouponService {

    constructor(
        @Inject('COUP_REPOSITORY')
        private readonly service: Repository<coupon>
    ) {}  

    async getPayments(user_id: number): Promise<Payment[]> {
        try {
            const x = await this.service.query(
                `select c.id, c.code, c.amount, c.activated
                 from   user_account a
                 inner  join payment b on (b.account_id = a.account_id)
                 inner  join coupon c on (c.payment_id = b.id)
                 where  a.user_id = ?
                 order  by c.activated`, [user_id]);
            let l: Payment[] = x.map(x => {
                let it = new Payment();
                it.id = x.id;
                it.coupon = x.code;
                it.amount = x.amount;
                it.created = x.activated;
                return it;
            });
            return l;
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException({
                status: HttpStatus.BAD_REQUEST,
                error: error
            });
        }
    }

    async couponFound(code: string): Promise<boolean> {
        const x = await this.service.query(
            `select count(*) as cnt
             from   coupon a
             where  a.code = ?`, [code]);
        if (!x || x.length == 0) return false;
        return x[0].cnt > 0;
    }

    async genCoupons(amount: number, cnt: number): Promise<Coupon[]> {
        try {
            const x = await this.service.query(
                `select a.id, a.code, a.amount, a.created
                 from   coupon a
                 where  a.payment_id is null and a.amount = ?
                 order  by a.created`, [amount]);
            let l: Coupon[] = x.map(x => {
                let it = new Coupon();
                it.id = x.id;
                it.code = x.code;
                it.amount = x.amount;
                it.created = x.created;
                return it;
            });
            while (l.length < cnt) {
                const digest =  (Math.random() + 1).toString(36).substring(7);
                let salt = 0;
                let y = new coupon();
                y.amount = amount;
                y.code = require('crypto').createHash('md5').update(salt.toString(16).toUpperCase() + digest).digest('hex').toUpperCase().substr(1, 16);
                while (await this.couponFound(y.code)) {
                    salt++;
                    y.code = require('crypto').createHash('md5').update(salt.toString(16).toUpperCase() + digest).digest('hex').toUpperCase().substr(1, 16);
                }
                const r = getRepository(coupon);
                await r.insert(y);
                let it = new Coupon();
                it.id = y.id;
                it.code = y.code;
                it.amount = y.amount;
                it.created = y.created;
                l.push(it);
            }
            return l;
        } catch (error) {
              console.error(error);
              throw new InternalServerErrorException({
                  status: HttpStatus.BAD_REQUEST,
                  error: error
              });
        }
    }
}
