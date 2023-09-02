import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class Payment {

    @ApiPropertyOptional()
    id: number;

    @ApiProperty()
    account_id: number;

    @ApiPropertyOptional()
    coupon: string;

    @ApiPropertyOptional()
    amount: number;

    @ApiPropertyOptional()
    created: Date;
}