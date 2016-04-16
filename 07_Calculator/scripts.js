(function() {
  var $result = $("#result");
  
  var expression = {
    left: "",
    right: "",
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
        var newText;
        if(expression.operation && !expression.right) {
          newText = text;
        } else {
          newText = $result.text() + text;
        }        
        $result.text(newText);
        break;
      case ".":          
        if(expression.operation && !expression.right) {
          $result.text(text);
        } else {
          if($result.text().indexOf(".") < 0) {
            var newText = $result.text() + text;
            $result.text(newText);
          }            
        }                 
        break;
      case "+": 
      case "-":     
      case "X":  
      case "/":        
        saveInputToExpression();
        if(expression.right) {
          calculateExpression();          
        }
        expression.operation = text;
        $result.text(expression.left);        
        break;
      case "=":        
        saveInputToExpression();
        if(expression.right) {
          calculateExpression();
          $result.text(expression.left);
        } else {
          setDefaultExpression();
        }
        break;
      case "AC":
        setDefaultExpression();
        $result.text(expression.right);
        break;
      case "CE":
        var newText = $result.text();        
        $result.text(newText.substring(0, newText.length - 1));        
        break;
      default:
        break;
    }    
    console.log(text)
  }); 
  
  function setDefaultExpression() {
    expression = {
      left: "",
      right: "",
      operation: ""
    };
  }
  
  function saveInputToExpression() {
    if(expression.operation) { 
      expression.right = $result.text();
    } else {
      expression.left = $result.text();
    }
  }
  
  function calculateExpression() {    
    var result = 0;
    var operandLeft = Number.parseFloat(expression.left);
    var operandRight = Number.parseFloat(expression.right);
    switch (expression.operation) {
      case "+": 
        result = operandLeft + operandRight;
        break;
      case "-": 
        result = operandLeft - operandRight;
        break;
      case "*": 
        result = operandLeft * operandRight;
        break;
      case "/": 
        result = operandLeft / operandRight;
        break;
    }  
    setDefaultExpression();
    expression.left = result;
  }
})();