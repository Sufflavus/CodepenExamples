(function() {
  var $result = $("#result");
  
  var operations = {
    add: "+",
    subtract: "-",
    multiply: "X",
    divide: "/",
    equal: "="
  };
  
  var expression = {
    left: 0,
    right: 0,
    operation: ""
  };
  
  $("a").click(function() {
    var text = $(this).text();  
    
    switch (text) {
      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        if(!expression.operation) {
          expression.left = expression.left * 10 + (+text);
          $result.text(expression.left);
        } else {
          expression.right = expression.right * 10 + (+text);
          $result.text(expression.right);
        }
        break;
      case "+": 
      case "-":     
      case "X":  
      case "/":
        if(expression.right) {
          calculateExpression();
          $result.text(expression.left);
        }
        expression.operation = text;
        break;
      case "=":
        if(expression.right) {
          calculateExpression();
          $result.text(expression.left);
        } else {
          expression = {
            left: 0,
            right: 0,
            operation: ""
          };
        }
        break;
      case "AC":
        expression = {
          left: 0,
          right: 0,
          operation: ""
        };
      case "CE":
        if(expression.operation) {          
          expression.right = expression.right - expression.right % 10;
          expression.right = expression.right/10;
          $result.text(expression.right);
        } else {          
          expression.left = expression.left - expression.left % 10;
          expression.left = expression.left/10;
          $result.text(expression.left);
        }
        break;
      default:
        break;
    }
    
    //$result.text(text);
    console.log(text)
  }); 
  
  function calculateExpression() {    
    var result = 0;
    switch (expression.operation) {
      case operations.add: 
        result = expression.left + expression.right;
        break;
      case operations.subtract: 
        result = expression.left - expression.right;
        break;
      case operations.multiply: 
        result = expression.left * expression.right;
        break;
      case operations.divide: 
        result = expression.left / expression.right;
        break;
    }  
    expression = {
      left: result,
      right: 0,
      operation: ""
    };
  }
})();