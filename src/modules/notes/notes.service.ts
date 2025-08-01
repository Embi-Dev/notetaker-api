import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notes, NoteDocument } from 'src/models/Notes';
import { createNoteObj, updateNoteObj } from './interface';
import { Types } from 'mongoose';
import { UserService } from '../user/user.service';
@Injectable()
export class NoteService {
  constructor(
    @InjectModel(Notes.name) private notesModel: Model<NoteDocument>,
    private readonly userService: UserService,
  ) {}
  async createNote(noteObj: createNoteObj): Promise<Notes> {
    const note = new this.notesModel(noteObj);
    return note.save();
  }

  async getNotes(
    userId: Types.ObjectId,
    lastItemId: Types.ObjectId | null,
  ): Promise<Notes[]> {
    let notes = [];
    const filter: any = {
      userId,
    };
    if (lastItemId) {
      filter._id = { $gt: lastItemId };
    }
    notes = await this.notesModel.find(filter).limit(10).exec();
    return notes;
  }

  async getNote(id: string, userId: Types.ObjectId): Promise<Notes> {
    return await this.notesModel.findOne({ _id: id, userId: userId }).exec();
  }

  async updateNote(
    noteId: string,
    userId: Types.ObjectId,
    updatedData: updateNoteObj,
  ) {
    const note = await this.notesModel.findOneAndUpdate(
      { _id: noteId, userId: userId },
      { $set: updatedData },
      { new: true },
    );
    return note;
  }

  async deleteNote(id: string): Promise<Notes | null> {
    const note = await this.notesModel.findByIdAndDelete({ _id: id }).exec();
    return note;
  }
}
