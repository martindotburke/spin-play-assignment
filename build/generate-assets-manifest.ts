import * as fs from 'fs';
import * as path from 'path';

function listFilesSync(dir: string): string[] {
  let fileList: string[] = [];
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.lstatSync(fullPath).isDirectory()) {
      fileList = fileList.concat(listFilesSync(fullPath));
    } else {
      fileList.push(fullPath);
    }
  });
  return fileList;
}

const dirPath = process.argv.slice(2)[0];
const fullDirPath = path.resolve(dirPath);
const fullFileList = listFilesSync(fullDirPath);

const manifest:any = {};
fullFileList.forEach((fullPath) => {
  const id = path.parse(fullPath).name;
  const relativePath = path.relative(fullDirPath, fullPath).replace(/\\/g, '/');
  manifest[id] = "assets/" + relativePath;
});

const outFile = `${fullDirPath}/manifest.json`;
fs.writeFileSync(outFile, JSON.stringify(manifest, null, 2));
