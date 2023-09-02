import { HttpStatus, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { getRepository, Repository } from 'typeorm';
import { account } from '../entity/account';
import { billing } from '../entity/billing';
import { coupon } from '../entity/coupon';
import { invoice } from '../entity/invoice';
import { payment } from '../entity/payment';
import { service } from '../entity/service';
import { tariff_service } from '../entity/tariff_service';
import { user_account } from '../entity/user_account';
import { Account } from '../interfaces/account.interface';
import { AccountTariff } from '../interfaces/accounttariff.interface';
import { AccountUser } from '../interfaces/accountuser.interface';
import { Invoice } from '../interfaces/invoice.interface';
import { Payment } from '../interfaces/payment.interface';
import { Period } from '../interfaces/period.interface';

@Injectable()
export class AccountService {

    constructor(
        @Inject('ACC_REPOSITORY')
        private readonly service: Repository<account>
    ) {}  

    async getBilling(): Promise<billing> {
        const x = await this.service.query(
            `select a.id, a.created
             from   billing a
             where  a.closed is null`);
        if (!x || x.length == 0) return null;
        let r = new billing();
        r.id = x[0].id;
        r.created = x[0].created;
        return r;
    }

    async getPeriod(d: Date): Promise<Period> {
        const x = await this.service.query(
            `select DATE_SUB(CURDATE(), INTERVAL DAYOFMONTH(CURDATE())-1 DAY) as start,
                    DATE_SUB(DATE_ADD(?, INTERVAL 32 DAY), INTERVAL DAYOFMONTH(DATE_ADD(?, INTERVAL 32 DAY))-1 DAY) as end`, [d, d]);
        if (!x || x.length == 0) return null;
        let r = new Period();
        r.start = x[0].start;
        r.end = x[0].end;
        return r;
    }

    async getCurrentBilling(): Promise<billing> {
        let x = await this.getBilling();
        const p = await this.getPeriod(x ? x.created : new Date());
        if (!x || x.created < p.start) {
            if (x) {
                await this.service.createQueryBuilder("billing")
                .update(billing)
                .set({ 
                    closed: p.end
                 })
                .where("id = :id", {id: x.id})
                .execute();
            }
            const r = getRepository(billing);
            const y = new billing();
            y.created = p.start;
            await r.insert(y);
            x = await this.getBilling();
        }
        return x;
    }

    async getDefaultTariff(): Promise<number> {
        const x = await this.service.query(
            `select a.id
             from   tariff a
             where  a.is_default = 1 and a.deleted is null
             order  by a.created desc`);
        if (!x || x.length == 0) {
            return null;
        }
        return x[0].id;
    }

    async findAccount(user_id: number): Promise<Account> {
        const x = await this.service.query(
            `select b.id, b.tariff_id, c.name as tariff, b.balance, a.created
             from   user_account a
             inner  join account b on (b.id = a.account_id)
             inner  join tariff c on (c.id = b.tariff_id)
             where  a.user_id = ? and a.deleted is null
             order  by a.created desc`, [user_id]);
        if (!x || x.length == 0) return null;
        let it = new Account();
        it.id = x[0].id;
        it.tariff_id = x[0].tariff_id;
        it.tariff = x[0].tariff;
        it.balance = x[0].balance;
        it.created = x[0].created;
        return it;
    }

    async getDefaultServices(tariff_id: number): Promise<tariff_service[]> {
        const x = await this.service.query(
            `select a.id, a.tariff_id, a.service_id, a.price, a.created, b.type_id
             from   tariff_service a
             inner  join service b on (b.id = a.service_id)
             where  a.tariff_id = ? and a.is_default = 1 and a.deleted is null`, [tariff_id]);
        let l: tariff_service[] = x.map(x => {
             let it = new tariff_service();
             it.id = x.id;
             it.tariff_id = x.tariff_id;
             it.service_id = x.service_id;
             it.price = (x.type_id == 1) ? x.price : 0;
             it.created = x.created;
             return it;
        });
        return l;
    }

    async createDefaultServices(bill_id: number, acc_id: number, tariff_id: number, balance: number): Promise<void> {
        const s = await this.getDefaultServices(tariff_id);
        for (let i = 0; i < s.length; i++) {
            if (s[i].price != 0) {
                balance -= s[i].price;
                await this.service.createQueryBuilder("account")
                .update(account)
                .set({ 
                    balance: balance
                 })
                .where("id = :id", {id: acc_id})
                .execute();
            }
            const t = new invoice();
            t.account_id = acc_id;
            t.service_id = s[i].service_id;
            t.billing_id = bill_id;
            t.quantity = 1;
            t.amount = s[i].price;
            t.closed = new Date();
            const p = getRepository(invoice);
            await p.insert(t);
        }
    }

    async createAccount(user_id: number): Promise<Account> {
        const b = await this.getCurrentBilling();
        if (!b) return null;
        const x = new account();
        x.tariff_id = await this.getDefaultTariff();
        if (!x.tariff_id) return null;
        x.balance = 0;
        const a = getRepository(account);
        await a.insert(x);
        const y = new user_account();
        y.account_id = x.id;
        y.user_id = user_id;
        const r = getRepository(user_account);
        await r.insert(y);
        await this.createDefaultServices(b.id, y.account_id, x.tariff_id, x.balance);
        const z = await this.findAccount(user_id);
        return z;
    }

    async getAccount(user_id: number): Promise<Account> {
        try {
            let r = await this.findAccount(user_id);
            if (!r) {
                r = await this.createAccount(user_id);
            }
            return r;
        } catch (error) {
              console.error(error);
              throw new InternalServerErrorException({
                  status: HttpStatus.BAD_REQUEST,
                  error: error
              });
        }
    }

    async getUsers(acc_id: number): Promise<AccountUser[]> {
        try {
            const x = await this.service.query(
                `select a.account_id as id, a.user_id, b.name as user, a.created, a.deleted
                 from   user_account a
                 inner  join users b on (b.id = a.user_id)
                 where  a.account_id = ?
                 order  by a.created`, [acc_id]);
            if (!x || x.length == 0) {
                 return null;
            }
            let l: AccountUser[] = x.map(x => {
                let it = new AccountUser();
                it.id = x.id;
                it.user_id = x.user_id;
                it.user = x.user;
                it.created = x.created;
                it.deleted = x.deleted;
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

    async checkLimit(acc_id: number): Promise<boolean> {
        const x = await this.service.query(
            `select b.max_quantity
             from   account a
             inner  join account_limit b on (b.tariff_id = a.tariff_id)
             where  a.id = ?`, [acc_id]);
        if (!x || x.length == 0) return true;
        const y = await this.service.query(
            `select count(*) as quantity
             from   user_account a
             where  a.account_id = ? and a.deleted is null`, [acc_id]);
        if (!y || y.length == 0) return false;
        return y[0].quantity < x[0].max_quantity;
    }

    async findUserAccountById(id: number): Promise<AccountUser> {
        const x = await this.service.query(
            `select a.id, a.account_id, a.user_id, b.name as user, a.created
             from   user_account a
             inner  join users b on (b.id = a.user_id)
             where  a.id = ?`, [id]);
        if (!x || x.length == 0) return null;
        let it = new AccountUser();
        it.id = x[0].id;
        it.account_id = x[0].account_id;
        it.user_id = x[0].user_id;
        it.user = x[0].user;
        it.created = x[0].created;
        return it;
    }

    async addUser(user_id: number, x: AccountUser): Promise<AccountUser> {
        try {
            const u = await this.findAccount(x.user_id);
            if (u) return null;
            const a = await this.findAccount(user_id);
            if (!a) return null;
            const f = await this.checkLimit(a.id);
            if (!f) return null;
            const r = getRepository(user_account);
            const y = new user_account();
            y.account_id = a.id;
            y.user_id = x.user_id;
            await r.insert(y);
            const z = await this.findUserAccountById(y.id);
            return z;
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException({
                status: HttpStatus.BAD_REQUEST,
                error: error
            });
        }
    }

    async findUserAccountByUser(user_id: number): Promise<AccountUser> {
        const x = await this.service.query(
            `select a.id, a.account_id, a.user_id, b.name as user, a.created
             from   user_account a
             inner  join users b on (b.id = a.user_id)
             where  a.user_id = ? and a.deleted is null`, [user_id]);
        if (!x || x.length == 0) return null;
        let it = new AccountUser();
        it.id = x[0].id;
        it.account_id = x[0].account_id;
        it.user_id = x[0].user_id;
        it.user = x[0].user;
        it.created = x[0].created;
        return it;
    }

    async delUser(user_id: number, x: AccountUser): Promise<AccountUser> {
        try {
            if (user_id == x.user_id) return null;
            const r = await this.findUserAccountByUser(x.user_id);
            if (r) {
                const u = await this.findAccount(user_id);
                if (u) return null;
                if (u.id != r.account_id) return null;
                await this.service.createQueryBuilder("user_account")
                .update(user_account)
                .set({ 
                    deleted: new Date()
                 })
                .where("id = :id", {id: r.id})
                .execute();
            }
            return r;
        } catch(error) {
            console.error(error);
            throw new InternalServerErrorException({
                status: HttpStatus.BAD_REQUEST,
                error: error
            });
        }
    }

    async getPayments(acc_id: number): Promise<Payment[]> {
        try {
            const x = await this.service.query(
                `select a.id, a.account_id, b.code as coupon, a.amount, a.created
                 from   payment a
                 jeft   join coupon b on (b.payment_id = a.id)
                 where  a.account_id = ?
                 order  by a.created`, [acc_id]);
            let l: Payment[] = x.map(x => {
                let it = new Payment();
                it.id = x.id;
                it.account_id = x.account_id;
                it.coupon = x.coupon;
                it.amount = x.amount;
                it.created = x.created;
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

    async getCoupon(code: string): Promise<coupon> {
        const x = await this.service.query(
            `select a.id, a.payment_id, a.amount, a.created
             from   coupon a
             where  a.code = ? and a.payment_id is null and a.activated is null`, [code]);
        if (!x || x.length == 0) return null;
        let it = new coupon();
        it.id = x[0].id;
        it.payment_id = x[0].payment_id;
        it.amount = x[0].amount;
        it.created = x[0].created;
        return it;
    }

    async addCoupon(user_id: number, x: Payment): Promise<Payment> {
        try {
            const a = await this.findAccount(user_id);
            if (!a) return null;
            x.account_id = a.id;
            const c = await this.getCoupon(x.coupon);
            if (!c) return null;
            const b = await this.getCurrentBilling();
            if (!b) return null;
            const r = getRepository(payment);
            const y = new payment();
            y.account_id = x.account_id;
            y.billing_id = b.id;
            y.type_id = 2;
            y.amount = c.amount;
            await r.insert(y);
            await this.service.createQueryBuilder("coupon")
            .update(coupon)
            .set({ 
                payment_id: y.id,
                activated: new Date()
             })
            .where("id = :id", {id: c.id})
            .execute();
            await this.service.createQueryBuilder("account")
            .update(account)
            .set({ 
                balance: +a.balance + +c.amount
             })
            .where("id = :id", {id: x.account_id})
            .execute();
            x.amount = c.amount;
            x.created = new Date();
            return x;
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException({
                status: HttpStatus.BAD_REQUEST,
                error: error
            });
        }
    }

    async getInvoices(acc_id: number): Promise<Invoice[]> {
        try {
            const x = await this.service.query(
                `select a.id, a.account_id, a.amount, a.service_id, b.name as service, a.created, a.closed
                 from   invoice a
                 inner  join service b on (b.id = a.service_id)
                 where  a.account_id = ?
                 order  by a.created`, [acc_id]);
            let l: Invoice[] = x.map(x => {
                let it = new Invoice();
                it.id = x.id;
                it.account_id = x.account_id;
                it.amount = x.amount;
                it.service_id = x.service_id;
                it.service = x.service;
                it.created = x.created;
                it.closed = x.closed;
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

    async findAccountById(id: number): Promise<account> {
        const x = await this.service.query(
            `select a.id, a.tariff_id, a.balance, a.created, a.deleted
             from   account a
             where  a.id = ?`, [id]);
        if (!x || x.length == 0) return null;
        let it = new account();
        it.id = x[0].id;
        it.tariff_id = x[0].tariff_id;
        it.balance = x[0].balance;
        it.created = x[0].created;
        it.deleted = x[0].deleted;
        it.created = x[0].created;
        return it;
    }

    async getCurrentInvoices(acc_id: number): Promise<invoice[]> {
        const x = await this.service.query(
            `select a.id, a.account_id, a.service_id, a.billing_id, a.discount_id, a.quantity, a.amount, a.created, a.changed
             from   invoice a
             where  a.account_id = ? and a.closed is null`, [acc_id]);
        let l: invoice[] = x.map(x => {
             let it = new invoice();
             it.id = x.id;
             it.account_id = x.account_id;
             it.service_id = x.service_id;
             it.billing_id = x.billing_id;
             it.discount_id = x.discount_id;
             it.quantity = x.quantity;
             it.amount = x.amount;
             it.created = x.created;
             it.changed = x.changed;
             return it;
        });
        return l;
    }

    async setTariff(x: AccountTariff): Promise<AccountTariff> {
        try {
            const b = await this.getCurrentBilling();
            if (!b) return null;
            const a = await this.findAccountById(x.account_id);
            if (!a) return null;
            if (a.tariff_id == x.tariff_id) return x;
            const v = await this.getCurrentInvoices(x.account_id);
            for (let i = 0; i < v.length; i++) {
                await this.service.createQueryBuilder("invoice")
                .update(invoice)
                .set({ 
                    closed: new Date()
                 })
                .where("id = :id", {id: v[i].id})
                .execute();
            }
            await this.service.createQueryBuilder("account")
            .update(account)
            .set({ 
                tariff_id: x.tariff_id,
                changed: new Date()
             })
            .where("id = :id", {id: x.account_id})
            .execute();
            await this.createDefaultServices(b.id, x.account_id, x.tariff_id, a.balance);
            return x;
        } catch (error) {
              console.error(error);
              throw new InternalServerErrorException({
                  status: HttpStatus.BAD_REQUEST,
                  error: error
              });
        }
    }

    async getTariffService(acc_id: number, service_id: number): Promise<tariff_service> {
        const x = await this.service.query(
            `select b.id, b.tariff_id, b.service_id, b.price, b.created
             from   account a
             inner  join tariff_service b on (b.tariff_id = a.tariff_id and b.service_id = ?)
             where  a.id = ? and b.deleted is null`, [service_id, acc_id]);
        if (!x || x.length == 0) return null;
        let r = new tariff_service();
        r.id = x[0].id;
        r.tariff_id = x[0].tariff_id;
        r.service_id = x[0].service_id;
        r.price = x[0].price;
        r.created = x[0].created;
        return r;
    }

    async getInvoice(acc_id: number, service_id: number): Promise<invoice> {
        const x = await this.service.query(
            `select a.id, a.account_id, a.service_id, a.billing_id, a.discount_id, a.quantity, a.amount, a.created, a.changed
             from   invoice a
             where  a.service_id = ? and a.account_id = ? and a.closed is null`, [service_id, acc_id]);
        if (!x || x.length == 0) return null;
        let r = new invoice();
        r.id = x[0].id;
        r.account_id = x[0].account_id;
        r.service_id = x[0].service_id;
        r.billing_id = x[0].billing_id;
        r.discount_id = x[0].discount_id;
        r.quantity = x[0].quantity;
        r.amount = x[0].amount;
        r.created = x[0].created;
        r.changed = x[0].changed;
        return r;
    }

    async getTimeDiff(t: Date): Promise<number> {
        const x = await this.service.query(
            `select TIME_TO_SEC(TIMEDIFF(now(), ?)) as v`, [t]);
        return x[0].v;
    }

    async getServicesById(id: number): Promise<service[]> {
        const x = await this.service.query(
            `select c.id, c.type_id, c.scope_id, c.scale, c.name, c.created
             from   account c
             where  c.id = ? and c.deleted is null`, [id]);
        if (!x || x.length == 0) return null;
        let l: service[] = x.map(x => {
             let r = new service();
             r.id = x.id;
             r.type_id = x.type_id;
             r.scope_id = x.scope_id;
             r.scale = x.scale;
             r.name = x.name;
             r.description = x.description;
             r.created = x.created;
             return r;
        });
        return l;
    }

    async getServicesByUsagetype(acc_id: number, scope_id): Promise<service[]> {
        const x = await this.service.query(
            `select c.id, c.type_id, c.scope_id, c.scale, c.name, c.created
             from   account a
             inner  join tariff_service b on (b.tariff_id = a.tariff_id and b.deleted is null)
             inner  join service c on (c.id = b.service_id and c.deleted is null)
             where  a.id = ? and a.deleted is null
             and    c.type_id in (2, 3, 4) and c.scope_id = ?`, [acc_id, scope_id]);
        let l: service[] = x.map(x => {
             let r = new service();
             r.id = x.id;
             r.type_id = x.type_id;
             r.scope_id = x.scope_id;
             r.scale = x.scale;
             r.name = x.name;
             r.description = x.description;
             r.created = x.created;
             return r;
        });
        return l;
    }

    async getScope(session_id): Promise<number> {
        const x = await this.service.query(
            `select coalesce(a.scope_id, b.scope_id) as scope_id
             from   game_sessions s
             inner  join game_variants a on (a.id = s.variant_id)
             inner  join games b on (b.id = a.game_id)
             where  s.id = ?`, [session_id]);
        if (!x || x.length == 0) return null;
        return x[0].scope_id;
    }

    async addInvoice(user_id: number, x: Invoice): Promise<Invoice> {
        try {
            const b = await this.getCurrentBilling();
            if (!b) return null;
            const a = await this.getAccount(user_id);
            if (!a) return null;
            let s: service[] = null;
            if (x.service_id) {
                s = await this.getServicesById(x.service_id);
                if (!s) return null;
            } else if (x.session_id) {
                const scope_id = await this.getScope(x.session_id)
                s = await this.getServicesByUsagetype(a.id, scope_id);
            }
            for (let i = 0; i < s.length; i++) {
                // periodic (not implemented)
                if (s[i].type_id == 2) return null;
                // time trecking (not implemented)
                if (s[i].type_id == 3) return null;
            }
            for (let i = 0; i < s.length; i++) {
                const t = await this.getTariffService(a.id, s[i].id);
                if (!t) return null;
                let v = await this.getInvoice(a.id, s[i].id);
                if (v && v.billing_id != b.id) {
                    await this.service.createQueryBuilder("invoice")
                    .update(invoice)
                    .set({ 
                        closed: new Date()
                     })
                    .where("id = :id", {id: v.id})
                    .execute();
                    v = null;
                }
                if (!x.count) x.count = 1;
                x.amount = 0;
                x.account_id = a.id;
                // event
                if (s[i].type_id == 1) {
                    x.amount = t.price;
                    x.amount = x.amount * x.count;
                }
                // subscription
                if (v && s[i].type_id == 4) {
                    x.count = await this.getTimeDiff(v.created);
                    var cnt = x.count;
                    if (s[i].scale) {
                        cnt = x.count / s[i].scale;
                    }
                    x.amount = (t.price * cnt) - v.amount;
                }
                if (x.amount < 0) continue;
                if (x.amount > a.balance) return null;
                await this.service.createQueryBuilder("account")
                .update(account)
                .set({ 
                    balance: a.balance - x.amount
                 })
                .where("id = :id", {id: a.id})
                .execute();
                if (!v) {
                    const v = new invoice();
                    v.account_id = a.id;
                    v.service_id = s[i].id;
                    v.billing_id = b.id;
                    v.quantity = x.count;
                    v.amount = x.amount;
                    const p = getRepository(invoice);
                    await p.insert(v);
                } else {
                    await this.service.createQueryBuilder("invoice")
                    .update(invoice)
                    .set({ 
                        quantity: +v.quantity + +x.count,
                        amount: +v.amount + +x.amount,
                        changed: new Date()
                     })
                    .where("id = :id", {id: v.id})
                    .execute();
                }
            }
            return x;
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException({
                status: HttpStatus.BAD_REQUEST,
                error: error
            });
        }
    }
}
