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
exports.CPHelperViewProvider = void 0;
const testRunner_1 = require("../utils/testRunner");
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
class CPHelperViewProvider {
    _extensionUri;
    static viewType = 'cp-helper.cpHelperView';
    _view;
    constructor(_extensionUri) {
        this._extensionUri = _extensionUri;
    }
    resolveWebviewView(webviewView, context, _token) {
        this._view = webviewView;
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };
        webviewView.webview.html = this.getHtmlForWebview(webviewView.webview);
        webviewView.webview.onDidReceiveMessage(async (message) => {
            if (message.command == 'runTests') {
                await (0, testRunner_1.runAllTests)(message.testCases);
                webviewView.webview.postMessage({ command: 'testResult', results: message.testCases });
            }
        });
    }
    getHtmlForWebview(webview) {
        // Use a nonce to whitelist which scripts can be run
        const nonce = this.getNonce();
        // Path to the HTML file
        const htmlPath = path.join(this._extensionUri.fsPath, 'media', 'index.html');
        let html = fs.readFileSync(htmlPath, 'utf8');
        const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'styles.css'));
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'scripts', 'main.js'));
        // Replace the NONCE_PLACEHOLDER with the actual nonce
        html = html.replace(/NONCE_PLACEHOLDER/g, nonce)
            .replace('styles.css', styleUri.toString())
            .replace('scripts.js', scriptUri.toString());
        return html;
    }
    getNonce() {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 32; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }
}
exports.CPHelperViewProvider = CPHelperViewProvider;
//# sourceMappingURL=webviewProvider.js.map