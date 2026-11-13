const en = {
    app: {
        title: 'M3U8 Downloader'
    },
    sidebar: {
        download: 'Download',
        settings: 'Settings'
    },
    tabs: {
        singleDownload: 'Single Download',
        multiDownload: `Multi Download`,
        mergeTS: `Merge TS`
    },
    newTask: {
        title: 'Create New Task',
        buttons: {
            confirm: 'Start it',
        },
        inputs: {
            url: {
                label: 'Source URL',
                holder: `Paste an M3U8 URL or direct media URL (MP4/FLV/MP3/WAV), or drag an M3U8 file here`,
            },
            taskName: {
                label: 'Task Name',
                holder: `[optional] Renamed the video name`,
            },
            quality: {
                label: '* Quality',
                holder: 'Select a video quality',
            },
            tags: {
                label: 'Category',
            },
            httpHeaders: {
                label: 'HTTP Headers',
                holder: `[optional] One line one http header, For example:
                orgin: http://www.host.com
                refer: http://www.host.com`
            },
            privateKey: {
                label: 'Private Key',
                holder: `[optional] KEY-IV pairs (HEX format)`,
                content: `32-bit HEX format KEY and IV value，IV can be null
                e.g. ABABABABABBBBBBBABABABABABBBBBBBABABABABABBBBBBBABABABABABBBBBBB
                e.g. ABABABABABBBBBBBABABABABABBBBBBB`
            },
            merge: {
                label: 'After merging',
                holder: `Delete all ts files`,
            },
            urlPrefix: {
                label: `Url Prefix`,
                holder: `[optional] e.g. http://video.com/m3u8/12345678/`,
                content: `If M3U8 file is downloaded directly to the local and there is no URL (https) prefix in the file, you need to fill in it.
                If the TS video stream is in the M3U8 file directory, you do not need to fill in this field`
            }
        },
        tips: {
            addTaskMessage: 'Select an image quality',
        },
    },
    deleteTask: {
        title: 'Delete the task',
        buttons: {
            ok: 'Yes, do it',
            cancel: 'Cancel',
            withFile: 'Delete the file',
            reset: 'Reset'
        }
    },
    taskDetail: {
        title: 'Task details',
        buttons: {
            detail: 'Details'
        },
        labels: {
            total: 'Total',
            succeeded: 'Success',
            failed: 'Failed',
            downloading: 'Downloading',
            pending: 'Pending'
        },
        tips: {
            empty: 'No segment data yet. Start the task to see download details.'
        }
    },
    singleDownload: {
        buttons: {
            newTask: 'New Task',
            clearCompletedTasks: `Clear completed ({finish}/{all})`,
        },
        tips: {
            openFolder: 'Open the folder',
            playVideo: 'Play the video',
            deleteVideo: 'Delete the video',
            startDownload: 'Start download',
            pauseDownload: 'Pause download',
            manualMerge: 'Merge manually',
            noTasks: `You haven't added a download yet, let's try it
            'Create new task' can recognizes the clipboard automatically
            format: https://m3u8.url + space + video name`
        },
    },
    multiDownload: {
        buttons: {
            multiDownload: 'Start multiple downloads',
        },
        inputs: {
            m3u8Urls: {
                label: 'Multi M3U8',
                holder: `One line one M3U8 url，format: url----video name(optional), e.g.:
                https://host/index1.m3u8----1st video name
                https://host/index2.m3u8----2nd video name
                https://host/index3.m3u8`
            },
            headers: {
                label: 'Http Headers',
                holder: `[optional] One lin one header, e.g.:
                origin: http://www.host.com
                referer: http://www.host.com`,
            },
            afterMerge: {
                label: 'After merging',
                holder: `Delete all ts files`,
            }
        },
    },
    mergeTS: {
        buttons: {
            startMerge: 'Start merging',
            clearForm: 'Clear',
            quickMerge: 'Quick merge',
            fixMerge: 'Fix and merge (slow | transcoding)',
            openFolder: 'Open the folder',
            playVideo: 'Play the Video',
        },
        inputs: {
            tsDir: {
                label: 'Video Clips',
                holder: 'Select a directory containing TS streams or drag all TS files here'
            },
            tsTaskName: {
                label: 'Renamed',
                holder: '[optional] Current timestamp as default',
            },
            viewFile: 'View files',
            mergeProgress: 'Merge progress',
            log: 'Logs'
        },
        tips: {
            total: 'Import {total} ".ts" clips',
            select: '[{total}] video were selected',
        }
    },
    settings: {
        sections: {
            savePath: 'Save location',
            download: 'Download',
            appearance: 'Appearance',
            behavior: 'Behavior'
        },
        buttons: {
            browser: 'Select',
            viewLog: 'View Logs',
            closeBtn: 'Close App'
        },
        inputs: {
            saveFolder: {
                label: 'Save Folder',
                holder: 'Click the right button to select a storage folder'
            },
            tags: {
                label: 'Video Category',
                default: 'ALL',
                add: '+ New',
            },
            log: {
                label: 'Logs',
            },
            proxy: {
                label: 'HTTP Proxy',
                holder: 'e.g. http://127.0.0.1:7890'
            },
            concurrency: {
                label: 'Concurrent downloads'
            },
            maxRetries: {
                label: 'Max retries per file'
            },
            theme: {
                label: 'Theme'
            },
            language: {
                label: 'Language',
                holder: ''
            }
        },
        dropdown: {
            theme: {
                dark: 'Dark',
                light: 'Light',
                system: 'Follow system'
            },
            closeBtn: [
                'Minimize to system tray',
                'Exit directly'
            ]
        },
        dialog: {
            category: {
                title: {
                    add: 'New Category',
                    modify: 'Modify Category',
                    delete: 'Delete Category'
                },
                inputs: {
                    label: 'Category',
                    holder: 'No repeated category',
                    saveFolder: 'Save Folder',
                    star: 'Hide the Save Folder',
                }
            }
        }
    },
    message: {
        hello: '{msg} world',
        title: 'Notice',
        enterM3U8: `Please enter an M3U8 URL or direct media URL`,
        noSaveDir: `Must set the "Storage Folder" of "Category: {category}" before downloading`,
        checkM3U8url: `Checking URL...`,
        m3u8UrlError: `Please enter the correct video URL or import (.m3u8) file`,
    },
    taskStatus: {
        parsingFailed: "🚦Parsing failed! turn On/Off \"HTTP Proxy\" to try.",
        parsingM3U8ok: "Resource OK, {count_seg} fragments, downloading...",
        parsingLiveOk: "Live resource parsing successfully, downloading...",
        multiAddOk: "Batch added OK, downloading...",
        initializing: "Initializing",
        failedMultipleTimes: "💢Download failed",
        noFFMPEG: "No FFMPEG, no merging.",
        merging: "Merging...[{percent}%]",
        mergeFaild: "Merging failed, try merging manually",
        downloadFaild: "💔Download failed, check M3U8 validity",
        downloadMerging: "Downloaded, merging...",
        downloading: "Downloading...{count_downloaded}/{count_seg} [{percent}]",
        startMerge: "Start merging...",
        mergeFailedMsg: "🔴Merge faild: {error}",
        pause: "Pause...{count_downloaded}/{count_seg} [{percent}]",
        done: "",//Done
        downloadLiveStreaming: "Live Stream...[{count_downloaded}]",
        downloadButFaild: "⛔Done, but failed",
        checkM3U8url: "Checking resource...",
        saveFolderNoExist: "🚥\"Save Folder\" not found, please reset"
    },
    unit: {
        bitrate: 'Bitrate',
        resolution: 'Resolution',
        link: 'Link',
        codecs: 'Codecs',
    },
    about: {
        offical: 'Homepage',
        github: 'Github',
        version: 'Version',
        newVersion: 'new!'
    },
    ui: {
        windowTitle: 'M3U8 Video Downloader',
        minimize: 'Minimize',
        maximize: 'Maximize',
        close: 'Close',
        themeLabel: 'APPEARANCE',
        dark: 'Dark',
        light: 'Light',
        system: 'System',
        tasksActive: '{tasks} TASKS · {active} ACTIVE',
        search: 'Search name / URL',
        status: 'STATUS',
        category: 'CATEGORY',
        all: 'All',
        downloading: 'Downloading',
        done: 'Done',
        failed: 'Failed',
        paused: 'Paused',
        clearDone: 'Clear completed',
        sort: 'By created time ↓',
        open: 'Open',
        play: 'Play',
        pause: 'Pause',
        resume: 'Resume',
        retry: 'Retry',
        delete: 'Delete',
        emptyFilter: 'No tasks match the current filters',
        rightClick: 'Right-click',
        footCtx: 'a task card for more actions',
        footClear: 'Completed tasks can be cleared in one click',
        ctxDetail: 'View details (segments)',
        ctxOpenFolder: 'Open containing folder',
        ctxPlay: 'Play video',
        ctxCopyUrl: 'Copy download URL',
        ctxRedownload: 'Redownload',
        ctxDelete: 'Delete…',
        source: 'Source',
        dropLabel: 'Import segments',
        mergeDrop: 'Drop .ts segments here, or click to select files',
        mergeImported: '{n} segments imported · sorted by file name',
        mergeNoFiles: 'No segments imported',
        mergeOptions: 'Merge options',
        mergeMode: 'Merge mode',
        outputCard: 'Output',
        mergeOutput: 'Output folder',
        mergeNoDir: 'No segment folder selected',
        cleanSegments: 'Clean segments',
        cleanSegmentsLabel: 'Delete .ts segments after merging',
        progressCard: 'Merge progress',
        log: 'LOG',
        startMerge: 'Start merging',
        fixMerge: 'Fix merge (slow | transcode)',
        clear: 'Clear',
        openOutput: 'Open output folder',
        playVideo: 'Play video',
        mergeSuccess: 'Merge completed',
        categories: 'Categories',
        showPath: 'Show path',
        hidePath: 'Hide path',
        removeCategory: 'Delete category',
        concurrency: 'Concurrent segments',
        retries: 'Max retries',
        proxy: 'Proxy',
        proxyHolder: 'http://127.0.0.1:7890 (optional)',
        theme: 'Theme',
        language: 'Language',
        mergeCard: 'Segment merge',
        ffmpeg: 'ffmpeg path',
        ffmpegHolder: 'Use bundled ffmpeg (optional)',
        versionText: 'M3U8 Downloader · v{version}',
        sourceHolder: 'M3U8 URL or direct media URL; drop a .m3u8 file here. Multiple lines download in batch.',
        headersHolder: 'Optional, e.g. Origin / Referer, one per line',
        cancel: 'Cancel',
        deleteConfirm: 'Delete',
        deleteDesc: 'The task',
        deleteDescTail: ' will be processed. Choose an option:',
        deleteRecord: 'Remove task record only',
        deleteRecordHint: 'Removes it from the list; downloaded files and .ts segments stay on disk.',
        deleteFile: 'Delete task and local files',
        deleteFileHint: 'Also deletes the downloaded video and leftover .ts segments. This cannot be undone.',
        totalSegments: '{total} segments · {percent}%',
        matrix: 'Segment matrix',
        onlyFail: 'Only failed',
        openFolder: 'Open folder',
        categoryDeleteDesc: 'Delete category',
        copied: 'Download URL copied'
    },
    validateMessage: {
        notEmpty: '{name} can not be empty!',
        nameCannotBe: '{name} cannot be {except}',
        mustSelect: 'Please select a(n) {name}!'
    }
}

// export default en;
