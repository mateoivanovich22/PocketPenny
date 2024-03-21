import mongoose from 'mongoose';
import config from '../config/config';

const Mongodb = config.db.cs;
const Dbname = config.db.name;

mongoose.connect(Mongodb, {
  dbName: Dbname,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error to connect MongoDB: '));
db.once('open', () => {
  console.log('Connection succesfully to MongoDB');
});

export default db;