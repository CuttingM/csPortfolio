let p5_chemotaxis = new p5(p => {
    // Class definitions
    class Particle {
        constructor(x, y, m, q, rd, mu) {
            this.pos = p.createVector(x || 0, y || 0);
            this.vel = p.createVector(0, 0);
            this.mass = m || 1;
            this.charge = q || 1;
            this.radius = rd || 100;
            this.friction = mu || 0;
        }

        attract(other, deltaTime) {
            let dir = other.pos.copy().sub(this.pos);
            let dist = dir.mag(); dir.normalize();
            // Prevent extreme values for acceleration
            if(dist < 1) dist = 1;
            let magnitude = 0;

            // Accelerate due to charge
            magnitude += -(this.charge * other.charge) / dist / dist / this.mass;
            // Accelerate due to gravity
            magnitude += 1000 * other.mass / dist / dist;

            if(dist < this.radius + other.radius) magnitude *= -1
            this.vel.add(dir.mult((1 - this.friction) * magnitude * deltaTime));
        }

        display() {
            p.push();
            p.noStroke();
            if(this.charge < 0) p.fill(0, 0, 255);
            else p.fill(255, 0, 0);
            p.circle(this.pos.x, this.pos.y, this.radius);
            //line(this.pos.x, this.pos.y, this.pos.x + this.vel.x, this.pos.y + this.vel.y);
            p.pop();
        }

        update(deltaTime) {
            this.pos.x += this.vel.x * deltaTime;
            this.pos.y += this.vel.y * deltaTime;
        }

        static hasDifferingCharges(p1, p2) {
            return p1.charge < 0 ^ p2.charge < 0
        }
    }

    class World {
        constructor(width, height, gravity, rotGravity, particles) {
            this.width = width || 100;
            this.height = height || 100;
            this.gravity = gravity || p.createVector(0, 0);
            this.rotGravity = rotGravity || 0;
            this.particles = particles || [];
        }

        addParticle(particle) {
            this.particles.push(particle);
        }

        update(deltaTime) {
            // Particle-particle interactions
            for(const pair of this.unorderedPairs()) {
                pair.first.attract(pair.second, deltaTime);
                pair.second.attract(pair.first, deltaTime);
            }
            // Update particle positions
            const g = this.gravity.copy().mult(deltaTime);
            const rotationalG = this.rotGravity * deltaTime;
            for(const particle of this.particles) {
                particle.vel.add(g);
                particle.update(deltaTime);
                if(this.hasOverflow(particle))
                    this.handleOverflowWall(particle);
                const perpToCenter = p.createVector(this.width / 2, this.height / 2)
                                     .sub(particle.pos);
                const temp = -perpToCenter.x;
                perpToCenter.x = perpToCenter.y;
                perpToCenter.y = temp;
                particle.vel.add(perpToCenter.mult(rotationalG))
            }
        }

        display() {
            for(const particle of this.particles)
            particle.display();
        }

        hasOverflow(particle) {
            const x = particle.pos.x;
            const y = particle.pos.y;
            return x < 0 || this.width <= x
            || y < 0 || this.height <= y;
        }

        handleOverflowWrap(particle) {
            particle.pos.x %= this.width;
            if(particle.pos.x < 0) particle.pos.x += this.width;
            particle.pos.y %= this.height;
            if(particle.pos.y < 0) particle.pos.y += this.height;
        }

        handleOverflowWall(particle) {
            if(particle.pos.x < 0) {
                particle.pos.x = 0;
                particle.vel.x = 0;
            }
            if(this.width <= particle.pos.x) {
                particle.pos.x = this.width;
                particle.vel.x = 0;
            }
            if(particle.pos.y < 0) {
                particle.pos.y = 0;
                particle.vel.y = 0;
            }
            if(this.height <= particle.pos.y) {
                particle.pos.y = this.height;
                particle.vel.y = 0;
            }
        }

        handleOverflowBounce(particle) {
            if(particle.pos.x < 0) {
                particle.pos.x = 0;
                particle.vel.x *= -1;
            }
            if(this.width <= particle.pos.x) {
                particle.pos.x = this.width;
                particle.vel.x *= -1;
            }
            if(particle.pos.y < 0) {
                particle.pos.y = 0;
                particle.vel.y *= -1;
            }
            if(this.height <= particle.pos.y) {
                particle.pos.y = this.height;
                particle.vel.y *= -1;
            }
        }

        // Generators and iterators
        [Symbol.iterator]() {
            return this.particles[Symbol.iterator]();
        }

        *orderedPairs() {
            for(let i = 0; i < this.particles.length; ++i)
            for(let j = 0; j < this.particles.length; ++j)
            if(i != j)
            yield new Pair(this.particles[i], this.particles[j]);
        }

        *unorderedPairs() {
            for(let i = 0; i < this.particles.length; ++i)
            for(let j = i + 1; j < this.particles.length; ++j)
            yield new Pair(this.particles[i], this.particles[j]);
        }
    }

    // Utility class to deal with returning a pair of objects
    class Pair {
        constructor(first, second) {
            this.first = first;
            this.second = second;
        }
    }

    // Utility class to deal with timing
    class Timer {
        constructor(timeFunc) {
            this.getTime = timeFunc;
            this.timeCreated = this.getTime();
            this.lastRecorded = this.timeCreated;
            this.delta = 0;
            this.totalTime = 0;
            this.isCurrentlyTiming = false
        }

        start() {
            this.lastRecorded = this.getTime();
            this.isCurrentlyTiming = true;
        }

        stop() {
            const t = this.getTime();
            this.delta = t - this.lastRecorded;
            this.totalTime += this.delta
            this.lastRecorded = t;
            this.isCurrentlyTiming = false
        }

        isTiming() {
            return this.isCurrentlyTiming;
        }

        getDelta() {
            return this.delta;
        }

        getTotalTime() {
            return this.totalTime;
        }

        getTimeSinceCreation() {
            return this.getTime() - this.timeCreated;
        }
    }

    // Main program
    let world;
    let mouse;
    let g = 5;
    let timer;

    const randomParticle = (minPosX, minPosY, maxW, maxH, massVariance) => {
        return new Particle(minPosX + Math.random() * maxW,
                            minPosY + Math.random() * maxH,
                            10 + Math.random() * massVariance,
                            (Math.random() < .5) ? -100 : 100,
                            5 + Math.random() * 2,
                            Math.random() * .5);
    }

    const seconds = () => p.millis() / 1000;

    p.setup = () => {
        p.canvas = p.createCanvas(640, 480);
        p.canvas.id('p5-chemotaxis');
        p.canvas.parent('p5-chemotaxis-container');
        mouse = new Particle(0, 0, 1000, 100, 50, 1);
        gravity = p.createVector(0, 0);
        world = new World(p.width, p.height, p.createVector(0, 0), 0.05);
        for(let i = 0; i < 50; ++i) {
            const particle = randomParticle(0, 0, p.width, p.height, 10);
            particle.vel.x = 1;
            world.addParticle(particle);
        }
        world.addParticle(mouse);
        timer = new Timer(seconds);
        timer.start(); timer.stop();
    }

    p.draw = () => {
        if(timer.isTiming()) timer.stop();
        if(!rangeCheck(p)) return;
        p.background(220);

        world.gravity.x = g * Math.cos(seconds());
        world.gravity.y = g * Math.sin(seconds());
        mouse.pos.x = p.mouseX;
        mouse.pos.y = p.mouseY;
        mouse.vel.x = 0;
        mouse.vel.y = 0;
        world.update(timer.getDelta());
        world.display();

        timer.start();
    }

    const rangeCheck = p => {
        return 0 <= p.mouseX
               && p.mouseX < p.width
               && 0 <= p.mouseY
               && p.mouseY < p.height;
    }
});
