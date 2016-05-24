(function() {
  var n = 70;
  var m = 50;
  
  var cellState = {
    dead: 0,
    firstGeneration: 1,
    secondGeneration: 2
  };
  
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
    getInitialState: function() {  
      var currentGeneration = [];
      
      for(var i = 0; i < n; i++) {
        for(var j = 0; j < m; j++) {          
          currentGeneration.push(cellState.dead);          
        }
      } 
      
      var startX = n*5 + 10;
            
      currentGeneration[startX + n*1 + 25] = cellState.firstGeneration;
      
      currentGeneration[startX + n*2 + 23] = cellState.firstGeneration;
      currentGeneration[startX + n*2 + 25] = cellState.firstGeneration;
      
      currentGeneration[startX + n*3 + 13] = cellState.firstGeneration;
      currentGeneration[startX + n*3 + 14] = cellState.firstGeneration;
      currentGeneration[startX + n*3 + 21] = cellState.firstGeneration;
      currentGeneration[startX + n*3 + 22] = cellState.firstGeneration;
      currentGeneration[startX + n*3 + 35] = cellState.firstGeneration;
      currentGeneration[startX + n*3 + 36] = cellState.firstGeneration;
      
      currentGeneration[startX + n*4 + 12] = cellState.firstGeneration;
      currentGeneration[startX + n*4 + 16] = cellState.firstGeneration;
      currentGeneration[startX + n*4 + 21] = cellState.firstGeneration;
      currentGeneration[startX + n*4 + 22] = cellState.firstGeneration;
      currentGeneration[startX + n*4 + 35] = cellState.firstGeneration;
      currentGeneration[startX + n*4 + 36] = cellState.firstGeneration;
      
      currentGeneration[startX + n*5 + 1] = cellState.firstGeneration;
      currentGeneration[startX + n*5 + 2] = cellState.firstGeneration;
      currentGeneration[startX + n*5 + 11] = cellState.firstGeneration;
      currentGeneration[startX + n*5 + 17] = cellState.firstGeneration;
      currentGeneration[startX + n*5 + 21] = cellState.firstGeneration;
      currentGeneration[startX + n*5 + 22] = cellState.firstGeneration;
      
      currentGeneration[startX + n*6 + 1] = cellState.firstGeneration;
      currentGeneration[startX + n*6 + 2] = cellState.firstGeneration;
      currentGeneration[startX + n*6 + 11] = cellState.firstGeneration;
      currentGeneration[startX + n*6 + 15] = cellState.firstGeneration;
      currentGeneration[startX + n*6 + 17] = cellState.firstGeneration;
      currentGeneration[startX + n*6 + 18] = cellState.firstGeneration;
      currentGeneration[startX + n*6 + 23] = cellState.firstGeneration;
      currentGeneration[startX + n*6 + 25] = cellState.firstGeneration;
      
      currentGeneration[startX + n*7 + 11] = cellState.firstGeneration;
      currentGeneration[startX + n*7 + 17] = cellState.firstGeneration;
      currentGeneration[startX + n*7 + 25] = cellState.firstGeneration;
      
      currentGeneration[startX + n*8 + 12] = cellState.firstGeneration;
      currentGeneration[startX + n*8 + 16] = cellState.firstGeneration;
      
      currentGeneration[startX + n*9 + 13] = cellState.firstGeneration;
      currentGeneration[startX + n*9 + 14] = cellState.firstGeneration;
      
      return { 
        generationNumber: 1,
        currentGeneration: currentGeneration,
        updateInterval: speed.fast
      };
    },
    calculateNextGeneration: function() {
      var currentGeneration = this.state.currentGeneration;
      var nextGeneration = [];
      
      currentGeneration.forEach(function(cell, index) {
        var topNeighbor = index - n;
        var bottomNeighbor = index + n;
        
        // first top row
        if(index >= 0 && index < n) {
          topNeighbor = n*(m - 1) + index;
        }
        
        // last bottom row
        if(index >= n*(m - 1) && index < n*m) {
          bottomNeighbor = index - n*(m - 1);
        }        
                
        var topLeftNeighbor = topNeighbor - 1;        
        var topRightNeighbor = topNeighbor + 1;
        
        var leftNeighbor = index - 1;        
        var rightNeighbor = index + 1;
        
        var bottomLeftNeighbor = bottomNeighbor - 1;        
        var bottomRightNeighbor = bottomNeighbor + 1;
        
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
                 
       /*  var neighborIndexes = [
          topLeftNeighbor, topNeighbor, topRightNeighbor,
          leftNeighbor, rightNeighbor,
          bottomLeftNeighbor, bottomNeighbor, bottomRightNeighbor
        ]; */
                
        var neighbors = [
          currentGeneration[topLeftNeighbor], 
          currentGeneration[topNeighbor], 
          currentGeneration[topRightNeighbor],
          currentGeneration[leftNeighbor], 
          currentGeneration[rightNeighbor],
          currentGeneration[bottomLeftNeighbor], 
          currentGeneration[bottomNeighbor], 
          currentGeneration[bottomRightNeighbor]
        ];
        
        var aliveCount = neighbors.filter(function(item) {
          return !!item;
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
      
      var generationNumber = this.state.generationNumber + 1;
      
      this.setState({ 
        currentGeneration: nextGeneration,
        generationNumber: generationNumber
      }); 
    },
    componentDidMount: function() { 
      this.calculateNextGeneration()
      //setInterval(this.calculateNextGeneration, this.state.updateInterval);   
            
      // TODO: start, pause
      // TODO: clear
      // TODO: random initial state
    }, 
    handleCellClick: function(id) {
      var currentGeneration = this.state.currentGeneration;
      currentGeneration[id] = currentGeneration[id] === cellState.dead ? cellState.firstGeneration : cellState.dead;
      
      this.setState({ 
        currentGeneration: currentGeneration
      }); 
    },
    render: function() {
      var self = this;
      
      var cells = self.state.currentGeneration.map(function(state, index) {
        return (
          <Cell id={index} state={state} 
            onClick={self.handleCellClick}/>
        )
      });
          
      return (
        <div className="board-wrapper">
          <div className="generation-info">
            Generation:&nbsp;
            {this.state.generationNumber}
          </div>
          <div className="board">
            {cells}
          </div>
        </div>
      );
    }
  });
  
  ReactDOM.render(
    <Board/>,
    document.getElementById('container')
  );
})();