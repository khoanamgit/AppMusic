const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const player = $ ('.player')
const pauseBtn = $('.btn-toggle-play.icon-pause')
const progess = $('#progess')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev') 
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const volumeBtn = $('.btn-volume')
const playlist = $('.play-list')
/**
    1. Render Song
    2. Scroll Top
    3. Play / Pause / seek (tua)
    4. CD rorate (ảnh quay)
    5. Next / Prev
    6. Random
    7. Next / Prev when Ended
    8. Reapeat
    9. Active Song
    10. Scroll Active song into view
    11. Click play songs
**/


const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs:  [
        {
            name: 'Muốn Em Là',
            singer:'Keyo',
            path:'./assets/music/song3.mp3',
            image: './assets/img/img1.jpg'
        },
        {
            name: 'Nevada',
            singer:'Vicetone',
            path:'./assets/music/song2.mp3',
            image: './assets/img/img2.jpg'
        },
        {
            name: 'Ngày Đầu Tiên',
            singer:'Đức Phúc',
            path:'./assets/music/song1.mp3',
            image: './assets/img/img3.jpg'
        },
        {
            name: 'Như Ngày Hôm Qua',
            singer:'Sơn Tùng MTP',
            path:'./assets/music/song4.mp3',
            image: './assets/img/img2.jpg'
        },
        {
            name: 'Cưới Thôi',
            singer:'Masew',
            path:'./assets/music/song6.mp3',
            image: './assets/img/img6.jpg'
        },
        {
            name: 'Reality',
            singer:'Keyo',
            path:'./assets/music/song3.mp3',
            image: './assets/img/img1.jpg'
        },
        {
            name: 'Lemon Tree',
            singer:'Fools Garden',
            path:'./assets/music/song5.mp3',
            image: './assets/img/img5.jpg'
        }

    ],

    // Thuộc tính render chứa hàm render ra danh sách bài hát
    render: function(){
        const htmls = this.songs.map((song,index) =>{
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index ="${index}">
                    <div class="thumb" style="background-image: url('${song.image}');"></div>
                    <div class="body">
                        <div class="title">${song.name}</div>
                        <div class="author">${song.singer}</div>
                    </div>
                    <div class="option">
                        <i class="fa-solid fa-ellipsis icon-option"></i>
                    </div>
                </div>
            `
        })
        playlist.innerHTML = htmls.join('');
    },

    defineProperties: function(){
        Object.defineProperty(this, 'currentSong', {
            get: function(){
                return this.songs[this.currentIndex]
            }
        })
    },

  
    // Hàm xử lý sự kiện của app
    handleEvent: function(){

        // Xử lý quay CD
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ],{
            duration: 10000,
            iterations: Infinity
        })

        cdThumbAnimate.pause()
        // Xử lý scroll chuột ẩn và hiện ảnh cd
       
        const cdWidth = cd.offsetWidth;

        document.onscroll = function(){
            const scrollTop = document.documentElement.scrollTop || window.scrollY

            const newcdWidth = cdWidth - scrollTop

            cd.style.width = newcdWidth > 0 ? newcdWidth + 'px' : 0 //Kiểm tra nếu kqua newcdWidth ra âm sẽ set = 0 luôn
            cd.style.opacity = newcdWidth / cdWidth
        }

        // Xử lý khi click vào nút play
        playBtn.onclick = function(){
            if(app.isPlaying){
                audio.pause()
            }else{
                audio.play()
            }    

       
            // Khi song được play
            audio.onplay = function(){
                app.isPlaying = true
                player.classList.add('playing')
                cdThumbAnimate.play()
            }
 
            
            // Khi song bị pause
            audio.onpause = function(){
                app.isPlaying = false
                player.classList.remove('playing')
                cdThumbAnimate.pause()
            }

            // Khi bài hát play thì thanh progess chạy
            audio.ontimeupdate = function(){
                const progessPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progess.value = progessPercent
            }

            // Khi tua bài hát
            progess.onchange = function(e){
                const seekTime = Math.floor((e.target.value * audio.duration / 100))
                audio.currentTime = seekTime
                // console.log(seekTime)
            }

        }

        // Hàm xử lý khi click vào nút next
        nextBtn.onclick = function(){
            if(app.isRandom){
                app.randomSong()
            }else{
                app.nextSong()
            }
            audio.play()
            app.render()
            app.scrolToActive()
        }

        // Hàm xử lý khi click vào nút prev
        prevBtn.onclick = function(){
            if(app.isRandom){
                app.randomSong()
            }else{
                app.prevSong()
            }
            audio.play()
            app.render()
            app.scrolToActive()

        }

        // Hàm xử lý khi click bật tắt nút random
        randomBtn.onclick = function(){
            app.isRandom = !app.isRandom

            randomBtn.classList.toggle('active')
        }
        //  Xử lý phát random bài hát khi kết thúc
        audio.onended  = function(){
            if(app.isRepeat){
                audio.play()
                // repeatBtn.click()
            } else{
                nextBtn.click()
            }
        }

        repeatBtn.onclick = function(){
            app.isRepeat  = !app.isRepeat

            repeatBtn.classList.toggle('active')
        }

        // volumeBtn.onclick = function (){
        //     audio.volume = 0.2
        // }
        

        // Lắng nghe hành vi khi click vào playlist
        playlist.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)')
            if( songNode || e.target.closest('.option')){
                // Xử lý khi click vào song
                console.log(songNode.dataset.index)
                if(songNode){
                    app.currentIndex = Number(songNode.dataset.index)
                    app.loadCurrentSong()
                    app.render()
                    audio.play()
                  
                }

                // Xử lý khi click vào option
            }
        }

    },

    //  Hàm load bài hát đầu tiên
    loadCurrentSong: function(){
   
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`
        audio.src = this.currentSong.path
    },

    // Hàm tải bài hát tiếp theo
    nextSong: function(){
        this.currentIndex++
        if (this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },

    // Hàm tải bài hát trước
    prevSong: function(){
        this.currentIndex--
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },

    // Hàm tải bài hát random
    randomSong: function(){
        let randomIndex
        do {
            randomIndex = Math.floor(Math.random() * this.songs.length)
        } while (randomIndex === this.currentIndex)

        this.currentIndex = randomIndex
        this.loadCurrentSong()
    },

    scrolToActive: function(){
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior:'smooth',
                block: 'nearest'
            })
        },300)
        // console.log(123)
    },


    

    start: function(){
        // Render lại danh sách bài háy
        this.render()
        // Lăng nghe / xử lý cá sự kiện (DOM Event)
        this.handleEvent()
        // Định nghĩa các thuộc tính của object
        this.defineProperties()
        // Load bài hát đầu tiên  khi chương trình chạy
        this.loadCurrentSong()
    
    }
       
}
app.start()