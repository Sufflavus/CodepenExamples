/* This project has not been finished yet */

var cellType = {
  wall: 0,
  room: 1,  
  player: 2,
  enemy: 3,
  boss: 4,
  health: 5,
  weapon: 6,
  door: 7
};

var cellClassNameByType = {
  0: "cell wall",
  1: "cell room",  
  2: "cell room",
  3: "cell room",
  4: "cell room",
  5: "cell room",
  6: "cell room",
  7: "cell room",
};

var iconClassNameByType = { 
  0: "em",
  1: "em",  
  2: "em em-sunglasses",
  3: "em em-japanese_ogre",
  4: "em em-smiling_imp",
  5: "em em-green_apple",
  6: "em em-gun",
  7: "em em-door",
};

var keyboardCode = {
  left: 37,
  up: 38,
  right: 39,
  down: 40
};

var weaponType = {
  0: "stick",
  1: "knife",
  2: "sword",
  3: "gun",
  4: "laser"
};

class Helper {
  static getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

class DungeonGenerator {
  constructor() {
    this.size = {
      n: 80,
      m: 80
    };
    
    this.map = [];
    this.rooms = [];
    
    this.roomsCount = 20;
    this.minRoomSize = 5;
    this.maxRoomSize = 15;
  }
  
  generate() {
    this._setInitialState();
    while(!this._generateRooms()) {    
      ;
    }        
    this._addCorridors();
    this._addRooms();
  }
  
  _setInitialState() {
    this._clearMap();
    this.rooms = [];
  }
  
  _clearMap() {
    this.map = [];
    for (let i = 0; i < this.size.n; i++) {
      this.map[i] = [];
      for (let j = 0; j < this.size.m; j++) {
        this.map[i][j] = cellType.wall;
      }
    }
  }
  
  _generateRooms() {
    this.rooms = [];
    const timeout = 200;
    var start = new Date().getTime();
    
    for (let i = 0; i < this.roomsCount; i++) {
      let room = this._createRandomRoom();

      if (this._isRoomsIntersect(room)) {
        var end = new Date().getTime();
        var time = end - start;
        
        if(time > timeout) {
          return false;
        }
        
        i--;
        continue;
      }     

      this.rooms.push(room);
    }
    return true;
  }  
  
  _addRooms() {
    var self = this;
    self.rooms.forEach(function(room) {
      for (let i = room.x0; i < room.x1; i++) {
        for (let j = room.y0; j < room.y1; j++) {
          self.map[i][j] = cellType.room;
        }
      }
    });    
  }  
  
  _addCorridors() {
    for (let i = 0; i < this.roomsCount; i++) {
      var room1 = this.rooms[i];
      if(room1.connectedWith.length >= 2) {
        continue;
      }
      
      var room2 = this._findClosestRoom(room1);      
      this._addCorridorBetweenTwoRooms(room1, room2);
      
      var room3 = this._findClosestRoom(room1);
      this._addCorridorBetweenTwoRooms(room1, room3);      
    }      
  }
  
  _addCorridorBetweenTwoRooms(room1, room2) {
    room1.connectedWith.push(room2);
    room2.connectedWith.push(room1);
    
    var point1 = {
      x: Helper.getRandomInt(room1.x1 - 1, room1.x0 + 1),
      y: Helper.getRandomInt(room1.y1 - 1, room1.y0 + 1)
    };

    var point2 = {
      x: Helper.getRandomInt(room2.x1 - 1, room2.x0 + 1),
      y: Helper.getRandomInt(room2.y1 - 1, room2.y0 + 1)
    };

    while ((point2.x != point1.x) || (point2.y != point1.y)) {
      if (point2.x != point1.x) {
        if (point2.x > point1.x) {
          point2.x--;
        } else {
          point2.x++;
        }
      } else if (point2.y != point1.y) {
        if (point2.y > point1.y) {
          point2.y--;
        }
        else {
          point2.y++;
        }
      }

      this.map[point2.x][point2.y] = cellType.room;
    }
  }
  
  _findClosestRoom(room) {
    let middle = {
      x: room.x0 + ((room.x1 - room.x0) / 2),
      y: room.y0 + ((room.y1 - room.y0) / 2)
    };
    let closestRoom = null;
    let closestDistance = 1000;
    for (let i = 0; i < this.roomsCount; i++) {
      let check = this.rooms[i];
      if (check == room || room.connectedWith.indexOf(check) >= 0) {
        continue;
      }
      let checkMiddle = {
        x: check.x0 + ((check.x1 - check.x0) / 2),
        y: check.y0 + ((check.y1 - check.y0) / 2)
      };
      let distance = Math.sqrt(Math.pow(middle.x - checkMiddle.x, 2) + Math.pow(middle.y - checkMiddle.y, 2));
      if (distance < closestDistance) {
        closestDistance = distance;
        closestRoom = check;
      }
    }
    return closestRoom;
  }   
  
  _createRandomRoom() {
    let x0 = Helper.getRandomInt(1, this.size.n - this.maxRoomSize);
    let y0 = Helper.getRandomInt(1, this.size.n - this.maxRoomSize);    
    let width = Helper.getRandomInt(this.minRoomSize, this.maxRoomSize);
    let height = Helper.getRandomInt(this.minRoomSize, this.maxRoomSize);
    
    return {      
      x0: x0,
      y0: y0,
      x1: x0 + width,
      y1: y0 + height,
      connectedWith: []
    };
  }
  
  _isRoomsIntersect(room) {
    for (let i = 0; i < this.rooms.length; i++) {          
      let roomForCheck = this.rooms[i];
      if (!((room.x1 + 1 < roomForCheck.x0) || (room.x0 > roomForCheck.x1 + 1) || 
            (room.y1 + 1 < roomForCheck.y0) || (room.y0 > roomForCheck.y1 + 1))) {
        return true;
      } 
    }

    return false;
  }
}

class Player {
  constructor() {
    this._setInitialState();
    this.coordinates = { x: -1, y: -1 };
  }
  
  fightWith(enemy) {    
    var userPower = ((this.level*100 + this.experience)/10)*(this.weapon.type + 1);
    var enemyPower = enemy.level;
    console.log(this.weapon.type)

    //var demage = Math.abs(userPower - enemyPower)*10;
        
    this.health -= enemyPower*2; 
    enemy.health -= userPower;
    
    /* if(userPower < enemyPower) {
      this.health -= enemyPower*10;      
    } else {
      enemy.health -= userPower*10;
    } */
    console.log("user: ", this.health)
    console.log("emeny: ", enemy.health)
        
    if(this.health >= 0) {      
      this.experience += enemy.level*2;
      if(this.experience >= 100) {
        this.level++;
        this.experience -= 100;
      }      
    }    
  }
  
  isAlife() {
    this.health >= 0;
  }
  
  _setInitialState() {
    this.level = 0;
    this.health = 100;
    this.weapon = new Weapon(0);
    this.experience = 40;
  }  
}

class Enemy {
  constructor(dungeonNumber) {        
    this.level = dungeonNumber * Helper.getRandomInt(5, 10);
    this.health = this.level * 5;
    this.coordinates = { x: -1, y: -1 };
  } 
  
  isAlife() {
    return this.health >= 0;
  }
}

class Boss {
  constructor() {        
    this.level = 60;
    this.health = 300;  
    this.coordinates = { x: -1, y: -1 };
  }
  
  isAlife() {
    this.health >= 0;
  }
}

class HealthItem {
  constructor() {    
    this.value = 20;  
    this.coordinates = { x: -1, y: -1 };
  }
}

class Weapon {
  constructor(type) {    
    this.value = type*10;  
    this.type = type;
    this.name = weaponType[this.type];
    this.coordinates = { x: -1, y: -1 };
  }
}

class Door {
  constructor() {
    this.coordinates = { x: -1, y: -1 };
  }
}

class Game {
  constructor() {    
    this.dungeonsCount = 4;
    this.dungeonGenerator = new DungeonGenerator(); 
    
    this.map = this.dungeonGenerator.map;  
    this.size = this.dungeonGenerator.size;
    this.rooms = this.dungeonGenerator.rooms;        
    this.roomsCount = this.dungeonGenerator.roomsCount;
    
    this.player = new Player();   
    
    this.settings = {
      dungeonNumber: 1,
      enemiesCount: 10,
      healthItemsCount: 10,
      weaponsCount: 1,
      doorsCount: 1      
    };     
    
    this.entitiesOnMap = [];
    
    this.enemies = [];    
    this.healthItems = [];
    this.weapons = [];
    this.doors = [];
    this.boss = null;
    
    this.player = new Player();
    this._generateField();        
  }
  
  movePlayer(direction) {     
    let coordinates = this._getNewUserCoordinates(direction);
    let x = coordinates.x;
    let y = coordinates.y;    

    if(this.map[x][y] == cellType.room) {
      this._doMoveUser(coordinates);
    } else if(this.map[x][y] == cellType.health) {      
      var healtItem = this.entitiesOnMap[x][y];
      this.player.health += healtItem.value;
      this.entitiesOnMap[x][y] = null;
      this._doMoveUser(coordinates);
    } else if(this.map[x][y] == cellType.weapon) {      
      var weapon = this.entitiesOnMap[x][y];
      this.player.weapon = weapon;
      console.log(weapon)
      console.log(this.player.weapon)
      this.entitiesOnMap[x][y] = null;
      this._doMoveUser(coordinates);
    } else if(this.map[x][y] == cellType.door) {       
      this.settings.dungeonNumber++;
      this._generateField();
    } else if(this.map[x][y] == cellType.enemy) {       
      var enemy = this.entitiesOnMap[x][y];
      this.player.fightWith(enemy);
      console.log(enemy)
      if(!enemy.isAlife()) {
        this.entitiesOnMap[x][y] = null;
        this._doMoveUser(coordinates);
      }
    }        
  }
  
  _getNewUserCoordinates(direction) {
    let x = this.player.coordinates.x;
    let y = this.player.coordinates.y;
    switch (direction) {
      case keyboardCode.right:
        x++;
        break;
      case keyboardCode.left:
        x--;
        break;
      case keyboardCode.up:
        y++;
        break;
      case keyboardCode.down:
        y--;
        break;
    }
    
    if(x < 0) {
      x = 0;
    } else if(x >= this.size.n) {
      x = this.size.n - 1;
    }
    
    if(y < 0) {
      y = 0;
    } else if(y >= this.size.m) {
      y = this.size.m - 1;
    }
    
    return {
      x: x,
      y: y
    };
  }
  
  _doMoveUser(newCoordinates) {
    this.map[this.player.coordinates.x][this.player.coordinates.y] = cellType.room;
    this.player.coordinates.x = newCoordinates.x;
    this.player.coordinates.y = newCoordinates.y;
    this.map[newCoordinates.x][newCoordinates.y] = cellType.player;
  }
  
  _generateField() {
    this.dungeonGenerator.generate();
    this.map = this.dungeonGenerator.map;  
    this.rooms = this.dungeonGenerator.rooms;
    this._addEnemies();
    this._addHealthItems();
    this._addWeapons();
    this._addDoors();
    this._putEntitiesOnMap();
    this.player.coordinates = this._findAvailablePointInRoom();
    this.map[this.player.coordinates.x][this.player.coordinates.y] = cellType.player;
  }
     
  _putEntitiesOnMap() {    
    for(let i = 0; i < this.size.n; i++) {
      this.entitiesOnMap[i] = [];
      for(let j = 0; j < this.size.m; j++) {
        this.entitiesOnMap[i][j] = null;
      }
    }
    
    this.enemies.forEach(entity => {
      this.entitiesOnMap[entity.coordinates.x][entity.coordinates.y] = entity;
    });    
    this.healthItems.forEach(entity => {
      this.entitiesOnMap[entity.coordinates.x][entity.coordinates.y] = entity;
    });    
    this.weapons.forEach(entity => {
      this.entitiesOnMap[entity.coordinates.x][entity.coordinates.y] = entity;
    });    
    this.doors.forEach(entity => {
      this.entitiesOnMap[entity.coordinates.x][entity.coordinates.y] = entity;
    });   
    
    if(this.boss) {
      this.entitiesOnMap[this.boss.coordinates.x][this.boss.coordinates.y] = this.boss;
    }    
  }
  
  _addEnemies() {
    this.enemies = [];
    for(let i = 0; i < this.settings.enemiesCount; i++) {      
      let enemy = this._createEnemy();
      this.enemies.push(enemy);
      this.map[enemy.coordinates.x][enemy.coordinates.y] = cellType.enemy;
    }
    
    // add boss if it is the last one dungeon
    if(this.settings.dungeonNumber === this.dungeonsCount) {
      this.boss = this._createBoss();
      this.map[this.boss.coordinates.x][this.boss.coordinates.y] = cellType.boss;       
    }
  } 
  
  _addHealthItems() {
    this.healthItems = [];
    for(let i = 0; i < this.settings.healthItemsCount; i++) {      
      let health = this._createHealthItem();
      this.healthItems.push(health);
      this.map[health.coordinates.x][health.coordinates.y] = cellType.health;
    }
  }
  
  _addWeapons() {
    this.weapons = [];
    for(let i = 0; i < this.settings.weaponsCount; i++) {      
      let weapon = this._createWeapon();
      this.weapons.push(weapon);
      this.map[weapon.coordinates.x][weapon.coordinates.y] = cellType.weapon;
    }
  }
  
  _addDoors() {
    this.doors = [];
    
    // do not add door if it is the last one dungeon
    if(this.settings.dungeonNumber === this.dungeonsCount) {
      return;
    }
    
    for(let i = 0; i < this.settings.doorsCount; i++) {      
      let door = this._createDoor();
      this.doors.push(door);
      this.map[door.coordinates.x][door.coordinates.y] = cellType.door;
    }
  }
  
  _createEnemy() {
    let enemy = new Enemy(this.settings.dungeonNumber);
    enemy.coordinates = this._findAvailablePointInRoom();
    return enemy;  
  }
  
  _createBoss() {
    let boss = new Boss();   
    boss.coordinates = this._findAvailablePointInRoom();
    return boss;
  }  
  
  _createHealthItem() {
    let health = new HealthItem();
    health.coordinates = this._findAvailablePointInRoom();
    return health;  
  }
  
  _createWeapon() {
    console.log(this.player.weapon.type)
    let weapon = new Weapon(this.player.weapon.type + 1);
    weapon.coordinates = this._findAvailablePointInRoom();
    return weapon;  
  }
  
  _createDoor() {
    let door = new Door();
    
    while(true) {          
      let coordinates = this._findAvailablePointInRoom();
      let x = coordinates.x;
      let y = coordinates.y;  
      if(this._isCellCanBeOccupied({ x: x - 1, y: y }) && 
         this._isCellCanBeOccupied({ x: x + 1, y: y }) &&
         this._isCellCanBeOccupied({ x: x, y: y - 1 }) &&
         this._isCellCanBeOccupied({ x: x, y: y + 1 })) {
        door.coordinates = coordinates;
        return door;
      }
    }    
  }
  
  _findAvailablePointInRoom() {
    while(true) {       
      let roomIndex = Helper.getRandomInt(0, this.roomsCount - 1);
      let room = this.rooms[roomIndex];
      let coordinates = {
        x: Helper.getRandomInt(room.x0, room.x1),
        y: Helper.getRandomInt(room.y0, room.y1)
      };      
      if(this._isCellCanBeOccupied(coordinates)) {        
        return coordinates;
      }
    }
  }
  
  _isCellCanBeOccupied(coordinates) {
    return this.map[coordinates.x][coordinates.y] === cellType.room;
  }
}

class GameCamera {
  constructor(mapSize, cameraSize) {
    this.mapSize = mapSize;   
    this.cameraSize = cameraSize;
    
    this.cameraRectangle = {
      x0: 0,
      y0: 0,
      x1: this.cameraSize.n,
      y1: this.cameraSize.m
    };
  }
  
  focusOnPlayer(coordinates) {
    let x = parseInt(coordinates.x - this.cameraSize.n/2);
    let y = parseInt(coordinates.y - this.cameraSize.m/2);
    
    if(x < 0){
      x = 0;
    } else if (x > this.mapSize.n - this.cameraSize.n) {
      x = this.mapSize.n - this.cameraSize.n;
    }
    
    if(y < 0) {
      y = 0;
    } else if (y > this.mapSize.m - this.cameraSize.m) {
      y = this.mapSize.m - this.cameraSize.m;
    }
    
    this.cameraRectangle = {
      x0: x,
      y0: y,
      x1: x + this.cameraSize.n,
      y1: y + this.cameraSize.m
    };
  }
}

var Cell = React.createClass({  
  render: function() {
    return (
      <div id={this.props.id} className={cellClassNameByType[this.props.type]}>
        <i className={iconClassNameByType[this.props.type]}/>
      </div>
    );
  }
});

var Row = React.createClass({  
  render: function() {
    var cells = this.props.cells.map((cell, index) => (
      <Cell type={cell} key={index}/>
    ));
    return (
      <div id={this.props.id} className="row">
        {cells}
      </div>
    );
  }
});

var Board = React.createClass({    
  render: function() {    
    var rows = this.props.rows.map((row, index) => (
      <Row cells={row} key={index}/>
    ));
    return (
      <div className="camera">
        {rows}
      </div>
    );
  }
});

var ScorePanel = React.createClass({
  render: function() {
    return (
      <div className="score-panel">
        <span className="score-item">Health: <span>{this.props.health}</span></span>
        <span className="score-item">Weapon: <span>{this.props.weapon}</span></span>
        <span className="score-item">Level: <span>{this.props.level}</span></span>
        <span className="score-item">XP: <span>{this.props.experience}</span></span>
        <span className="score-item">Dungeon:  <span>{this.props.dungeon}</span></span>
      </div>
  )}
});

var Field = React.createClass({  
  getInitialState: function() {             
    return this.initGameDefaultState();
  },
  initGameDefaultState: function() {
    var game = new Game();
    var cameraSize = { n: 30, m: 30 };    
    var camera = new GameCamera(game.size, cameraSize);    
    camera.focusOnPlayer(game.player.coordinates);
    
    var score = {
      health: game.player.health,
      weapon: game.player.weapon.name,
      level: game.player.level,
      experience: game.player.experience,
      dungeon: game.settings.dungeonNumber,
    };

    return { 
      game: game,
      map: game.map,
      camera: camera,
      score: score
    };
  },
  componentDidMount: function() {
    $(document.body).on("keydown", this.handleKeyDown);
    //$(document.body).focus();
  },
  handleKeyDown: function(e) {    
    if(e.keyCode < keyboardCode.left || e.keyCode > keyboardCode.down ||
      this.state.game.player.health < 0 || 
      this.state.game.boss && this.state.game.boss.health < 0) {
      return;
    }
    e.preventDefault();
    var game = this.state.game;    
    game.movePlayer(e.keyCode);
    this.state.camera.focusOnPlayer(game.player.coordinates);      
    this.setState({ 
      map: game.map,
      score: {
        health: game.player.health,
        weapon: game.player.weapon.name,
        level: game.player.level,
        experience: game.player.experience,
        dungeon: game.settings.dungeonNumber,
      }
    }); 
    if(game.player.health < 0) {
      var self = this;
      $("#overlay").fadeIn("fast", function() {
        $("#loseMessage")
          .slideToggle("slow", "swing")
          .delay(3000)
          .fadeOut("fast", function() {
            $("#overlay").fadeOut("fast", function() {
              var state = self.initGameDefaultState();
              self.state.camera.focusOnPlayer(game.player.coordinates);      
              self.setState(state);
            });
        })
      });
    } else if(game.boss && game.boss.health < 0) {
      var self = this;
      $("#overlay").fadeIn("fast", function() {
        $("#winMessage")
          .slideToggle("slow", "swing")
          .delay(3000)
          .fadeOut("fast", function() {
            $("#overlay").fadeOut("fast",  function() {
              var state = self.initGameDefaultState();
              self.state.camera.focusOnPlayer(game.player.coordinates);      
              self.setState(state);
            });
        })
      });
    }
  },
  render: function() {
    var map = this.state.map;
    var mapInCamera = [];
    var cameraRectangle = this.state.camera.cameraRectangle;
    var i = 0;
    for(var x = cameraRectangle.x0; x < cameraRectangle.x1; x++) {
      mapInCamera[i] = [];
      let j = 0;
      for(var y = cameraRectangle.y0; y < cameraRectangle.y1; y++) {
        mapInCamera[i][j] = map[x][y];
        j++;
      }
      i++;
    }
    
    var rows = [];
    for (var i = 0, m = this.state.camera.cameraSize.m; i < m; i++) {
      rows[i] = [];
      for (var j = 0, n = this.state.camera.cameraSize.n; j < n; j++) {
        rows[i][j] = mapInCamera[j][n - i - 1];
      }
    }

    return (
      <div>
        <ScorePanel 
          health={this.state.score.health}
          weapon={this.state.score.weapon}
          level={this.state.score.level}
          experience={this.state.score.experience}
          dungeon={this.state.score.dungeon}>
        </ScorePanel>
        <Board rows={rows} />         
      </div>
    );
  }
});

ReactDOM.render(
  <Field />,
  document.getElementById("container")
);