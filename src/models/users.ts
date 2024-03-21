import mongoose from 'mongoose';
import db from './db';

const collection = 'users';
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstname: String,
  lastname: String,
  email: String,
  password: String,
  last_connection: {
    type: Date,
    default: Date.now(),
  },
  gastos: {
    type: [{
      description: String,
      amount: Number,
      date: {
        type: Date,
        default: Date.now(),
      },
    }],
    default: [],
  },
  totalSpendAmount: {
    type: Number,
    default: 0
  },
  totalAmountToSpend: {
    type: Number,
    default: 0
  }

});


const UsersModel = db.model(collection, userSchema);

export default UsersModel;