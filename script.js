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

    //nextエリア
    context.fillStyle = "white";
    context.fillRect(12, 0, 5, 20);
    const nextPos = {x: 13, y: 2.05};
    drawMatrix(player.next, nextPos)
    drawMatrix(arena, {x: 0, y: 0});
    drawMatrix(player.matrix, {x: player.pos.x, y: player.pos.y});
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

functoin playerRotate(dir){
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
            merge(arena, player)
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
    }
});

nextMatrix()
gameLoop()


