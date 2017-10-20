<template>
  <div id="status">
    <p>{{ remaining }}</p>
  </div>
</template>

<script>
export default {
  name: 'timer',
  data () {
    return {
      remaining: '',
      intervalId: null
    }
  },
  created () {
    this.$bus.$on('stateChange', ($event) => {
      console.log("Timer: heard a 'waiting' event!");
      this.startTimer($event);
    }),
    this.$bus.$on('processing', ($event) => {
      console.log("Timer: heard a 'processing' event!");
      this.stopTimer();
    }),
    this.$bus.$on('playing', ($event) => {
      console.log("Timer: heard a 'playing' event!");
      this.stopTimer();
    }),
    this.$bus.$on('gameover', ($event) => {
      console.log("Timer: heard a 'gameover' event!");
      this.stopTimer('Game over!');
    })
  },
  methods: {

    stopTimer: function(message) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
      console.log("Timer: in stopTimer");
      if (message) {
        this.remaining = message;
      }
      else {
        this.remaining = '';
      }
    },

    startTimer: function(timerLength) {
      if (this.intervalId === null) {
        console.log("Timer: in startTimer");
        this.remaining = timerLength;
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
    color: #E53A40;
    font-weight: bold;
  }

</style>
