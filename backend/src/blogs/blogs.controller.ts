import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseUUIDPipe,
  Header,
} from '@nestjs/common';
import { BlogsService } from './blogs.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CreateBlogDto } from './dto/create-blog.dto.js';
import { UpdateBlogDto } from './dto/update-blog.dto.js';
@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogs: BlogsService) {}
  @Get('admin/all')
  @UseGuards(JwtAuthGuard)
  @Header('Cache-Control', 'no-store')
  all() {
    return this.blogs.listAdmin();
  }
  @Post() @UseGuards(JwtAuthGuard) create(@Body() dto: CreateBlogDto) {
    return this.blogs.create(dto);
  }
  @Patch(':id') @UseGuards(JwtAuthGuard) update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateBlogDto,
  ) {
    return this.blogs.update(id, dto);
  }
  @Delete(':id') @UseGuards(JwtAuthGuard) remove(
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.blogs.remove(id);
  }
  @Get() @Header('Cache-Control', 'no-store') list() {
    return this.blogs.listPublic();
  }
  @Get(':slug') @Header('Cache-Control', 'no-store') one(
    @Param('slug') slug: string,
  ) {
    return this.blogs.bySlug(slug);
  }
}
