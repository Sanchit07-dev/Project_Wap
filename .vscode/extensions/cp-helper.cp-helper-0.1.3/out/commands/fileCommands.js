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
exports.createNewFileHandler = createNewFileHandler;
exports.createContestHandler = createContestHandler;
const vscode = __importStar(require("vscode"));
const fileUtils_1 = require("../utils/fileUtils");
const templateManager_1 = require("../utils/templateManager");
const errorHandler_1 = require("../utils/errorHandler");
async function createNewFileHandler() {
    // Get the problem URL.
    const url = await vscode.window.showInputBox({ prompt: 'Enter problem URL' });
    if (!url)
        return;
    // Get the file name.
    const fileName = await vscode.window.showInputBox({ prompt: 'Enter file name' });
    if (!fileName)
        return;
    if (!(0, fileUtils_1.validateFileName)(fileName)) {
        vscode.window.showErrorMessage('Invalid file name');
        return;
    }
    // Ensure there is an open workspace.
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showErrorMessage('No workspace folder open');
        return;
    }
    // Let the user pick a folder recursively starting from the workspace root.
    const targetFolder = await (0, fileUtils_1.pickFolder)(workspaceFolders[0].uri);
    if (!targetFolder)
        return;
    // Construct the C++ file URI.
    const cppFileUri = vscode.Uri.joinPath(targetFolder, `${fileName}.cpp`);
    if (!(await (0, fileUtils_1.checkFileDoesNotExist)(cppFileUri, `${fileName}.cpp`)))
        return;
    const header = (0, fileUtils_1.getHeader)(url);
    const cppTemplate = await (0, templateManager_1.getTemplate)();
    // Write the C++ file.
    try {
        await vscode.workspace.fs.writeFile(cppFileUri, Buffer.from(header + cppTemplate, 'utf8'));
    }
    catch (err) {
        (0, errorHandler_1.handleError)(err, "C++ File creation");
        return;
    }
    // Open the C++ file.
    const cppDoc = await vscode.workspace.openTextDocument(cppFileUri);
    await vscode.window.showTextDocument(cppDoc);
}
async function createContestHandler() {
    const url = await vscode.window.showInputBox({ prompt: 'Enter contest URL' });
    if (!url)
        return;
    const contestName = await vscode.window.showInputBox({ prompt: 'Enter contest name' });
    if (!contestName)
        return;
    if (!(0, fileUtils_1.validateFileName)(contestName)) {
        vscode.window.showErrorMessage(`Invalid file name`);
    }
    const taskCountStr = await vscode.window.showInputBox({ prompt: 'Enter number of tasks' });
    if (!taskCountStr)
        return;
    const taskCount = parseInt(taskCountStr);
    if (isNaN(taskCount) || taskCount <= 0) {
        vscode.window.showErrorMessage('Invalid number of tasks');
        return;
    }
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showErrorMessage('No workspace folder open');
        return;
    }
    // Let the user pick a folder recursively from the workspace root.
    const targetFolder = await (0, fileUtils_1.pickFolder)(workspaceFolders[0].uri);
    if (!targetFolder)
        return;
    const contestFolder = vscode.Uri.joinPath(targetFolder, contestName);
    try {
        await vscode.workspace.fs.createDirectory(contestFolder);
        const header = (0, fileUtils_1.getHeader)(url);
        const template = await (0, templateManager_1.getTemplate)();
        for (let i = 0; i < taskCount; i++) {
            const taskName = String.fromCharCode(65 + i);
            const fileUri = vscode.Uri.joinPath(contestFolder, `${taskName}.cpp`);
            await vscode.workspace.fs.writeFile(fileUri, Buffer.from(header + template, 'utf8'));
        }
        vscode.window.showInformationMessage(`Contest "${contestName}" created with ${taskCount} tasks.`);
    }
    catch (err) {
        vscode.window.showErrorMessage(`Failed to create contest: ${err.message}`);
    }
}
//# sourceMappingURL=fileCommands.js.map