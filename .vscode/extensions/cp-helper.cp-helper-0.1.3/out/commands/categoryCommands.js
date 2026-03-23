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
exports.addCategoriesHandler = addCategoriesHandler;
exports.insertCategoriesIntoHeader = insertCategoriesIntoHeader;
const vscode = __importStar(require("vscode"));
const configService_1 = require("../utils/configService");
async function addCategoriesHandler() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active editor found.');
        return;
    }
    const categoriesList = configService_1.ConfigService.categories;
    if (categoriesList.length === 0) {
        vscode.window.showErrorMessage('No categories available. Please configure the categories list.');
        return;
    }
    const selectedCategories = await vscode.window.showQuickPick(categoriesList, {
        canPickMany: true,
        placeHolder: 'Select categories for the problem',
    });
    if (!selectedCategories || selectedCategories.length === 0) {
        vscode.window.showInformationMessage('No categories selected.');
        return;
    }
    // Insert categories into the file header
    insertCategoriesIntoHeader(editor, selectedCategories);
    await editor.document.save();
}
function insertCategoriesIntoHeader(editor, categories) {
    const document = editor.document;
    const categoriesLine = `// Categories: ${categories.join(', ')}\n`;
    const text = document.getText();
    const lines = text.split(/\r?\n/);
    let insertPosition = new vscode.Position(0, 0);
    let headerEndLine = -1;
    // Look for existing header comments
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('//')) {
            if (line.startsWith('// Categories:')) {
                // Replace existing categories line
                const range = new vscode.Range(new vscode.Position(i, 0), new vscode.Position(i + 1, 0));
                editor.edit(editBuilder => {
                    editBuilder.replace(range, categoriesLine);
                });
                return;
            }
        }
        else if (line === '') {
            // Skip empty lines
            continue;
        }
        else {
            // End of header comments
            headerEndLine = i;
            break;
        }
    }
    if (headerEndLine === -1) {
        // No existing header found, insert at the top
        headerEndLine = 0;
    }
    insertPosition = new vscode.Position(headerEndLine, 0);
    editor.edit(editBuilder => {
        editBuilder.insert(insertPosition, categoriesLine);
    });
}
//# sourceMappingURL=categoryCommands.js.map