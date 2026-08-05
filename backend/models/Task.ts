import { Schema, model, Document, Types } from 'mongoose';

export interface ITask extends Document {
    userId: Types.ObjectId;
    title: string;
    description?: string;
    tags: string[];
    startTime?: Date;
    endTime?: Date;
    status: 'todo' | 'in_progress' | 'completed';
    isPrivate: boolean;
    isHabit: boolean;
    currentStreak: number;
    bestStreak: number;
    lastCompletedDate?: Date | null;
    completionHistory: Date[];
    createdAt: Date;
    updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        title: { type: String, required: true, trim: true },
        description: { type: String, default: '' },
        tags: { type: [String], default: [] },
        startTime: { type: Date, default: null },
        endTime: { type: Date, default: null },
        status: { type: String, enum: ['todo', 'in_progress', 'completed'], default: 'todo' },
        isPrivate: { type: Boolean, default: false, index: true },
        isHabit: { type: Boolean, default: false },
        currentStreak: { type: Number, default: 0 },
        bestStreak: { type: Number, default: 0 },
        lastCompletedDate: { type: Date, default: null },
        completionHistory: { type: [Date], default: [] },
    },
    {
        timestamps: true,
    }
);

export const Task = model<ITask>('Task', taskSchema);
