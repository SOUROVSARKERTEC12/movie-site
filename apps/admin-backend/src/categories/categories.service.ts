import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';
import { CreateCategoryDto, UpdateCategoryDto, CategoryResponseDto } from './dto/category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<CategoryResponseDto> {
    return this.categoriesRepository.create(createCategoryDto);
  }

  async findAll(): Promise<CategoryResponseDto[]> {
    return this.categoriesRepository.findAll();
  }

  async findOne(id: string): Promise<CategoryResponseDto> {
    const category = await this.categoriesRepository.findOne(id);
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<CategoryResponseDto> {
    const result = await this.categoriesRepository.update(id, updateCategoryDto);
    if (!result) throw new NotFoundException('Category not found');
    return result;
  }

  async remove(id: string): Promise<{ success: boolean }> {
    const success = await this.categoriesRepository.remove(id);
    if (!success) throw new NotFoundException('Category not found');
    return { success: true };
  }
}
