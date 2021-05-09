import fs from 'fs';
import { logSection, SectionLogger } from 'rev-logs';

interface PathReaderProps {
    path: string;
}

/**
 * # Path Reader
 * Reads file into to interact with.
 */
export class PathReader<P extends PathReaderProps> {
    protected props: P;
    static create<P extends PathReaderProps>(props: P | string) {
        const _props = typeof props === "string"
            ? { path: props }
            : props;
        return new PathReader(_props);
    }

    protected constructor(_props: P) {
        this.props = _props;
    }

    get exists() {
        return fs.existsSync(this.props.path);
    }

    get data() {
        if (this.exists)
            return fs.readFileSync(this.props.path, 'utf8');
        else
            return "";
    }

    writeData(data: string) {
        return fs.writeFileSync(this.props.path, data);
    }

    createFile(data = "") {
        fs.writeFileSync(this.props.path, data);
    }

    createDir() {
        fs.mkdirSync(this.props.path);
    }
}

interface VarProvider<Vars extends { [index: string]: string }> {
    vars: Vars;
}


interface Props<Vars extends { [index: string]: string } = {}> extends PathReaderProps {
    defaults?: Vars;
}

export class FileReader<Vars extends { [index: string]: string }> extends PathReader<Props> implements VarProvider<Vars> {
    private _vars: { [index: string]: string };
    private _provideDefaults?: VarProvider<Vars>;
    private _logger: SectionLogger;

    static create<Vars extends { [index: string]: string }>(props: Props<Vars> | string) {
        const _props = typeof props === "string"
            ? { path: props }
            : props;
        return new FileReader<Vars>(_props);
    }

    private constructor(props: Props<Vars>) {
        super(props);
        console.log("props", props);
        this._logger = logSection(`Reading ${props.path}`);
        this._vars = props?.defaults || {};
        if (this.exists) {
            this.loadVariables();
            this._logger.bullet(`${Object.keys(this.vars).length} variables loaded`);
        } else {
            this.createFile();
            this._logger.bullet(`file created`);
        }
    }

    useDefaultProvider(provider: VarProvider<Vars>) {
        this._provideDefaults = provider;
    }

    get vars() {
        return this._vars as Vars;
    }

    get defaults(): { [index: string]: string } {
        return this._provideDefaults?.vars || this.props.defaults || {};
    }

    private loadVariables() {
        const data = this.data;
        if(!data){
            return;
        }
        const lines = data.split("\n");
        lines.forEach(line => {
            const tokens = line.split("=");
            const name = tokens[0].trimEnd();
            const value = tokens[1].trimStart();
            this._vars[name] = value;
        });
    }

    saveVariables() {

        for (const defaultVar in this.defaults) {
            this._vars[defaultVar] = this._vars[defaultVar] || this.defaults[defaultVar];
        }

        let lineBuffer: string[] = [];
        for (const varName in this.vars) {
            console.log(`varName`, varName, this.vars[varName]);
            lineBuffer.push(`${varName} = ${this.vars[varName]}`);
        }
        const data = lineBuffer.join(`\n`);
        this.writeData(data);
        this._logger.bullet("variables saved");
    }

    /**
     * Sets variables to default vars
     */
    resetVariables() {
        this._vars = this.defaults;
        this._logger.bullet("reset to defaults");
        console.log("vars", this.vars);
        console.log("props defaults", this.props.defaults);
    }


}