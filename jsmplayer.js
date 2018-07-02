Vue.component('Jsmplayer', {
    data() {
      return { 	
        Slider: null,
				slider: {
          start: 2,
          min: 0,
          max: 10,
          connect: [true, false]
        },
        playing: false,
        showUI: true,
        isFullscreen: false,
        isMute: false,
        isIdle: false,
				timeoutID: ""
      }
    },

    props: ['client', 'index'],

    template: 
        `<div :class="{'player': !isFullscreen, 'player-isfull': isFullscreen}" @mouseover="onMouseShow" @mouseleave="onMouseHide">
            <canvas :id="'video-canvas-' + this.index" :class="{'player-media': !isFullscreen, 'player-media-isfull': isFullscreen}" @click="clickActive">
            </canvas>
            <transition name="fade">
                <div class="player-UI" v-show="showUI && !isIdle">
                    <i :class="{'fa fa-pause fa-2x': playing, 'fa fa-play fa-2x': !playing}" @click="togglePlay"></i>
                    <i :class="{'fa fa-volume-up fa-2x': !isMute, 'fa fa-volume-off fa-2x': isMute}" @click="toggleVolume"></i>
                    <div class="slider" :id="'slider-' + this.index"></div>
                    <i @click="screenFull" class="fa icon-fullscreen fa-2x"></i>
                </div>
            </transition>
        </div>`,

	  created() {},
		mounted() {
			  var self = this
        self.jsmegInstant()
        player.pause();
        screenfull.onchange(function() {
            self.isFullscreen = !self.isFullscreen;
        });

        this.setup();

		},
    methods: {
			jsmegInstant() {
				 var self = this
         player = new JSMpeg.Player(this.url, {
             canvas: this.canvas
         });

         this.Slider = document.getElementById('slider-' + this.index);

         noUiSlider.create(this.Slider, {
             start: this.slider.start,
             connect: [this.slider.connect[0], this.slider.connect[1]],
             range: {
                 'min': this.slider.min,
                 'max': this.slider.max
             }
         });
         this.Slider.noUiSlider.on('slide', function(values, handle) {
             player.setVolume(values[handle]);
             if (values[handle] > 0) {
                 self.isMute = false;
             } else {
                 self.isMute = true;
             }
         });
      },
			togglePlay() {
        if (!player.isPlaying) {
           player.play();
           this.playing = true
        player.audioOut.unlock(function() {
        //  alert("unlock IPHONE audio");
        });
        } else {
            player.pause();
            this.playing = false
        }
      },
      toggleVolume() {
          const currentVolume = this.Slider.noUiSlider.get()
          this.isMute = !this.isMute;
          if (currentVolume != 0) {
              this.Slider.noUiSlider.set(0)
          } else {
              this.Slider.noUiSlider.set(4)
          }
      },
      onMouseShow() {
          if (!this.isFullscreen) {
              this.showUI = true;
          }
      },
      onMouseHide() {
          //this.showUI = false;
      },
      screenFull() {
          if (screenfull.enabled) {
              screenfull.toggle(document.getElementById('JSMplayer-' + this.index));
          } else {
              alert("Your browser not support fullscreen")
          }
      },
      clickActive() {
          if (this.showUI) {
              this.togglePlay();
          }
          if (this.isFullscreen) {
              this.showUI = true;
          }

      },
      setup() {
        this.$el.addEventListener("mousemove", this.resetTimer, false);
        this.$el.addEventListener("mousedown", this.resetTimer, false);
        this.$el.addEventListener("keypress", this.resetTimer, false);
        this.$el.addEventListener("DOMMouseScroll", this.resetTimer, false);
        this.$el.addEventListener("mousewheel", this.resetTimer, false);
        this.$el.addEventListener("touchmove", this.resetTimer, false);
        this.$el.addEventListener("MSPointerMove", this.resetTimer, false);

        //this.startTimer();
      },
			startTimer() {
        this.timeoutID = window.setTimeout(this.goInactive, 3000);
			},
			resetTimer() {
        window.clearTimeout(this.timeoutID);

        this.goActive();
			},
			goActive() {
        this.isIdle = false;
        this.startTimer();
			},
			goInactive() {
        //this.isIdle = true;
        this.isIdle = false;
			}
    },
		computed: {
	    canvas() {
				var canvas = document.getElementById('video-canvas-' + this.index)
				return canvas
			},
			url() {
		    var url = 'ws://' + document.location.hostname + ':8082' + this.client.streamUrl	
				return url
			},
			//Slider() {
      //  var Slider = document.getElementById('slider-' + this.index);
			//  return Slider
			//}
		}
})

//window.onload = function () {
  new Vue({
      el: '#main'
  });
//}
