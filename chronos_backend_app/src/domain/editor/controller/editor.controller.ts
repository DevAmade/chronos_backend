import { Body, Controller, Inject, LoggerService, NotFoundException, Param, ParseUUIDPipe, Post, Put, Req } from '@nestjs/common';
import { Request } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { UUID } from 'node:crypto';

import { SupportController } from '../../../core/toolkit/support.controller';
import { XSSPipe } from '../../../core/pipe/xss.pipe';
import { UniqueException } from '../../../core/exception/unique_exception';

import { Editor } from '../model/editor.model';
import { EditorService } from '../service/editor.service';
import { CreateEditorDto } from '../dto/create_editor.dto';
import { UpdateEditorDto } from '../dto/update_editor.dto';

@Controller('editor')
export class EditorController 
    extends SupportController<CreateEditorDto, UpdateEditorDto, Editor> {
        
        constructor(
            protected readonly editorService: EditorService,
            @Inject(WINSTON_MODULE_NEST_PROVIDER) protected readonly loggerService: LoggerService,
        ) {
            super(editorService, loggerService);
        }

        @Post()
        async create(@Body(XSSPipe) data: CreateEditorDto, @Req() req: Request): Promise<Editor | Error> {
            const existingDuplicate = await this.editorService.findOneByAttribute([{ name: data.name }]);

            if(existingDuplicate) {
                throw new UniqueException();
            }

            const createdEditor = await this.editorService.create(data);

            this.loggerService.log(
                `Editor created: { Client IP: ${req.ip}, Editor id: ${createdEditor.id} }`,
                'EditorController#create',
            );

            return createdEditor;
        }
    
        @Put(':id')
        async update(
            @Param('id', ParseUUIDPipe) id: UUID,
            @Body(XSSPipe) data: UpdateEditorDto,
            @Req() req: Request,
        ): Promise<[affectedCount: number] | Error> {
            const existingEditor = await this.editorService.findOneById(id);
            const existingDuplicate = await this.editorService.findOneByAttribute([{ name: data.name }]);

            if(!existingEditor) {
                throw new NotFoundException();
            }

            if(existingEditor.name !== data.name && existingDuplicate) {
                throw new UniqueException();
            }

            const updatedEditor = await this.editorService.update(id, data);

            this.loggerService.log(
                `Editor updated: { Client IP: ${req.ip}, Editor id: ${existingEditor.id} }`,
                'EditorController#update',
            );

            return updatedEditor;
        }
}