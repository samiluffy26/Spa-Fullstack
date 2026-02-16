import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Setting, SettingDocument } from './schemas/setting.schema';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Injectable()
export class SettingsService {
    private readonly SETTING_KEY = 'business_availability';

    constructor(@InjectModel(Setting.name) private settingModel: Model<SettingDocument>) { }

    async getSettings() {
        let setting = await this.settingModel.findOne({ key: this.SETTING_KEY });

        if (!setting) {
            // Return default if not exists
            return this.createDefaultSettings();
        }

        return setting.value;
    }

    async updateSettings(updateSettingsDto: UpdateSettingsDto) {
        const current = await this.getSettings();
        const updatedValue = { ...current, ...updateSettingsDto };

        const setting = await this.settingModel.findOneAndUpdate(
            { key: this.SETTING_KEY },
            { value: updatedValue },
            { new: true, upsert: true }
        );

        return setting.value;
    }

    private async createDefaultSettings() {
        const defaultSettings = {
            weeklySchedule: [
                { day: 0, isOpen: false, openTime: '09:00', closeTime: '18:00' }, // Sun
                { day: 1, isOpen: true, openTime: '09:00', closeTime: '18:00' },  // Mon
                { day: 2, isOpen: true, openTime: '09:00', closeTime: '18:00' },  // Tue
                { day: 3, isOpen: true, openTime: '09:00', closeTime: '18:00' },  // Wed
                { day: 4, isOpen: true, openTime: '09:00', closeTime: '18:00' },  // Thu
                { day: 5, isOpen: true, openTime: '09:00', closeTime: '18:00' },  // Fri
                { day: 6, isOpen: true, openTime: '10:00', closeTime: '16:00' },  // Sat
            ],
            exceptions: [],
            maxDailyBookings: 20,
            maxGuestsPerBooking: 5
        };

        const created = new this.settingModel({
            key: this.SETTING_KEY,
            value: defaultSettings,
            description: 'Global business availability configuration'
        });

        await created.save();
        return defaultSettings;
    }
}
