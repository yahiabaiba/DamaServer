import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class Invoice {

    @ApiPropertyOptional()
    id: number;

    @ApiPropertyOptional()
    session_id: number;

    @ApiPropertyOptional()
    usagetype_id: number;

    @ApiPropertyOptional()
    account_id: number;

    @ApiPropertyOptional()
    amount: number;

    @ApiPropertyOptional()
    count: number;

    @ApiProperty()
    service_id: number;

    @ApiProperty()
    service: string;

    @ApiProperty()
    created: Date;

    @ApiPropertyOptional()
    closed: Date;
}