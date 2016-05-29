(function() {      
  var classForState = {
    0: "cell",
    1: "cell alive",
    2: "cell old"
  };

  var speed = {
    fast: 50,
    medium: 200,
    slow: 500
  };
  
  class LiveGenerator {
    constructor() {
      this.size = {
        n: 70,
        m: 50
      };
      
      this.cellState = {
        dead: 0,
        firstGeneration: 1,
        secondGeneration: 2
      };

      this.board = [];  
      this.generation = 1;
      this.clearBoard();
      this.setRandom();
    }
    
    clearBoard() {
      const n = this.size.n;
      const m = this.size.m;
      const cellState = this.cellState;
      let board = [];      
      
      let id = 0;
      for(let i = 0; i < n; i++) {
        for(let j = 0; j < m; j++) {          
          board[id] = cellState.dead;
          id++;
        }
      } 
      
      this.board = board;
      this.generation = 0;
    }
    
    setRandom() {
      const n = this.size.n;
      const m = this.size.m;
      const cellState = this.cellState;
      
      let currentGeneration = [];
      
      for(let i = 0; i < n; i++) {
        for(let j = 0; j < m; j++) {          
          currentGeneration.push(cellState.dead);          
        }
      } 
      
      let randomCount = n*m/4;
      for(let i = 0; i < randomCount; i++) {
        let randomCell = getRandomInt(0, n*m);
        currentGeneration[randomCell] = cellState.firstGeneration;
      }     
      
      this.board = currentGeneration;
      this.generation = 1;  
      
      function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }
    }
    
    tick() {
      const n = this.size.n;
      const m = this.size.m;
      const cellState = this.cellState;
      
      let currentGeneration = this.board;
      let nextGeneration = [];
      
      currentGeneration.forEach(function(cell, index) {
        let topNeighbor = index - n;
        let bottomNeighbor = index + n;
        
        // first top row
        if(index >= 0 && index < n) {
          topNeighbor = n*(m - 1) + index;
        }
        
        // last bottom row
        if(index >= n*(m - 1) && index < n*m) {
          bottomNeighbor = index - n*(m - 1);
        }        
                
        let topLeftNeighbor = topNeighbor - 1;        
        let topRightNeighbor = topNeighbor + 1;
        
        let leftNeighbor = index - 1;        
        let rightNeighbor = index + 1;
        
        let bottomLeftNeighbor = bottomNeighbor - 1;        
        let bottomRightNeighbor = bottomNeighbor + 1;
        
        // first left column
        if(index%n === 0 && index/n >= 0 && index/n < m - 1) {          
          topLeftNeighbor = topNeighbor + n - 1;
          leftNeighbor = index + n - 1;
          bottomLeftNeighbor = bottomNeighbor + n - 1; 
        }
                
        // first right column
        if((index + 1)%n === 0 && (index + 1)/n >= 0 && (index + 1)/n < m - 1) {          
          topRightNeighbor = topNeighbor - n + 1;
          rightNeighbor = index - n + 1;
          bottomRightNeighbor = bottomNeighbor - n + 1;          
        }
                        
        let neighbors = [
          currentGeneration[topLeftNeighbor], 
          currentGeneration[topNeighbor], 
          currentGeneration[topRightNeighbor],
          currentGeneration[leftNeighbor], 
          currentGeneration[rightNeighbor],
          currentGeneration[bottomLeftNeighbor], 
          currentGeneration[bottomNeighbor], 
          currentGeneration[bottomRightNeighbor]
        ];

        let aliveCount = neighbors.filter(function(item) {
          return item != cellState.dead;
        }).length;
       
        if(cell != cellState.dead && (aliveCount < 2 || aliveCount > 3)) {
          nextGeneration[index] = cellState.dead;
        } else if(cell != cellState.dead && (aliveCount === 2 || aliveCount === 3)) {
          nextGeneration[index] = cellState.secondGeneration;
        } else if(cell === cellState.dead && aliveCount === 3) {
          nextGeneration[index] = cellState.firstGeneration;
        } else {
          nextGeneration[index] = cellState.dead;
        }
      });
      
      this.board = nextGeneration;
      this.generation++;      
    }
    
    onCellClick(cellId) {    
      const cellState = this.cellState;
      
      this.board[cellId] = this.board[cellId] === cellState.dead ? 
        cellState.firstGeneration : 
        cellState.dead;
    }      
  }
  
  var Cell = React.createClass({
    handleClick: function() {  
      this.props.onClick(this.props.id);
    }, 
    render: function() {
      return (
        <div id={this.props.id}
          className={classForState[this.props.state]}
          onClick={this.handleClick}>
        </div>
      );
    }
  });

  var Board = React.createClass({
    handleCellClick: function(id) {  
      this.props.onCellClick(id);
    }, 
    render: function() {
      var self = this;
      
      var cells = self.props.currentGeneration.map(function(state, index) {
        return (
          <Cell id={index} state={state} 
            onClick={self.handleCellClick}/>
        )
      });
          
      return (
        <div className="board-wrapper">
          <div className="generation-info">
            Generation:&nbsp;
            {this.props.generationNumber}
          </div>
          <div className="board">
            {cells}
          </div>
        </div>
      );
    }
  });
  
  var Button = React.createClass({
    handleClick: function() {  
      this.props.onClick();
    }, 
    render: function() {
      return (
        <a className="waves-effect waves-light btn"
          onClick={this.handleClick}>
          <i className="material-icons left">{this.props.icon}</i>{this.props.name}
        </a>
      );
    }
  });
  
  var ButtonPanel = React.createClass({
    handleRunClick: function() {  
      this.props.onRunClick();
    }, 
    handlePauseClick: function() {  
      this.props.onPauseClick();
    }, 
    handleClearClick: function() {  
      this.props.onClearClick();
    }, 
    render: function() {
      return (
        <div className="center-align button-wrapper">
          <Button name="Run" icon="play_arrow" onClick={this.handleRunClick}/>
          <Button name="Pause" icon="pause" onClick={this.handlePauseClick}/>
          <Button name="Clear" icon="loop" onClick={this.handleClearClick}/>                   
        </div>
      );
    }
  });
  
  var SpeedRadioButton = React.createClass({
    handleChange: function(e) {  
      var speed = +e.currentTarget.value;
      this.props.onChange(speed);
    }, 
    render: function() {
      return (
        <div className="radio-wrapper">
          <input className="with-gap" type="radio" name="speed" 
            id={this.props.id}
            value={this.props.value} 
            checked={this.props.checked} 
            onChange={this.handleChange}/>
          <label htmlFor={this.props.id}>{this.props.label}</label>
        </div>
      );
    }
  });
  
  var SpeedPanel = React.createClass({
    getInitialState: function() {        
      return {         
        speed: this.props.defaultSpeed
      };
    },
    handleSpeedChanged: function(newSpeed) {
      this.setState({ 
        speed: newSpeed
      }); 
      this.props.onSpeedChanged(newSpeed);
    },
    render: function() {
      return (
        <div className="center-align button-wrapper">
          <SpeedRadioButton
            id="slow"
            value={speed.slow}
            checked={this.state.speed === speed.slow}
            onChange={this.handleSpeedChanged}
            label="Slow">
          </SpeedRadioButton>
          <SpeedRadioButton
            id="medium"
            value={speed.medium}
            checked={this.state.speed === speed.medium}
            onChange={this.handleSpeedChanged}
            label="Medium">
          </SpeedRadioButton>    
          <SpeedRadioButton
            id="fast"
            value={speed.fast}
            checked={this.state.speed === speed.fast}
            onChange={this.handleSpeedChanged}
            label="Fast">
          </SpeedRadioButton>  
        </div>
      );
    }
  });
  
  var Field = React.createClass({    
    getInitialState: function() {             
      var liveGenerator = new LiveGenerator();
      
      return { 
        liveGenerator: liveGenerator,
        generationNumber: liveGenerator.generation,
        currentGeneration: liveGenerator.board,
        speed: speed.fast,
        boardUpdater: null
      };
    },
    componentDidMount: function() {       
      var timer = setInterval(this.calculateNextGeneration, this.state.speed);
      
      this.setState({ 
        boardUpdater: timer
      });           
    },  
    calculateNextGeneration: function() {
      var liveGenerator = this.state.liveGenerator;
      liveGenerator.tick();
            
      this.setState({ 
        currentGeneration: liveGenerator.board,
        generationNumber: liveGenerator.generation
      }); 
    },    
    handleCellClick: function(id) {
      var liveGenerator = this.state.liveGenerator;
      liveGenerator.onCellClick(id);
            
      this.setState({ 
        currentGeneration: liveGenerator.board
      }); 
    },    
    handleSpeedChanged: function (newSpeed) {     
      var speed = newSpeed;
            
      if(this.state.boardUpdater) {
        clearInterval(this.state.boardUpdater);
        var timer = setInterval(this.calculateNextGeneration, speed);
        this.setState({ 
          speed: speed,
          boardUpdater: timer
        }); 
      } else {
        this.setState({ 
          speed: speed          
        }); 
      }                 
    },    
    handleRunClick: function(e) {
      if(this.state.boardUpdater) {
        clearInterval(this.state.boardUpdater);
      }
      
      var timer = setInterval(this.calculateNextGeneration, this.state.speed);
      
      this.setState({ 
        boardUpdater: timer
      }); 
    },
    handlePauseClick: function(e) {
      clearInterval(this.state.boardUpdater);
      this.setState({ 
        boardUpdater: null
      }); 
    },
    handleClearClick: function(e) {
      clearInterval(this.state.boardUpdater);
      var liveGenerator = this.state.liveGenerator;
      liveGenerator.clearBoard();
      
      this.setState({ 
        currentGeneration: liveGenerator.board,
        generationNumber: liveGenerator.generation,
        boardUpdater: null
      }); 
    },
    render: function() {              
      return (
        <div>
          <Board 
            generationNumber={this.state.generationNumber}
            currentGeneration={this.state.currentGeneration}
            onCellClick={this.handleCellClick}>            
          </Board>          
          <ButtonPanel 
            onRunClick={this.handleRunClick}
            onPauseClick={this.handlePauseClick}
            onClearClick={this.handleClearClick}>
          </ButtonPanel>
          <SpeedPanel 
            onSpeedChanged={this.handleSpeedChanged}
            defaultSpeed={this.state.speed}>
          </SpeedPanel>          
        </div>
      );
    }
  });
  
  ReactDOM.render(
    <Field/>,
    document.getElementById('container')
  );
})();