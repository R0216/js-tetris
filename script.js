import { PIECES } from "./pieces.js";
const canvas = document.getElementById("tetris");
const context = canvas.getContext("2d");

context.scale(20, 20);
context.fillStyle = "red";
context.fillRect(2, 2, 1, 1);



function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}

const player = {
    pos: {x: 5, y: 2},
    matrix: PIECES['T'],
};
drawMatrix(player.matrix, player.pos);