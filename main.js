import { eachLine } from "line-reader";
import { performance } from "perf_hooks";
import fetchFiles from "./fetch-files.js";
import { writeFileSync } from "fs";

const wordsCounter = (q) => {
  const wordsCounter = {};
  const startTime = performance.now();
  const eachLinePromise = new Promise((resolve, reject) => {
    eachLine(
      `myfile${q}mb.txt`,
      (line) => {
        const words = String(line).toLowerCase().split(" ");
        words.forEach((word) => {
          if (wordsCounter.hasOwnProperty(word)) wordsCounter[word] += 1;
          else wordsCounter[word] = 1;
        });
      },
      function finished(err) {
        if (err) return reject(err);
        resolve();
      }
    );
  });

  eachLinePromise.then(() => {
    const endTime = performance.now();
    writeFileSync(
      `wordsCounter${q}mb.txt`,
      JSON.stringify(wordsCounter, null, 2),
      "utf-8"
    );

    const log = `${q};${endTime - startTime}`;
    console.log(log);
  });
};

const fileSizes = [10, 100, 1000, 5000, 10000];
await fetchFiles(fileSizes);

fileSizes.forEach((size) => {
  for (let i = 0; i < 5; i++) wordsCounter(size);
});
