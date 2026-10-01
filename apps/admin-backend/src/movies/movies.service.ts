import { Injectable, NotFoundException } from '@nestjs/common';
import { MoviesRepository } from './movies.repository';
import { CreateMovieDto, UpdateMovieDto, MovieResponseDto } from './dto/movie.dto';

@Injectable()
export class MoviesService {
  constructor(private readonly moviesRepository: MoviesRepository) {}

  async create(createMovieDto: CreateMovieDto): Promise<MovieResponseDto> {
    return this.moviesRepository.create(createMovieDto);
  }

  async findAll(): Promise<MovieResponseDto[]> {
    return this.moviesRepository.findAll();
  }

  async findOne(id: string): Promise<MovieResponseDto> {
    const movie = await this.moviesRepository.findOne(id);
    if (!movie) throw new NotFoundException('Movie not found');
    return movie;
  }

  async update(id: string, updateMovieDto: UpdateMovieDto): Promise<MovieResponseDto> {
    const result = await this.moviesRepository.update(id, updateMovieDto);
    if (!result) throw new NotFoundException('Movie not found');
    return result;
  }

  async delete(id: string): Promise<MovieResponseDto> {
    const result = await this.moviesRepository.delete(id);
    if (!result) throw new NotFoundException('Movie not found');
    return result;
  }
}
