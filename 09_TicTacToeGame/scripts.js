(function() {        
  var markerType = {
    x: "X",
    o: "O",
    none: "none"
  };
  
  var game = new Game();
  drawBoard(game.board);
        
  $("#roleChooser").openModal({
    dismissible: false, // Modal can be dismissed by clicking outside of the modal
    opacity: .5, // Opacity of modal background
    in_duration: 300, 
    out_duration: 300,    
  });
  
  $("#btnX").click(function() {    
    game.initPlayerMarkers(markerType.x);    
  });
  
  $("#btnO").click(function() {    
    game.initPlayerMarkers(markerType.o);    
  });
  
  $(".s4").click(function() {
    var element = $(this).children().first();
    if(!element.text()) {             
      var position = element.data("position").split("-");
      game.onStrangerMove([+position[0], +position[1]]);
    }
  });   
  
  function drawBoard(board) {
    var $board = $("#board");

    for (var row = 0; row < board.rowsCount; row++) {
      var $row = $("<div/>", {        
        class: "row" + (row == board.rowsCount - 1 ? "" : " bordered")
      }).appendTo($board);

      for (var col = 0; col < board.colsCount; col++) {
        var $cell = $("<div/>", {        
          class: "col s4 center-align waves-effect waves-green" + (col == board.colsCount - 1 ? "" : " bordered")         
        }).appendTo($row);
        var content = $("<span/>", {                 
          attr: {
            "data-position": row + "-" + col
          }
        }).text((row + col) % 2 == 0 ? markerType.x : markerType.o).appendTo($cell);
      }
    }
  }
  
  function Game() {
    var self = this;
    var board = new Board();
    var stranger = new Stranger();
    var ai = new Ai(board);    
    var winnerHighlightClass = "green-text text-accent-3";
    
    self.board = board;
    
    self.initPlayerMarkers = function(strangerMarker) {
      stranger.initMarker(strangerMarker);
      stranger.isFirstPlayer = strangerMarker == markerType.x;
      
      var aiMarker = strangerMarker == markerType.o ? markerType.x : markerType.o;
      ai.initMarker(aiMarker); 
      ai.isFirstPlayer = !stranger.isFirstPlayer;
      
      restart(); 
    }
    
    self.onStrangerMove = function(position) {
      if (board.isFieldEmpty(position)) {
        board.setMarker(position, stranger.myMarker);
        drawMarker(position, stranger.myMarker);
        
        var isWin = board.checkIfWin(stranger.myMarker);
        if(isWin.hasWon) {          
          highlightWin(isWin.winCombination);
          setTimeout(restart, 2000);          
          return;
        }
        
        if(!board.hasEmptyFields()) {
          setTimeout(restart, 2000);    
          return;
        }
        
        var aiMove = ai.getNextMove();
        board.setMarker(aiMove, ai.myMarker);
        drawMarker(aiMove, ai.myMarker);
        
        isWin = board.checkIfWin(ai.myMarker);
        if(isWin.hasWon) {          
          highlightWin(isWin.winCombination);
          setTimeout(restart, 2000);    
          return;
        }
        
        if(!board.hasEmptyFields()) {
          setTimeout(restart, 2000);
          return;
        }
      }
    }       
    
    function restart() {
      clearField();
      if(ai.isFirstPlayer) {
        var aiMove = ai.getNextMove();
        board.setMarker(aiMove, ai.myMarker);
        drawMarker(aiMove, ai.myMarker);
      }
    }
           
    function drawMarker(position, marker) {
      $('.s4 span[data-position="' + position[0] + '-' + position[1] + '"]').hide().text(marker).fadeIn(1000);
    }
    
    function clearField() {
      board.clear();
      $(".s4 span").each(function() {
        $(this).fadeOut(1000).removeClass(winnerHighlightClass).text("").show();
      });
    } 
    
    function highlightWin(winCombination) {      
      for(var i = 0; i < winCombination.length; i++) {
        var coors = winCombination[i].join("-");
        $('.s4 span[data-position="' + coors + '"]').addClass(winnerHighlightClass);
      }
    }      
  } 
  
  function Player() {
    var self = this;
    self.myMarker = markerType.none; 
    self.opponentMarker = markerType.none;   
    self.isFirstPlayer = false;
                  
    self.initMarker = function(marker) {
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
      // the algorithm is based on article http://www3.ntu.edu.sg/home/ehchua/programming/java/javagame_tictactoe_ai.html
      var result = minimax(2, self.myMarker, -Number.MAX_VALUE, Number.MAX_VALUE);
      return [result[1], result[2]];   // row, col
    }
    
    function minimax(depth, marker, alpha, beta) {
      // Generate possible next moves in a list of int[2] of {row, col}.
      var nextMoves = generateMoves();
 
      // myMarker is maximizing; while opponentMarker is minimizing
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
            self.board.setMarker(move, marker);
            if (marker == self.myMarker) {  // myMarker (computer) is maximizing player
               score = minimax(depth - 1, self.opponentMarker, alpha, beta)[0];
               if (score > alpha) {
                  alpha = score;
                  bestRow = move[0];
                  bestCol = move[1];
               }
            } else {  // opponentMarker is minimizing player
               score = minimax(depth - 1, self.myMarker, alpha, beta)[0];
               if (score < beta) {
                  beta = score;
                  bestRow = move[0];
                  bestCol = move[1];
               }
            }
            // undo move
            self.board.setMarker(move, markerType.none);
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

      // Search for empty cells and add to the List
      for (var row = 0; row < board.rowsCount; row++) {
        for (var col = 0; col < board.colsCount; col++) {
          if (self.board.isFieldEmpty([row, col])) {
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
        if (score == 1) {   // cell1 is myMarker
          score = 10;
        } else if (score == -1) {  // cell1 is opponentMarker
          return 0;
        } else {  // cell1 is empty
          score = 1;
        }
      } else if (self.board.getMarker([row2, col2]) == self.opponentMarker) {
        if (score == -1) { // cell1 is opponentMarker
          score = -10;
        } else if (score == 1) { // cell1 is myMarker
          return 0;
        } else {  // cell1 is empty
          score = -1;
        }
      }

      // Third cell
      if (self.board.getMarker([row3, col3]) == self.myMarker) {
        if (score > 0) {  // cell1 and/or cell2 is myMarker
          score *= 10;
        } else if (score < 0) {  // cell1 and/or cell2 is opponentMarker
          return 0;
        } else {  // cell1 and cell2 are empty
          score = 1;
        }
      } else if (self.board.getMarker([row3, col3]) == self.opponentMarker) {
        if (score < 0) {  // cell1 and/or cell2 is opponentMarker
          score *= 10;
        } else if (score > 1) {  // cell1 and/or cell2 is myMarker
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
        
    var winCombinations = [
      [[0, 0], [0, 1], [0, 2]],  // row 0
      [[1, 0], [1, 1], [1, 2]],  // row 1
      [[2, 0], [2, 1], [2, 2]],  // row 2
      [[0, 0], [1, 0], [2, 0]],  // col 0
      [[0, 1], [1, 1], [2, 1]],  // col 1
      [[0, 2], [1, 2], [2, 2]],  // col 2
      [[0, 0], [1, 1], [2, 2]],  // diagonal
      [[2, 0], [1, 1], [0, 2]]   // alternate diagonal
    ];    
    
    for(var row = 0; row < rowsCount; row++) {
      cells[row] = new Array(colsCount);
      for(var col = 0; col < colsCount; col++) {
        cells[row][col] = markerType.none;
      }
    }
    
    function isFieldEmpty(position) {
      return cells[position[0]][position[1]] == markerType.none;
    }
    
    function setMarker(position, marker) {
      cells[position[0]][position[1]] = marker;  
    }
    
    function getMarker(position) {
      return cells[position[0]][position[1]];
    }   
    
    /** Returns true if thePlayer wins */
    function checkIfWin(playerMarker) { 
      for(var i = 0, length = winCombinations.length; i < length; i++) {
        var combination = winCombinations[i];
        var hasWon = combination.every(function(coors) {
          return getMarker(coors) == playerMarker;
        });
        if(hasWon) {
          return {
            hasWon: true,
            winCombination: combination
          };
        }
      }  
      return { hasWon: false };      
    }; 
    
    function hasEmptyFields() {
      for (var row = 0; row < rowsCount; row++) {
        for (var col = 0; col < colsCount; col++) {
          if (isFieldEmpty([row, col])) {
            return true;
          }
        }
      }
      return false;
    }
    
    function clear() {
      for(var row = 0; row < rowsCount; row++) {        
        for(var col = 0; col < colsCount; col++) {
          cells[row][col] = markerType.none;
        }
      }
    }
        
    return {
      rowsCount: rowsCount,
      colsCount: colsCount,
      isFieldEmpty: isFieldEmpty,
      setMarker: setMarker,
      getMarker: getMarker,
      checkIfWin: checkIfWin,
      hasEmptyFields: hasEmptyFields,
      clear: clear
    };
  }
})();