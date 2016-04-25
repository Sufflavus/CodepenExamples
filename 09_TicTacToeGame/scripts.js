(function() {
    //http://www3.ntu.edu.sg/home/ehchua/programming/java/javagame_tictactoe_ai.html
  //https://github.com/aglemann/tic-tac-toe
  var userRole = "X";
  
  var markerType = {
    x: "X",
    o: "O",
    none: "none"
  };
  
  var game = new Game();
  
  $("#roleChooser").openModal({
    dismissible: false, // Modal can be dismissed by clicking outside of the modal
    opacity: .5, // Opacity of modal background
    in_duration: 300, 
    out_duration: 300,    
  });
  
  $("#btnX").click(function() {
    userRole = "X";    
    game.setStrangerMarker(markerType.x);
    clearField();
  });
  
  $("#btnO").click(function() {
    userRole = "O";    
    game.setStrangerMarker(markerType.o);
    clearField();
  });
  
  $(".s4").click(function() {
    var element = $(this);
    if(!element.text()) {
      //element.text(userRole);       
      var position = element.data("position").split("-");
      game.onStrangerMove([+position[0], +position[1]]);
    }
  });
  
  function clearField() {
    $(".s4").each(function() {
      $(this).text("");
    });
  } 
  
  //http://www3.ntu.edu.sg/home/ehchua/programming/java/javagame_tictactoe_ai.html
  //https://github.com/aglemann/tic-tac-toe
  function Game() {
    var self = this;
    var board = new Board();
    var stranger = new Stranger();
    var ai = new Ai(board);
    
    self.setStrangerMarker = function(marker) {
      stranger.setMarker(marker);
      debugger;
      var aiMarker = marker == markerType.o ? markerType.x : markerType.o;
      ai.setMarker(aiMarker);
    }
    
    self.onStrangerMove = function(position) {
      debugger
      if (board.getMarker(position) == markerType.none) {
        board.putMarker(position, stranger.myMarker);
        drawMarker(position, stranger.myMarker);
        
        var aiMove = ai.getNextMove();
        board.putMarker(aiMove, ai.myMarker);
        drawMarker(aiMove, ai.myMarker);
      }
    }
    
    function drawMarker(position, marker) {
      $('.s4[data-position="' + position[0] + '-' + position[1] + '"]').text(marker);
    }
  } 
  
  function Player() {
    var self = this;
    self.myMarker = markerType.none; 
    self.opponentMarker = markerType.none;     
    
    self.setMarker = function(marker) {
      var self = this;
      var opponentMarker = marker == markerType.o ? markerType.x : markerType.o;
      self.myMarker = marker;      
      self.opponentMarker = opponentMarker;
    };
  }
      
  function Stranger() {
    var self = this;
    var proto = new Player();
    $.extend(self, proto);
    //Player.call(self);    
  }
  
  //Stranger.prototype = Object.create(Player.prototype);
  //Stranger.prototype.constructor = Player;
  
  function Ai(board) {
    var self = this;
    //Player.call(self); 
    var proto = new Player();
    $.extend(self, proto);
    self.board = board;    

    self.getNextMove = function() {
      var result = minimax(2, self.myMarker);
      return [result[1], result[2]];   // row, col
    }

    function minimax(depth, marker) {
      // Generate possible next moves in a List of int[2] of {row, col}.
      var nextMoves = generateMoves();

      // mySeed is maximizing; while oppSeed is minimizing
      var bestScore = marker == self.myMarker ? Number.MIN_VALUE : Number.MAX_VALUE;
      var currentScore;
      var bestRow = -1;
      var bestCol = -1;

      if (nextMoves.length == 0 || depth == 0) {
        // Gameover or depth reached, evaluate score
        bestScore = evaluate();
      } else {
        for (var i = 0, length = nextMoves.length; i < length; i++) {
          var move = nextMoves[i];
          // Try this move for the current "player"
          self.board.putMarker(move, marker);           
          if (marker == self.myMarker) {  // mySeed (computer) is maximizing player
            currentScore = minimax(depth - 1, self.opponentMarker)[0];
            if (currentScore > bestScore) {
              bestScore = currentScore;
              bestRow = move[0];
              bestCol = move[1];
            }
          } else {  // oppSeed is minimizing player
            currentScore = minimax(depth - 1, self.myMarker)[0];
            if (currentScore < bestScore) {
              bestScore = currentScore;
              bestRow = move[0];
              bestCol = move[1];
            }
          }
          // Undo move
          self.board.putMarker(move, markerType.none);           
        }
      }
      return [bestScore, bestRow, bestCol];
    }

    /** Find all valid next moves.
        Return List of moves in int[2] of {row, col} or empty list if gameover */
    function generateMoves() {
      var nextMoves = [];

      // If gameover, i.e., no next move
      if (hasWon(self.myMarker) || hasWon(self.opponentMarker)) {
        return nextMoves;   // return empty list
      }

      // Search for empty cells and add to the List
      for (var row = 0; row < 3; ++row) {
        for (var col = 0; col < 3; ++col) {
          if (self.board.getMarker([row, col]) == markerType.none) {
            nextMoves.push([row, col]);
          }
        }
      }
      return nextMoves;
    }

    /** The heuristic evaluation function for the current board
         @Return +100, +10, +1 for EACH 3-, 2-, 1-in-a-line for computer.
                 -100, -10, -1 for EACH 3-, 2-, 1-in-a-line for opponent.
                 0 otherwise   */
    function evaluate() {
      var score = 0;
      // Evaluate score for each of the 8 lines (3 rows, 3 columns, 2 diagonals)
      score += evaluateLine(0, 0, 0, 1, 0, 2);  // row 0
      score += evaluateLine(1, 0, 1, 1, 1, 2);  // row 1
      score += evaluateLine(2, 0, 2, 1, 2, 2);  // row 2
      score += evaluateLine(0, 0, 1, 0, 2, 0);  // col 0
      score += evaluateLine(0, 1, 1, 1, 2, 1);  // col 1
      score += evaluateLine(0, 2, 1, 2, 2, 2);  // col 2
      score += evaluateLine(0, 0, 1, 1, 2, 2);  // diagonal
      score += evaluateLine(0, 2, 1, 1, 2, 0);  // alternate diagonal
      return score;
    }

    /** The heuristic evaluation function for the given line of 3 cells
         @Return +100, +10, +1 for 3-, 2-, 1-in-a-line for computer.
                 -100, -10, -1 for 3-, 2-, 1-in-a-line for opponent.
                 0 otherwise */
    function evaluateLine(row1, col1, row2, col2, row3, col3) {
      var score = 0;

      // First cell
      if (self.board.getMarker([row1, col1]) == self.myMarker) {
        score = 1;
      } else if (self.board.getMarker([row1, col1]) == self.opponentMarker) {
        score = -1;
      }

      // Second cell
      if (self.board.getMarker([row2, col2]) == self.myMarker) {
        if (score == 1) {   // cell1 is mySeed
          score = 10;
        } else if (score == -1) {  // cell1 is oppSeed
          return 0;
        } else {  // cell1 is empty
          score = 1;
        }
      } else if (self.board.getMarker([row2, col2]) == self.opponentMarker) {
        if (score == -1) { // cell1 is oppSeed
          score = -10;
        } else if (score == 1) { // cell1 is mySeed
          return 0;
        } else {  // cell1 is empty
          score = -1;
        }
      }

      // Third cell
      if (self.board.getMarker([row3, col3]) == self.myMarker) {
        if (score > 0) {  // cell1 and/or cell2 is mySeed
          score *= 10;
        } else if (score < 0) {  // cell1 and/or cell2 is oppSeed
          return 0;
        } else {  // cell1 and cell2 are empty
          score = 1;
        }
      } else if (self.board.getMarker([row3, col3]) == self.opponentMarker) {
        if (score < 0) {  // cell1 and/or cell2 is oppSeed
          score *= 10;
        } else if (score > 1) {  // cell1 and/or cell2 is mySeed
          return 0;
        } else {  // cell1 and cell2 are empty
          score = -1;
        }
      }
      return score;
    }

    var winningPatterns = [
      0x111000000, 0x000111000, 0x000000111, // rows
      0x100100100, 0x010010010, 0x001001001, // cols
      0x100010001, 0x001010100               // diagonals
    ];

    /** Returns true if thePlayer wins */
    function hasWon(playerMarker) {
      var pattern = 0x000000000;  // 9-bit pattern for the 9 cells
      for (var row = 0; row < 3; ++row) {
        for (var col = 0; col < col; ++col) {
          if (self.board.getMarker([row, col]) == playerMarker) {
            pattern |= (1 << (row * 3 + col));
          }
        }
      }
      for (var i = 0, length = winningPatterns.length; i < length; i++) {
        var winningPattern = winningPatterns[i];
        if ((pattern & winningPattern) == winningPattern) {
          return true;
        }
      }
      return false;
    }
  }
  
  //Ai.prototype = Object.create(Player.prototype);
  //Ai.prototype.constructor = Player;
  
  function Board() {
    var cells = new Array(3);
       
    for(var row = 0; row < 3; row++) {
      cells[row] = new Array(3);
      for(var col = 0; col < 3; col++) {
        cells[row][col] = markerType.none;
      }
    }
    
    function putMarker(position, marker) {
      cells[position[0]][position[1]] = marker;
      //console.log(position);
      //console.log(marker);      
    }
    
    function getMarker(position) {
      return cells[position[0]][position[1]];
    }    
        
    return {
      cells: cells,
      putMarker: putMarker,
      getMarker: getMarker
    };
  }
})();