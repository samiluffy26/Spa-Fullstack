import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './schemas/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
    constructor(@InjectModel(Category.name) private categoryModel: Model<Category>) { }

    async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
        try {
            const createdCategory = new this.categoryModel(createCategoryDto);
            return await createdCategory.save();
        } catch (error) {
            if (error.code === 11000) {
                throw new ConflictException('Category with this name already exists');
            }
            throw error;
        }
    }

    async findAll(): Promise<Category[]> {
        return this.categoryModel.find().exec();
    }

    async remove(id: string): Promise<void> {
        const result = await this.categoryModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }
    }
}
