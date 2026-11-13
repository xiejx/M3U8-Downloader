const zhCN = {
    app: {
        title: 'M3U8 下载器'
    },
    sidebar: {
        download: '资源下载',
        settings: '软件设置'
    },
    tabs: {
        singleDownload: '视频下载',
        multiDownload: `M3U8批量下载`,
        mergeTS: `合并视频片段`
    },
    newTask: {
        title: '新建下载任务',
        buttons: {
            newTask: '新建下载',
            clearCompletedTasks: `清空已完成`,
            confirm: '开始下载',
        },
        inputs: {
            url: {
                label: '视频源',
                holder: `请输入 M3U8 地址或普通视频直链（MP4/FLV/MP3/WAV），也可拖拽 M3U8 文件`,
            },
            taskName: {
                label: '任务名',
                holder: `[可空] 默认当前时间戳`,
            },
            quality: {
                label: '* 画质',
                holder: '选择视频源',
            },
            tags: {
                label: '分类',
            },
            httpHeaders: {
                label: '附加头',
                holder: `[可空] 一行一个Header，例如:
                orgin: http://www.host.com
                refer: http://www.host.com`
            },
            privateKey: {
                label: '私有KEY',
                holder: `[可空] KEY和IV值(HEX格式)`,
                content: `32位HEX格式KEY和32位IV值，IV值可空
                例如 ABABABABABBBBBBBABABABABABBBBBBBABABABABABBBBBBBABABABABABBBBBBB
                或者 ABABABABABBBBBBBABABABABABBBBBBB`
            },
            merge: {
                label: '合并完成',
                holder: `删除TS片段`,
            },
            urlPrefix: {
                label: `URL前缀`,
                holder: `[可空] 例如：http://video.com/m3u8/12345678/`,
                content: `如果M3U8文件是直接下载到本地的，并且文件里没有URL(https)前缀，则需要填写
                如果TS视频流在M3U8文件目录下，则不需要填写这块`
            }
        },
        tips: {
            addTaskMessage: '请选择一种画质',
        },
    },
    deleteTask: {
        title: '删除任务',
        buttons: {
            ok: '确 定',
            cancel: '取 消',
            withFile: '删除文件',
            reset: '重 置'
        }
    },
    taskDetail: {
        title: '任务详情',
        buttons: {
            detail: '详情'
        },
        labels: {
            total: '总数',
            succeeded: '成功',
            failed: '失败',
            downloading: '下载中',
            pending: '等待中'
        },
        tips: {
            empty: '暂无分片数据，任务启动后可查看下载详情'
        }
    },
    singleDownload: {
        buttons: {
            newTask: '新建下载',
            clearCompletedTasks: `清空已完成 ({finish}/{all})`,
        },
        tips: {
            openFolder: '打开文件夹',
            playVideo: '播放',
            deleteVideo: '删除',
            startDownload: '开始下载',
            pauseDownload: '暂停下载',
            manualMerge: '手动合并',
            noTasks: `您还没有添加下载任务，快来试试吧
            新建任务，能自动识别剪切板，省去繁琐操作
            格式：https://m3u8.url+空格+视频名字`
        },
    },
    multiDownload: {
        buttons: {
            multiDownload: '批量下载',
        },
        inputs: {
            m3u8Urls: {
                label: 'Multi M3U8',
                holder: `请输入一行一个M3U8视频源，格式：视频源----任务名（可空）,例如：
                https://host/index1.m3u8----第一个视频
                https://host/index2.m3u8----第二个视频
                https://host/index3.m3u8`
            },
            headers: {
                label: '附加头',
                holder: `[可空] 请输入一行一个Header，例如：
                Origin: http://www.host.com
                Referer: http://www.host.com`,
            },
            afterMerge: {
                label: '合并完成',
                holder: `删除TS片段`,
            }
        },
    },
    mergeTS: {
        buttons: {
            startMerge: '开始合并',
            clearForm: '清空',
            quickMerge: '快速合并',
            fixMerge: '修复合并 (慢|转码)',
            openFolder: '打开文件夹',
            playVideo: '播放视频',
        },
        inputs: {
            tsDir: {
                label: '视频片段',
                holder: '选择一个包含TS流的目录或将所有TS文件拖拽至此'
            },
            tsTaskName: {
                label: '新视频名',
                holder: '[可空] 默认当前时间戳',
            },
            viewFile: '查看文件',
            mergeProgress: '合并进度',
            log: '日志'
        },
        tips: {
            total: '共导入 {total} 个视频片段',
            select: '选择了 [{total}] 个视频',
        }
    },
    settings: {
        sections: {
            savePath: '保存位置',
            download: '下载',
            appearance: '外观',
            behavior: '行为'
        },
        buttons: {
            browser: '浏览',
            viewLog: '查看日志',
            closeBtn: '关闭按钮'
        },
        inputs: {
            saveFolder: {
                label: '存储目录',
                holder: '请单击右侧按钮选择存储文件夹'
            },
            tags: {
                label: '视频分类',
                default: '全部',
                add: '+ 新增',
            },
            log: {
                label: '日志',
            },
            proxy: {
                label: 'HTTP代理',
                holder: '请输入HTTP代理(如：http://127.0.0.1:7890 )'
            },
            concurrency: {
                label: '同时下载数量'
            },
            maxRetries: {
                label: '单文件重试次数'
            },
            theme: {
                label: '主题'
            },
            language: {
                label: '语言',
                holder: ''
            }
        },
        dropdown: {
            theme: {
                dark: '深色',
                light: '浅色',
                system: '跟随系统'
            },
            closeBtn: [
                '最小化到系统托盘',
                '直接退出'
            ]
        },
        dialog: {
            category: {
                title: {
                    add: '新增分类',
                    modify: '修改分类',
                    delete: '删除分类'
                },
                inputs: {
                    label: '分类标签',
                    holder: '请不要重复添加分类标签',
                    saveFolder: '存储目录',
                    star: '隐藏存储目录',
                }
            }
        }
    },
    message: {
        hello: '{msg} 全世界',
        title: '注意',
        enterM3U8: `请输入 M3U8 地址或普通视频直链`,
        noSaveDir: '请先设置"分类: {category}"的存储路径，再开始下载',
        checkM3U8url: `正在检查链接...`,
        m3u8UrlError: `请输入正确的视频 URL 或者导入(.m3u8)文件`,
    },
    taskStatus: {
        parsingFailed: "🚦解析失败！开关 HTTP代理 试试",
        parsingM3U8ok: "资源解析成功，有 {count_seg} 个片段，开始下载...",
        parsingLiveOk: "直播资源解析成功，开始下载...",
        multiAddOk: "批量添加成功，开始下载...",
        initializing: "初始化...",
        failedMultipleTimes: "💢多次尝试，下载片段失败",
        noFFMPEG: "未发现本地FFMPEG，不能合成视频",
        merging: "合并中...[{percent}%]",
        mergeFaild: "合并出错，请尝试手动合并",
        downloadFaild: "💔下载失败，请检查链接有效性",
        downloadMerging: "已完成，合并中...",
        downloading: "下载中...{count_downloaded}/{count_seg} [{percent}]",
        startMerge: "开始合并...",
        mergeFailedMsg: "🔴合并出错：{error}",
        pause: "暂停...{count_downloaded}/{count_seg} [{percent}]",
        done: "",//已完成
        downloadLiveStreaming: "下载直播中...[{count_downloaded}]",
        downloadButFaild: "⛔已完成，下载失败",
        checkM3U8url: "解析资源中...",
        saveFolderNoExist: "🚥\"存储目录\" 无效，请重设"
    },
    unit: {
        bitrate: '码率',
        resolution: '分辨率',
        link: '链接',
        codecs: '编码',
    },
    about: {
        offical: '官网',
        github: 'Github',
        version: '版本',
        newVersion: '新版本!'
    },
    ui: {
        windowTitle: 'M3U8 视频下载器',
        minimize: '最小化',
        maximize: '最大化',
        close: '关闭',
        themeLabel: 'APPEARANCE',
        dark: '深色',
        light: '浅色',
        system: '跟随系统',
        tasksActive: '{tasks} TASKS · {active} ACTIVE',
        search: '搜索任务名 / 链接',
        status: '状态',
        category: '分类',
        all: '全部',
        downloading: '下载中',
        done: '已完成',
        failed: '失败',
        paused: '已暂停',
        clearDone: '清空已完成',
        sort: '按创建时间 ↓',
        open: '打开',
        play: '播放',
        pause: '暂停',
        resume: '继续',
        retry: '重试',
        delete: '删除',
        emptyFilter: '当前筛选条件下没有任务',
        rightClick: '右键',
        footCtx: '任务卡片可打开操作菜单',
        footClear: '已完成任务支持一键清空',
        ctxDetail: '查看详情（分片矩阵）',
        ctxOpenFolder: '打开所在文件夹',
        ctxPlay: '播放视频',
        ctxCopyUrl: '复制下载链接',
        ctxRedownload: '重新下载',
        ctxDelete: '删除…',
        source: '源片段',
        dropLabel: '导入片段',
        mergeDrop: '将 .ts 片段拖拽至此，或点击选择文件',
        mergeImported: '已导入 {n} 个片段 · 按文件名自动排序',
        mergeNoFiles: '尚未导入片段',
        mergeOptions: '合并设置',
        mergeMode: '合并方式',
        outputCard: '完成处理',
        mergeOutput: '输出目录',
        mergeNoDir: '未选择片段目录',
        cleanSegments: '清理分片',
        cleanSegmentsLabel: '合并完成后删除 .ts 片段',
        progressCard: '合并进度',
        log: '日志',
        startMerge: '开始合并',
        fixMerge: '修复合并（慢 | 转码）',
        clear: '清空',
        openOutput: '打开输出目录',
        playVideo: '播放视频',
        mergeSuccess: '合并完成',
        categories: '视频分类',
        showPath: '显示路径',
        hidePath: '隐藏路径',
        removeCategory: '删除分类',
        concurrency: '并发分片数',
        retries: '最大重试次数',
        proxy: '代理地址',
        proxyHolder: 'http://127.0.0.1:7890（可空）',
        theme: '主题',
        language: '语言',
        mergeCard: '片段合并',
        ffmpeg: 'ffmpeg 路径',
        ffmpegHolder: '使用内置 ffmpeg（可空）',
        versionText: 'M3U8 Downloader · v{version}',
        sourceHolder: '输入 M3U8 地址或视频直链，也可拖拽 .m3u8 文件；多行可批量下载',
        headersHolder: '可空，例如 Origin / Referer，一行一个',
        cancel: '取消',
        deleteConfirm: '删 除',
        deleteDesc: '即将处理任务',
        deleteDescTail: '，请选择处理方式：',
        deleteRecord: '仅删除任务记录',
        deleteRecordHint: '从任务列表移除，已下载的视频文件与 .ts 片段完整保留在存储目录中。',
        deleteFile: '删除任务及本地文件',
        deleteFileHint: '同时删除已下载的视频与残留 .ts 片段，释放磁盘空间。此操作不可恢复。',
        totalSegments: '共 {total} 片段 · {percent}%',
        matrix: '分片矩阵',
        onlyFail: '只看失败',
        openFolder: '打开文件夹',
        categoryDeleteDesc: '确定要删除分类',
        copied: '已复制下载链接'
    },
    validateMessage: {
        notEmpty: '{name} 不能为空！',
        nameCannotBe: '{name} 不能是 {except}',
        mustSelect: '请选择 {name}！'
    }
}

// export default zhCN;
