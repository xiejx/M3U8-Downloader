const { ipcRenderer, clipboard } = require('electron')
const path = require('path')

const DEFAULT_LANGUAGE = 'en'

Vue.use(VueI18n)

const i18n = new VueI18n({
    locale: DEFAULT_LANGUAGE,
    messages: {
        'en': en,
        'zh-CN': zhCN,
    },
    silentTranslationWarn: true,
})

if (window.ELEMENT) {
    Vue.use(ELEMENT, { i18n: (key, value) => i18n.t(key, value) })
}

const WORKING_STATUS = [
    taskStatus.parsingM3U8ok,
    taskStatus.parsingLiveOk,
    taskStatus.multiAddOk,
    taskStatus.initializing,
    taskStatus.merging,
    taskStatus.downloadMerging,
    taskStatus.downloading,
    taskStatus.startMerge,
    taskStatus.downloadLiveStreaming,
    taskStatus.checkM3U8url,
]

const FAILED_STATUS = [
    taskStatus.parsingFailed,
    taskStatus.failedMultipleTimes,
    taskStatus.mergeFaild,
    taskStatus.mergeFailedMsg,
    taskStatus.downloadFaild,
    taskStatus.downloadButFaild,
    taskStatus.saveFolderNoExist,
]

const SEG_PENDING = 0
const SEG_DOWNLOADING = 1
const SEG_DONE = 2
const SEG_FAILED = 3

let vm = new Vue({
    el: '#app',
    i18n,
    data() {
        return {
            version: '',
            newVersion: '',
            platform: process.platform,

            view: 'download',

            searchText: '',
            stateFilter: 'all',
            catFilter: 'all',

            allVideos: [],

            languages: [
                { lang: 'English', value: 'en' },
                { lang: '简体中文', value: 'zh-CN' },
            ],

            config_theme: 'dark',
            config_language: DEFAULT_LANGUAGE,
            config_closeAppBehavior: 0,
            config_categories: [],
            config_proxy: '',
            config_downloadConcurrency: 5,
            config_downloadMaxRetries: 3,
            config_ffmpeg: '',

            // 新建任务
            taskTag: '',
            headers: '',
            myKeyIV: '',
            m3u8_url: '',
            taskName: '',
            taskIsDelTs: true,
            m3u8_url_prefix: '',
            m3u8_audio_url: '',
            playlists: [],
            playlistUri: '',
            addTaskMessage: '',
            dlg_newtask_visible: false,

            // 删除任务
            dlg_deltask_visible: false,
            dlg_deltask_id: '',
            dlg_deltask_name: '',
            dlg_deltask_isDelFile: false,

            // 任务详情
            dlg_taskdetail_visible: false,
            dlg_taskdetail_id: '',
            dlg_taskdetail_statuses: [],
            detailOnlyFail: false,

            // 合并
            ts_folder: '',
            ts_dir: '',
            ts_urls: [],
            tsTaskName: '',
            tsMergeType: 'speed',
            tsMergeDelTs: true,
            tsMergeProgress: 0,
            tsMergeStatus: '',
            tsMergeLog: [],
            tsMergeMp4Path: '',
            tsMergeMp4Dir: '',

            // 分类
            dlg_category_visible: false,
            dlg_category_action: 'add',
            dlg_category_title: '',
            dlg_category_modify_name: '',
            dlg_category_index: -1,
            categoryForm: { category: '', saveFolder: '', star: false },

            // 右键菜单
            ctxVisible: false,
            ctxTask: null,
            ctxX: 0,
            ctxY: 0,
        }
    },
    computed: {
        taskStatus() {
            return taskStatus
        },
        stateCounts() {
            const counts = { all: this.allVideos.length, downloading: 0, done: 0, failed: 0, paused: 0 }
            this.allVideos.forEach(o => {
                counts[this.stateOf(o)]++
            })
            return counts
        },
        catCounts() {
            const counts = {}
            this.allVideos.forEach(o => {
                const tag = o.tag || ''
                counts[tag] = (counts[tag] || 0) + 1
            })
            return counts
        },
        filteredTasks() {
            const keyword = this.searchText.trim().toLowerCase()
            return this.allVideos.filter(o => {
                if (this.catFilter !== 'all' && o.tag !== this.catFilter) return false
                if (this.stateFilter !== 'all' && this.stateOf(o) !== this.stateFilter) return false
                if (keyword) {
                    const name = `${o.taskName || ''}`.toLowerCase()
                    const url = `${o.url || ''}`.toLowerCase()
                    if (!name.includes(keyword) && !url.includes(keyword)) return false
                }
                return true
            })
        },
        activeCount() {
            return this.allVideos.filter(o => this.isTaskRunning(o.status)).length
        },
        mergeOutputDir() {
            return this.ts_folder ? path.dirname(this.ts_folder) : ''
        },
        dlg_taskdetail_task() {
            return this.allVideos.find(o => o.id === this.dlg_taskdetail_id)
        },
        dlg_taskdetail_stats() {
            const stats = { total: 0, succeeded: 0, failed: 0, downloading: 0, pending: 0 }
            this.dlg_taskdetail_statuses.forEach(st => {
                stats.total++
                if (st === SEG_DONE) stats.succeeded++
                else if (st === SEG_FAILED) stats.failed++
                else if (st === SEG_DOWNLOADING) stats.downloading++
                else stats.pending++
            })
            return stats
        },
        detailPercent() {
            const stats = this.dlg_taskdetail_stats
            if (!stats.total) return 0
            return Math.round((stats.succeeded + stats.failed) * 100 / stats.total)
        },
    },
    mounted() {
        this.systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        this.onSystemThemeChange = () => {
            if (this.config_theme === 'system') this.applyTheme('system')
        }
        this.systemTheme.addEventListener('change', this.onSystemThemeChange)

        document.addEventListener('click', this.hideCtx)
        document.addEventListener('keydown', this.onKeyDown)

        this.applyTheme(this.config_theme)

        ipcRenderer.on('message', (event, message) => {
            if (!message) return
            if (message.downloadSpeed != null) return

            this.version = message.version || ''
            if (message.platform) this.platform = message.platform
            this.allVideos = message.videoDatas || []

            this.config_categories = message.config_categories || []
            this.config_proxy = message.config_proxy || ''
            this.config_downloadConcurrency = Number(message.config_downloadConcurrency) || 5
            this.config_downloadMaxRetries = Number(message.config_downloadMaxRetries) || 3
            this.config_ffmpeg = message.config_ffmpeg || ''
            this.config_closeAppBehavior = Number(message.config_closeAppBehavior) || 0
            this.config_theme = message.config_theme || 'dark'
            this.config_language = message.config_language || DEFAULT_LANGUAGE
            this.taskTag = message.config_taskTag || (this.config_categories[0] && this.config_categories[0].tag) || ''

            if (i18n.locale !== this.config_language) i18n.locale = this.config_language
            this.applyTheme(this.config_theme)

            if (this.newVersion == '') {
                ipcRenderer.send('check-update')
            }
        })

        ipcRenderer.on('task-add-reply', (event, reply) => {
            this.onTaskAddReply(reply || {})
        })

        ipcRenderer.on('task-notify-create', (event, video) => {
            if (!video) return
            const index = this.allVideos.findIndex(o => o.id === video.id)
            if (index === -1) this.allVideos.unshift(video)
            else this.allVideos.splice(index, 1, video)
        })

        ipcRenderer.on('task-notify-update', (event, video) => {
            if (!video) return
            const index = this.allVideos.findIndex(o => o.id === video.id)
            if (index === -1) this.allVideos.unshift(video)
            else this.allVideos.splice(index, 1, video)
        })

        ipcRenderer.on('task-notify-end', (event, video) => {
            if (!video) return
            const index = this.allVideos.findIndex(o => o.id === video.id)
            if (index === -1) this.allVideos.unshift(video)
            else this.allVideos.splice(index, 1, video)
        })

        ipcRenderer.on('delvideo-reply', (event, task) => {
            if (!task) return
            const index = this.allVideos.findIndex(o => o.id === task.id)
            if (index !== -1) this.allVideos.splice(index, 1)
        })

        ipcRenderer.on('task-detail-snapshot', (event, data) => {
            if (!data || data.id !== this.dlg_taskdetail_id) return
            this.dlg_taskdetail_statuses = data.statuses || []
        })

        ipcRenderer.on('task-detail-update', (event, data) => {
            if (!data || data.id !== this.dlg_taskdetail_id) return
            const changes = data.changes || []
            changes.forEach(([idx, status]) => {
                if (this.dlg_taskdetail_statuses[idx] !== undefined) {
                    this.$set(this.dlg_taskdetail_statuses, idx, status)
                }
            })
        })

        ipcRenderer.on('start-merge-ts-status', (event, data) => {
            this.onMergeStatus(data || {})
        })

        ipcRenderer.on('open-select-m3u8-reply', (event, data) => {
            if (data) {
                this.m3u8_url = data
                this.m3u8UrlChange()
            }
        })

        ipcRenderer.on('open-directory-reply', (event, index, data) => {
            if (index == -1) {
                this.categoryForm.saveFolder = data
            } else {
                this.config_categories = data || []
                if (this.catFilter !== 'all' && !this.config_categories.some(c => c.tag === this.catFilter)) {
                    this.catFilter = 'all'
                }
                if (this.config_categories.length && !this.config_categories.some(c => c.tag === this.taskTag)) {
                    this.taskTag = this.config_categories[0].tag
                }
            }
        })

        ipcRenderer.on('open-select-ts-dir-reply', (event, dir) => {
            if (!dir) return
            this.ts_folder = dir
            this.ts_dir = dir
        })

        ipcRenderer.on('open-select-ts-select-reply', (event, files) => {
            this.setTsFiles(files || [])
        })

        ipcRenderer.on('auto-manualMerge-reply', (event, name, files) => {
            if (name) this.tsTaskName = name
            if (files) this.setTsFiles(files)
            this.view = 'merge'
        })

        ipcRenderer.on('open-select-ffmpeg-reply', (event, ffmpegPath) => {
            if (!ffmpegPath) return
            this.config_ffmpeg = ffmpegPath
            ipcRenderer.send('set-config', { key: 'ffmpegPath', value: ffmpegPath })
        })

        ipcRenderer.on('check-update-reply', (event, version) => {
            this.newVersion = version || ''
        })
    },
    beforeDestroy() {
        document.removeEventListener('click', this.hideCtx)
        document.removeEventListener('keydown', this.onKeyDown)
        this.systemTheme && this.systemTheme.removeEventListener('change', this.onSystemThemeChange)
    },
    methods: {
        /* ================= 通用 ================= */
        setView(view) {
            this.view = view
        },
        applyTheme(theme) {
            const resolved = theme === 'system'
                ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
                : theme
            document.documentElement.setAttribute('data-theme', resolved === 'light' ? 'light' : 'dark')
        },
        onKeyDown(e) {
            if (e.key !== 'Escape') return
            if (this.ctxVisible) {
                this.hideCtx()
                return
            }
            if (this.dlg_category_visible) return this.closeCategory()
            if (this.dlg_taskdetail_visible) return this.closeDetail()
            if (this.dlg_deltask_visible) return this.closeDelete()
            if (this.dlg_newtask_visible) return this.closeNewTaskDialog()
        },

        /* ================= 状态 ================= */
        isTaskRunning(status) {
            return WORKING_STATUS.indexOf(status) !== -1
        },
        stateOf(o) {
            if (o.status === taskStatus.done || o.status === taskStatus.noFFMPEG) return 'done'
            if (o.status === taskStatus.pause) return 'paused'
            if (FAILED_STATUS.indexOf(o.status) !== -1) return 'failed'
            return 'downloading'
        },
        statusTextClass(o) {
            const state = this.stateOf(o)
            if (state === 'done') return 'ok'
            if (state === 'failed') return 'err'
            if (state === 'paused') return ''
            return 'warn'
        },
        canToggle(o) {
            return o.status !== taskStatus.done
                && o.status !== taskStatus.noFFMPEG
                && o.status !== taskStatus.mergeFaild
                && o.status !== taskStatus.parsingFailed
                && o.status !== taskStatus.saveFolderNoExist
        },
        taskPercent(o) {
            if (o.status === taskStatus.done || o.status === taskStatus.noFFMPEG) return 100
            if (o.isLiving) return 0
            const total = this.segTotal(o)
            const done = (o.segment_succeeded != null ? o.segment_succeeded : (o.segment_downloaded || 0))
            if (!total) return 0
            return Math.max(0, Math.min(100, Math.round(done * 100 / total)))
        },
        stateText(o) {
            const text = o.statusText || (this.stateOf(o) === 'done' ? this.$t('ui.done') : '')
            return text.replace(/[\s\u3000]{2,}/g, ' · ')
        },
        segTotal(o) {
            return o.segment_stats_total || o.segment_total || 0
        },
        timeText(o) {
            return o.time || ''
        },
        cellState(st) {
            if (st === SEG_DONE) return 'done'
            if (st === SEG_FAILED) return 'fail'
            if (st === SEG_DOWNLOADING) return 'dl'
            return 'pending'
        },
        statusLabel(st) {
            if (st === SEG_DONE) return this.$t('taskDetail.labels.succeeded')
            if (st === SEG_FAILED) return this.$t('taskDetail.labels.failed')
            if (st === SEG_DOWNLOADING) return this.$t('taskDetail.labels.downloading')
            return this.$t('taskDetail.labels.pending')
        },

        /* ================= 窗口 ================= */
        clickMinWindow() {
            ipcRenderer.send('window-minimize')
        },
        clickMaxWindow() {
            ipcRenderer.send('window-toggle-maximize')
        },
        clickClose() {
            ipcRenderer.send('hide-windows')
        },

        /* ================= 任务操作 ================= */
        openFolder(o) {
            ipcRenderer.send('openInExplorer', o.videopath || o.dir)
        },
        playVideo(o) {
            o.videopath && ipcRenderer.send('playvideo', o.videopath)
        },
        toggleRunning(o) {
            if (this.isTaskRunning(o.status)) {
                o.status = taskStatus.pause
            } else {
                o.status = taskStatus.downloading
            }
            ipcRenderer.send('StartOrStop', o.id)
        },
        manualMerge(o) {
            ipcRenderer.send('auto-manualMerge', o.dir)
        },
        copyUrl(o) {
            clipboard.writeText(o.url || '')
            this.$message && this.$message.success(this.$t('ui.copied'))
        },
        clickClearTask() {
            ipcRenderer.send('task-clear')
            this.allVideos = this.allVideos.filter(o => o.status !== taskStatus.done)
        },
        openDelete(o) {
            this.dlg_deltask_id = o.id
            this.dlg_deltask_name = o.taskName
            this.dlg_deltask_isDelFile = false
            this.dlg_deltask_visible = true
        },
        closeDelete() {
            this.dlg_deltask_visible = false
        },
        confirmDelete() {
            ipcRenderer.send('delvideo', this.dlg_deltask_id, this.dlg_deltask_isDelFile)
            this.dlg_deltask_visible = false
        },
        openDetail(o) {
            this.dlg_taskdetail_id = o.id
            this.dlg_taskdetail_statuses = []
            this.detailOnlyFail = false
            this.dlg_taskdetail_visible = true
            ipcRenderer.send('task-detail-open', o.id)
        },
        closeDetail() {
            this.dlg_taskdetail_visible = false
            ipcRenderer.send('task-detail-close')
        },
        detailOpenFolder() {
            const task = this.dlg_taskdetail_task
            if (task) this.openFolder(task)
        },

        /* ================= 右键菜单 ================= */
        openCtx(e, o) {
            this.ctxTask = o
            this.ctxX = Math.min(e.clientX, window.innerWidth - 204)
            this.ctxY = Math.min(e.clientY, window.innerHeight - 238)
            this.ctxVisible = true
        },
        hideCtx() {
            this.ctxVisible = false
        },
        ctxDetail() {
            const task = this.ctxTask
            this.hideCtx()
            task && this.openDetail(task)
        },
        ctxOpenFolder() {
            const task = this.ctxTask
            this.hideCtx()
            task && this.openFolder(task)
        },
        ctxPlay() {
            const task = this.ctxTask
            this.hideCtx()
            task && this.playVideo(task)
        },
        ctxCopyUrl() {
            const task = this.ctxTask
            this.hideCtx()
            task && this.copyUrl(task)
        },
        ctxRedownload() {
            const task = this.ctxTask
            this.hideCtx()
            if (!task) return
            task.status = taskStatus.downloading
            ipcRenderer.send('StartOrStop', task.id)
        },
        ctxDelete() {
            const task = this.ctxTask
            this.hideCtx()
            task && this.openDelete(task)
        },

        /* ================= 新建下载 ================= */
        resetNewTask() {
            this.m3u8_url = ''
            this.taskName = ''
            this.headers = ''
            this.myKeyIV = ''
            this.m3u8_url_prefix = ''
            this.m3u8_audio_url = ''
            this.playlists = []
            this.playlistUri = ''
            this.addTaskMessage = ''
            this.taskIsDelTs = true
        },
        openNewTaskDialog() {
            this.resetNewTask()
            this.dlg_newtask_visible = true
            const value = clipboard.readText().trim()
            if (!value || this.m3u8_url) return
            if (/^(https?:\/\/|file:\/\/\/)/i.test(value) || /\.m3u8(\?|$)/i.test(value)) {
                this.m3u8_url = value
                this.m3u8UrlChange()
            }
        },
        closeNewTaskDialog() {
            this.dlg_newtask_visible = false
        },
        m3u8UrlChange() {
            const raw = (this.m3u8_url || '').trim()
            const lines = raw.split(/\r?\n/).filter(line => line.trim() !== '')
            if (lines.length !== 1) return

            let line = lines[0]
            let name = ''
            if (line.includes('----')) {
                const parts = line.split('----')
                name = parts.slice(1).join('----').trim()
            } else {
                const matched = line.match(/^(https?:\/\/\S+|file:\/\/\/\S+)\s+(.+)$/i)
                if (matched) name = matched[2].trim()
            }
            if (name) this.taskName = name
        },
        getPlaylistLabel(playlist) {
            const attrs = playlist.attributes || {}
            const resolution = attrs.RESOLUTION ? `${attrs.RESOLUTION.width}×${attrs.RESOLUTION.height}` : ''
            const bandwidth = attrs.BANDWIDTH ? `${Math.round(attrs.BANDWIDTH / 1000)} kbps` : ''
            return [resolution, bandwidth].filter(Boolean).join(' · ') || playlist.uri
        },
        qualityChange() {
            const playlist = this.playlists.find(p => p.uri === this.playlistUri)
            this.m3u8_audio_url = playlist && playlist.audio ? playlist.audio : ''
        },
        clickChangeTaskTag() {
            ipcRenderer.send('set-config', { key: 'taskTag', value: this.taskTag })
        },
        clickSelectM3U8() {
            ipcRenderer.send('open-select-m3u8')
        },
        dropM3U8File(e) {
            if (!e.dataTransfer || !e.dataTransfer.files || !e.dataTransfer.files.length) return
            const file = e.dataTransfer.files[0]
            this.m3u8_url = `file:///${file.path}`
            this.m3u8UrlChange()
        },
        clickNewTaskOK() {
            const raw = (this.m3u8_url || '').trim()
            if (!raw) {
                this.$message && this.$message.warning(this.$t('message.enterM3U8'))
                return
            }

            // 批量下载
            const lines = raw.split(/\r?\n/).filter(line => line.trim() !== '')
            if (lines.length > 1) {
                ipcRenderer.send('task-add-muti', {
                    m3u8_urls: raw,
                    headers: this.headers,
                    taskIsDelTs: this.taskIsDelTs,
                })
                this.dlg_newtask_visible = false
                this.resetNewTask()
                return
            }

            let url = lines[0].trim()
            let name = (this.taskName || '').trim()
            if (url.includes('----')) {
                const parts = url.split('----')
                url = parts[0].trim()
                if (!name) name = parts.slice(1).join('----').trim()
            } else {
                const matched = url.match(/^(https?:\/\/\S+|file:\/\/\/\S+)\s+(.+)$/i)
                if (matched) {
                    url = matched[1].trim()
                    if (!name) name = matched[2].trim()
                }
            }

            let audio = this.m3u8_audio_url
            if (this.playlists.length && this.playlistUri) {
                url = this.playlistUri
                const playlist = this.playlists.find(p => p.uri === this.playlistUri)
                audio = playlist && playlist.audio ? playlist.audio : ''
            }

            const category = this.config_categories.find(c => c.tag === this.taskTag) || this.config_categories[0]
            if (!category || !category.dir) {
                this.$message && this.$message.warning(this.$t('message.noSaveDir', { category: category ? category.tag : '' }))
                return
            }

            ipcRenderer.send('task-add', {
                url: url,
                taskName: name,
                headers: this.headers,
                myKeyIV: this.myKeyIV,
                taskIsDelTs: this.taskIsDelTs,
                url_prefix: this.m3u8_url_prefix,
                tag: category.tag,
                dir: category.dir,
                audio: audio,
            })
        },
        onTaskAddReply(reply) {
            const { object, code, message, playlists } = reply

            if (code === 1) {
                this.playlists = playlists || []
                this.playlistUri = this.playlists.length ? this.playlists[0].uri : ''
                this.qualityChange()
                this.addTaskMessage = message || this.$t('newTask.tips.addTaskMessage')
                return
            }

            if (object) {
                const index = this.allVideos.findIndex(o => o.id === object.id)
                if (index === -1) this.allVideos.unshift(object)
                else this.allVideos.splice(index, 1, object)
            }

            if (code === 0) {
                this.dlg_newtask_visible = false
                this.resetNewTask()
                return
            }

            if (message) this.$message && this.$message.error(message)

            if (object && code === -1) {
                setTimeout(() => {
                    const index = this.allVideos.findIndex(o => o.id === object.id)
                    if (index !== -1) this.allVideos.splice(index, 1)
                }, 5000)
            }

            this.dlg_newtask_visible = false
            this.resetNewTask()
        },

        /* ================= 设置 ================= */
        themeChange(theme) {
            this.config_theme = theme
            this.applyTheme(theme)
            ipcRenderer.send('set-config', { key: 'theme', value: theme })
        },
        languageChange() {
            i18n.locale = this.config_language
            ipcRenderer.send('set-config', { key: 'language', value: this.config_language })
        },
        proxyChange() {
            ipcRenderer.send('set-config', { key: 'config_proxy', value: this.config_proxy })
        },
        stepConcurrency(delta) {
            const value = Math.max(1, Math.min(32, Number(this.config_downloadConcurrency || 1) + delta))
            this.config_downloadConcurrency = value
            ipcRenderer.send('set-config', { key: 'config_downloadConcurrency', value: value })
        },
        stepRetries(delta) {
            const value = Math.max(1, Math.min(100, Number(this.config_downloadMaxRetries || 1) + delta))
            this.config_downloadMaxRetries = value
            ipcRenderer.send('set-config', { key: 'config_downloadMaxRetries', value: value })
        },
        closeAppBehaviorChange() {
            ipcRenderer.send('set-config', { key: 'closeApp', value: this.config_closeAppBehavior })
        },
        clickOpenLogDir() {
            ipcRenderer.send('open-log-dir')
        },
        clickOpenGithub() {
            window.open('https://github.com/xiejx/M3U8-Downloader')
        },
        clickUpdateApp() {
            window.open('https://github.com/xiejx/M3U8-Downloader/releases')
        },
        ffmpegChange() {
            ipcRenderer.send('set-config', { key: 'ffmpegPath', value: (this.config_ffmpeg || '').trim() })
        },
        clickSelectFfmpeg() {
            ipcRenderer.send('open-select-ffmpeg')
        },

        /* ================= 分类管理 ================= */
        categoryTitle(action) {
            return this.$t(`settings.dialog.category.title.${action}`)
        },
        clickCategoryAddNew() {
            this.dlg_category_action = 'add'
            this.dlg_category_title = this.categoryTitle('add')
            this.dlg_category_modify_name = ''
            this.dlg_category_index = -1
            this.categoryForm = { category: '', saveFolder: '', star: false }
            this.dlg_category_visible = true
        },
        clickCategoryModify(category) {
            this.dlg_category_action = 'modify'
            this.dlg_category_title = this.categoryTitle('modify')
            this.dlg_category_modify_name = category.tag
            this.dlg_category_index = this.config_categories.indexOf(category)
            this.categoryForm = { category: category.tag, saveFolder: category.dir, star: !!category.star }
            this.dlg_category_visible = true
        },
        askDeleteCategory(index) {
            const category = this.config_categories[index]
            if (!category) return
            this.dlg_category_action = 'delete'
            this.dlg_category_title = this.categoryTitle('delete')
            this.dlg_category_index = index
            this.dlg_category_modify_name = category.tag
            this.categoryForm = { category: category.tag, saveFolder: category.dir, star: !!category.star }
            this.dlg_category_visible = true
        },
        closeCategory() {
            this.dlg_category_visible = false
        },
        toggleCategoryStar(index) {
            const category = this.config_categories[index]
            if (!category) return
            category.star = !category.star
            ipcRenderer.send('set-config', { key: 'categories', value: this.config_categories })
        },
        clickCategorySelect(index) {
            ipcRenderer.send('open-directory', index, this.config_categories[index])
        },
        clickOpenDir() {
            ipcRenderer.send('open-directory', -1, this.categoryForm)
        },
        submitCategory() {
            if (this.dlg_category_action === 'delete') {
                const index = this.dlg_category_index
                if (index >= 0 && this.config_categories.length > 1) {
                    const removed = this.config_categories.splice(index, 1)[0]
                    if (!this.config_categories.some(c => c.select)) this.config_categories[0].select = true
                    if (this.catFilter === removed.tag) this.catFilter = 'all'
                    if (this.taskTag === removed.tag) this.taskTag = this.config_categories[0].tag
                    ipcRenderer.send('set-config', { key: 'categories', value: this.config_categories })
                }
                this.dlg_category_visible = false
                return
            }

            const tag = (this.categoryForm.category || '').trim()
            if (!tag) {
                this.$message && this.$message.warning(this.$t('validateMessage.notEmpty', { name: this.$t('settings.dialog.category.inputs.label') }))
                return
            }
            if (!this.categoryForm.saveFolder) {
                this.$message && this.$message.warning(this.$t('validateMessage.notEmpty', { name: this.$t('settings.dialog.category.inputs.saveFolder') }))
                return
            }
            const duplicated = this.config_categories.some(c => c.tag === tag && c.tag !== this.dlg_category_modify_name)
            if (duplicated) {
                this.$message && this.$message.warning(this.$t('settings.dialog.category.inputs.holder'))
                return
            }

            if (this.dlg_category_action === 'add') {
                this.config_categories.push({
                    tag: tag,
                    dir: this.categoryForm.saveFolder,
                    star: !!this.categoryForm.star,
                    select: false,
                })
            } else {
                const index = this.dlg_category_index
                const category = this.config_categories[index]
                category.tag = tag
                category.dir = this.categoryForm.saveFolder
                category.star = !!this.categoryForm.star
                if (this.catFilter === this.dlg_category_modify_name) this.catFilter = tag
                if (this.taskTag === this.dlg_category_modify_name) this.taskTag = tag
            }

            if (!this.config_categories.some(c => c.select)) this.config_categories[0].select = true
            ipcRenderer.send('set-config', { key: 'categories', value: this.config_categories })
            this.dlg_category_visible = false
        },

        /* ================= 合并 ================= */
        setTsFiles(files) {
            const absolute = files.filter(f => path.isAbsolute(f))
            if (absolute.length) {
                const dir = path.dirname(absolute[0])
                this.ts_folder = dir
                this.ts_dir = dir
                this.ts_urls = absolute.filter(f => path.dirname(f) === dir).map(f => path.basename(f))
                if (!this.tsTaskName) this.tsTaskName = path.basename(dir)
                return
            }
            this.ts_urls = files.map(f => path.basename(f))
        },
        clickSelectTSDir() {
            ipcRenderer.send('open-select-ts-dir')
        },
        dropTSFiles(e) {
            if (!e.dataTransfer || !e.dataTransfer.files || !e.dataTransfer.files.length) return
            const files = Array.from(e.dataTransfer.files)
                .map(f => f.path)
                .filter(f => f && /\.ts$/i.test(f))
            if (files.length) this.setTsFiles(files)
        },
        clearMerge() {
            this.ts_urls = []
            this.tsMergeProgress = 0
            this.tsMergeStatus = ''
            this.tsMergeLog = []
            this.tsMergeMp4Path = ''
            this.tsMergeMp4Dir = ''
        },
        startMerge(transcoding) {
            if (!this.ts_urls.length) return
            if (!this.ts_folder) {
                this.$message && this.$message.warning(this.$t('mergeTS.inputs.tsDir.holder'))
                return
            }

            this.tsMergeType = transcoding ? 'transcoding' : 'speed'
            this.tsMergeProgress = 0
            this.tsMergeStatus = ''
            this.tsMergeLog = []
            this.tsMergeMp4Path = ''
            this.tsMergeMp4Dir = ''

            ipcRenderer.send('start-merge-ts', {
                ts_folder: this.ts_folder,
                ts_files: this.ts_urls,
                mergeType: this.tsMergeType,
                name: (this.tsTaskName || '').trim() || `${new Date().getTime()}`,
                delTs: this.tsMergeDelTs,
            })
        },
        onMergeStatus(data) {
            if (typeof data.progress === 'number' && data.progress >= 0) {
                this.tsMergeProgress = Math.min(100, data.progress)
            }

            if (data.status) {
                const line = data.status === 'success' ? this.$t('ui.mergeSuccess') : data.status
                this.tsMergeStatus = line
                this.tsMergeLog.push(`${new Date().toLocaleTimeString()}  ${line}`)
                if (this.tsMergeLog.length > 200) this.tsMergeLog.shift()
            }

            if (data.code === 1) {
                this.tsMergeProgress = 100
                this.tsMergeMp4Path = data.path || ''
                this.tsMergeMp4Dir = data.path ? path.dirname(data.path) : (data.dir || '')
            }

            if ((data.code === -1 || data.code === -2) && data.status) {
                this.$message && this.$message.error(data.status)
            }
        },
        openMergeOutput() {
            const target = this.tsMergeMp4Dir || this.tsMergeMp4Path
            target && ipcRenderer.send('openInExplorer', target)
        },
        playMergeOutput() {
            this.tsMergeMp4Path && ipcRenderer.send('playvideo', this.tsMergeMp4Path)
        },
    },
})
