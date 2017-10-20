<template>
  <div id="app">

    <h1>Vuemon</h1>

    <div id="simon">

      <timer v-on:expired="timesUp"></timer>

      <div class="row">
        <div id="green" class="light col" v-on:click="captureTap('green')" v-bind:class="{ 'bright': currentButton === 'green' }"></div>
        <div id="red" class="light col" v-on:click="captureTap('red')" v-bind:class="{ 'bright': currentButton === 'red' }"></div>
      </div>

      <div class="row">
        <div id="yellow" class="light col" v-on:click="captureTap('yellow')" v-bind:class="{ 'bright': currentButton === 'yellow'}"></div>
        <div id="blue" class="light col" v-on:click="captureTap('blue')" v-bind:class="{ 'bright': currentButton === 'blue'}"></div>
      </div>

    </div>

    <div id="controls" class="row">
      <div class="col"><button class="start" v-on:click="start">Start</button></div>
    </div>

    <div id="history">
      <p><strong>Current Sequence:</strong> {{ current }}</p>
      <p><strong>Longest Sequence:</strong> {{ longest }}</p>
    </div>

  </div>
</template>

<script>
import timer from './Timer.vue';

export default {
  name: 'app',
  data () {
    return {
      playSequenceId: null,
      playSequenceCounter: 0,
      currentButton: '',
      timerLength: 10,
      state: 'ready',
      longest: 0,
      sequence: [],
      taps: [],
      lights: [ 'red', 'green', 'yellow', 'blue' ]
    }
  },
  components: { timer },
  computed: {
    current: function() {
      return this.sequence.length;
    },
    tapsMatchesSequence: function() {
      var partialSequence = this.sequence.slice(0, this.taps.length);
      console.log(this.taps);
      console.log(partialSequence);
      return JSON.stringify(this.taps)==JSON.stringify(partialSequence); 
    }
  },
  created () {
    this.$bus.$on('expired', ($event) => {
      this.timesUp();
    })
  },
  methods: {

    start: function() {
      if (this.timerIsActive == false) {
        this.timerIsActive = true;
        this.sequence = [];
        this.addToSequence();
        this.playSequence();
      }
    },

    chooseRandomLight: function() {
      var index = Math.floor(Math.random() * 4);
      console.log(index);
      return this.lights[index];
    },

    addToSequence: function() {
      this.sequence.push(this.chooseRandomLight());
    },

    playSequence: function() {

      console.log("App: playSequence: " + this.playSequenceCounter);

      this.$bus.$emit('playing', this.timerLength);
      this.timerIsActive = false;

      this.playSequenceId = window.setInterval(function(self) {

        console.log("anonymous function: " + self.playSequenceCounter)
        self.currentButton = self.sequence[self.playSequenceCounter];
        self.playSequenceCounter++;

        console.log("anonymous function: (counter)" + self.playSequenceCounter);
        console.log("anonymous function: (sequence length)" + self.sequence.length);

        if (self.playSequenceCounter > self.sequence.length) {
          window.clearInterval(self.playSequenceId);
          self.playSequenceId = null;
          self.playSequenceCounter = 0;
          self.$bus.$emit('waiting', self.timerLength);
          self.timerIsActive = true;
        }

      }, 400, this);

    },

    captureTap: function(light) {

      console.log("tapped: " + light);

      // Ignore taps unless the application is waiting
      // The application is waiting when the timer is active
      if (this.timerIsActive) {
      
        // Put application in "processing" state
        this.$bus.$emit('processing');

        // Add tap to taps
        this.taps.push(light);

        // Do the taps match sequence?
        if (this.tapsMatchesSequence) {
          if (this.taps.length === this.sequence.length) {
            // Matches completely
            this.taps = [];
            this.addToSequence();
            this.playSequence();
            this.$bus.$emit('waiting', this.timerLength);
            this.timerIsActive = true;
          }
          else {
            // Matches so far
            this.$bus.$emit('waiting', this.timerLength)            
            this.timerIsActive = true;
          }

        }
        else {
          this.gameOver();
        }
      
      }
      else {
        // Ignore the tap
      }

    },

    timesUp: function() {
      this.timerIsActive = false;
      this.gameOver();
    },

    gameOver: function() {
      this.$bus.$emit('gameover', this.timerLength)            
      this.timerIsActive = false;
      this.taps = [];
      if (this.longest < this.sequence.length) {
        this.longest = this.sequence.length;
      }
    }

  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

#simon {
  padding: 0 20px 20px 20px;
}

#controls {
  padding-bottom: 20px;
}

.row {

}

.col {
  display: inline-block;
}

.start {
  padding: 10px;
  font-size: 18px;
}

.light {
  margin: 20px;
  border: 1px solid #000;
  transition: 10x 2s;
}

#red {
  height: 100px;
  width: 100px;
  background: #E53A40;
  opacity: 0.1;
}

#yellow {
  height: 100px;
  width: 100px;
  background: #EFDC05;
  opacity: 0.1;
}

#green {
  height: 100px;
  width: 100px;
  background: #75D701;
  opacity: 0.1;
}

#blue {
  height: 100px;
  width: 100px;
  background: #30A9DE;
  opacity: 0.1;
}

.bright {
  opacity: 1.0 !important;
}

.light:active {
  opacity: 1.0 !important;
}


</style>
