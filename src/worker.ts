import { parentPort, workerData } from 'node:worker_threads';

async function work(text: string): Promise<number> {
    console.log(`working: ${text}`);
    let j = 0;
    for (let i = 0; i < 5000000000; i++) {
        j+=i;
    };

    return j;
}

(async () => {
    const text = workerData;
    const result = await work(text);
    parentPort?.postMessage(result);
})().catch((e) => {
    console.error(`worker упал`);
    console.error(e);
    throw e;
});
