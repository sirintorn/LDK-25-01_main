import { configDotenv } from 'dotenv';
import mongoose, { Mongoose } from 'mongoose';

// MongoDB URI with username and password

configDotenv();

const env = process.env.NODE_ENV || 'development';

const dbURI = (env == 'development') ? process.env.DB_DEV_URL : process.env.DB_PROD_URL;

export class DB {
    mongoose?: Mongoose;

    static async connectDB(){
        try {
            if (dbURI) {
                await mongoose.connect(dbURI, {
                    //useNewUrlParser: true,
                    //useUnifiedTopology: true,
                });
                console.log('MongoDB connected successfully');
            } else {
                console.log('ERR: Missing DB Url.');
            }
        } catch (err) {
            console.error('ERR connecting to MongoDB:', err);
            process.exit(1);  // Exit process with failure code
        }
    };

    static checkConnectionStatus(): number{
        if (mongoose.connection.readyState === 1) {
          console.log('Mongoose is connected to the database');
        } else if (mongoose.connection.readyState === 2) {
          console.log('Mongoose is connecting to the database');
        } else if (mongoose.connection.readyState === 0) {
          console.log('Mongoose is disconnected from the database');
        } else if (mongoose.connection.readyState === 3) {
          console.log('Mongoose is disconnecting from the database');
        }
        return mongoose.connection.readyState;
    };

    static isConnected(): boolean{
        return (mongoose.connection.readyState === 1);   
    }
}