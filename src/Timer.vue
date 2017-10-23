<template>
  <div id="status">
    <p>{{ message }}{{ remaining }}</p>
  </div>
</template>

<script>
export default {
  name: 'timer',
  data () {
    return {
      message: 'Click the Start button to begin!',
      remaining: '',
      intervalId: null
    }
  },
  created () {
    this.$bus.$on('stateChange', ($event, timerLength) => {
      switch($event) {
        case 'capturing':
          this.startTimer(timerLength)
          break;
        case 'playing':
          this.stopTimer('Watch closely!');
          break;
        case 'processing':
          this.stopTimer();
          break;
        case 'gameover':
          this.stopTimer('OOPS! Click the Start button to play again!');
          break;
        default:
          console.log("Timer: state changed to [" + $event +"]");
      }
    })
  },
  methods: {

    stopTimer: function(text) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
      this.remaining = '';
      if (text) {
        this.message = text;
      }
      else {
        this.message = '';
      }
    },

    startTimer: function(timerLength) {
      if (this.intervalId === null) {
        this.remaining = timerLength;
        this.message = '';
        this.intervalId = window.setInterval(this.tick, 1000);
      }
    },

    tick: function() {
      console.log("tick!");
      this.remaining--;
      if (this.remaining === 0) {
        this.$bus.$emit('expired');
        window.clearInterval(this.intervalId);
        this.intervalId = null;
      }
    }

  }
}
</script>

<style>

  #status {
    height: 40px;
    color: #999;
    font-weight: bold;
  }

</style>
