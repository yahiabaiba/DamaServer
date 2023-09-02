import { Controller, Get, HttpStatus, Param, Req, Res, UseGuards } from '@nestjs/common';
import { ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiSecurity, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { TokenGuard } from '../auth/token.guard';
import { CouponService } from './coupon.service';
import { Request } from 'express';
import { Payment } from '../interfaces/payment.interface';
import { Coupon } from '../interfaces/coupon.interface';

@ApiSecurity('bearer')
@Controller('api/coupon')
export class CouponController {

    constructor(
        private readonly service: CouponService
    ) {}

    @UseGuards(JwtAuthGuard, TokenGuard)
    @Get('payments')
    @ApiOperation({description: 'Get Coupon-payments', summary: 'Get Coupon-payments'})
    @ApiResponse({ type: [Payment] })
    @ApiOkResponse({ description: 'Successfully.'})
    @ApiUnauthorizedResponse({ description: 'Unauthorized.'})
    @ApiInternalServerErrorResponse({ description: 'Internal Server error.'})
    async getAccount(@Req() request: Request, @Res() res): Promise<Payment[]> {
        const auth: any = request.user;
        try {
            const r = await this.service.getPayments(auth.id);
            return res.status(HttpStatus.OK).json(r);
        } catch(e) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: e.message.error.toString(), stack: e.stack});
        }
    }

    @UseGuards(JwtAuthGuard, RolesGuard, TokenGuard)
    @Roles('admin')
    @Get(':sum/:cnt')
    @ApiOperation({description: 'Get Coupons', summary: 'Get Coupons'})
    @ApiResponse({ type: [Coupon] })
    @ApiOkResponse({ description: 'Successfully.'})
    @ApiForbiddenResponse({ description: 'Forbidden.'})
    @ApiUnauthorizedResponse({ description: 'Unauthorized.'})
    @ApiInternalServerErrorResponse({ description: 'Internal Server error.'})
    async generate(@Res() res, @Param('sum') sum, @Param('cnt') cnt): Promise<Coupon[]> {
        try {
            const r = await this.service.genCoupons(sum, cnt);
            return res.status(HttpStatus.OK).json(r);
        } catch(e) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: e.message.error.toString(), stack: e.stack});
        }
    }
}
