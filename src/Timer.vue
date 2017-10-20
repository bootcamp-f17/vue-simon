<template>
  <div id="status">
    <p v-if="remaining > 0">{{ remaining }}</p>
  </div>
</template>

<script>
export default {
  name: 'timer',
  data () {
    return {
      remaining: 0,
      intervalId: null
    }
  },
  created () {
    this.$bus.$on('waiting', ($event) => {
      this.startTimer($event);
    }),
    this.$bus.$on('processing', ($event) => {
      this.stopTimer();
    })
  },
  methods: {

    stopTimer: function() {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log("Timer: in stopTimer");
      this.remaining = '';
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
        clearInterval(this.intervalId);
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
