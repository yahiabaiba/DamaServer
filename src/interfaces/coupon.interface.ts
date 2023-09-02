import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class Coupon {

    @ApiProperty()
    id: number;

    @ApiProperty()
    code: string;

    @ApiProperty()
    amount: number;

    @ApiProperty()
    created: Date;

    @ApiPropertyOptional()
    activated: Date;
}