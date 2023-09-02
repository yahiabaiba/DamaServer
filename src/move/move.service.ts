import { Injectable, Inject, InternalServerErrorException, HttpStatus } from '@nestjs/common';
import { game_moves } from '../entity/game_moves';
import { getRepository, Repository } from 'typeorm';
import { Move } from '../interfaces/move.interface';
import { user_games } from '../entity/user_games';
import { game_sessions } from '../entity/game_sessions';
import { game_alerts } from '../entity/game_alerts';

@Injectable()
export class MoveService {

    constructor(
        @Inject('MOVE_REPOSITORY')
        private readonly service: Repository<game_moves>
    ) {}  
    
    async getMovesBySession(sid: number, turn: number): Promise<Move[]> {
        try {
            const x = await this.service.query(
                `select a.id, a.session_id, a.user_id, a.turn_num,
                        a.move_str, a.setup_str, a.note, a.time_delta,
                        b.main_time, b.additional_time, b.is_sandglass,
                      ( select sum(c.time_delta)
                        from   game_moves c
                        where  c.session_id = a.session_id
                        and    c.user_id = a.user_id
                        and    c.turn_num <= a.turn_num
                      ) as time_limit
                 from   game_moves a
                 inner  join game_sessions b on (b.id = a.session_id)
                 where  a.session_id = ? and a.turn_num = ?
                 order  by a.id`, [sid, turn]);
            let l: Move[] = x.map(x => {
                let it = new Move();
                it.id = x.id;
                it.session_id = x.session_id;
                it.user_id = x.user_id;
                it.turn_num = x.turn_num;
                it.move_str = x.move_str;
                it.setup_str = x.setup_str;
                it.note = x.note;
                it.time_delta = x.time_delta;
                if (x.main_time && !x.is_sandglass) {
                    it.time_limit = x.main_time * 1000;
                    it.time_limit -= x.time_limit;
                    if (it.time_limit < 0) {
                        it.time_limit = x.time_delta - (x.additional_time * 1000);
                    }
                }
                it.additional_time = x.additional_time;
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

    async touchSession(uid: number, sess: number): Promise<boolean> {
        await this.service.createQueryBuilder("game_sessions")
        .update(game_sessions)
        .set({ 
            last_user: uid,
            last_time: Date.now()
        })
        .where("id = :id and last_time is null", {id: sess})
        .execute();
        return true;
    }

    async acceptMove(id: number): Promise<boolean> {
        await this.service.createQueryBuilder("game_moves")
        .update(game_moves)
        .set({ 
            accepted: new Date()
        })
        .where("id = :id", {id: id})
        .execute();
        return true;
    }

    async getSession(uid: number): Promise<number> {
        const x = await this.service.query(
            `select session_id
             from   user_games
             where  id = ?`, [uid]);
        if (!x || x.length == 0) {
             return null;
        }
        return x[0].session_id;
    }

    async getUser(uid: number): Promise<number> {
        const x = await this.service.query(
            `select user_id
             from   user_games
             where  id = ?`, [uid]);
        if (!x || x.length == 0) {
             return null;
        }
        return x[0].user_id;
    }

    async getSessionAlert(sid: number, uid: number): Promise<Move[]> {
        const x = await this.service.query(
            `select a.uid as uid, a.result_id as result_id, a.turn_number as turn_number
             from   game_alerts a
             inner  join user_games b on (b.id = a.uid)
             where  a.session_id = ?`, [sid]);
        if (!x || x.length == 0) {
             return null;
        }
        return x.filter(it => {
            return it.uid != uid;
        }).map(it => {
            let r = new Move();
            r.session_id = it.session_id;
            r.turn_num = it.turn_number;
            r.result_id = it.result_id;
            return r;
        });
    }

    async getConfirmedMove(uid: number): Promise<Move[]> {
        try {
            const sid: number = await this.getSession(uid);
            const r = await this.getSessionAlert(sid, uid);
            if (r !== null) {
                return r;
            }
            const f = await this.checkSession(sid);
            if (!f) {
                return null;
            }
            const x = await this.service.query(
            `select a.id, a.session_id, a.user_id, a.turn_num,
                    a.move_str, a.setup_str, a.note, a.time_delta, a.uid
             from   game_moves a
             inner  join game_sessions b on (b.id = a.session_id)
             where  a.session_id = ? and a.uid <> ?
             and    not a.setup_str is null 
             and    a.accepted is null
             order  by a.id`, [sid, uid]);
            if (!x) {
                return null;
            }
            let l = new Array();
            if (x.length > 0 && x[0].uid != uid) {
                let it = new Move();
                it.id = x[0].id;
                it.session_id = x[0].session_id;
                it.user_id = x[0].user_id;
                it.uid = x[0].uid;
                it.turn_num = x[0].turn_num;
                it.move_str = x[0].move_str;
                it.setup_str = x[0].setup_str;
                it.note = x[0].note;
                it.time_delta = x[0].time_delta;
                it.time_limit = await this.getTimeLimit(uid);
                it.additional_time = await this.getAdditionalTime(it.session_id);
                l.push(it);
                await this.acceptMove(it.id);
                await this.touchSession(it.uid, sid);
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

    async getTimeLimit(uid: number): Promise<number> {
        let x = await this.service.query(
            `select a.time_limit, b.last_time
             from   user_games a
             inner  join game_sessions b on (b.id = a.session_id)
             where  a.id = ?`, [uid]);
        if (!x || x.length == 0) {
             return null;
        }
        let time_limit  = x[0].time_limit;
        if (time_limit !== null) {
            const last_time = x[0].last_time;
            if (last_time && (Date.now() > last_time)) {
                time_limit -= Date.now() - last_time;
            }
        }
        return time_limit;
    }

    async getAdditionalTime(sid: number): Promise<number> {
        let x = await this.service.query(
            `select additional_time * 1000 as additional_time
             from   game_sessions
             where  id = ?`, [sid]);
        if (!x || x.length == 0) {
             return null;
        }
        return x[0].additional_time;
    }

    async getUnconfirmedMove(sess: number): Promise<Move[]> {
        try {
            const f = await this.checkSession(sess);
            if (!f) {
                return null;
            }
            const x = await this.service.query(
                `select a.id, a.session_id, a.user_id, a.turn_num,
                        a.move_str, a.setup_str, a.note, a.time_delta, a.uid
                 from   game_moves a
                 inner  join game_sessions b on (b.id = a.session_id and b.closed is null)
                 where  a.session_id = ?
                 and    a.setup_str is null
                 order  by a.id desc`, [sess]);
            if (!x) {
                return null;
            }
            let l = new Array();
            if (x.length > 0) {
                let it = new Move();
                it.id = x[0].id;
                it.session_id = x[0].session_id;
                it.user_id = x[0].user_id;
                it.turn_num = x[0].turn_num;
                it.move_str = x[0].move_str;
                it.setup_str = x[0].setup_str;
                it.note = x[0].note;
                it.time_delta = x[0].time_delta;
                it.time_limit = await this.getTimeLimit(it.uid);
                it.additional_time = await this.getAdditionalTime(it.session_id);
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

    async getLastTime(id: number): Promise<number> {
        const x = await this.service.query(
            `select last_time from game_sessions where id = ?`, [id]);
        if (!x || x.length != 1) {
            return null;
        }
        return x[0].last_time;
    }

    async checkSession(id: number): Promise<boolean> {
        const x = await this.service.query(
            `select id from game_sessions where id = ?`, [id]);
        if (!x || x.length != 1) {
            return false;
        }
        return true;
    }

    async getLastUser(id: number): Promise<number> {
        const x = await this.service.query(
            `select last_user as uid
             from   game_sessions
             where  id = ?`, [id]);
        if (!x || x.length != 1) {
            return null;
        }
        return x[0].uid;
    }

    async getTurnNumber(id: number): Promise<number> {
        const x = await this.service.query(
            `select coalesce(max(turn_num), 0) + 1 as turn_num
             from   game_moves 
             where  session_id = ?`, [id]);
        if (!x || x.length != 1) {
            return null;
        }
        return x[0].turn_num;
    }

    async acceptAlert(x: Move): Promise<Move> {
        try {
            await this.service.createQueryBuilder("game_alerts")
            .delete()
            .from(game_alerts)
            .where("session_id = :sid", {sid: x.session_id})
            .execute();
            return x;
        } catch (error) {
          console.error(error);
          throw new InternalServerErrorException({
              status: HttpStatus.BAD_REQUEST,
              error: error
          });
        }
    }

    async sendAlert(x: Move): Promise<Move> {
        try {
            const r = await this.getSessionAlert(x.session_id, x.uid);
            if (r !== null) {
                return x;
            }
            const turn_num = await this.getTurnNumber(x.session_id);
            const y = getRepository(game_alerts);
            const z = new game_alerts();
            z.session_id = x.session_id;
            z.uid = x.uid;
            z.result_id = x.result_id;
            z.turn_number = turn_num;
            await y.insert(z);
            x.id = z.id;
            return x;
        } catch (error) {
          console.error(error);
          throw new InternalServerErrorException({
              status: HttpStatus.BAD_REQUEST,
              error: error
          });
        }
    }

    async addMove(x: Move): Promise<Move> {
        try {
            const t = await this.service.query(
                `select a.session_id, b.is_sandglass
                 from   user_games a
                 inner  join game_sessions b on (b.id = a.session_id)
                 where  a.id = ?`, [x.uid]);
            if (!t || t.length == 0) {
                 return null;
            }
            const is_sandglass = t[0].is_sandglass;
            x.session_id = t[0].session_id;
            x.user_id = await this.getUser(x.uid);
            const f = await this.checkSession(x.session_id);
            if (!f) {
                return null;
            }
            const last_time = await this.getLastTime(x.session_id);
            let time_delta = last_time ? Date.now() - last_time : null;
            let time_limit = await this.getTimeLimit(x.uid);
            const turn_num = await this.getTurnNumber(x.session_id);
            const y = getRepository(game_moves);
            const z = new game_moves();
            z.session_id = x.session_id;
            z.user_id = x.user_id;
            z.uid = x.uid;
            z.move_str = x.move_str;
            z.setup_str = x.setup_str;
            z.turn_num = turn_num;
            z.note = x.note;
            z.time_delta = time_delta;
            await y.insert(z);
            x.id = z.id;
            if (!time_limit) {
                time_delta = null;
            }
            if (time_delta && is_sandglass) {
                const z = await this.service.query(
                    `select id, time_limit
                     from   user_games
                     where  session_id = ? and id <> ?`, [x.session_id, x.uid]);
                if (z && (z.length > 0) && z[0].time_limit) {
                    await this.service.createQueryBuilder("user_games")
                    .update(user_games)
                    .set({ 
                        time_limit: +z[0].time_limit + +time_delta
                     })
                    .where("id = :id", {id: z[0].id})
                    .execute();
                }
            }
            if (time_limit && time_delta) {
                if (time_limit < 0) {
                    time_limit = 0;
                }
                time_limit -= time_delta;
                if (time_limit < 0) time_limit = 0;
                await this.service.createQueryBuilder("user_games")
                .update(user_games)
                .set({ 
                    time_limit: time_limit
                 })
                .where("id = :uid", {uid: x.uid})
                .execute();
            }
            if (x.setup_str) {
                await this.service.createQueryBuilder("game_sessions")
                .update(game_sessions)
                .set({ 
                    changed: new Date(),
                    last_time: null,
                    last_setup: x.setup_str,
                    last_turn: turn_num,
                    last_user: x.uid,
                    next_player: x.next_player
                 })
                .where("id = :sess", {sess: x.session_id})
                .execute();
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

    async confirmMove(x: Move): Promise<Move> {
        try {
            const f = await this.checkSession(x.session_id);
            if (!f) {
                return null;
            }
            await this.service.createQueryBuilder("game_moves")
            .update(game_moves)
            .set({ 
                setup_str: x.setup_str
             })
            .where("id = :id", {id: x.id})
            .execute();
            await this.service.createQueryBuilder("game_sessions")
            .update(game_sessions)
            .set({ 
                last_setup: x.setup_str
             })
            .where("id = :id", {id: x.session_id})
            .execute();
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
