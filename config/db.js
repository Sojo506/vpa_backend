import mongoose from "mongoose"

const connect_db = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const url = `${db.connection.host}:${db.connection.port}`;

    console.log(`MongoDB connected on ${url}`);
  } catch (error) {
    console.log("🚀 ~ file: db.js:7 ~ connect ~ error:", error.message);
    process.exit(1);
  }
};

export default connect_db;
