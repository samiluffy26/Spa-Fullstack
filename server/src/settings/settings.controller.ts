import { Controller, Get, Body, Patch, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('settings')
export class SettingsController {
    constructor(private readonly settingsService: SettingsService) { }

    @Get()
    getSettings() {
        return this.settingsService.getSettings();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Patch()
    updateSettings(@Body() updateSettingsDto: UpdateSettingsDto) {
        return this.settingsService.updateSettings(updateSettingsDto);
    }
}
