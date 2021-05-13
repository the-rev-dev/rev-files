import fs from 'fs';

export interface PathReaderProps {
    path: string;
}

/**
 * # Rev Path
 * Reads file into to interact with.
 */
export class PathReader<P extends PathReaderProps> {

    protected path: string;

    constructor(path: string) {
        this.path = path;
    }

    get exists() {
        return fs.existsSync(this.path);
    }

    get data() {
        if (this.exists)
            return fs.readFileSync(this.path, 'utf8');
        else
            return "";
    }

    writeData(data: string) {
        return fs.writeFileSync(this.path, data);
    }

    createFile(data = "") {
        fs.writeFileSync(this.path, data);
    }

    deleteFile(){
        if(!this.exists){
            throw 'file does not exist to delete';
        }
        return fs.rmSync(this.path);
    }

    createDir() {
        if (this.exists) {
            throw "already exists"
        }
        fs.mkdirSync(this.path);
    }

    deleteDir() {
        if (!this.exists) {
            throw "path does not exist to delete"
        }
        return fs.rmdirSync(this.path);
    }

}
