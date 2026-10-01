import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateMovieDto, UpdateMovieDto, MovieResponseDto } from './dto/movie.dto';

@Controller('movies')
@UseGuards(AuthGuard('jwt'))
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  create(@Body() createMovieDto: CreateMovieDto): Promise<MovieResponseDto> {
    return this.moviesService.create(createMovieDto);
  }

  @Get()
  findAll(): Promise<MovieResponseDto[]> {
    return this.moviesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<MovieResponseDto> {
    return this.moviesService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto): Promise<MovieResponseDto> {
    return this.moviesService.update(id, updateMovieDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<MovieResponseDto> {
    return this.moviesService.delete(id);
  }
}
