// http://afeld.github.io/emoji-css/
//http://gamedevelopment.tutsplus.com/tutorials/create-a-procedurally-generated-dungeon-cave-system--gamedev-10099
//http://bigbadwofl.me/random-dungeon-generator/

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

class DungeonGenerator {
  constuctor() {
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
    this.addRooms();
    this.addCorridors();
  }
  
  clearMap() {
    for (let i = 0; i < this.size.n; i++) {
      this.map[i] = [];
      for (let j = 0; j < this.size.m; j++) {
        this.map[i][j] = 0;
      }
    }
  }
  
  addRooms() {
    for (let i = 0; i < this.roomsCount; i++) {
      let room = creareRandomRoom();

      if (this.isRoomsIntersect(room)) {
        i--;
        continue;
      }     

      this.rooms.push(room);
    }
  }  
  
  addCorridors() {}
  
  creareRandomRoom() {
    return {
      x: getRandomInt(1, this.size.n - this.maxRoomSize),
      y: getRandomInt(1, this.size.m - this.maxRoomSize),
      width: getRandomInt(this.minRoomSize, this.maxRoomSize),
      height: getRandomInt(this.minRoomSize, this.maxRoomSize)
    };
  }
  
  isRoomsIntersect(room, ignoreIndex) {
    for (let i = 0; i < this.rooms.length; i++) {
      if (i == ignoreIndex) {
        continue;
      }
      
      var roomForCheck = this.rooms[i];
      if (!((room.x + room.width < roomForCheck.x) || 
            (room.x > roomForCheck.x + roomForCheck.width) || 
            (room.y + room.height < roomForCheck.y) || 
            (room.y > roomForCheck.y + roomForCheck.height))) {
        return true;
      } 
    }

    return false;
  }
}