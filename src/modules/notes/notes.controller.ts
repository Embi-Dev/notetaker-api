import {
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
  Param,
  Res,
  Put,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RequestObj } from './interface';
import { UserService } from '../user/user.service';
import { NoteService } from './notes.service';
import { Response } from 'express';
@Controller('notes')
export class NotesController {
  constructor(
    private readonly userService: UserService,
    private readonly notesService: NoteService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('/')
  async createNote(@Req() req: RequestObj, @Res() res: Response) {
    try {
      const user = req.user as any;
      const userObj = await this.userService.isExist(user.email);
      if (!userObj) {
        res
          .status(401)
          .json({ message: 'User not found. Unauthorized access.' });
      }
      const { title, content, tags } = req.body;
      if (!title || !content) {
        return res.status(400).json({
          message: 'Title and content is required!',
        });
      }
      const note = await this.notesService.createNote({
        userId: userObj._id,
        content,
        title,
        tags,
      });
      return res.json({
        message: 'Note created successfully',
        data: note,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Failed creating a note.' });
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/')
  async getNotes(@Req() req: RequestObj, @Res() res: Response) {
    try {
      const user = req.user as any;
      const { lastItemId } = req.body;
      const userObj = await this.userService.isExist(user.email);
      if (!userObj) {
        res
          .status(401)
          .json({ message: 'User not found. Unauthorized access.' });
      }
      const notes = await this.notesService.getNotes(userObj._id, lastItemId);
      return res.json({
        notes,
      });
    } catch {
      return res
        .status(500)
        .json({ message: 'Failed to get the list of notes.' });
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':noteId')
  async getNote(
    @Req() req: RequestObj,
    @Param('noteId') noteId: string,
    @Res() res: Response,
  ) {
    try {
      if (!noteId) {
        return res.status(400).json({
          message: 'Invalid parameter.',
        });
      }
      const user = req.user as any;
      const userObj = await this.userService.isExist(user.email);
      if (!userObj) {
        res
          .status(401)
          .json({ message: 'User not found. Unauthorized access.' });
      }
      const note = await this.notesService.getNote(noteId, userObj._id);
      if (!note) return res.status(404).json({ message: 'Note not found.' });
      return res.json(note);
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: 'Failed getting details of note.',
      });
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':noteId')
  async updateNote(
    @Req() req: RequestObj,
    @Res() res: Response,
    @Param('noteId') noteId: string,
  ) {
    try {
      if (!noteId) {
        return res.status(400).json({
          message: 'Invalid parameter. Note id not found',
        });
      }
      const { tags, title, content } = req.body;
      const user = req.user as any;
      const userObj = await this.userService.isExist(user.email);
      if (!userObj) {
        return res
          .status(401)
          .json({ message: 'User not found. Unauthorized access.' });
      }
      const note = await this.notesService.updateNote(noteId, userObj._id, {
        tags,
        title,
        content,
      });
      if (!note)
        return res
          .status(404)
          .json({ message: 'Note associated to note id not found.' });
      return res.json(note);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to update the note.' });
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':noteId')
  async deleteNote(
    @Req() req: RequestObj,
    @Res() res: Response,
    @Param('noteId') noteId: string,
  ) {
    if (!noteId) {
      return res.status(400).json({
        message: 'Invalid parameter. Note id not found',
      });
    }
    const user = req.user as any;
    const userObj = await this.userService.isExist(user.email);
    if (!userObj) {
      return res
        .status(401)
        .json({ message: 'User not found. Unauthorized access.' });
    }
    if (userObj.role !== 'ADMIN') {
      return res
        .status(401)
        .json({ message: 'Unauthorized access. Only admin can delete a note' });
    }
    const note = this.notesService.deleteNote(noteId);
    if (!note)
      return res
        .status(404)
        .json({ message: 'Note not found. Deletion failed.' });
    return res.json({
      message: 'Note deleted successfully.',
    });
  }
}
