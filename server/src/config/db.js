import mongoose from 'mongoose';

/**
 * Connect to MongoDB with retry logic.
 * Exits the process after 5 failed attempts.
 */
const connectDB = async () => {
  const MAX_RETRIES = 5;
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI);
      console.log(`✅ MongoDB connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      retries += 1;
      console.error(
        `❌ MongoDB connection attempt ${retries}/${MAX_RETRIES} failed: ${error.message}`
      );
      if (retries >= MAX_RETRIES) {
        console.error('🛑 Max retries reached. Exiting.');
        process.exit(1);
      }
      // Wait 3 seconds before retrying
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
};

export default connectDB;
