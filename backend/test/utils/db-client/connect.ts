import mongoose from 'mongoose';

import {mongooseConfig} from './config';

export const connectMongo = () => {
    return mongoose.connect(mongooseConfig.connectionUrl);
}