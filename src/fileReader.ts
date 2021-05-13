import { logSection, SectionLogger } from 'rev-logs';
import { PathReader, PathReaderProps } from './pathReader';

// NOT USED
export interface VarProvider<Vars extends { [index: string]: string }> {
    variables: Vars;
}


export interface FileReaderProps extends PathReaderProps {
}

export class FileReader<Vars extends { [index: string]: string }> extends PathReader<FileReaderProps> implements VarProvider<Vars> {
    private _variables: { [index: string]: string };
    private _defaultProvider?: VarProvider<Vars>;
    private _logger: SectionLogger;

    constructor(path: string) {
        super(path);
        this._logger = logSection(`Reading ${path}`);
        this._variables = {};
        if (this.exists) {
            this.loadVariables();
            this._logger.bullet(`${Object.keys(this.variables).length} variables loaded`);
        } else {
            this.createFile();
            this._logger.bullet(`file created`);
        }
    }

    useDefaultProvider(provider: VarProvider<Vars>) {
        this._defaultProvider = provider;
    }

    get variables() {
        return this._variables as Vars;
    }

    get defaults(): { [index: string]: string } {
        return this._defaultProvider?.variables || {};
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
            this._variables[name] = value;
        });
    }

    saveVariables() {

        for (const defaultVar in this.defaults) {
            this._variables[defaultVar] = this._variables[defaultVar] || this.defaults[defaultVar];
        }

        let lineBuffer: string[] = [];
        for (const varName in this.variables) {
            console.log(`varName`, varName, this.variables[varName]);
            lineBuffer.push(`${varName} = ${this.variables[varName]}`);
        }
        const data = lineBuffer.join(`\n`);
        this.writeData(data);
        this._logger.bullet("varisables saved");
    }

    /**
     * Sets variables to default vars
     */
    resetVariables() {
        this._variables = this.defaults;
        this._logger.bullet("reset to defaults");
        console.log("vars", this.variables);
    }


}