import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { NotesController } from './notes.controller';
import { UserModule } from '../user/user.module';
import { NoteService } from './notes.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Notes, NoteSchema } from 'src/models/Notes';
@Module({
  imports: [
    AuthModule,
    UserModule,
    MongooseModule.forFeature([{ name: Notes.name, schema: NoteSchema }]),
  ],
  controllers: [NotesController],
  providers: [NoteService],
})
export class NotesModule {}
