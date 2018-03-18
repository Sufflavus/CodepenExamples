(function () {     
  class Rule {
    constructor(predecessor, successor) {
      this.predecessor = predecessor;
      this.successor = successor;
    }
    
    get dictionary() {
      return {
        [this.predecessor]: this.successor
      };
    }
  }
  
  class LSystem {
    constructor(axiom, rules) {
      this.axiom = axiom;
      this.rules = Object.assign({}, ...rules.map(r => r.dictionary));
    }
    
    generate(generationsCount) {
      let current = "" + this.axiom;
      let next = "";
      
      for(let i = 0; i < generationsCount; i++) {             
        for(let j = 0, length = current.length; j < length; j++) {
          let letter = current[j];
          let rule = this.rules[letter];
          next = next + (rule || letter);
        }   
        current = next;
        next = "";
      }
      
      return current;
    }
  }  
  
  class Turtle {
    constructor(length, theta) {
      this.length = length;
      this.theta = theta;
    }
    
    draw(sentence, containerSelector, startPoint, startAngle) {
      let route = this._generateRoute(sentence, startPoint, startAngle);
      
      let svgContainer = d3.select(containerSelector).append("svg")
        .attr("width", 600)
        .attr("height", 700);
      
      svgContainer.append("path")
        .attr("stroke", "#1D1F20")
        .attr("stroke-width", 1)
        .attr("fill", "none")
        .attr("d", route);
    }
    
    _generateRoute(sentence, startPoint, startAngle) {
      if (typeof startAngle === 'undefined') {
        startAngle = Math.PI/2;
      }
      
      let state = { x: startPoint.x, y: startPoint.y, theta: startAngle };
      let stack = [];
      let svg = ["M " + state.x + ", " + state.y];
      
      for(let j = 0, length = sentence.length; j < length; j++) {
          let letter = sentence[j];
          switch(letter) {
            case "F": // Draw a line and move forward
              state.x -= this.length * Math.cos(state.theta);
              state.y -= this.length * Math.sin(state.theta);
              svg.push("L " + state.x + ", " + state.y);
              break;
            case "+": // rotate(angle);
              state.theta += this.theta;
              break;
            case "-": // rotate(-angle);
              state.theta -= this.theta;
              break;
            case "[": // Save current location
              stack.push({...state});
              break;
            case "]": // Restore previous location
              state = stack.pop();
              svg.push("M" + state.x + "," + state.y);
              break;
            case "X": break;
          }
      }     
      
      return svg.join(" ");      
    }     
  }  
  
  function drawTree1() {
    let rule = new Rule("F", "FF+[+F-F-F]-[-F+F+F]");
    let lSystem = new LSystem("F", [rule]);
    let sentence = lSystem.generate(4);
    let turtle = new Turtle(12, 25 * Math.PI / 180);
    let startPoint = { x: 200, y:700 };
    let startAngle = Math.PI/2;
    turtle.draw(sentence, "#container1", startPoint, startAngle);
  }
  
  function drawTree2() {
    let rule1 = new Rule("X", "F-[[X]+X]+F[+FX]-X");
    let rule2 = new Rule("F", "FF");
    let lSystem = new LSystem("X", [rule1, rule2]);  
    let sentence = lSystem.generate(7);
    let turtle = new Turtle(2, 22.5 * Math.PI / 180);
    let startPoint = { x: 200, y:700 };
    let startAngle = Math.PI/2;
    turtle.draw(sentence, "#container2", startPoint, startAngle);
  }
  
  function drawTree3() {
    let rule1 = new Rule("X", "F[+X]F[-X]+X");
    let rule2 = new Rule("F", "FF");
    let lSystem = new LSystem("X", [rule1, rule2]);  
    let sentence = lSystem.generate(8);
    let turtle = new Turtle(1, 20 * Math.PI / 180);
    let startPoint = { x: 300, y:700 };
    let startAngle = Math.PI/2;
    turtle.draw(sentence, "#container3", startPoint, startAngle);
  }
  
  function drawTree4() {
    let rule1 = new Rule("X", "F[+X][-X]FX");
    let rule2 = new Rule("F", "FF");
    let lSystem = new LSystem("X", [rule1, rule2]);  
    let sentence = lSystem.generate(8);
    let turtle = new Turtle(1, 25.7 * Math.PI / 180);
    let startPoint = { x: 300, y:700 };
    let startAngle = Math.PI/2;
    turtle.draw(sentence, "#container3", startPoint, startAngle);
  }
  
  
  drawTree1();
  drawTree2();
  drawTree3();
  drawTree4();
})()