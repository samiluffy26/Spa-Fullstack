import { Controller, Get, UseGuards, SetMetadata } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard'; // Lo crearé a continuación

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Get('stats')
    @UseGuards(RolesGuard)
    async getStats() {
        return this.adminService.getStats();
    }
}
