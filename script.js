import { PIECES, COLORS } from "./pieces.js";

const canvas = document.getElementById('tetris');
const context = canvas.getContext("2d");


context.scale(20, 20);

function createMatrix(w, h) {
    return Array.from({length: h}, () => new Array(w).fill(0));
}

const arena = createMatrix(12, 20);
console.table(arena)

const player = {
    pos: {x: 5, y: 0},
    matrix: null,
    next: null,
    hold: null,
    canHold: true,
    score: 0,
}

function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if(value!==0) {
                context.fillStyle = COLORS[value];
                context.fillRect(x + offset.x, y + offset.y, 0.95, 0.95)
            }
        })
    });
}

function draw () {
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);
    const OFFSET_X = 5;

    //nextエリア
    context.fillStyle = "white";
    context.fillRect(OFFSET_X + 12, 0, 5, 20);
    const nextPos = {x: OFFSET_X + 13, y: 2.05};
    drawMatrix(player.next, nextPos)

    //holdエリア
    context.fillStyle = "white";
    context.fillRect(0, 0, 5, 20);
    const holdPos = {x: 1.2, y: 2.05};
    if (player.hold){drawMatrix(player.hold, holdPos);}

    //scoreエリア
    context.fillStyle = "black";
    context.font = "1px Arial";
    context.fillText("SCORE", OFFSET_X + 12.6, 8);
    context.fillText(player.score, OFFSET_X + 14.2, 9);
    drawMatrix(arena, {x: OFFSET_X, y: 0});
    drawMatrix(player.matrix, {x: OFFSET_X + player.pos.x, y: player.pos.y});
}

function merge(arena, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if(value !== 0){
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

function arenaSweep() {
    let rowCount = 1
    for (let y = arena.length - 1; y >= 0; y--) {
        let isFull = true;
        for (let x = 0; x < arena[y].length;x++){
            if(arena[y][x] === 0){
                isFull = false;
                break;
            }
        }

        if(isFull) {
            const row = arena.splice(y, 1)[0].fill(0);
            arena.unshift(row);
            y++;
            player.score += rowCount * 10;
            rowCount *= 2
        }
    }
}

function collide(arena, player) {
    const m = player.matrix;
    const o = player.pos;

    for (let y = 0; y < m.length; y++) {
        for (let x = 0; x < m[y].length; x++) {
            if(m[y][x] !== 0){
                if (arena[y + o.y] === undefined ||
                    arena[y + o.y][x + o.x] === undefined ||
                    arena[y + o.y][x + o.x] !== 0 ) {
                        return true
                    }
            }
        };
    };
    return false
}

function nextMatrix() {
    const pieces = 'TILJSZO';
    if(player.next === null) {
        player.next = PIECES[pieces[Math.floor(Math.random() * pieces.length)]];
    }

    player.matrix = JSON.parse(JSON.stringify(player.next));
    player.next = PIECES[pieces[Math.floor(Math.random() * pieces.length)]];

    player.pos.x = 5;
    player.pos.y = 0;
    if(collide(arena, player)) {
        arena.forEach(row => row.fill(0));
        dropInterval = 1000;
    }
    player.canHold = true;
}

function rotate(matrix, dir){
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < y; x++) {
            [
                matrix[x][y],
                matrix[y][x],
            ] = [
                matrix[y][x],
                matrix[x][y],
            ];
        }
    }
    if(dir > 0){
        matrix.forEach(row => row.reverse());
    } else {
        matrix.reverse()
    }
}

function playerRotate(dir){
    const pos = player.pos.x;
    let offset = 1;
    rotate(player.matrix, dir);

    while(collide(arena, player)) {
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1: -1));

        if (offset > player.matrix[0].length) {
            rotate(player.matrix, -dir);
            player.pos.x = pos;
            return;
        }
    }
}

function hold(){
    if(!player.canHold) return;

    if(player.hold === null) {
        player.hold = player.matrix;
        nextMatrix();
    } else {
        const temp = player.matrix;
        player.matrix = player.hold;
        player.hold = temp;
        player.pos.y = 0;
        player.pos.x = 5;
        player.canHold = false;
    }
}

let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;
function gameLoop(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;
    dropCounter += deltaTime;

    if(dropCounter >= dropInterval) {
        player.pos.y++;
        if (collide(arena, player)) {
            player.pos.y--;
            merge(arena, player);
            arenaSweep()
            nextMatrix()
        }
        dropCounter = 0;
    }
    
    draw();
    requestAnimationFrame(gameLoop);
}



window.addEventListener('keydown', (event) => {
    if(event.key === "ArrowDown") {
        player.pos.y++;
        dropCounter = 0;
        if(collide(arena, player)) {
            player.pos.y--
            console.log(player.pos);
        }
    } else if(event.key === "ArrowLeft") {
        player.pos.x--
        if(collide(arena, player)) {
            player.pos.x++;
        }
    } else if(event.key === "ArrowRight") {
        player.pos.x++
        if(collide(arena, player)) {
            player.pos.x--;
        }
    } else if(event.key === "s") {
        playerRotate(-1);
    } else if(event.key === "a") {
        playerRotate(1);
    } else if(event.key === "f") {
        hold()
    }
});

nextMatrix()
draw()
gameLoop()


