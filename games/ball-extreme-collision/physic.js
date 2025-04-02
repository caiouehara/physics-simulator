let state = {
    balls: [],
    time: {
        start: 0,
        frameCount: 0,
        fps: 0,
        elapsed: 0,
    },
}

const collisions = {
    wall: function (collider) {
        if (collider.posX + collider.radius > CANVAS_WIDTH || collider.posX - collider.radius < 0 ) {
            collider.applyVx(-collider.vx)
        }
        if (collider.posY + collider.radius > CANVAS_HEIGHT || collider.posY - collider.radius < 0 ) {
            collider.applyVy(-collider.vy)
        }
    },
    ball: function (collider) {
        for (let ball of state.balls) {
            if (ball === collider) continue;
            const distance = calculateDistance(ball, collider)
            const gap = 3;

            //overlap
            let overlap = ball.radius + collider.radius - calculateDistance(ball, collider);
            let smallerObject = ball.radius < collider.radius ? ball : collider;
            let biggerObject = ball.radius > collider.radius ? ball : collider;
            let theta = Math.atan2((biggerObject.posY - smallerObject.posY), (biggerObject.posX - smallerObject.posX));

            if (distance < ball.radius + collider.radius - gap) {
                const { newVx1, newVy1, newVx2, newVy2 } = calculateBidimensionalDynamic(ball, collider);
                
                ball.applyVx(newVx1);
                ball.applyVy(newVy1);
                
                collider.applyVx(newVx2);
                collider.applyVy(newVy2);

                smallerObject.posX -= overlap * Math.cos(theta);
                smallerObject.posY -= overlap * Math.sin(theta); 
            }
        }
    }
}

class Vector {
    constructor(vx, vy) {
        this.vx = vx;
        this.vy = vy;
    }
    speed() {
        return calculatePitagoras(this.vx, this.vy);
    }
    angle() {
        return Math.atan2(this.vy, this.vx);
    }
    applyVx(number) {
        this.vx = number;
    }
    applyVy(number) {
        this.vy = number;
    }
}

class Ball extends Vector {
    constructor(posX, posY, vx, vy, mass, radius, color) {
        super(vx, vy)
        this.posX = posX;
        this.posY = posY;
        this.radius = radius;
        this.mass = mass;
        this.color = color;
    }
    move() {
        this.posX += this.vx;
        this.posY += this.vy;
    }
}

function createBall(posX, posY, vx, vy, mass, radius, color) {
    state.balls.push(new Ball(posX, posY, vx, vy, mass, mass*2, color))
};