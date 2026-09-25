import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
  Header,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { ProjectsService } from './projects.service.js';
import { CreateProjectDto } from './dto/create-project.dto.js';
import { UpdateProjectDto } from './dto/update-project.dto.js';
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projects: ProjectsService) {}
  @Get('admin/all')
  @UseGuards(JwtAuthGuard)
  @Header('Cache-Control', 'no-store')
  all() {
    return this.projects.all();
  }
  @Post() @UseGuards(JwtAuthGuard) create(@Body() dto: CreateProjectDto) {
    return this.projects.create(dto);
  }
  @Patch(':id') @UseGuards(JwtAuthGuard) update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.projects.update(id, dto);
  }
  @Delete(':id') @UseGuards(JwtAuthGuard) remove(
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.projects.remove(id);
  }
  @Get() @Header('Cache-Control', 'no-store') list() {
    return this.projects.published();
  }
  @Get(':slug') @Header('Cache-Control', 'no-store') bySlug(
    @Param('slug') slug: string,
  ) {
    return this.projects.bySlug(slug);
  }
}
