var root = document.getElementById("root");
var randmoves = document.getElementById("randmoves")
var commandhistoryelement = document.getElementById("commandhistory");

var STATE = [
  [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ],
  [
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1],
  ],
  [
    [2, 2, 2],
    [2, 2, 2],
    [2, 2, 2],
  ],
  [
    [3, 3, 3],
    [3, 3, 3],
    [3, 3, 3],
  ],
  [
    [4, 4, 4],
    [4, 4, 4],
    [4, 4, 4],
  ],
  [
    [5, 5, 5],
    [5, 5, 5],
    [5, 5, 5],
  ],
]

var state = create_copy(STATE)

var commandhistory = []

function buildFace(container, faceNumber) {
  var face = document.createElement("div");
  face.className = "rubiks-face";
  container.appendChild(face)
  for (let i=0; i<3; i++) {
    var row = document.createElement("div");
    row.className = "rubiks-face-row";
    face.appendChild(row)
    for (let j=0; j<3; j++) {
      var el = document.createElement("div");
      el.className = "rubiks-face-element";
      el.dataset.face = faceNumber
      el.dataset.row = i
      el.dataset.col = j
      row.appendChild(el)
    }
  }
}

function draw() {
  for (var i=0; i<6; i++) {
    for (var r=0; r<3; r++) {
      for (var c=0; c<3; c++) {
        const color = state[i][r][c];
        const el = document.querySelector(
          `[data-face="${i}"][data-row="${r}"][data-col="${c}"]`
        )
        if (color == 0) el.style = "background-color: white"
        if (color == 1) el.style = "background-color: orange"
        if (color == 2) el.style = "background-color: green"
        if (color == 3) el.style = "background-color: red"
        if (color == 4) el.style = "background-color: blue"
        if (color == 5) el.style = "background-color: yellow"
      }
    }
  }
  commandhistoryelement.innerText = commandhistory.join(", ")
}
function col_col(state_copy, face1, face2, colnum1, colnum2,dir){
  if (dir == 1) {
    state[face2][0][colnum2] = state_copy[face1][0][colnum1]
    state[face2][1][colnum2] = state_copy[face1][1][colnum1]
    state[face2][2][colnum2] = state_copy[face1][2][colnum1]
  }
  else {
    state[face2][2][colnum2] = state_copy[face1][0][colnum1]
    state[face2][1][colnum2] = state_copy[face1][1][colnum1]
    state[face2][0][colnum2] = state_copy[face1][2][colnum1]
  }
}
function row_col(state_copy, face1, face2, row1, col1, dir){
  if (dir) {
    state[face2][0][col1] = state_copy[face1][row1][2]
    state[face2][1][col1] = state_copy[face1][row1][1]
    state[face2][2][col1] = state_copy[face1][row1][0]
  } else {
    state[face2][0][col1] = state_copy[face1][row1][0]
    state[face2][1][col1] = state_copy[face1][row1][1]
    state[face2][2][col1] = state_copy[face1][row1][2]
  }
}
function col_row(state_copy, face1, face2, col1, row1, dir){
  if (dir) {
    state[face2][row1][2] = state_copy[face1][2][col1]
    state[face2][row1][1] = state_copy[face1][1][col1]
    state[face2][row1][0] = state_copy[face1][0][col1]
  } else {
    state[face2][row1][2] = state_copy[face1][0][col1]
    state[face2][row1][1] = state_copy[face1][1][col1]
    state[face2][row1][0] = state_copy[face1][2][col1]
  }
}
function row_row(state_copy, face1, face2, row){
  state[face2][row][0] = state_copy[face1][row][0]
  state[face2][row][1] = state_copy[face1][row][1]
  state[face2][row][2] = state_copy[face1][row][2]
}
function create_copy(f){
  state_copy = [];
  for (var i=0; i<6; i++) {
    state_copy[i] = []
    for (var r=0; r<3; r++) {
      state_copy[i][r] = []
      for (var c=0; c<3; c++) {
        state_copy[i][r][c] = (f ? f : state)[i][r][c];
      }
    }
  }
  return state_copy
}
function do_l(act) {
  var state_copy = create_copy()
  col_col(state_copy, 0,1,0,0,1)
  col_col(state_copy, 1,5,0,0,1)
  col_col(state_copy, 5,3, 0, 2, -1)
  col_col(state_copy, 3,0,2,0,-1)

  face_rotate_clockwise(4)

  if (!act) {
    commandhistory.push("L")
    draw()
  }
}
function do_lprime(){
  do_l(true)
  do_l(true)
  do_l(true)
  commandhistory.push("L'")
  draw()
}
function do_r(act){
  var state_copy = create_copy()
  col_col(state_copy, 1,0,2,2,1)
  col_col(state_copy, 5,1,2,2,1)
  col_col(state_copy, 3,5, 0, 2, -1)
  col_col(state_copy, 0,3,2,0,-1)
  face_rotate_clockwise(2)
  if (!act) {
    commandhistory.push("R")
    draw()
  }
}
function do_rprime(){
  do_r(true)
  do_r(true)
  do_r(true)
  commandhistory.push("R'")
  draw()
}

function do_f(act){
  var state_copy = create_copy()
  row_col(state_copy, 0,2, 2,0)
  col_row(state_copy, 2, 5, 0, 0)
  row_col(state_copy, 5, 4, 0, 2)
  col_row(state_copy, 4, 0, 2, 2)
  face_rotate_clockwise(1)
  if (!act) {
    commandhistory.push("F")
    draw()
  }
}
function do_fprime(){
  do_f(true)
  do_f(true)
  do_f(true)
  commandhistory.push("F'")
  draw()
}

function do_u(act){
  var state_copy = create_copy()
  row_row(state_copy, 2,1, 0)
  row_row(state_copy, 3,2, 0)
  row_row(state_copy, 4,3, 0)
  row_row(state_copy, 1,4, 0)
  face_rotate_clockwise(0)
  if (!act) {
    commandhistory.push("U")
    draw()
  }
}
function do_uprime(){
  do_u(true)
  do_u(true)
  do_u(true)
  commandhistory.push("U'")
  draw()
}

function do_b(act){
  var state_copy = create_copy()
  col_row(state_copy, 2, 0, 2, 0, 1)
  row_col(state_copy, 0, 4, 0, 0, 1)
  col_row(state_copy, 4, 5, 0, 2, 1)
  row_col(state_copy, 5, 2, 2, 2, 1)
  face_rotate_clockwise(3)
  if (!act) {
    commandhistory.push("B")
    draw()
  }
}
function do_bprime(){
  do_b(true)
  do_b(true)
  do_b(true)
  commandhistory.push("B'")
  draw()
}

function do_d(act){
  var state_copy = create_copy()
  row_row(state_copy, 1,2, 2)
  row_row(state_copy, 2,3, 2)
  row_row(state_copy, 3,4, 2)
  row_row(state_copy, 4,1, 2)
  face_rotate_clockwise(5)
  if (!act) {
    commandhistory.push("D")
    draw()
  }
}
function do_dprime(){
  do_d(true)
  do_d(true)
  do_d(true)
  commandhistory.push("D'")
  draw()
}

function face_rotate_clockwise(faceNum){
  face_copy = []
  for (var r=0; r<3; r++) {
      face_copy[r] = []
      for (var c=0; c<3; c++) {
        face_copy[r][c] = state[faceNum][r][c];
      }
    }
  state[faceNum][0][2] = face_copy[0][0]
  state[faceNum][2][2] = face_copy[0][2]
  state[faceNum][2][0] = face_copy[2][2]
  state[faceNum][0][0] = face_copy[2][0]
  state[faceNum][0][1] = face_copy[1][0]
  state[faceNum][1][2] = face_copy[0][1]
  state[faceNum][2][1] = face_copy[1][2]
  state[faceNum][1][0] = face_copy[2][1]
  
}

function reset() {
  state = create_copy(STATE)
  commandhistory = []
  draw()
}

var c1 = document.createElement("div");
c1.className = "container"
root.appendChild(c1)
var c2 = document.createElement("div");
c2.className = "container"
root.appendChild(c2)
var c3 = document.createElement("div");
c3.className = "container"
root.appendChild(c3)

window.addEventListener('keyup', function(event) {
  if(event.keyCode === 76) {
    if(event.shiftKey == true) do_lprime()
    else do_l()
  }
  if(event.keyCode === 82) {
    if(event.shiftKey == true) do_rprime()
    else do_r()
  }
  if(event.keyCode === 70) {
    if(event.shiftKey == true) do_fprime()
    else do_f()
  }
  if(event.keyCode === 85) {
    if(event.shiftKey == true) do_uprime()
    else do_u()
  }
  if(event.keyCode === 68) {
    if(event.shiftKey == true) do_dprime()
    else do_d()
  }
  if(event.keyCode === 66) {
    if(event.shiftKey == true) do_bprime()
    else do_b()
  }
  if(event.keyCode === 32) {
    reset()
  }
});

func = [do_l, do_lprime, do_r, do_rprime, do_f, do_fprime, do_u, do_uprime, do_d, do_dprime, do_b, do_bprime]

randmoves.addEventListener("input", function (event) {
  reset()
  if (randmoves.value >=100) randmoves.value = 100;
  for(var i = 0; i<randmoves.value; i++) {
    func[Math.floor(Math.random() * 12)]()
  }
  draw()
})

buildFace(c1, 0);
buildFace(c2, 1);
buildFace(c2, 2);
buildFace(c2, 3);
buildFace(c2, 4);
buildFace(c3, 5);

draw();

