// http://afeld.github.io/emoji-css/
//http://gamedevelopment.tutsplus.com/tutorials/create-a-procedurally-generated-dungeon-cave-system--gamedev-10099
//http://bigbadwofl.me/random-dungeon-generator/
// https://jsfiddle.net/Lt3fsdau/4/

var cellType = {
  wall: 0,
  room: 1,
  corridor: 2,
  player: 3,
  enemy: 4,
  boss: 5,
  health: 6,
  weapon: 7,
  door: 8
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
    var timeout = 200;
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
    
    var pointA = {
      x: Helper.getRandomInt(room1.x1 - 1, room1.x0 + 1),
      y: Helper.getRandomInt(room1.y1 - 1, room1.y0 + 1)
    };

    var pointB = {
      x: Helper.getRandomInt(room2.x1 - 1, room2.x0 + 1),
      y: Helper.getRandomInt(room2.y1 - 1, room2.y0 + 1)
    };

    while ((pointB.x != pointA.x) || (pointB.y != pointA.y)) {
      if (pointB.x != pointA.x) {
        if (pointB.x > pointA.x) {
          pointB.x--;
        } else {
          pointB.x++;
        }
      } else if (pointB.y != pointA.y) {
        if (pointB.y > pointA.y) {
          pointB.y--;
        }
        else {
          pointB.y++;
        }
      }

      this.map[pointB.x][pointB.y] = cellType.corridor;
    }
  }
  
  _findClosestRoom(room) {
    var middle = {
      x: room.x0 + ((room.x1 - room.x0) / 2),
      y: room.y0 + ((room.y1 - room.y0) / 2)
    };
    var closestRoom = null;
    var closestDistance = 1000;
    for (var i = 0; i < this.roomsCount; i++) {
      var check = this.rooms[i];
      if (check == room || room.connectedWith.indexOf(check) >= 0) {
        continue;
      }
      var checkMiddle = {
        x: check.x0 + ((check.x1 - check.x0) / 2),
        y: check.y0 + ((check.y1 - check.y0) / 2)
      };
      var distance = Math.sqrt(Math.pow(middle.x - checkMiddle.x, 2) + Math.pow(middle.y - checkMiddle.y, 2));
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
      var roomForCheck = this.rooms[i];
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
  
  _setInitialState() {
    this.level = 0;
    this.health = 100;
    this.weapon = 1;
    this.xp = 0;
  }
}

class Enemy {
  constructor(dungeonNumber) {        
    this.level = dungeonNumber * Helper.getRandomInt(5, 10);
    this.health = this.level * 5;
    this.coordinates = { x: -1, y: -1 };
  }   
}

class Boss {
  constructor() {        
    this.level = 60;
    this.health = 300;  
    this.coordinates = { x: -1, y: -1 };
  }
}

class HealthItem {
  constructor() {    
    this.value = 20;  
    this.coordinates = { x: -1, y: -1 };
  }
}

class Weapon {
  constructor(dungeonNumber) {    
    this.value = dungeonNumber*10;  
    this.name = "name";
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
    this.dungeonNumber = 1;
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
    
    this.enemies = [];    
    this.healthItems = [];
    this.weapons = [];
    this.doors = [];
    this.boss = null;
    
    this.dungeonNumber = 1;   
     this.player = new Player();
    this._setInitialState();        
  }
  
  _setInitialState() {
    this.dungeonGenerator.generate();
    this.map = this.dungeonGenerator.map;  
    this.rooms = this.dungeonGenerator.rooms;
    this._addEnemies();
    this._addHealthItems();
    this._addWeapons();
    this._addDoors();
    this.player.coordinates = this._findAvailablePointInRoom();
    this.map[this.player.coordinates.x][this.player.coordinates.y] = cellType.player;
  }
  
  _addEnemies() {
    this.enemies = [];
    for(let i = 0; i < this.settings.enemiesCount; i++) {      
      let enemy = this._createEnemy();
      this.enemies.push(enemy);
      this.map[enemy.coordinates.x][enemy.coordinates.y] = cellType.enemy;
    }
    
    // add boss if it is the last one dungeon
    if(this.dungeonNumber === this.dungeonsCount) {
      this.boss = _createBoss();
      this.map[boss.coordinates.x][boss.coordinates.y] = cellType.boss;      
      this.map[boss.coordinates.x + 1][boss.coordinates.y] = cellType.boss;
      this.map[boss.coordinates.x + 1][boss.coordinates.y + 1] = cellType.boss;
      this.map[boss.coordinates.x][boss.coordinates.y + 1] = cellType.boss;
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
    for(let i = 0; i < this.settings.doorsCount; i++) {      
      let door = this._createDoor();
      this.doors.push(door);
      this.map[door.coordinates.x][door.coordinates.y] = cellType.door;
    }
  }
  
  _createEnemy() {
    let enemy = new Enemy(this.dungeonNumber);
    enemy.coordinates = this._findAvailablePointInRoom();
    return enemy;  
  }
  
  _createBoss() {
    let boss = new Boss();   
    
    while(true) {          
      let coordinates = this._findAvailablePointInRoom();
      let x = coordinates.x;
      let y = coordinates.y;  
      if(this._isCellCanBeOccupied({ x: x + 1, y: y }) && 
         this._isCellCanBeOccupied({ x: x + 1, y: y + 1 }) &&
         this._isCellCanBeOccupied({ x: x, y: y + 1 })) {
        boss.coordinates = coordinates;
        return boss;
      }
    }
  }  
  
  _createHealthItem() {
    let health = new HealthItem();
    health.coordinates = this._findAvailablePointInRoom();
    return health;  
  }
  
  _createWeapon() {
    let weapon = new Weapon();
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

var game = new Game();
var $board = $("#board");
game.map.forEach(row => {
  var $row = $("<div/>", {        
    class: "row"
  }).appendTo($board);

  row.forEach(cell => {
    var className = "cell";
    if(cell === cellType.wall) {
      className = className + " wall";
    } else if(cell === cellType.room) {
      className = className + " room";
    } else if(cell === cellType.corridor) {
      className = className + " corridor";
    } else {
      className = className + " room";
    }
    var $cell = $("<div/>", {
      class: className
    }).appendTo($row);
    
    var itemClass = "em";
    if(cell === cellType.player) {
      itemClass = itemClass + " em-sunglasses";
    } else if(cell === cellType.enemy) {
      itemClass = itemClass + " em-japanese_ogre";
    } else if(cell === cellType.boss) {
      itemClass = itemClass + " em-japanese_ogre";
    } else if(cell === cellType.health) {
      itemClass = itemClass + " em-ambulance";
    } else if(cell === cellType.weapon) {
      itemClass = itemClass + " em-gun";
    } else if(cell === cellType.door) {
      itemClass = itemClass + " em-door";
    }
    var $i = $("<i/>", {
      class: itemClass
    }).appendTo($cell);    
  });  
})

//console.log(g.map)

/* var d = new DungeonGenerator();
for(var i = 0; i < 10; i++) {  
  var start = new Date().getTime();
  d.generate();
  var end = new Date().getTime();
  console.log(end-start);
} */
