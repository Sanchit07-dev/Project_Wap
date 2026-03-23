"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STATUS_BAR_ITEMS = exports.COMMAND_PREFIX = exports.EXTENSION_NAME = void 0;
exports.EXTENSION_NAME = 'cp-helper';
exports.COMMAND_PREFIX = `${exports.EXTENSION_NAME}.`;
exports.STATUS_BAR_ITEMS = {
    CREATE_FILE: {
        text: '$(new-file) Create new file',
        command: `${exports.COMMAND_PREFIX}createNewFile`
    },
    CREATE_CONTEST: {
        text: '$(new-folder) Create Contest',
        command: `${exports.COMMAND_PREFIX}createContest`
    }
};
//# sourceMappingURL=index.js.map