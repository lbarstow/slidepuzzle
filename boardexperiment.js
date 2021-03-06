const PUZZLE_HOVER_TINT = '#009900';
var _canvas;
var _stage;
var _img;
var _pieces;
var _puzzleWidth;
var _puzzleHeight;
var _pieceWidth;
var _pieceHeight;
var _currentPiece;
var _currentDropPiece;
var _currentOpening;
var _mouse

function init(){
  _img = new Image();
  _img.addEventListener('load', onImage, false);
  _img.src = "bench.jpg";

}
function onImage(e){
  _pieceWidth = Math.floor(_img.width / 3);
  _pieceHeight = Math.floor(_img.height / 3);
  // why not just original image dimentions? I'll come back to this
  _puzzleWidth = _pieceWidth * 3;
  _puzzleHeight = _pieceHeight *3;
  setCanvas();
  initPuzzle();
}
function setCanvas(){
  _canvas = document.getElementById('canvas');
  _stage = _canvas.getContext('2d');
  _canvas.width = _puzzleWidth;
  _canvas.height = _puzzleHeight;
  _canvas.style.border = "1px solid black";
}
function initPuzzle(){
  if (document.contains(document.getElementById("refreshBtn"))){
            document.getElementById("refreshBtn").remove();
          }
  _pieces = [];
  _mouse = {x:0, y:0};
  _currentPiece = null;
  _currentDropPiece = null;
  _stage.drawImage(_img, 0, 0, _puzzleWidth, _puzzleHeight, 0, 0, _puzzleWidth, _puzzleHeight);
  createTitle("Click to Start Puzzle");
  _stage.fillStyle= "#000000";
  buildPieces();
}
function createTitle(msg){
  _stage.fillStyle = "#000000";
  _stage.globalAlpha = .4;
  _stage.fillRect(100, _puzzleHeight -40, _puzzleWidth- 200, 40);
  _stage.fillStyle = "#FFFFFF";
  _stage.globalAlpha = 1;
  _stage.textAlign = "center";
  _stage.textBaseline = "middle";
  _stage.font = "20px Arial";
  _stage.fillText(msg, _puzzleWidth/2, _puzzleHeight-20);
}
function buildPieces(){
  var i;
  var xPos = 0;
  var yPos = 0;
  for(i = 0; i<9; i++){
    piece = {}
    piece.sx = xPos;
    piece.sy = yPos;
    piece.xPos = xPos;
    piece.yPos = yPos;
    if(i<8){
      piece.empty = false;
    }else{
      piece.empty = true;
      _currentOpening = piece;
    }
    _pieces.push(piece);
    xPos +=_pieceWidth;
    if(xPos >= _puzzleWidth){
      xPos = 0;
      yPos += _pieceHeight;
    }
  }
  //document.onmousedown = shufflePuzzle;
  //change listener
  document.onmousedown = coolShuffle;
  console.log("finished buildPieces");
}
/*
function shufflePuzzle(){
  _pieces = shuffleArray(_pieces);
  _stage.clearRect(0,0,_puzzleWidth , _puzzleHeight);
  var i;
  var piece;
  var xPos = 0;
  var yPos = 0;
  for(i = 0; i< _pieces.length; i++){
    piece = _pieces[i];
    piece.xPos = xPos;
    piece.yPos = yPos;
    if (piece.empty== false){
      //source image, area taking from, area pasting to
      _stage.drawImage(_img, piece.sx, piece.sy, _pieceWidth, _pieceHeight, xPos, yPos, _pieceWidth, _pieceHeight);
    } else{
      //_stage.fillStyle = "#000000";
      _stage.fillRect(xPos,yPos,_pieceWidth, _pieceHeight);
      //_currentOpening = {xPos:piece.xPos,yPos:piece.yPos};
      _currentOpening = piece;
    }
    _stage.strokeRect(xPos, yPos, _pieceWidth, _pieceHeight);
    xPos += _pieceWidth;
    if(xPos >= _puzzleWidth){
      xPos = 0;
      yPos += _pieceHeight;
    }
  }
  document.onmousedown = onPuzzleClick;
  var refresh = document.createElement("input");
  refresh.setAttribute('type','button');
  refresh.setAttribute('id','refreshBtn');
  refresh.setAttribute('value','Reshuffle');
  document.body.appendChild(refresh);
  refresh.onclick = initPuzzle;
}
*/
function coolShuffle(){
  document.onmousedown = null;
  console.log("coolShuffle");
  drawPuzzle();

  setTimeout(createTitle("Shuffling"), 500);

  /*for(i =0; i <25; i++){
    setTimeout(autoMove, 500);
  }*/
  var count = 0;
  while(count <25){
    var moved = autoMove();
    if(moved){
      count+=1;
      setTimeout(drawPuzzle, 3000);
    }
  }
  document.onmousedown = onPuzzleClick;
  var refresh = document.createElement("input");
  refresh.setAttribute('type','button');
  refresh.setAttribute('id','refreshBtn');
  refresh.setAttribute('value','Reshuffle');
  document.body.appendChild(refresh);
  refresh.onclick = initPuzzle;
}
//just so it can be used in set timeout
function addOne(num){
  return num++;
}
/*
function shuffleArray(o){
  for(var j, x, i=o.length; i; j = parseInt(Math.random() * i ), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
}
*/
function onPuzzleClick(e){
  if(e.layerX || e.layerX ==0){
    _mouse.x = e.layerX - _canvas.offsetLeft;
    _mouse.y = e.layerY - _canvas.offsetTop;

  }
  else if (e.offsetX || e.offsetX ==0) {
    _mouse.x= e.offsetX - _canvas.offsetLeft;
    _mouse.y = e.offsetY - _canvas.offsetTop;
  }
  _currentPiece = checkPieceClicked();
  if(_currentPiece != null){
    //need to check if clicked an adjacent piece
    if(isAdjacent(_currentPiece.xPos, _currentPiece.yPos)){
        swap();
        resetPuzzleAndCheckWin();
    }
  }
}
function checkPieceClicked(){
  var i;
  var piece;
  for(i = 0; i<_pieces.length; i++){
    piece = _pieces[i];
    if(_mouse.x<piece.xPos || _mouse.x>(piece.xPos + _pieceWidth) || _mouse.y < piece.yPos || _mouse.y >(piece.yPos + _pieceHeight)){
      //piece not hit...?
    }
    else{
      return piece;
    }
  }
  return null;
}
function isAdjacent(x, y){
  if((_currentOpening.yPos == y) &&((_currentOpening.xPos - _pieceWidth)== x ||(_currentOpening.xPos+ _pieceWidth) ==x )){
    return true;
  }else if ((x == _currentOpening.xPos) &&(((_currentOpening.yPos -_pieceHeight) ==y)||(_currentOpening.yPos +_pieceHeight) == y) ) {
    return true;
  }else{
    return false;
  }
}

function swap(){
  //just swaps coordinates of two variables
  //modifies coordinates of two pieces in list
  var tmpPiece = {xPos:_currentPiece.xPos,yPos:_currentPiece.yPos};
  var tmpOpen = {xPos:_currentOpening.xPos,yPos:_currentOpening.yPos};
  var i;
  var piece;
  for(i =0; i<_pieces.length; i++){
    piece = _pieces[i];
    if(piece == _currentPiece){
      piece.xPos = tmpOpen.xPos;
      piece.yPos = tmpOpen.yPos;
      _currentPiece = null;
    } else if (piece == _currentOpening) {
      piece.xPos = tmpPiece.xPos;
      piece.yPos = tmpPiece.yPos;
      _currentOpening = piece;
    }
  }
}

function resetPuzzleAndCheckWin(){
  _stage.clearRect(0,0,_puzzleWidth, _puzzleHeight);
  var gameWin =true;
  var i;
  var piece;
  for(i=0; i< _pieces.length; i++){
    piece = _pieces[i];
    //draws all pieces, does fill rect if is empty square
    if(piece.empty ==false){
      _stage.drawImage(_img, piece.sx, piece.sy, _pieceWidth, _pieceHeight, piece.xPos, piece.yPos, _pieceWidth, _pieceHeight);
    }else{
      _stage.fillRect(piece.xPos,piece.yPos,_pieceWidth, _pieceHeight);
    }

    _stage.strokeRect(piece.xPos, piece.yPos, _pieceWidth,_pieceHeight);
    if(piece.xPos != piece.sx || piece.yPos != piece.sy){
      gameWin = false;
  }
}
  if(gameWin){
    createTitle("You Won! Click to Play Again.");
    setTimeout(gameOver, 500);
  }
}
function drawPuzzle(){
  _stage.clearRect(0,0,_puzzleWidth, _puzzleHeight);
  var i;
  var piece;
  for(i=0; i< _pieces.length; i++){
    piece = _pieces[i];
    //draws all pieces, does fill rect if is empty square
    if(piece.empty ==false){
      _stage.drawImage(_img, piece.sx, piece.sy, _pieceWidth, _pieceHeight, piece.xPos, piece.yPos, _pieceWidth, _pieceHeight);
    }else{
      _stage.fillRect(piece.xPos,piece.yPos,_pieceWidth, _pieceHeight);
    }

    _stage.strokeRect(piece.xPos, piece.yPos, _pieceWidth,_pieceHeight);
  }
}
//moves one randomlly selected pieve
function autoMove(){
  //randomly choose one of four choices
  var choice = getRandomInt(1, 5);
  //console.log("choice "+ choice);
  var randX;
  var randY;
  if(choice ==1){
    //top
    randX = _currentOpening.xPos;
    randY = _currentOpening.yPos - _pieceHeight;
  }else if (choice == 2) {
    //right
    randX = _currentOpening.xPos + _pieceWidth;
    randY = _currentOpening.yPos;

  }else if (choice == 3) {
    //bottom
    randX = _currentOpening.xPos;
    randY = _currentOpening.yPos + _pieceHeight;
  }else if (choice ==4) {
    //left
    randX = _currentOpening.xPos - _pieceWidth;
    randY = _currentOpening.yPos;
  }
  _currentPiece = checkPieceChosen(randX, randY);
  if(_currentPiece != null){
    swap();
    return true;
    //drawPuzzle();
  }
  return false;
}

//taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
//modify this
//will take in x and y and see if matches the x,y coordinates of any of the pieces
//will return matching piece
//does not perform any adjacency checks
function checkPieceChosen(x, y){
  var i;
  var piece;
  for(i = 0; i<_pieces.length; i++){
    piece = _pieces[i];
    if((piece.xPos == x) && (piece.yPos ==y)){
      return piece;
    }
  }
  return null;
}
function gameOver(){
document.onmousedown = initPuzzle;
document.onmousemove = null;
document.onmouseup = null;

}
