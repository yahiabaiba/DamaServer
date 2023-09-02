import {MigrationInterface, QueryRunner} from "typeorm";

export class tariff1631626023466 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`insert into tariff(id, name, is_default) values(1, 'Default', 1)`);
        await queryRunner.query(`insert into tariff(id, name, is_default) values(2, 'Free', 0)`);

        await queryRunner.query(`insert into account_limit(tariff_id, max_quantity) values(1, 2)`);

        await queryRunner.query(`insert into service(id, type_id, scope_id, scale, name) values(1, 4, 1, 60, 'subscription')`);
        await queryRunner.query(`insert into service(id, type_id, scope_id, scale, name) values(2, 4, 2, 60, 'subscription')`);
        await queryRunner.query(`insert into service(id, type_id, scope_id, scale, name) values(3, 4, 3, 60, 'subscription')`);
        await queryRunner.query(`insert into service(id, type_id, scope_id, scale, name) values(4, 1, null, null, 'promo')`);

        await queryRunner.query(`insert into tariff_service(tariff_id, service_id, price) values(1, 1, 0)`);
        await queryRunner.query(`insert into tariff_service(tariff_id, service_id, price) values(1, 2, 1)`);
        await queryRunner.query(`insert into tariff_service(tariff_id, service_id, price) values(1, 3, 1)`);
        await queryRunner.query(`insert into tariff_service(tariff_id, service_id, price, is_default) values(1, 4, -43200, 1)`);

        await queryRunner.query(`update games set scope_id = 2 where id = 1`);
        await queryRunner.query(`update games set scope_id = 3 where id = 2`);
        await queryRunner.query(`update games set scope_id = 1 where id = 3`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`delete from tariff_service`);
        await queryRunner.query(`delete from service`);
        await queryRunner.query(`delete from account_limit`);
        await queryRunner.query(`delete from tariff`);
    }
}
