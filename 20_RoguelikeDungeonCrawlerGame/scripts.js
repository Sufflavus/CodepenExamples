// http://afeld.github.io/emoji-css/
//http://gamedevelopment.tutsplus.com/tutorials/create-a-procedurally-generated-dungeon-cave-system--gamedev-10099
//http://bigbadwofl.me/random-dungeon-generator/

var cellType = {
  wall: 0,
  room: 1,
  corridor: 2
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

class DungeonGenerator {
  constructor() {
    this.size = {
      n: 100,
      m: 100
    };
    
    this.map = [];
    this.rooms = [];
    
    this.roomsCount = 30;
    this.minRoomSize = 7;
    this.maxRoomSize = 20;
  }
  
  generate() {
    this.clearMap();
    this.generateRooms();
    this.addRooms();
    this.addCorridors();
  }
  
  clearMap() {
    for (let i = 0; i < this.size.n; i++) {
      this.map[i] = [];
      for (let j = 0; j < this.size.m; j++) {
        this.map[i][j] = cellType.wall;
      }
    }
  }
  
  generateRooms() {
    for (let i = 0; i < this.roomsCount; i++) {
      let room = this.createRandomRoom();

      if (this.isRoomsIntersect(room)) {
        i--;
        continue;
      }     

      this.rooms.push(room);
    }
  }  
  
  addRooms() {
    var self = this;
    self.rooms.forEach(function(room) {
      for (let i = room.x0; i < room.x1; i++) {
        for (let j = room.y0; j < room.y1; j++) {
          self.map[i][j] = cellType.room;
        }
      }
    });    
  }  
  
  addCorridors() {
    for (let i = 0; i < this.roomsCount; i++) {
      var roomA = this.rooms[i];
      var roomB = this.findClosestRoom(roomA);

      var pointA = {
        x: getRandomInt(roomA.x0, roomA.x1),
        y: getRandomInt(roomA.y0, roomA.y1)
      };
      
      var pointB = {
        x: getRandomInt(roomB.x0, roomB.x1),
        y: getRandomInt(roomB.y0, roomB.y1)
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
  }
  
  findClosestRoom(room) {
    var middle = {
      x: room.x0 + ((room.x1 - room.x0) / 2),
      y: room.y0 + ((room.y1 - room.y0) / 2)
    };
    var closest = null;
    var closestDistance = 1000;
    for (var i = 0; i < this.roomsCount; i++) {
      var check = this.rooms[i];
      if (check == room) {
        continue;
      }
      var checkMiddle = {
        x: check.x0 + ((check.x1 - check.x0) / 2),
        y: check.y0 + ((check.y1 - check.y0) / 2)
      };
      var distance = Math.min(Math.abs(middle.x - checkMiddle.x) - ((room.x1 - room.x0) / 2) - ((check.x1 - check.x0) / 2), Math.abs(middle.y - checkMiddle.y) - ((room.y1 - room.y0) / 2) - ((check.y1 - check.y0) / 2));
      if (distance < closestDistance) {
        closestDistance = distance;
        closest = check;
      }
    }
    return closest;
  }
  
  createRandomRoom() {
    let x0 = getRandomInt(1, this.size.n - this.maxRoomSize);
    let y0 = getRandomInt(1, this.size.n - this.maxRoomSize);    
    let width = getRandomInt(this.minRoomSize, this.maxRoomSize);
    let height = getRandomInt(this.minRoomSize, this.maxRoomSize);
    
    return {      
      x0: x0,
      y0: y0,
      x1: x0 + width,
      y1: y0 + height
    };
  }
  
  isRoomsIntersect(room) {
    for (let i = 0; i < this.rooms.length; i++) {          
      var roomForCheck = this.rooms[i];
      if (!((room.x1 < roomForCheck.x0) || (room.x0 > roomForCheck.x1) || 
            (room.y1 < roomForCheck.y0) || (room.y0 > roomForCheck.y1))) {
        return true;
      } 
    }

    return false;
  }
}