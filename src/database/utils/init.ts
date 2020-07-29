import mongoose from 'mongoose';

const init = {
  connect: async (): Promise<number> => {
    const mongooseOptions: mongoose.ConnectionOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    };
    await mongoose.connect(
      'mongodb://localhost:27017/playlist-destroyer',
      mongooseOptions,
    );
    return mongoose.connection.readyState;
  },
  closeDatabase: async (): Promise<void> => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  },
};

export default init;
