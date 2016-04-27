(function() {
        //http://www3.ntu.edu.sg/home/ehchua/programming/java/javagame_tictactoe_ai.html
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
    clearField();
    game.setStrangerMarker(markerType.x);    
  });
  
  $("#btnO").click(function() {
    userRole = "O";    
    clearField();
    game.setStrangerMarker(markerType.o);    
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
    var firstPlayer = markerType.x;
    var winnerHighlightClass = "green-text text-accent-3";
    
    var winningPatterns = [
      //0x111000000, 0x000111000, 0x000000111, // rows
      448, 56, 7,
      //0x100100100, 0x010010010, 0x001001001, // cols
      292, 146, 73,
      //0x100010001, 0x001010100               // diagonals
      273, 84
    ];
    
    var winCombinationByPattern = {
      448: [[0, 0], [0, 1], [0, 2]],
      56: [[1, 0], [1, 1], [1, 2]],
      7: [[2, 0], [2, 1], [2, 2]],
      292: [[0, 0], [1, 0], [2, 0]],
      146: [[0, 1], [1, 1], [2, 1]],
      73: [[0, 2], [1, 2], [2, 2]],
      273: [[0, 0], [1, 1], [2, 2]],
      84: [[2, 0], [1, 1], [0, 2]]
    }
    
    self.setStrangerMarker = function(marker) {
      stranger.setMarker(marker);
      var aiMarker = marker == markerType.o ? markerType.x : markerType.o;
      ai.setMarker(aiMarker);
      
      if(aiMarker === firstPlayer) {
        var aiMove = ai.getNextMove();
        board.putMarker(aiMove, ai.myMarker);
        drawMarker(aiMove, ai.myMarker);
      }
    }
    
    self.onStrangerMove = function(position) {
      if (board.getMarker(position) == markerType.none) {
        board.putMarker(position, stranger.myMarker);
        drawMarker(position, stranger.myMarker);
        
        var isWin = checkIfWin(stranger.myMarker);
        if(isWin.hasWon) {
          alert(stranger.myMarker);
          highlightWin(isWin.winCombination);
          return;
        }
        
        var aiMove = ai.getNextMove();
        board.putMarker(aiMove, ai.myMarker);
        drawMarker(aiMove, ai.myMarker);
        
        isWin = checkIfWin(ai.myMarker);
        if(isWin.hasWon) {
          alert(ai.myMarker);
          highlightWin(isWin.winCombination);
          return;
        }
      }
    }
           
    function drawMarker(position, marker) {
      $('.s4[data-position="' + position[0] + '-' + position[1] + '"]').text(marker);
    }
    
    function highlightWin(winCombination) {
      for(var i = 0; i < winCombination.length; i++) {
        var coors = winCombination[i].join("-");
        $('.s4[data-position="' + coors + '"]').addClass(winnerHighlightClass).fadeOut(500).fadeIn(500);
      }
    }
    
    /** Returns true if thePlayer wins */
    function checkIfWin(playerMarker) {
      var pattern = 0;  // 9-bit pattern for the 9 cells
      for (var row = 0; row < board.rowsCount; row++) {
        for (var col = 0; col < board.colsCount; col++) {
          if (board.getMarker([row, col]) == playerMarker) {
            pattern |= (1 << (row * board.colsCount + col));
          }
        }
      }
      
      for (var i = 0, length = winningPatterns.length; i < length; i++) {
        var winningPattern = winningPatterns[i];
        if ((pattern & winningPattern) == winningPattern) {
          return {
            hasWon: true,
            winCombination: winCombinationByPattern[winningPattern]
          };
        }
      }
      return { hasWon: false };
    }; 
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
  }
  
  function Ai(board) {
    var self = this;
    var proto = new Player();
    $.extend(self, proto);
    self.board = board;    

    self.getNextMove = function() {
      var result = minimax(2, self.myMarker, -Number.MAX_VALUE, Number.MAX_VALUE);
      return [result[1], result[2]];   // row, col
    }
    
    function minimax(depth, marker, alpha, beta) {
      // Generate possible next moves in a list of int[2] of {row, col}.
      var nextMoves = generateMoves();
 
      // mySeed is maximizing; while oppSeed is minimizing
      var score;
      var bestRow = -1;
      var bestCol = -1;
 
      if (!nextMoves.length || depth == 0) {
         // Gameover or depth reached, evaluate score
         score = evaluate();
         return [score, bestRow, bestCol];
      } else {
         for (var i = 0, length = nextMoves.length; i < length; i++) {
          var move = nextMoves[i];
            // try this move for the current "player"
            self.board.putMarker(move, marker);
            if (marker == self.myMarker) {  // mySeed (computer) is maximizing player
               score = minimax(depth - 1, self.opponentMarker, alpha, beta)[0];
               if (score > alpha) {
                  alpha = score;
                  bestRow = move[0];
                  bestCol = move[1];
               }
            } else {  // oppSeed is minimizing player
               score = minimax(depth - 1, self.myMarker, alpha, beta)[0];
               if (score < beta) {
                  beta = score;
                  bestRow = move[0];
                  bestCol = move[1];
               }
            }
            // undo move
            self.board.putMarker(move, markerType.none);
            // cut-off
            if (alpha >= beta) {
              break;
            }
         }
         return [(marker == self.myMarker) ? alpha : beta, bestRow, bestCol];
      }
   }

    /** Find all valid next moves.
        Return List of moves in int[2] of {row, col} or empty list if gameover */
    function generateMoves() {
      var nextMoves = [];

      // If gameover, i.e., no next move
      /* if (self.hasWon(self.myMarker) || self.hasWon(self.opponentMarker)) {
        return nextMoves;   // return empty list
      } */

      // Search for empty cells and add to the List
      for (var row = 0; row < board.rowsCount; row++) {
        for (var col = 0; col < board.colsCount; col++) {
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
  }
  
  function Board() {
    var rowsCount = 3;
    var colsCount = 3;
    var cells = new Array(rowsCount);
       
    for(var row = 0; row < rowsCount; row++) {
      cells[row] = new Array(colsCount);
      for(var col = 0; col < colsCount; col++) {
        cells[row][col] = markerType.none;
      }
    }
    
    function putMarker(position, marker) {
      cells[position[0]][position[1]] = marker;  
    }
    
    function getMarker(position) {
      return cells[position[0]][position[1]];
    }    
        
    return {
      rowsCount: rowsCount,
      colsCount: colsCount,
      putMarker: putMarker,
      getMarker: getMarker
    };
  }
})();