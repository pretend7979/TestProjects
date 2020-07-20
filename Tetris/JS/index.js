const canvas = document.getElementById('BlockyMcDroppy');
const canvas2 = document.getElementById('next');
const ctx = canvas.getContext('2d');



ctx.scale(20, 20);





function arenaSweep() {
    let rowCount = 1;
    outer: for (let y = arena.length - 1; y > 0; --y) {
        for (let x = 0; x < arena[y].length; ++x) {
            if (arena[y][x] === 0) {
                continue outer;
            }
        }

        const row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row);
        ++y;

        player.score += rowCount * 10;
        rowCount *= 2;
    }
}


function collide(arena, player) {
    const m = player.matrix;
    const o = player.pos;
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 &&
                (arena[y + o.y] &&
                    arena[y + o.y][x + o.x]) !== 0)

            {

                return true;

            }
        }
    }
    return false;
}

function createMatrix(w, h) {
    const matrix = [];
    while (h--) {
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}

function createPiece(type) {
    if (type === 'I') {
        return [
            [1, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ];
    } else if (type === 'L') {
        return [
            [0, 0, 2],
            [2, 2, 2],
            [0, 0, 0],
        ];
    } else if (type === 'J') {
        return [
            [3, 0, 0],
            [3, 3, 3],
            [0, 0, 0],
        ];
    } else if (type === 'O') {
        return [
            [4, 4],
            [4, 4],
        ];
    } else if (type === 'Z') {
        return [
            [5, 5, 0],
            [0, 5, 5],
            [0, 0, 0],
        ];
    } else if (type === 'S') {
        return [
            [0, 6, 6],
            [6, 6, 0],
            [0, 0, 0],
        ];
    } else if (type === 'T') {
        return [
            [0, 7, 0],
            [7, 7, 7],
            [0, 0, 0],
        ];
    }
}

function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                ctx.shadowBlur = 3;
                ctx.shadowColor = 'rgb(20,39,71)';
                ctx.fillStyle = colors[value];
                ctx.fillRect(x + offset.x,
                    y + offset.y,
                    1, 1);
                ctx.shadowBlur = 0;
            }
        });
    });
}




function draw() {

    ctx.globalAlpha = .3;
    ctx.fillStyle = 'rgb(20,39,71)';

    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fill('evenodd');
    ctx.beginPath();
    ctx.strokeRect(.5, 0, 0, canvas.height);
    ctx.strokeRect(2.5, 0, 0, canvas.height);
    ctx.strokeRect(4.5, 0, 0, canvas.height);
    ctx.strokeRect(6.5, 0, 0, canvas.height);
    ctx.strokeRect(8.5, 0, 0, canvas.height);
    ctx.strokeRect(10.5, 0, 0, canvas.height);

    ctx.fillStyle = '#fff';
    ctx.globalAlpha = 1;

    drawMatrix(arena, { x: 0, y: 0 });
    drawMatrix(player.matrix, player.pos);
}



function merge(arena, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

function rotate(matrix, dir) {
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [
                matrix[x][y],
                matrix[y][x],
            ] = [
                matrix[y][x],
                matrix[x][y],
            ];
        }
    }
    if (dir > 0) {
        matrix.forEach(row => row.reverse());
    } else {
        matrix.reverse();
    }
}



function playerDrop() {
    player.pos.y++;
    if (collide(arena, player)) {
        player.pos.y--;
        merge(arena, player);
        playerReset();
        arenaSweep();
        updateScore();
    }
    dropCounter = 0;
}


function playerMove(offset) {
    player.pos.x += offset;
    if (collide(arena, player)) {
        player.pos.x -= offset;
    }
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

let piece_order = ['T', 'L', 'J', 'S', 'Z', 'I', 'O'];
let next_shape_index = 0;

function myFunc() {
    myFunc = function() {};
    shuffle(piece_order);
}
myFunc();


const random = function(x) {
    return Math.ceil(Math.random() * x);
};


const randomize_array = function(l) {
    for (let i = 0; i < l.length; i++) {
        let random_index = random(l.length) - 1;
        let temp = l[i];
        l[i] = l[random_index];
        l[random_index] = temp
    }

    return l
};




let playerReset = function() {
    if (next_shape_index >= piece_order.length) {
        next_shape_index = 0;
        piece_order = randomize_array(piece_order);
    }
    player.matrix = createPiece(piece_order[next_shape_index++]);
    player.pos.y = 0;
    player.pos.x = (arena[0].length / 2 | 0) -
        (player.matrix[0].length / 2 | 0);
    if (collide(arena, player)) {
        arena.forEach(row => row.fill(0));
        player.score = 0;
        updateScore();
    }
};




function playerRotate(dir) {
    const pos = player.pos.x;
    let offset = 1;
    rotate(player.matrix, dir);
    while (collide(arena, player)) {
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
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


function update(time = 0) {
    const deltaTime = time - lastTime;

    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        playerDrop();
    }

    lastTime = time;

    draw();

    requestAnimationFrame(update);

}

function updateScore() {
    document.getElementById('score').innerText = player.score;
}

let down = false;
document.addEventListener('keypress', event => {
    if (down) return;
    down = true;

    switch (event.key) {




        case "q":
            playerRotate(-1);
            break;
        case "w":
            playerRotate(1);
            break;
    }



}, false);

document.addEventListener('keyup', function() {
    down = false;
}, false);

document.addEventListener('keydown', event => {
    switch (event.key) {
        case " ":
            let i;
            player.pos.y = 1;
            for (i = 0; i < player.pos.y; i) {
                playerDrop();

            }

            console.log(i, player.pos.y);
            break;
        case "ArrowLeft":
            playerMove(-1);
            break;
        case "ArrowRight":
            playerMove(1);
            break;
        case "ArrowDown":
            playerDrop();



    }
});


const colors = [
    null,
    'purple',
    'yellow',
    'orange',
    'blue',
    'aqua',
    'green',
    'red'
];

const arena = createMatrix(10, 20);

const player = {
    pos: { x: 0, y: 0 },
    matrix: null,
    score: 0,
};


playerReset();
updateScore();
update();