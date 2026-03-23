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
exports.openLatexFile = openLatexFile;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const templateManager_1 = require("../utils/templateManager");
async function openLatexFile() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage("No active editor found.");
        return;
    }
    const activeFileUri = editor.document.uri;
    if (!activeFileUri.fsPath.endsWith(".cpp")) {
        vscode.window.showErrorMessage("The active file is not a C++ file.");
        return;
    }
    // Get the workspace folder for the active file.
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(activeFileUri);
    if (!workspaceFolder) {
        vscode.window.showErrorMessage("The active file is not in a workspace.");
        return;
    }
    const workspaceRoot = workspaceFolder.uri;
    // Compute the relative path from the workspace root to the active file's folder.
    const activeFileFolder = path.dirname(activeFileUri.fsPath);
    const relativePath = vscode.workspace.asRelativePath(vscode.Uri.file(activeFileFolder));
    // Get the base file name (without extension).
    const baseName = path.basename(activeFileUri.fsPath, ".cpp");
    // Use new folder destination: workspaceRoot/latex/<relativePath>/<baseName>/<baseName>.tex
    const latexFolderUri = vscode.Uri.joinPath(workspaceRoot, "latex", ...relativePath.split(/[\/\\]+/), baseName);
    const latexFileUri = vscode.Uri.joinPath(latexFolderUri, `${baseName}.tex`);
    // Check if the LaTeX file exists.
    try {
        await vscode.workspace.fs.stat(latexFileUri);
        // File exists: open it.
        const texDoc = await vscode.workspace.openTextDocument(latexFileUri);
        await vscode.window.showTextDocument(texDoc, { viewColumn: vscode.ViewColumn.Two });
    }
    catch (err) {
        // File doesn't exist.
        await vscode.workspace.fs.createDirectory(latexFolderUri);
        const latexTemplate = await (0, templateManager_1.getLatexTemplate)();
        await vscode.workspace.fs.writeFile(latexFileUri, Buffer.from(latexTemplate, "utf8"));
        const texDoc = await vscode.workspace.openTextDocument(latexFileUri);
        await vscode.window.showTextDocument(texDoc, { viewColumn: vscode.ViewColumn.Two });
    }
}
//# sourceMappingURL=latexCommands.js.map