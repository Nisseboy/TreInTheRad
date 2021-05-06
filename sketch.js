let size;
let pos;

let crosses = [];
let circles = [];

let held = null;
let grabDist;
let grabStart;

let endTime = null;
let board;

function setup() {
  createCanvas(windowWidth, windowHeight);
  document.body.style.overflow = 'hidden';
  size = height / 3;
  grabDist = size / 2;

  pos = pos = [
    [
      [width / 2 - size * 1.5, 0],
      [width / 2 - size / 2, 0],
      [width / 2 + size / 2, 0]
    ],
    [
      [width / 2 - size * 1.5, height / 2 - size / 2],
      [width / 2 - size / 2, height / 2 - size / 2],
      [width / 2 + size / 2, height / 2 - size / 2]
    ],
    [
      [width / 2 - size * 1.5, height / 2 + size / 2],
      [width / 2 - size / 2, height / 2 + size / 2],
      [width / 2 + size / 2, height / 2 + size / 2]
    ]
  ];

  reset();
}

function draw() {
  if (endTime == null) {
    if (held != null) {
      held.x = mouseX - size / 2;
      held.y = mouseY - size / 2;
    }

    background(40, 40, 50);
    board = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];


    stroke(255);
    strokeWeight(10);
    line(pos[0][0][0], pos[0][0][1], pos[0][2][0] + size, pos[0][2][1]);
    line(pos[1][0][0], pos[1][0][1], pos[1][2][0] + size, pos[1][2][1]);
    line(pos[2][0][0], pos[2][0][1], pos[2][2][0] + size, pos[2][2][1]);
    line(pos[2][0][0], pos[2][0][1] + size, pos[2][2][0] + size, pos[2][2][1] + size);


    line(pos[0][0][0], pos[0][0][1], pos[2][0][0], pos[2][0][1] + size);
    line(pos[0][1][0], pos[0][1][1], pos[2][1][0], pos[2][1][1] + size);
    line(pos[0][2][0], pos[0][2][1], pos[2][2][0], pos[2][2][1] + size);
    line(pos[0][2][0] + size, pos[0][2][1], pos[2][2][0] + size, pos[2][2][1] + size);
    noFill();
    for (let i = 0; i < 3; i++) {
      crosses[i].draw();
      circles[i].draw();
    }
    checkWin();
  } else if (endTime + 1000 < millis()) {

    reset();
    endTime = null;
  }



}


function reset() {
  crosses = [];
  circles = [];

  for (let i = 0; i < 3; i++) {
    crosses.push(new Piece(pos[i][0][0] - size, pos[i][0][1], 0));
    circles.push(new Piece(pos[i][2][0] + size, pos[i][2][1], 1));
  }
}


class Piece {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
  }
  draw() {
    switch (this.type) {
      case 0: //Cross
        stroke(255,40,50);
        line(this.x + size / 4, this.y + size / 4, this.x + size * 0.75, this.y + size * 0.75);
        line(this.x + size * 0.75, this.y + size / 4, this.x + size / 4, this.y + size * 0.75);
        break;
      case 1: //Circle
        stroke(40,40,255);
        ellipse(this.x + size / 2, this.y + size / 2, size * 0.5);
    }
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        if (pos[x][y][0] == this.x && pos[x][y][1] == this.y) {
          board[x][y] = this.type + 1;
        }
      }
    }
  }
}

function mousePressed() {
  let c = closestPiece(mouseX, mouseY);
  if (c[1] < grabDist) {
    held = c[0];

    grabStart = [held.x, held.y];
  }
}

function mouseReleased() {
  let c = closestBox(mouseX, mouseY);
  if (c[1] < grabDist && held != null) {
    if (board[c[2][0]][c[2][1]] == 0) {
      held.x = c[0][0];
      held.y = c[0][1];
    } else {
      held.x = grabStart[0];
      held.y = grabStart[1];
    }
  }
  held = null;

}

function closestPiece(x, y) {
  let bestD = Infinity;
  let best;
  for (let i = 0; i < 3; i++) {
    let crd = dist(crosses[i].x + size / 2, crosses[i].y + size / 2, x, y);
    let cid = dist(circles[i].x + size / 2, circles[i].y + size / 2, x, y);

    if (crd < bestD) {
      bestD = crd;
      best = crosses[i];
    }
    if (cid < bestD) {
      bestD = cid;
      best = circles[i];
    }
  }
  return [best, bestD];
}

function closestBox(X, Y) {
  let bestD = Infinity;
  let best;
  let bestC;
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      let d = dist(pos[x][y][0] + size / 2, pos[x][y][1] + size / 2, X, Y);

      if (d < bestD) {
        bestD = d;
        best = pos[x][y];
        bestC = [x, y];
      }
    }
  }

  return [best, bestD, bestC];
}

function checkWin() {
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      stroke(0, 255, 0);
      if (x == 0 && y == 0 && board[x][y] != 0 && board[x + 1][y + 1] == board[x][y] && board[x + 2][y + 2] == board[x][y]) {
        line(pos[x][y][0] + size / 2, pos[x][y][1] + size / 2, pos[x + 2][y + 2][0] + size / 2, pos[x + 2][y + 2][1] + size / 2);
        endTime = millis();
      }
      if (x == 2 && y == 0 && board[x][y] != 0 && board[x - 1][y + 1] == board[x][y] && board[x - 2][y + 2] == board[x][y]) {
        line(pos[x][y][0] + size / 2, pos[x][y][1] + size / 2, pos[x - 2][y + 2][0] + size / 2, pos[x - 2][y + 2][1] + size / 2);
        endTime = millis();
      }
      if (x == 0 && board[x][y] != 0 && board[x + 1][y] == board[x][y] && board[x + 2][y] == board[x][y]) {
        line(pos[x][y][0] + size / 2, pos[x][y][1] + size / 2, pos[x + 2][y][0] + size / 2, pos[x + 2][y][1] + size / 2);
        endTime = millis();
      }
      if (y == 0 && board[x][y] != 0 && board[x][y + 1] == board[x][y] && board[x][y + 2] == board[x][y]) {
        line(pos[x][y][0] + size / 2, pos[x][y][1] + size / 2, pos[x][y + 2][0] + size / 2, pos[x][y + 2][1] + size / 2);
        endTime = millis();
      }
    }
  }
}
