import { join } from 'node:path';
import { Worker } from 'node:worker_threads';

const threads = 32;

function delegateWork(text: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const worker = new Worker(join(__dirname, 'worker.ts'), {
            workerData: text,
        });
        worker.on('message', resolve);
        worker.on('error', reject);
        worker.on('exit', (code) => {
            if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
        });
    });
};

(async () => {
    const results = await Promise.all(new Array(threads).fill(null).map((_, i) => delegateWork(`thread [${i}]`)));
    console.log(results);
})().catch((e) => {
    console.error(`main упал`);
    console.error(e);
});
