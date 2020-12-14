const p5_starfield = new p5(p => {
    let particles = [];
    let timer;

    class NormalParticle {
        constructor(scalar, theta) {
            this.x = scalar * p.cos(theta);
            this.y = scalar * p.sin(theta);
            this.angle = 0;
            this.speed = 100;
            this.color = p.color(p.random(128), p.random(0), p.random(128));
        }

        show() {
            p.push();
            p.noStroke();
            p.fill(this.color);
            p.circle(this.x, this.y, 3);
            p.pop();
        }

        move(deltaTime) {
            this.x += deltaTime * this.speed * p.cos(this.angle);
            this.y += deltaTime * this.speed * p.sin(this.angle);

            this.angle += (1 + p.sin(p.millis())) * p.PI / 32;
        }
    }

    class JumboParticle extends NormalParticle {
        show() {
            p.push();
            p.noStroke();
            p.fill(this.color);
            p.circle(this.x, this.y, 10);
            p.pop();
        }
    }

    class OddballParticle {
        constructor(scalar, theta) {
            this.x = scalar * p.cos(theta);
            this.y = scalar * p.sin(theta);
            this.angle = p.PI;
            this.speed = 200;
            this.color = p.color(p.random(0), p.random(256), p.random(256));
            this.thetaInitial = theta;
            this.scalarInitial = scalar;
        }

        show() {
            p.push();
            p.noStroke();
            p.fill(this.color);
            p.circle(this.x, this.y, 3);
            p.pop();
        }

        move(deltaTime) {
            const speed = this.speed * deltaTime;
            this.x += speed * p.cos(this.angle);
            this.y += speed * p.sin(this.angle);

            const angleToCenter = p.atan2(this.y, this.x)
            this.x += speed * p.cos(angleToCenter);
            this.y += speed * p.sin(angleToCenter);

            const halfW = p.width / 2;
            const halfH = p.height / 2;

            if(p.dist(0, 0, p.width / 2, p.height / 2)
               < p.dist(0, 0, this.x, this.y))
            {
                this.x = 0;
                this.y = 0;
                this.angle = this.thetaInitial;
            }

            this.angle += p.PI / 32;
        }
    }

    class Timer {
        constructor(timeFunc) {
            this.getTime = timeFunc;
            this.timeCreated = this.getTime();
            this.lastRecorded = this.timeCreated;
            this.delta = 0;
            this.totalTime = 0;
            this.isCurrentlyTiming = false;
        }

        start() {
            this.lastRecorded = this.getTime();
            this.isCurrentlyTiming = true;
        }

        stop() {
            const t = this.getTime();
            this.delta = t - this.lastRecorded;
            this.totalTime += this.delta;
            this.lastRecorded = t;
            this.isCurrentlyTiming = false;
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

    p.setup = () => {
        p.canvas = p.createCanvas(640, 480);
        p.canvas.id('p5-starfield');
        p.canvas.parent('p5-starfield-container');

        timer = new Timer(() => p.millis() / 1000.0);

        let theta = 1;
        let scalar = 0.01;
        while(theta * scalar < p.dist(0, 0, p.width / 2, p.height / 2)) {
            if(isPrime(theta)) {
                if(Math.random() < 0.9) {
                    particles.push(new NormalParticle(scalar * theta, theta));
                } else {
                    particles.push(new JumboParticle(scalar * theta, theta));
                }
            } else {
                particles.push(new OddballParticle(scalar * theta, theta));
            }
            theta += 100;
        }
    }

    p.draw = () => {
        if(timer.isTiming()) timer.stop();
        if(!rangeCheck(p)) return;

        p.background(0, 0, 0, 50);
        p.translate(p.width / 2, p.height / 2);

        for(const p of particles) {
            p.show();
            p.move(timer.getDelta());
        }

        timer.start()
    }

    const gcf = n => {
        let result = cache[p.int(n / 2)] || 1;

        for(let i = 1; i < p.int(n / 2); ++i) {
            if(n % i === 0) result = i;
        }

        return result;
    }

    const _isPrime = n => {
        for(let i = 2; i <= n / 2; ++i) {
            if(n % i === 0)
                return false;
        }

        return true;
    }

    const cache = [];
    const isPrime = n => {
        if(cache[n] == null) {
            cache[n] = _isPrime(n);
        }

        return cache[n];
    }

    const rangeCheck = p => {
        return 0 <= p.mouseX
               && p.mouseX < p.width
               && 0 <= p.mouseY
               && p.mouseY < p.height;
    }
});
