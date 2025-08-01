import { Request } from 'express';
import { Types } from 'mongoose';

export interface RequestObj extends Request {
  user: {
    email: string;
    id: any;
    [key: string]: any;
  };
}

export interface createNoteObj {
  title: string;
  content: string;
  userId: Types.ObjectId;
  tags: string[] | [];
}

export interface updateNoteObj {
  title?: string;
  content?: string;
  tags?: string;
}
