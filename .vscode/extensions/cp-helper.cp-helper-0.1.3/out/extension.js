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
exports.activate = activate;
const vscode = __importStar(require("vscode"));
const webviewProvider_1 = require("./providers/webviewProvider");
const commands = __importStar(require("./commands"));
const constants_1 = require("./constants");
function activate(context) {
    const provider = new webviewProvider_1.CPHelperViewProvider(context.extensionUri);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(webviewProvider_1.CPHelperViewProvider.viewType, provider));
    // Register Commands
    const registeredCommands = [
        { name: 'createNewFile', handler: commands.createNewFileHandler },
        { name: 'createContest', handler: commands.createContestHandler },
        { name: 'markAsAC', handler: () => commands.markProblem('AC') },
        { name: 'markAsWA', handler: () => commands.markProblem('WA') },
        { name: 'copyCode', handler: commands.copyNoHeaders },
        { name: 'addCategories', handler: commands.addCategoriesHandler },
        { name: 'openLatexFile', handler: commands.openLatexFile }
    ];
    registeredCommands.forEach(({ name, handler }) => {
        context.subscriptions.push(vscode.commands.registerCommand(`${constants_1.COMMAND_PREFIX}${name}`, handler));
    });
    setupStatusBar(context);
}
function setupStatusBar(context) {
    const statusBarItems = [
        vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100),
        vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 99)
    ];
    statusBarItems[0] = Object.assign(statusBarItems[0], constants_1.STATUS_BAR_ITEMS.CREATE_FILE);
    statusBarItems[1] = Object.assign(statusBarItems[1], constants_1.STATUS_BAR_ITEMS.CREATE_CONTEST);
    statusBarItems.forEach(item => {
        item.show();
        context.subscriptions.push(item);
    });
}
//# sourceMappingURL=extension.js.map