import { Document } from 'mongoose';
import { Session } from 'express-session';

interface UserDocument extends Document {
    _id: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    last_connection: Date;
    gastos: { description: string, amount: number, date: Date , _id: string }[];
    totalSpendAmount: number;
    totalAmountToSpend: number;
}

interface ExtendedSession extends Session {
    user: UserDocument;
}

export { UserDocument, ExtendedSession };