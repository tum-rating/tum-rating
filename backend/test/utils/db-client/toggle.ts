import mongoose from 'mongoose';

import { Toggle, ToggleSchema } from '@tum-rating/backend/src/database/documents/toggle';

const ToggleModel = mongoose.model('toggles', ToggleSchema);

export const dropAllToggles = async () => {
    await ToggleModel.deleteMany({});
}