let p5_dice = new p5(p => {
    let dice = [];
    let separationDist = 100;
    let isRolling;
    let highScore;
    let lastTimeMillis;
    let currTimeMillis;
    let font;

    p.preload = () => {
        font = p.loadFont('../../Ubuntu-M.ttf');
    }

    p.setup = () => {
        p.canvas = p.createCanvas(640, 480, p.WEBGL);
        p.canvas.id('p5-dice');
        p.canvas.parent('p5-dice-container');
        p.textSize(32);
        dice = new Array(9);
        for(let i = 0; i < dice.length; ++i) {
            dice[i] = new Die(p.createVector(Math.floor(i % 3) * separationDist, Math.floor(i / 3) * separationDist, 0),
                              p.createVector(p.random(0, p.TWO_PI), p.random(0, p.TWO_PI), p.random(0, p.TWO_PI)),
                              50);
        }
        isRolling = true;
        highScore = 0;
        lastTimeMillis = p.millis();
        p.textFont(font);
    }

    p.draw = () => {
        currTimeMillis = p.millis();

        p.background(0);
        p.camera(separationDist, separationDist, 400, separationDist, separationDist, 0, 0, 1, 0);

        if(isRolling) {
            p.text("Click to roll", 0, -80);
        } else {
            const score = getRollSum(dice);
            if(highScore < score) highScore = score;
            p.text("Your score: " + score, -15, -80);
            p.text("(Click to re-roll)", -25, 300);
        }
        p.text("High score: " + highScore, -15, -48);

        for(let d of dice) {
            d.display();
            if(!isRolling) {
              d.rotateToSide(d.getLatestRoll());
            }
            d.update((currTimeMillis - lastTimeMillis) * .001);
        }

        lastTimeMillis = currTimeMillis;
    }

    p.mouseClicked = () => {
        if(isRolling) {
            for(let d of dice) {
                d.rollNew();
                d.setSpin(false);
            }
        } else {
            for(let d of dice) d.setSpin(true);
        }
        isRolling = !isRolling;
    }

    const getRollSum = dice => {
        let sum = 0;
        for(let d of dice) sum += d.getLatestRoll();
        return sum;
    }

    class Die {
        constructor(pos, rot, sz) {
            if(rot == null && sz == null) {
                sz = pos;
                pos = null;
            }
            this.position = pos || p.createVector(0, 0, 0);
            this.rotation = rot || p.createVector(0, 0, 0);
            this.size = sz;
            this.spinSpeed = 1;
            this.isSpinning = true;
            this.latestRoll = -1;
          }

        display() {
            p.push();
            this.applyTransforms();
            p.box(this.size);
            this.drawDots(5);
            p.pop();
        }

        update(deltaTime) {
            if(this.isSpinning) this.spin(deltaTime);
        }

        setSpin(b) {
            this.isSpinning = b;
        }

        getSpin() { return this.isSpinning; }

        setSpinSpeed(s) { this.spinSpeed = s; }

        getSpinSpeed() { return this.spinSpeed; }

        rollNew() {
            this.latestRoll = Math.floor(Math.random() * 6) + 1;
            return this.getLatestRoll();
        }

        getLatestRoll() {
            return this.latestRoll;
        }

        rotateToSide(sideNum) {
            switch(sideNum) {
                case 1:
                    this.rotation.x = p.HALF_PI;
                    this.rotation.y = 0;
                    this.rotation.z = 0;
                    break;
                case 2:
                    this.rotation.x = 0;
                    this.rotation.y = 0;
                    this.rotation.z = 0;
                    break;
                case 3:
                    this.rotation.x = 0;
                    this.rotation.y = -p.HALF_PI;
                    this.rotation.z = 0;
                    break;
                case 4:
                    this.rotation.x = 0;
                    this.rotation.y = p.HALF_PI;
                    this.rotation.z = 0;
                    break;
                case 5:
                    this.rotation.x = 0;
                    this.rotation.y = p.PI;
                    this.rotation.z = 0;
                    break;
                case 6:
                    this.rotation.x = -p.HALF_PI;
                    this.rotation.y = 0;
                    this.rotation.z = 0;
                    break;
                default:
                    throw new Error("Invalid Argument");
            }
        }

        spin(deltaTime) {
            this.rotation.y += this.spinSpeed * deltaTime * p.TWO_PI;
            this.rotation.x += this.spinSpeed * deltaTime * p.PI;
        }

        applyTransforms() {
            p.translate(this.position.x, this.position.y, this.position.z);
            p.rotateX(this.rotation.x);
            p.rotateY(this.rotation.y);
            p.rotateZ(this.rotation.z);
        }

        drawDots(radius) {
            const halfSize = this.size / 2;
            const quarterSize = this.size / 4;

            p.push();
            p.noStroke();
            p.fill(0);

            // One
            p.push();
            p.translate(0, halfSize, 0);
            p.scale(1, .1, 1);
            p.sphere(radius);
            p.pop();

            // Two
            p.push();
            p.translate(-quarterSize, -quarterSize, halfSize);
            p.scale(1, 1, .1);
            p.sphere(radius);
            p.translate(halfSize, halfSize, 0);
            p.sphere(radius);
            p.pop();

            // Three
            p.push();
            p.translate(halfSize, -quarterSize, -quarterSize);
            p.scale(.1, 1, 1);
            p.sphere(radius);
            p.translate(0, quarterSize, quarterSize);
            p.sphere(radius);
            p.translate(0, quarterSize, quarterSize);
            p.sphere(radius);
            p.pop();

            // Four
            p.push();
            p.translate(-halfSize, -quarterSize, -quarterSize);
            p.scale(.1, 1, 1);
            p.sphere(radius);
            p.translate(0, halfSize, 0);
            p.sphere(radius);
            p.translate(0, 0, halfSize);
            p.sphere(radius);
            p.translate(0, -halfSize, 0);
            p.sphere(radius);
            p.pop();

            // Five
            p.push();
            p.translate(0, 0, -halfSize);
            p.scale(1, 1, .1);
            p.sphere(radius);
            p.translate(-quarterSize, -quarterSize);
            p.sphere(radius);
            p.translate(0, halfSize, 0);
            p.sphere(radius);
            p.translate(halfSize, 0, 0);
            p.sphere(radius);
            p.translate(0, -halfSize, 0);
            p.sphere(radius);
            p.pop();

            // Six
            p.push();
            p.translate(-quarterSize, -halfSize, -quarterSize);
            p.scale(1, .1, 1);
            p.sphere(radius);
            p.translate(0, 0, quarterSize);
            p.sphere(radius);
            p.translate(0, 0, quarterSize);
            p.sphere(radius);
            p.translate(halfSize, 0, 0);
            p.sphere(radius);
            p.translate(0, 0, -quarterSize);
            p.sphere(radius);
            p.translate(0, 0, -quarterSize);
            p.sphere(radius);
            p.pop();

            p.pop();
        }
    }
});
