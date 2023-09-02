import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class Account {

    @ApiProperty()
    id: number;

    @ApiProperty()
    tariff_id: number;

    @ApiProperty()
    tariff: string;

    @ApiProperty()
    balance: number;

    @ApiProperty()
    created: Date;

    @ApiPropertyOptional()
    deleted: Date;
}