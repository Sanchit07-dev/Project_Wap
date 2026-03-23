"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runAllTests = runAllTests;
exports.runTestCase = runTestCase;
exports.execPromise = execPromise;
const vscode = __importStar(require("vscode"));
const child_process_1 = require("child_process");
const child_process_2 = require("child_process");
const path = __importStar(require("path"));
const os = __importStar(require("os"));
const fs = __importStar(require("fs"));
const configService_1 = require("./configService");
async function runAllTests(testCases) {
    // Check if workspaceFolders is defined
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showErrorMessage('No workspace folder open');
        return [];
    }
    // Get the current file path
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active editor');
        return [];
    }
    const filePath = editor.document.uri.fsPath;
    // Generate a temporary executable path in the system's temp directory
    const tempExecPath = path.join(os.tmpdir(), `temp_exec_${Date.now()}`);
    const compileCommand = `g++ -o "${tempExecPath}" "${filePath}"`;
    try {
        // Compile the program
        await execPromise(compileCommand);
        for (const testCase of testCases) {
            const result = await runTestCase(tempExecPath, testCase.input, testCase.expectedOutput);
            testCase.status = result.status;
            testCase.actualOutput = result.output;
            if (result.error) {
                testCase.error = result.error;
            }
        }
    }
    catch (err) {
        vscode.window.showErrorMessage(`Compilation Error: ${err.message}`);
    }
    finally {
        // Clean up the temporary executable
        if (fs.existsSync(tempExecPath)) {
            fs.unlinkSync(tempExecPath);
        }
    }
}
async function runTestCase(execPath, input, expectedOutput) {
    return new Promise((resolve, reject) => {
        const child = (0, child_process_1.spawn)(execPath);
        let output = '';
        child.stdout.on('data', (data) => {
            output += data.toString();
        });
        let errorOutput = '';
        child.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });
        let isTimeout = false;
        const timeout = setTimeout(() => {
            isTimeout = true;
            child.kill();
        }, configService_1.ConfigService.timeoutDuration);
        child.stdin.write(input);
        child.stdin.end();
        child.on('close', (code) => {
            clearTimeout(timeout);
            if (isTimeout) {
                resolve({ status: 'TLE', output: '' });
            }
            else if (code !== 0) {
                resolve({ status: 'RTE', output: errorOutput });
            }
            else {
                const status = output.trim() === expectedOutput.trim() ? 'AC' : 'WA';
                resolve({ status, output });
            }
        });
        child.on('error', (err) => {
            resolve({ status: 'RTE', output: '', error: err.message });
        });
    });
}
function execPromise(command) {
    return new Promise((resolve, reject) => {
        (0, child_process_2.exec)(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            }
            else {
                resolve();
            }
        });
    });
}
//# sourceMappingURL=testRunner.js.map