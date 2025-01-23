import { Body, Controller, Delete, Get, Inject, LoggerService, NotFoundException, Param, ParseUUIDPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { UUID } from 'node:crypto';

import { XSSPipe } from '../../../core/toolkit/pipe/xss.pipe';

import { AdminGuard } from '../../toolkit/guard/admin.guard';
import { AuthGuard } from '../../toolkit/guard/auth.guard';
import { Editor } from '../model/editor.model';
import { EditorService } from '../service/editor.service';
import { CreateEditorDto } from '../dto/create_editor.dto';
import { UpdateEditorDto } from '../dto/update_editor.dto';

@Controller('editor')
export class EditorController {
        
    constructor(
        private readonly editorService: EditorService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly loggerService: LoggerService,
    ) {}

    @Post()
    @UseGuards(AdminGuard)
    async create(@Body(XSSPipe) data: CreateEditorDto, @Req() req: Request): Promise<Editor | Error> {
        const createdEditor = await this.editorService.create(data);

        this.loggerService.log(
            `Editor created: { Client IP: ${req.ip}, Editor id: ${createdEditor.id} }`,
            'EditorController#create',
        );

        return createdEditor;
    }

    @Put(':id')
    @UseGuards(AdminGuard)
    async update(
        @Param('id', ParseUUIDPipe) id: UUID,
        @Body(XSSPipe) data: UpdateEditorDto,
        @Req() req: Request,
    ): Promise<[affectedCount: number] | Error> {
        const existingEditor = await this.editorService.findOneById(id);

        if(!existingEditor) {
            throw new NotFoundException();
        }

        const updatedEditor = await this.editorService.update(id, data);

        this.loggerService.log(
            `Editor updated: { Client IP: ${req.ip}, Editor id: ${existingEditor.id} }`,
            'EditorController#update',
        );

        return updatedEditor;
    }

    @Get(':id')
    @UseGuards(AuthGuard)
    async findOneById(@Param('id', ParseUUIDPipe) id: UUID): Promise<Editor | Error> {
        const findEditor = await this.editorService.findOneById(id);

        if(!findEditor) {
            throw new NotFoundException();
        }

        return findEditor;
    }

    @Get()
    @UseGuards(AuthGuard)
    findAll(): Promise<Editor[]> {
        return this.editorService.findAll();
    }

    @Delete(':id')
    @UseGuards(AdminGuard)
    async delete(@Param('id', ParseUUIDPipe) id: UUID, @Req() req: Request): Promise<void | Error> {
        const deleteEditor = await this.editorService.delete(id);

        if(deleteEditor === null) {
            throw new NotFoundException();
        }

        this.loggerService.log(
            `Editor deleted: { Client IP: ${req.ip}, Editor id: ${deleteEditor.id} }`,
            'EditorController#delete',
        );
    }
}