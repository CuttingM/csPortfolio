let p5_lightning = new p5(p => {
    let boltX;
    let boltY;

    let sizeFunc;
    let angleFunc;
    let weightFunc;

    p.setup = () => {
        p.canvas = p.createCanvas(640, 480);
        p.canvas.id('p5-lightning');
        p.canvas.parent('p5-lightning-container');
        
        boltX = p.width / 2;
        boltY = 0;
        sizeFunc = x => (5 + p.random(10)) * (1 - x);
        angleFunc = x => p.random(-p.HALF_PI, p.HALF_PI);
        weightFunc = x => 5 * (1 - x);
        p.background(0);
    }

    p.draw = () => {
        if(!rangeCheck(p)) return;

        p.background(0, 0, 0, 64);
        if(Math.random() < .9) {
            // Yellow lightning
            p.stroke(255, 255, p.random(100, 255));
        } else {
            // Blue lightning
            let r = p.random(200, 255);
            p.stroke(r, r, 255);
        }
        
        if(p.keyIsPressed && p.keyCode == p.CONTROL && rangeCheck(p)) {
            boltX = p.mouseX;
            boltY = p.mouseY;
        }
        
        if(p.mouseIsPressed && rangeCheck(p)) {
            castLightning(boltX, boltY, p.mouseX, p.mouseY, sizeFunc, angleFunc, weightFunc);
        } else {
            castLightning(boltX, boltY, p.lerp(p.mouseX, p.noise(p.millis() / 1000) * p.width, 1 + 0 * Math.random()), p.lerp(p.mouseY, p.noise(500 + p.millis() / 1000) * p.height, 1 + 0 * Math.random()), sizeFunc, angleFunc, weightFunc);
        }
    }

    const castLightning = (originX, originY, targetX, targetY, sizeVariance, angleVariance, weightVariance) => {
        let maxDist = p.dist(originX, originY, targetX, targetY);
        let d = maxDist;
        
        for(let i = 0; i < 1000 && d > 1; ++i) {
            let progress = 1 - d / maxDist;
            let prevX = originX;
            let prevY = originY;
            
            let r = sizeVariance(progress)
            let theta = p.atan2(targetY - originY, targetX - originX) + angleVariance(progress);
            
            originX += r * p.cos(theta);
            originY += r * p.sin(theta);
            
            p.strokeWeight(weightVariance(progress));
            p.line(prevX, prevY, originX, originY);
            
            d = p.dist(originX, originY, targetX, targetY);
        }
    }
    
    const rangeCheck = p => {
        return 0 <= p.mouseX
               && p.mouseX < p.width
               && 0 <= p.mouseY
               && p.mouseY < p.height;
    }
});