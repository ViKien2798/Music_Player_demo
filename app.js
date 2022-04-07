// 1. Render songs
// 2. Scroll top
// 3. Play / pause / seek /
// 4. CD rotate
// 5. Next / Prev
// 6. Random
// 7. Next / repeat when ended
// 8. Active songs
// 9. Scroll active songs into view
// 10. Play songs when click

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAY_STORAGE_KEY = 'KIÊN_PLAYER '

const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const player = $('.player') 
const progress = $('.progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRamDom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAY_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'Ái nộ',
            singer: 'Masew',
            path: './assets/music/AiNo1-MasewKhoiVu.mp3',
            image: './assets/img/Ai_no.jfif'
        },
        {
            name: 'Bình yên những phút giây',
            singer: 'Sơn Tùng MTP',
            path: './assets/music/Bình Yên Những Phút Giây_Sơn Tùng M-TP_-1076223947.mp3',
            image: './assets/img/SonTung_MTP.jpg'
        },
        {
            name: 'Có em Chờ',
            singer: 'Min',
            path: './assets/music/Có Em Chờ_Min, Mr.A_-1076227401.flac',
            image: './assets/img/Min.jfif'
        },
        {
            name: 'Cưới Thôi',
            singer: 'Masew',
            path: './assets/music/CuoiThoi-MasewMasiuBRay.mp3',
            image: './assets/img/cuoithoi.jfif'
        },
        {
            name: 'Đế Vương',
            singer: 'Đình Đũng',
            path: './assets/music/DeVuong-DinhDungACV.mp3',
            image: './assets/img/DeVuong.jfif'
        },
        {
            name: 'Đường Ta Chờ em về',
            singer: 'Bui Trường linh',
            path: './assets/music/DuongTaChoEmVe-buitruonglinh.mp3',
            image: './assets/img/buiminhminh.jfif'
        },
        {
            name: 'Hạ Còn Vương Nắng',
            singer: 'ĐatKaa',
            path: './assets/music/HaConVuongNang-DatKaa.mp3',
            image: './assets/img/datkaa.jfif'
        },
        {
            name: 'Không Phải dạng vừa đâu',
            singer: 'Sơn Tùng MTP',
            path: './assets/music/Không Phải Dạng Vừa Đâu_Sơn Tùng M-TP_-1075201860.mp3',
            image: './assets/img/Sontung.jfif'
        },
        {
            name: 'See Tình',
            singer: 'Hoàng Thùy Linh',
            path: './assets/music/SeeTinh-HoangThuyLinh-7130526.mp3',
            image: './assets/img/seeTinh.jfif'
        },
        {
            name: 'Thức Giấc',
            singer: 'DaLAB',
            path: './assets/music/ThucGiac-DaLAB-7048212.mp3',
            image: './assets/img/thucgiac.jfif'
        },
        {
            name: 'Yêu 5',
            singer: 'Rhymastic',
            path: './assets/music/Yêu 5_Rhymastic_-1075832913.mp3',
            image: './assets/img/yeu5.jfif'
        },
        {
            name: 'Yêu đương khó quá thì về đây',
            singer: 'Erik',
            path: './assets/music/YeuDuongKhoQuaThiChayVeKhocVoiAnh-ERIK-7128950.mp3',
            image: './assets/img/Erik.jfif'
        },
    ],
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAY_STORAGE_KEY, JSON.stringify(this.config));
    },
    render: function() {
        const html = this.songs.map((song, index) => {
            return `<div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>`;
        })
        playlist.innerHTML = html.join('')
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvent: function() {
        const _this = this
        const cdWidth = cd.offsetWidth
        //xử lý cd quay / dừng
        const cdThumbAnimate = cdThumb.animate([{
            transform: 'rotate(360deg)'
        }, {
            duration: 10000, // 10 seconds
            iterations: Infinity
        }
        ])
        cdThumbAnimate.pause()
        
        //Xử lý khi thu phóng CD
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }
        //Xử lý khi click play
        playBtn.onclick = function() {
            if(_this.isPlaying){
                audio.pause()
            } else {
                audio.play()
            }
        }
        //khi song dc play
        audio.onplay = function() {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }
        //khi song bị pause
        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }
        //khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }
        //Xử lý khi tua songs
        progress.oninput = function(e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }
        //khi next bài hát
        nextBtn.onclick = function() {
            if(_this.isRamDom) {
                _this.playRamdomSong()
            }else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        //khi quay lại(prev) bài hát
        prevBtn.onclick = function() {
            if(_this.isRamDom) {
                _this.playRamdomSong()
            }else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        //xử lý bật / tắt ramdom song
        randomBtn.onclick = function(e) {
            _this.isRamDom = !_this.isRamDom
            _this.setConfig('isRamDom', _this.isRamDom)
            randomBtn.classList.toggle('active', _this.isRamDom)
        }
        //xử lý next song khi audio end song
        audio.onended = function() {
            if(_this.isRepeat) {
                audio.play()
            } else{
                nextBtn.click()
            }
        }
        //xử lý  khi lặp lại bài hát
        repeatBtn.onclick = function(e) {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }
        //lắng nghe hành vi click vào playlist
        playlist.onclick = function(e) {
            const songNode =  e.target.closest('.song:not(.active)')
            const songOption = e.target.closest('.option')
            if (songNode || songOption) 
                {
                //xử lý khi click vào song
                    if (songNode) {
                        _this.currentIndex = Number(songNode.dataset.index)
                        _this.loadCurrentSong()
                        _this.render()
                        audio.play()
                    }

                // Xử lý khi click vào option
                if(songOption) {

                }
            }
        }
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path

    },
    //loadConfig
    loadConfig: function(){
        this.isRamDom = this.config.isRamDom
        this.isRepeat = this.config.isRepeat
        
    },
    //next
    nextSong: function(){
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    //pver song
    prevSong: function(){
        this.currentIndex--
        if (this.currentIndex <0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    //play ramdom song
    playRamdomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    //scroll view
    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'end',
                inline: 'nearest',
            })
        }, 300)
    },
    start: function() {
        //gán cấu hình từ config vào ứng dụng
        this.loadConfig()
        //định nghĩa các thuộc tính cho object
        this.defineProperties()
        //lắng nghe / xử lý các sự kiện (DOM events) 
        this.handleEvent()
        //Tải thông tin bài hát đầu tiên vào UI khi chạy úng dụng
        this.loadCurrentSong()
        // Render playlist
        this.render()
        //hiển thị trạng thái ban đầu của button repeat và random
        randomBtn.classList.toggle('active', this.isRamDom)
        repeatBtn.classList.toggle('active', this.isRepeat)
    }

}

app.start()