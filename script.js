import { PIECES } from "./pieces.js";
const canvas = document.getElementById("tetris");
const context = canvas.getContext("2d");

context.scale(20, 20);

const player = {
    pos: {x: 5, y: 2},
    matrix: PIECES['T'],
};
drawMatrix(player.matrix, player.pos);

let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;

function draw() {
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.clientWidth, canvas.height);
    context.fillStyle = 'red';
    drawMatrix(player.matrix, player.pos);
}

function update(time=0){
    const deltaTime = time - lastTime;
    lastTime = time;

    dropCounter += deltaTime;
    if (dropCounter > dropInterval){
        player.pos.y++;
        dropCounter = 0;
    }
    draw();
    requestAnimationFrame(update);
}
function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}

update();