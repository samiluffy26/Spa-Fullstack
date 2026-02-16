import { Controller, Patch, Body, UseGuards, Request, Get, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Request() req) {
        const user = await this.usersService.findById(req.user.userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
            phone: (user as any).phone
        };
    }

    @UseGuards(JwtAuthGuard)
    @Patch('profile')
    async updateProfile(@Request() req, @Body() updateData: any) {
        // Solo permitimos actualizar ciertos campos
        const { name, phone } = updateData;
        const updatedUser = await this.usersService.updateProfile(req.user.userId, { name, phone });

        if (!updatedUser) {
            throw new NotFoundException('User not found');
        }

        return {
            id: updatedUser._id,
            email: updatedUser.email,
            name: updatedUser.name,
            role: updatedUser.role,
            phone: (updatedUser as any).phone
        };
    }

}
