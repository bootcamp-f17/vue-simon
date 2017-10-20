<template>
  <div id="app">

    <h1>Vuemon</h1>

    <div id="simon">

      <timer v-on:expired="timesUp"></timer>

      <div class="row">
        <div id="green" class="light col" v-on:click="captureTap('green')"></div>
        <div id="red" class="light col" v-on:click="captureTap('red')"></div>
      </div>

      <div class="row">
        <div id="yellow" class="light col" v-on:click="captureTap('yellow')"></div>
        <div id="blue" class="light col" v-on:click="captureTap('blue')"></div>
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
      i: 0,
      timerLength: 10,
      timerIsActive: false, // For logic in this component
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

    test: function(message) {
      console.log('something something test test: ' + message);
    },

    start: function() {
      if (this.timerIsActive == false) {
        this.timerIsActive = true;
        this.sequence = [ 'red', 'blue', 'yellow'];
        this.addToSequence();
        this.playSequence();
        this.$bus.$emit('waiting', this.timerLength)
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

      console.log("in playSequence");

//      this.$bus.$emit('playing', this.timerLength);

      console.log("simon.i is " + simon.i);

      setTimeout(function (i, testFunction) {
          // Do Something Here
          // Then recall the parent function to
          // create a recursive loop.

          testFunction('woot!');

          console.log( '1(' + i + ') this.sequence[' + i + '](' + this.sequence[i] + ')'  )
          i++;
          if ( i < this.sequence.length ) {
            this.playSequence();
          }
          else {
            console.log( 'FINISHED!' );
          }
      }.bind(this, this.i, this.test), 1000);





//      this.$bus.$emit('waiting', this.timerLength);

    },

    playButton: function(light) {

      console.log("Correct sequence: ");
      for (var i=0; i < this.sequence.length; i++) {
        console.log(this.sequence[i]);
      }

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
            this.$bus.$emit('waiting', this.timerLength)
          }
          else {
            // Matches so far
            this.$bus.$emit('waiting', this.timerLength)            
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
      alert("Time's up!");
      this.timerIsActive = false;
      this.gameOver();
    },

    gameOver: function() {

      alert("GAME OVER, MAN!");
      this.timerIsActive = false;
      this.taps = [];
      if (this.longest < this.sequence.length) {
        this.longest = this.sequence.length;
      }

      // There is no win condition for Simon
      // You just try to go as long as you can before you screw up

      // Put application in "gameover" state
      // Play the gameover sound
      // Save a new high score, if justified
      // Start game button should start a new game

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



</style>
