import { FileReader } from './fileReader';
import { PathReader } from './pathReader';

const testCreateDirectory = (testPath: string) => test(`[${testPath}/] Directory created`, () => {
    const path = new PathReader(testPath);
    path.createDir();
    expect(path.exists).toBe(true);
})

const testDeleteDirectory = (testPath: string) => test(`[${testPath}/] Directory deleted`, () => {
    const pathReader = new PathReader(testPath);
    pathReader.deleteDir();
    expect(pathReader.exists).toBe(false);
});

const testCreateFile = (testPath: string) => test(`[${testPath}] File created`, () => {
    const fileReader = new FileReader(testPath);
    fileReader.createFile();
    expect(fileReader.exists).toBe(true);
});


const testDeleteFile = (testPath: string) => test(`[${testPath}] File deleted`, () => {
    const fileReader = new FileReader(testPath);
    fileReader.deleteFile();
    expect(fileReader.exists).toBe(true);
});

 



testCreateDirectory('test');
testCreateFile('test/test');
// testDeleteDirectory('test');