import cliProgress from 'cli-progress';
import keySimilarityCore from './keySimilarityCore.js';

export default async function keySimilarityWithProgress(arr, key, identificationKey) {
    const progressBar = new cliProgress.SingleBar(
        {
            format: `{bar} || {percentage}% || {value}/{total} || ETA: {eta}s || Processing...`,
        },
        cliProgress.Presets.shades_classic,
    );

    progressBar.start(arr.length, 0);

    const progressCallback = (value) => {
        progressBar.update(value);
    };

    const result = await keySimilarityCore(arr, key, identificationKey, progressCallback);

    progressBar.stop();

    return result;
}