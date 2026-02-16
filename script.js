import { PIECES } from "./pieces.js";

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
    matrix: PIECES["T"],
}

function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if(value!==0) {
                context.fillStyle = "red";
                context.fillRect(x + offset.x, y + offset.y, 0.95, 0.95)
            }
        })
    });
}

function draw () {
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);
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

gameLoop()


