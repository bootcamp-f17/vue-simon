<template>
  <div id="app">

    <h1>Vueplicate</h1>

    <div id="simon">

      <timer></timer>

      <div class="row">
        <div id="green" class="light col noSelect" v-on:click="captureTap('green')" v-bind:class="{ 'bright': currentButton === 'green' }"></div>
        <div id="red" class="light col noSelect" v-on:click="captureTap('red')" v-bind:class="{ 'bright': currentButton === 'red' }"></div>
      </div>

      <div class="row">
        <div id="yellow" class="light col noSelect" v-on:click="captureTap('yellow')" v-bind:class="{ 'bright': currentButton === 'yellow'}"></div>
        <div id="blue" class="light col noSelect" v-on:click="captureTap('blue')" v-bind:class="{ 'bright': currentButton === 'blue'}"></div>
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
      state: 'ready',
      timerIsActive: false,
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
      // This only works because we know exactly what taps and sequence contain
      return JSON.stringify(this.taps)==JSON.stringify(partialSequence); 
    }
  },
  created () {
    this.$bus.$on('expired', ($event) => {
      this.gameOver();
    })
  },
  methods: {

    changeState: function(newState) {
      switch(newState) {
        case 'ready': 
          // Application is waiting for the user to start a new game
          this.timerIsActive = false;
          this.$bus.$emit('stateChange', 'ready'); 
          break;       
        case 'playing':
          // Application is currently playing back the sequence
          this.timerIsActive = false;
          this.$bus.$emit('stateChange', 'playing');        
          break;
        case 'capturing':
          // Application is capturing taps from the user
          this.timerIsActive = true;
          this.$bus.$emit('stateChange', 'capturing', this.timerLength);  
          break;
        case 'processing':
          // Application is processing a tap
          this.timerIsActive = false;
          this.$bus.$emit('stateChange', 'processing');
          break;
        case 'gameover':
          // The player (finally) tapped a wrong button
          this.timerIsActive = false;
          this.$bus.$emit('stateChange', 'gameover');
          break;
        default:
          console.log("Error! Changing to unrecognized state: " + newState);
      }
      this.state = newState;
      console.log("State changed to: " + newState);

    },

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

      // console.log("App: playSequence: " + this.playSequenceCounter);

      this.playSequenceId = window.setInterval(() => {

        this.changeState('playing');

        this.currentButton = '';

        setTimeout(() => {
  
          this.currentButton = this.sequence[this.playSequenceCounter];
          this.playSequenceCounter++;

          if (this.playSequenceCounter > this.sequence.length) {
            window.clearInterval(this.playSequenceId);
            this.playSequenceId = null;
            this.playSequenceCounter = 0;
            this.changeState('capturing');
          }

        }, 300);

      }, 600);

    },

    captureTap: function(light) {

      console.log("tapped: " + light);

      // Ignore taps unless the application is waiting
      // The application is waiting when the timer is active
      if (this.timerIsActive) {

        // Display the tap
        this.currentButton = light;

        // Turn off the light
        setTimeout(() => {
          this.currentButton = '';
        }, 300); 
      
        // Put application in "processing" state
        this.changeState('processing');

        // Add tap to taps
        this.taps.push(light);

        // Do the taps match sequence?
        if (this.tapsMatchesSequence) {
          if (this.taps.length === this.sequence.length) {
            // Matches completely
            this.taps = [];
            this.addToSequence();
            this.playSequence();
            this.changeState('capturing');
          }
          else {
            // Matches so far
            this.changeState('capturing');
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

    gameOver: function() {
      this.changeState('gameover');
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

/* https://stackoverflow.com/questions/21003535/anyway-to-prevent-the-blue-highlighting-of-elements-in-chrome-when-clicking-quic */
.noSelect {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

</style>
