// Meth Meth Method github: https://github.com/meth-meth-method/pong
// Meth Meth Method Tutorial: https://www.youtube.com/watch?v=ju09womACpQ
// Pong Tutorial by Meth Meth Method

// For Rick Reyes --- HAPPY FATHERS DAY
// Modified By Ricky Reyes, github:rickyjreyes

//These are the sounds
var audio = new Audio('paddle.wav');
var audio2 = new Audio('wall.wav');
var audio3 = new Audio('score.wav');

// A Vector is a data structure to store the values
// It is a list without an order
class Vector
{
    //A Constructor Initializes the stored values of x and y.
    constructor(coordinate_x = 0, coordinate_y = 0)
    {
        this.coordinate_x = coordinate_x;
        this.coordinate_y = coordinate_y;
    }
    get len()
    {
        // This is the hypotenuse a^2 + b^2 = c^2
        return Math.sqrt(this.coordinate_x * this.coordinate_x + this.coordinate_y * this.coordinate_y);
    }
    set len(value) {
        const f = value / this.len;
        this.coordinate_x *= f;
        this.coordinate_y *= f;
    }
}

//Paddle Object
class Paddle
{
    constructor(coordinate_x = 0, coordinate_y = 0)
    {
        this.postion = new Vector(0, 0);
        this.size = new Vector(coordinate_x, coordinate_y);
    }
    get left()
    {
        return this.postion.coordinate_x - this.size.coordinate_x / 2;
    }
    get right()
    {
        return this.postion.coordinate_x + this.size.coordinate_x / 2;
    }
    get top()
    {
        return this.postion.coordinate_y - this.size.coordinate_y / 2;
    }
    get bottom()
    {
        return this.postion.coordinate_y + this.size.coordinate_y / 2;
    }
}

// The Ball
class Ball extends Paddle
{
    constructor()
    {
        //Initializes Size of Ball
        super(7, 7);
        //Initializes Speed of the Ball
        this.velocity = new Vector;
    }
}

// Player Object
class Player extends Paddle
{
    constructor()
    {

        // Initialize Size
        super(20, 40);
        //Initialize Speed
        this.velocity = new Vector;
        //Initialize Score
        this.score = 0;

        //Keeps track of the last updated position
        this.lastPosition = new Vector;
    }
    update(dt)
    {
        this.velocity.coordinate_y = (this.postion.coordinate_y - this.lastPosition.coordinate_y) / dt;
        this.lastPosition.coordinate_y = this.postion.coordinate_y;
    }
}

// Main Game of Pong
class Pong
{

    constructor(canvas)
    {
      //Initialize Game canvas
        this.canvas = canvas;
        this.context = canvas.getContext('2d');

        //Initialize Ball initialSpeed
        this.initialSpeed = 250;

        //Create Ball Object
        this.ball = new Ball;

        //Create 2 Players
        this.players = [
            new Player,
            new Player,
        ];

        // Set the position of Player 1 and Player 2
        this.players[0].postion.coordinate_x = 40;
        this.players[1].postion.coordinate_x = this.canvas.width - 40;
        this.players.forEach(p => p.postion.coordinate_y = this.canvas.height / 2);

        let lastTime = null;
        this._frameCallback = (millis) => {
            if (lastTime !== null) {
                const diff = millis - lastTime;
                this.update(diff / 1000);
            }
            lastTime = millis;
            requestAnimationFrame(this._frameCallback);
        };

        //Score
        this.CHAR_PIXEL = 10;
        // 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
        //.map converts 0's 1's matrix onto a canvas
        this.CHARS = [
            '111101101101111',
            '010010010010010',
            '111001111100111',
            '111001111001111',
            '101101111001001',
            '111100111001111',
            '111100111101111',
            '111001001001001',
            '111101111101111',
            '111101111001111',
        ].map(str => {
            const canvas = document.createElement('canvas');
            canvas.height = this.CHAR_PIXEL * 5;
            canvas.width = this.CHAR_PIXEL * 3;
            const context = canvas.getContext('2d');
            context.fillStyle = '#fff';
            str.split('').forEach((fill, i) => {
                if (fill === '1') {
                    context.fillRect((i % 3) * this.CHAR_PIXEL, (i / 3 | 0) * this.CHAR_PIXEL, this.CHAR_PIXEL, this.CHAR_PIXEL);
                }
            });
            return canvas;
        });

        this.reset();
    }
    clear()
    {
        this.context.fillStyle = '#303030';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    collide(player, ball)
    {

        if (player.left < ball.right && player.right > ball.left &&
            player.top < ball.bottom && player.bottom > ball.top) {
            ball.velocity.coordinate_x = -ball.velocity.coordinate_x * 1.05;
            const len = ball.velocity.len;
            ball.velocity.coordinate_y += player.velocity.coordinate_y * .2;
            ball.velocity.len = len;

              audio.play();
        }
    }
    draw()
    {
        this.clear();

        this.drawRect(this.ball);
        this.players.forEach(player => this.drawRect(player));

        this.drawScore();
    }
    drawRect(rect)
    {
        this.context.fillStyle = '#fff';
        this.context.fillRect(rect.left, rect.top, rect.size.coordinate_x, rect.size.coordinate_y);
    }
    drawScore()
    {
        const align = this.canvas.width / 3;
        const cw = this.CHAR_PIXEL * 4;
        this.players.forEach((player, index) => {
            const chars = player.score.toString().split('');
            const offset = align * (index + 1) - (cw * chars.length / 2) + this.CHAR_PIXEL / 2;
            chars.forEach((char, postion) => {
                this.context.drawImage(this.CHARS[char|0], offset + postion * cw, 20);
            });
        });
    }
    play()
    {
        const b = this.ball;
        if (b.velocity.coordinate_x === 0 && b.velocity.coordinate_y === 0) {
            b.velocity.coordinate_x = 200 * (Math.random() > .5 ? 1 : -1);
            b.velocity.coordinate_y = 200 * (Math.random() * 2 - 1);
            b.velocity.len = this.initialSpeed;
        }
    }
    reset()
    {
        const b = this.ball;
        b.velocity.coordinate_x = 0;
        b.velocity.coordinate_y = 0;
        b.postion.coordinate_x = this.canvas.width / 2;
        b.postion.coordinate_y = this.canvas.height / 2;
    }
    start()
    {
        requestAnimationFrame(this._frameCallback);
    }
    update(dt)
    {
        const cvs = this.canvas;
        const ball = this.ball;
        ball.postion.coordinate_x += ball.velocity.coordinate_x * dt;
        ball.postion.coordinate_y += ball.velocity.coordinate_y * dt;

        if (ball.right < 0 || ball.left > cvs.width) {
            audio2.play();
            ++this.players[ball.velocity.coordinate_x < 0 | 0].score;
            this.reset();
        }

        if (ball.velocity.coordinate_y < 0 && ball.top < 0 ||
            ball.velocity.coordinate_y > 0 && ball.bottom > cvs.height) {
              audio3.play();
            ball.velocity.coordinate_y = -ball.velocity.coordinate_y;
        }

        this.players[1].postion.coordinate_y = ball.postion.coordinate_y;

        this.players.forEach(player => {
            player.update(dt);
            this.collide(player, ball);
        });

        this.draw();
    }
}

//This places the Pong Canvas in HTML with id #pong
const canvas = document.querySelector('#pong');

//New Pong creates the canvas the game is played on
const pong = new Pong(canvas);

//Will play the game on click
canvas.addEventListener('click', () => pong.play());

//Checks for Mouse Movement as Paddle placement
canvas.addEventListener('mousemove', event => {
    // Track Mouse Position to Scale
    const scale = event.offsetY / event.target.getBoundingClientRect().height;
    pong.players[0].postion.coordinate_y = canvas.height * scale;
});

//Starts the Game
pong.start();
