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
exports.getTemplate = getTemplate;
exports.getLatexTemplate = getLatexTemplate;
const vscode = __importStar(require("vscode"));
const configService_1 = require("./configService");
const errorHandler_1 = require("./errorHandler");
async function getTemplate() {
    let templatePath = configService_1.ConfigService.templatePath;
    // Fallback to the extension's template if the custom path is not set or invalid
    if (!templatePath) {
        return '#include <bits/stdc++.h>\nusing namespace std;\n\nint main()\n{\n   return 0;\n}';
    }
    try {
        let templateUri = vscode.Uri.file(templatePath);
        const templateFile = await vscode.workspace.fs.readFile(templateUri);
        return templateFile.toString();
    }
    catch (err) {
        (0, errorHandler_1.handleError)(err, "Template");
        return '';
    }
}
async function getLatexTemplate() {
    let templatePath = configService_1.ConfigService.latexTemplatePath;
    if (!templatePath) {
        return "\\documentclass{article}\n\\begin{document}\nYour content here.\n\\end{document}";
    }
    try {
        let templateUri = vscode.Uri.file(templatePath);
        const templateFile = await vscode.workspace.fs.readFile(templateUri);
        return templateFile.toString();
    }
    catch (err) {
        (0, errorHandler_1.handleError)(err, "Latex template");
        return '';
    }
}
//# sourceMappingURL=templateManager.js.map