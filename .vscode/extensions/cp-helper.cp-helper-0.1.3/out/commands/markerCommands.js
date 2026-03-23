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
exports.markProblem = markProblem;
exports.copyNoHeaders = copyNoHeaders;
const vscode = __importStar(require("vscode"));
async function markProblem(result) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active editor');
        return;
    }
    const document = editor.document;
    const now = new Date();
    const finishLine = `// Finish Time: ${now.toLocaleString()} ${result}`;
    const edit = new vscode.WorkspaceEdit();
    const firstLine = document.lineAt(0);
    // Check if Finish Time already exists
    const finishTimeRegex = /^\/\/ Finish Time:.*$/;
    let insertPosition;
    if (finishTimeRegex.test(firstLine.text)) {
        // Replace existing Finish Time
        insertPosition = new vscode.Position(0, 0);
        edit.replace(document.uri, firstLine.range, finishLine);
    }
    else {
        // Insert after Start Time
        insertPosition = new vscode.Position(1, 0);
        edit.insert(document.uri, insertPosition, finishLine + '\n');
    }
    await vscode.workspace.applyEdit(edit);
    await document.save();
}
async function copyNoHeaders() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active editor');
        return;
    }
    const document = editor.document;
    const text = document.getText();
    // Split the text into lines
    const lines = text.split(/\r?\n/);
    let startLine = 0;
    // find first #
    for (startLine; startLine < lines.length; startLine++) {
        if (lines[startLine].trim().startsWith('#')) {
            break;
        }
    }
    // Get the code without headers
    const codeWithoutHeaders = lines.slice(startLine).join('\n');
    // Copy the code to the clipboard
    await vscode.env.clipboard.writeText(codeWithoutHeaders);
}
//# sourceMappingURL=markerCommands.js.map