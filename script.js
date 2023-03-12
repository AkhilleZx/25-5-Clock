const audio = document.getElementById('beep')

class App extends React.Component {
    
    state = {
        breakCount: 5,
        sessionCount: 25,
        clockCount: (25 * 60),
        currentTimer: "Session",
        isPlaying: false
    }

    constructor(props) {
        super(props);
        this.loop = undefined;
    }

    componentWillUnmount() {
        clearInterval(this.loop)
    }

    handlePlayPause = () => {
        const { isPlaying } = this.state;
    
        if( isPlaying ) {
            clearInterval(this.loop)

            this.setState({
                isPlaying: false
            });
        } else {
            this.setState({
                isPlaying: true
            });

            this.loop = setInterval(() => {
                const { clockCount, 
                        currentTimer, 
                        breakCount, 
                        sessionCount 
                    } = this.state;

                if(clockCount === 0) {
                    this.setState({
                        currentTimer: (currentTimer === "Session") ? "Break" : "Session", 
                        clockCount: (currentTimer === 'Session') ? (breakCount * 60) : (sessionCount * 60)
                    })
// Audio section 
                audio.play();
                setTimeout(function() {
                    audio.pause();
                  }, 35000);

                } else {
                    this.setState({
                        clockCount: clockCount - 1
                    })
                }

            }, 1000);
        }
    }
    
    handleReset = () => {
        this.setState({
            breakCount: 5,
            sessionCount: 25,
            clockCount: 25 * 60,
            currentTimer: "Session",
            isPlaying: false
        })

// Audio reset section        
        clearInterval(this.loop)
        audio.pause();
        audio.currentTime = 0;
    }

    timeToRelax(_timer) {
        if(sessionCount === 0) {
            this.audio.play();
        }
    } 

    convertToTime = (count) => {
        let minutes = Math.floor(count / 60);
        let seconds = count % 60;

        minutes = minutes < 10 ? (`0`+minutes) : minutes;
        seconds = seconds < 10 ? (`0`+seconds) : seconds;

        return `${minutes}:${seconds}`;
    }

// Change session/break timeframes section

handleTimeChangeRequest = (count, timerType) => {
    const { sessionCount, breakCount, isPlaying, currentTimer } = this.state;
  
    let newCount;
  
    if (timerType === "session") {
      newCount = this.state.sessionCount + count;
    } else {
      newCount = this.state.breakCount + count;
    }
  
    if (newCount >= 1 && newCount <= 60 && !isPlaying) {
      this.setState({
        [`${timerType}Count`]: newCount,
        clockCount:
          currentTimer.toLowerCase() === timerType
            ? newCount * 60
            : this.state.clockCount,
      });
    }
  };
  
    render() {

        const { breakCount, 
                sessionCount, 
                clockCount, 
                currentTimer,
                isPlaying
            } = this.state;

        const breakTime = {
            title: 'Break',
            count: breakCount,
            handleDecrease: () => this.handleTimeChangeRequest(-1, 'break'),
            handleIncrease: () => this.handleTimeChangeRequest(1, 'break')
        }

        const sessionTime = {
            title: 'Session',
            count: sessionCount,
            handleDecrease: () => this.handleTimeChangeRequest(-1, 'session'),
            handleIncrease: () => this.handleTimeChangeRequest(1, 'session')
        }

        const backgroundColor = `hsl(${clockCount/Math.random() % 360}, 100%, 50%)`;

        return (
            
        <div className="background-image">
            <div className="belt">
                    <div className="special-container">
                        <h3 className="special">25 + 5 Clock</h3>
                    </div>
                    <div className="flex">
                        <SetTimer {...breakTime}/>
                        <SetTimer {...sessionTime}/>
                    </div>
                    <div className="clock-container">
                        <h1 id="timer-label">{currentTimer}</h1>
                        <span id="time-left" style={{ color: backgroundColor }}>{this.convertToTime(clockCount)}</span>

                        <div className="flex">
                            <button id="start_stop" onClick={this.handlePlayPause}>Play/Pause</button>
                            <button id="reset" onClick={this.handleReset}>Reset</button>
                        </div>
                    </div>
                    <h4 className="author">Designed and Coded by<br></br> 
                    <a href="https://www.linkedin.com/in/daniel-carter-2aa23ba4/" target= "_blank">Daniel Carter</a></h4>
                </div>
        </div>
        )
    }
}

const SetTimer = (props) => {
    
    const id = props.title.toLowerCase();

    return (
        <div className="timer-container">

        <h2 id={`${id}-label`}>{props.title} length</h2>
        <div className="flex button-wrapper">
            <button id={`${id}-decrement`} onClick={props.handleDecrease}>-</button>

            <span id={`${id}-length`}>{props.count}</span>

            <button id={`${id}-increment`} onClick={props.handleIncrease}>+</button>
        </div>

    </div>
    )
}

ReactDOM.render(<App/>, document.getElementById('app'));