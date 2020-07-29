import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const mongod = new MongoMemoryServer();

/**
 * Connect to the in-memory database.
 */
export const connect = async (): Promise<void> => {
  const uri = await mongod.getUri();

  const mongooseOpts: mongoose.ConnectionOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  };

  await mongoose.connect(uri, mongooseOpts);
};

/**
 * Drop database, close the connection and stop mongod.
 */
export const closeDatabase = async (): Promise<void> => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
};

/**
 * Remove all the data for all db collections.
 */
export const clearDatabase = async (): Promise<void> => {
  const { collections } = mongoose.connection;

  Object.keys(collections).forEach((key) => {
    const collection = collections[key];
    collection.deleteMany({});
  });
};
