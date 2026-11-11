const path = require('path');
const fs = require('fs');
const download = require('download');
const got = require('got');
const filenamify = require('filenamify');
const { pipeline } = require('stream');
const { promisify } = require('util');

const streamPipeline = promisify(pipeline);

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 部分 m3u8 里的分片/密钥地址包含未编码的中文等非 ASCII 字符，
// Node 的 http.request 会抛出 ERR_UNESCAPED_CHARACTERS，这里统一做百分号编码。
function encodeHttpUrl(uri) {
    if (typeof uri !== 'string' || !/^https?:/i.test(uri)) return uri;
    try {
        return new URL(uri).href;
    } catch (_) {
        return uri.replace(/[^\x21-\x7E]/g, ch => encodeURIComponent(ch));
    }
}

function createDownloadHelpers({ logger, isTaskActive }) {
    function safeUnlink(filePath) {
        try {
            if (filePath && fs.existsSync(filePath)) {
                fs.rmSync(filePath, { force: true });
            }
        } catch (error) {
            logger && logger.error(error);
        }
    }

    function safeRemoveDir(dir) {
        try {
            if (dir && fs.existsSync(dir)) {
                fs.rmSync(dir, { recursive: true, force: true });
            }
        } catch (error) {
            logger && logger.error(error);
        }
    }

    function getTaskDir(baseDir, taskName) {
        const safeTaskName = filenamify(taskName, { replacement: '_' });
        return path.basename(baseDir) == safeTaskName ? baseDir : path.join(baseDir, safeTaskName);
    }

    async function downloadFileWithRetry(uri, dir, options, taskId, maxRetries = 10, activeCheck) {
        const checkActive = activeCheck ||
            (taskId != null && isTaskActive ? () => isTaskActive(taskId) : null);
        const filePath = path.join(dir, options.filename);
        uri = encodeHttpUrl(uri);
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            if (checkActive && !checkActive()) {
                return { ok: false, canceled: true };
            }
            try {
                const task = download(uri, dir, options);
                task.on('request', req => {
                    const interval = setInterval(() => {
                        if (checkActive && !checkActive()) {
                            req.destroy();
                            clearInterval(interval);
                        }
                    }, 100);
                    req.once('close', () => clearInterval(interval));
                    req.once('error', () => clearInterval(interval));
                });
                await task;
                if (!fs.existsSync(filePath) || fs.statSync(filePath).size <= 0) {
                    throw new Error(`downloaded file is empty: ${filePath}`);
                }
                return { ok: true };
            } catch (err) {
                logger && logger.error(`download failed, attempt=${attempt}/${maxRetries}, url=${uri}, error=${err && (err.code || err.message || err)}`);
                safeUnlink(filePath);
                if (checkActive && !checkActive()) {
                    return { ok: false, canceled: true, error: err };
                }
                if (attempt >= maxRetries) return { ok: false, error: err };
                await delay(Math.min(30000, 1000 * attempt * attempt));
            }
        }
        return { ok: false };
    }

    async function downloadFileStreamWithRetry(uri, filePath, options, taskId, maxRetries = 10, onProgress, activeCheck) {
        const checkActive = activeCheck ||
            (taskId != null && isTaskActive ? () => isTaskActive(taskId) : null);
        const gotOptions = { ...options };
        delete gotOptions.filename;
        uri = encodeHttpUrl(uri);

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            if (checkActive && !checkActive()) {
                return { ok: false, canceled: true };
            }

            try {
                fs.mkdirSync(path.dirname(filePath), { recursive: true });
                const stream = got.stream(uri, gotOptions);
                let interval;

                stream.on('downloadProgress', progress => {
                    if (onProgress) onProgress(progress, attempt);
                });

                stream.on('request', req => {
                    interval = setInterval(() => {
                        if (checkActive && !checkActive()) {
                            req.destroy();
                        }
                    }, 100);
                    req.once('close', () => clearInterval(interval));
                    req.once('error', () => clearInterval(interval));
                });

                await streamPipeline(stream, fs.createWriteStream(filePath));
                if (interval) clearInterval(interval);

                if (!fs.existsSync(filePath) || fs.statSync(filePath).size <= 0) {
                    throw new Error(`downloaded file is empty: ${filePath}`);
                }
                return { ok: true };
            } catch (err) {
                logger && logger.error(`stream download failed, attempt=${attempt}/${maxRetries}, url=${uri}, error=${err && (err.code || err.message || err)}`);
                safeUnlink(filePath);
                if (checkActive && !checkActive()) {
                    return { ok: false, canceled: true, error: err };
                }
                if (attempt >= maxRetries) return { ok: false, error: err };
                await delay(Math.min(30000, 1000 * attempt * attempt));
            }
        }
        return { ok: false };
    }

    return {
        safeUnlink,
        safeRemoveDir,
        getTaskDir,
        downloadFileWithRetry,
        downloadFileStreamWithRetry
    };
}

module.exports = {
    createDownloadHelpers
};
