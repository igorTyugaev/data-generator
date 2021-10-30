import fetch from "node-fetch";
import * as koi8r from "koi8-r";
import { access, constants, appendFileSync, statSync, writeFileSync } from "fs";

export const getFileByURL = async (
  url = "http://lib.ru/POEZIQ/DANTE/comedy.txt_Ascii.txt",
  fileName = "src-text.txt",
  saveFile = false
) => {
  return await fetch(url)
    .then((res) => {
      return res.buffer();
    })
    .then((data) => {
      const text = koi8r.decode(data);
      saveFile && writeFileSync(fileName, text);
      return text;
    })
    .catch((err) => {
      console.log(err);
    });
};

const createFileByRandomLines = async (lines, fileName = "myfile.txt") => {
  let textFile = "";
  try {
    writeFileSync(fileName, "");
  } catch (err) {
    throw err;
  }

  for (
    let fileSize = 0;
    fileSize < 1024 * 1024;
    fileSize = statSync(fileName).size
  ) {
    const n = Math.floor(Math.random() * lines.length);
    try {
      const new_line = lines[n] + "\n";
      appendFileSync(fileName, new_line);
      textFile = textFile.concat(new_line);
    } catch (err) {
      throw err;
    }
  }

  return textFile;
};

const writeToFile = async (contents, q) => {
  const fileName = `myfile${q}mb.txt`;
  access(fileName, constants.F_OK, (err) => {
    console.log(`${fileName} ${err ? "does not exist" : "already exists"}`);
    if (err) return;
  });

  try {
    writeFileSync(fileName, "");
  } catch (err) {
    console.error(err);
  }
  for (let i = 0; i < q; i++) {
    try {
      appendFileSync(fileName, contents, { encoding: "utf-8" });
    } catch (err) {
      console.error(err);
    }
  }
};

const fetchFiles = async (fileSizes) => {
  const text = await getFileByURL();
  const textLines = text.split("\r\n").map((line) => line.trim());
  const originText = await createFileByRandomLines(textLines);
  if (!originText) return;
  fileSizes.forEach((size) => writeToFile(originText, size));
};

export default fetchFiles;
