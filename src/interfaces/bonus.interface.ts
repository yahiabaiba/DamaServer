import { ApiPropertyOptional, ApiProperty } from "@nestjs/swagger";

export class Bonus {

    @ApiPropertyOptional()
    id: number;

    @ApiPropertyOptional()
    type_id: number;

    @ApiProperty()
    uid: number;

    @ApiPropertyOptional()
    bonus: string;

    @ApiPropertyOptional()
    created: Date;

    @ApiPropertyOptional()
    expired: Date;

    @ApiPropertyOptional()
    activated: Date;

    @ApiPropertyOptional()
    email: string;

    @ApiPropertyOptional()
    phone: string;

    @ApiPropertyOptional()
    info: string;
}