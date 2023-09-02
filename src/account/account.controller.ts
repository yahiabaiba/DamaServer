import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiSecurity, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Account } from '../interfaces/account.interface';
import { AccountService } from './account.service';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TokenGuard } from '../auth/token.guard';
import { AccountUser } from '../interfaces/accountuser.interface';
import { Payment } from '../interfaces/payment.interface';
import { Invoice } from '../interfaces/invoice.interface';
import { AccountTariff } from '../interfaces/accounttariff.interface';

@ApiSecurity('bearer')
@Controller('api/account')
export class AccountController {

    constructor(
        private readonly service: AccountService
    ) {}

    @UseGuards(JwtAuthGuard, TokenGuard)
    @Get()
    @ApiOperation({description: 'Create Account on demand', summary: 'Create Account on demand'})
    @ApiResponse({ type: Account })
    @ApiOkResponse({ description: 'Successfully.'})
    @ApiUnauthorizedResponse({ description: 'Unauthorized.'})
    @ApiInternalServerErrorResponse({ description: 'Internal Server error.'})
    async getAccount(@Req() request: Request, @Res() res): Promise<Account> {
        const auth: any = request.user;
        try {
            const r = await this.service.getAccount(auth.id);
            return res.status(HttpStatus.OK).json(r);
        } catch(e) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: e.message.error.toString(), stack: e.stack});
        }
    }

    @UseGuards(JwtAuthGuard, TokenGuard)
    @Get(':id')
    @ApiOperation({description: 'Get User\'s Account', summary: 'Get User\'s Account'})
    @ApiResponse({ type: Account })
    @ApiOkResponse({ description: 'Successfully.'})
    @ApiUnauthorizedResponse({ description: 'Unauthorized.'})
    @ApiInternalServerErrorResponse({ description: 'Internal Server error.'})
    async getUsersAccount(@Res() res, @Param('id') id): Promise<Account> {
        try {
            const r = await this.service.getAccount(id);
            return res.status(HttpStatus.OK).json(r);
        } catch(e) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: e.message.error.toString(), stack: e.stack});
        }
    }

    @UseGuards(JwtAuthGuard, TokenGuard)
    @Get('users/:id')
    @ApiOperation({description: 'Get related Users', summary: 'Get related Users'})
    @ApiResponse({ type: [AccountUser] })
    @ApiOkResponse({ description: 'Successfully.'})
    @ApiNotFoundResponse({ description: 'Not Found.'})
    @ApiUnauthorizedResponse({ description: 'Unauthorized.'})
    @ApiInternalServerErrorResponse({ description: 'Internal Server error.'})
    async getUsers(@Res() res, @Param('id') id): Promise<AccountUser[]> {
        try {
            const r = await this.service.getUsers(id);
            if (!r) {
                return res.status(HttpStatus.NOT_FOUND).json();
            } else {
                return res.status(HttpStatus.OK).json(r);
            }
        } catch(e) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: e.message.error.toString(), stack: e.stack});
        }
    }

    @UseGuards(JwtAuthGuard, TokenGuard)
    @Put('user')
    @ApiOperation({description: 'Add User to Account', summary: 'Add User to Account'})
    @ApiBody({ type: AccountUser })
    @ApiResponse({ type: AccountUser })
    @ApiCreatedResponse({ description: 'Successfully.'})
    @ApiNotFoundResponse({ description: 'Not Found.'})
    @ApiUnauthorizedResponse({ description: 'Unauthorized.'})
    @ApiInternalServerErrorResponse({ description: 'Internal Server error.'})
    async addUser(@Req() request: Request, @Res() res, @Body() x: AccountUser): Promise<AccountUser> {
        const auth: any = request.user;
        try {
            const r = await this.service.addUser(auth.id, x);
            if (!r) {
                return res.status(HttpStatus.NOT_FOUND).json();
            } else {
                return res.status(HttpStatus.CREATED).json(r);
            }
        } catch (e) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: e.message.error.toString(), stack: e.stack});
        }
    }

    @UseGuards(JwtAuthGuard, TokenGuard)
    @Delete('user')
    @ApiOperation({description: 'Delete User\'s relation to Account', summary: 'Delete User\'s relation to Account'})
    @ApiBody({ type: AccountUser })
    @ApiResponse({ type: AccountUser })
    @ApiCreatedResponse({ description: 'Successfully.'})
    @ApiForbiddenResponse({ description: 'Forbidden.'})
    @ApiUnauthorizedResponse({ description: 'Unauthorized.'})
    @ApiInternalServerErrorResponse({ description: 'Internal Server error.'})
    async delUser(@Req() request: Request, @Res() res, @Body() x: AccountUser): Promise<AccountUser> {
        const auth: any = request.user;
        try {
            const r = await this.service.delUser(auth.id, x);
            if (!r) {
                return res.status(HttpStatus.FORBIDDEN).json();
            } else {
                return res.status(HttpStatus.CREATED).json(r);
            }
        } catch (e) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: e.message.error.toString(), stack: e.stack});
        }
    }

    @UseGuards(JwtAuthGuard, TokenGuard)
    @Get('payments/:id')
    @ApiOperation({description: 'Get User\'s Payments', summary: 'Get User\'s Payments'})
    @ApiResponse({ type: [Payment] })
    @ApiOkResponse({ description: 'Successfully.'})
    @ApiUnauthorizedResponse({ description: 'Unauthorized.'})
    @ApiInternalServerErrorResponse({ description: 'Internal Server error.'})
    async getPayments(@Res() res, @Param('id') id): Promise<Payment[]> {
        try {
            const r = await this.service.getPayments(id);
            if (!r) {
                return res.status(HttpStatus.NOT_FOUND).json();
            } else {
                return res.status(HttpStatus.OK).json(r);
            }
        } catch(e) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: e.message.error.toString(), stack: e.stack});
        }
    }

    @UseGuards(JwtAuthGuard, TokenGuard)
    @Post('coupon')
    @ApiBody({ type: Payment })
    @ApiResponse({ type: Payment })
    @ApiCreatedResponse({ description: 'Successfully.'})
    @ApiNotFoundResponse({ description: 'Not Found.'})
    @ApiUnauthorizedResponse({ description: 'Unauthorized.'})
    @ApiInternalServerErrorResponse({ description: 'Internal Server error.'})
    async addCoupon(@Req() request: Request, @Res() res, @Body() x: Payment): Promise<Payment> {
        const auth: any = request.user;
        try {
            const r = await this.service.addCoupon(auth.id, x);
            if (!r) {
                return res.status(HttpStatus.NOT_FOUND).json();
            } else {
                return res.status(HttpStatus.CREATED).json(r);
            }
        } catch (e) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: e.message.error.toString(), stack: e.stack});
        }
    }

    @UseGuards(JwtAuthGuard, TokenGuard)
    @Get('invoices/:id')
    @ApiOperation({description: 'Get User\'s Invoices', summary: 'Get User\'s Invoices'})
    @ApiResponse({ type: [Invoice] })
    @ApiOkResponse({ description: 'Successfully.'})
    @ApiUnauthorizedResponse({ description: 'Unauthorized.'})
    @ApiInternalServerErrorResponse({ description: 'Internal Server error.'})
    async getInvoices(@Res() res, @Param('id') id): Promise<Invoice[]> {
        try {
            const r = await this.service.getInvoices(id);
            if (!r) {
                return res.status(HttpStatus.NOT_FOUND).json();
            } else {
                return res.status(HttpStatus.OK).json(r);
            }
        } catch(e) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: e.message.error.toString(), stack: e.stack});
        }
    }

    @UseGuards(JwtAuthGuard, TokenGuard)
    @Post('invoice')
    @ApiBody({ type: Invoice })
    @ApiResponse({ type: Invoice })
    @ApiCreatedResponse({ description: 'Successfully.'})
    @ApiNotFoundResponse({ description: 'Not Found.'})
    @ApiUnauthorizedResponse({ description: 'Unauthorized.'})
    @ApiInternalServerErrorResponse({ description: 'Internal Server error.'})
    async addInvoice(@Req() request: Request, @Res() res, @Body() x: Invoice): Promise<Invoice> {
        const auth: any = request.user;
        try {
            const r = await this.service.addInvoice(auth.id, x);
            if (!r) {
                return res.status(HttpStatus.NOT_FOUND).json();
            } else {
                return res.status(HttpStatus.CREATED).json(r);
            }
        } catch (e) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: e.message.error.toString(), stack: e.stack});
        }
    }

    @UseGuards(JwtAuthGuard, TokenGuard)
    @Put('tariff')
    @ApiBody({ type: AccountUser })
    @ApiResponse({ type: AccountTariff })
    @ApiCreatedResponse({ description: 'Successfully.'})
    @ApiNotFoundResponse({ description: 'Not Found.'})
    @ApiUnauthorizedResponse({ description: 'Unauthorized.'})
    @ApiInternalServerErrorResponse({ description: 'Internal Server error.'})
    async setTariff(@Res() res, @Body() x: AccountTariff): Promise<AccountTariff> {
        try {
            const r = await this.service.setTariff(x);
            if (!r) {
                return res.status(HttpStatus.NOT_FOUND).json();
            } else {
                return res.status(HttpStatus.CREATED).json(r);
            }
        } catch (e) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: e.message.error.toString(), stack: e.stack});
        }
    }
}
