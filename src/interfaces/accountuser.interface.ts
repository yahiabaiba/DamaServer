import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class AccountUser {

    @ApiPropertyOptional()
    id: number;

    @ApiPropertyOptional()
    account_id: number;

    @ApiProperty()
    user_id: number;

    @ApiPropertyOptional()
    user: string;

    @ApiPropertyOptional()
    created: Date;

    @ApiPropertyOptional()
    deleted: Date;
}