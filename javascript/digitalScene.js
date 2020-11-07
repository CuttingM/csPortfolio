let p5_digitalScene = new p5(p => {
    let speed;

    let black;
    let white;
    let rockColor;
    let grassColor;
    let darkGrassColor;
    let dirtColor;
    let waterColor;
    let deepWaterColor;
    let sandColor;
    let snowColor;
    let cloudColor;

    let pixelSize;
    let pixelWitdh;
    let pixelHeight;
    let numPixels;

    let noiseScale;

    p.setup = () => {
        p.canvas = p.createCanvas(640, 480);
        p.canvas.id('p5-digitalScene');
        p.canvas.parent('p5-digitalScene-container');
        //frameRate(1);
        p.noiseSeed(0);
        
        speed = .5;
        
        black = p.color(0);
        white = p.color(255);
        grassColor = p.color(50, 150, 50);
        darkGrassColor = p.color(25, 75, 25);
        rockColor = p.color(100);
        dirtColor = p.color(100, 50, 50);
        waterColor = p.color(0, 100, 200);
        deepWaterColor = p.color(0, 50, 100);
        sandColor = p.color(240, 200, 175);
        snowColor = p.color(250);
        cloudColor = p.color(240);
        
        pixelSize = 10;
        pixelWidth = p.width / pixelSize;
        pixelHeight = p.height / pixelSize;
        numPixels = pixelWidth * pixelHeight;
        
        noiseScale = 0.005;
        
        p.noStroke();
    }

    p.draw = () => {
        if(!rangeCheck(p)) return;
        p.background(black);
        
        p.push();
        p.scale(pixelSize);
        
        // Loop through and draw each pixel
        for(let y = 0; y < pixelHeight; ++y) {
            for(let x = 0; x < pixelWidth; ++x) {
                // Generate height from noise
                let height = pixelNoise(x, y, secondsElapsed() * speed, pixelSize, noiseScale);
                
                // Get the color based on the height value
                let c = getColorFromHeight(height);
                let brightness = 1;//.7 + .3 * sin(TWO_PI * (second() % 24 + 1) / 24);
                
                // Draw the pixel
                p.fill(p.lerpColor(p.color(0), c, brightness));
                drawPixel(x, y);
            }
        }
        p.pop();
        
        // Print text
        /*scale(2);
        fill(0);
        rect(0, 0, 150, 35);
        fill(255);
        text("Mason Cutting period 7A", 5, 15);
        text("Framerate: " + Math.round(frameCount / secondsElapsed()) + "fps", 5, 30);
        */
    }

    /**
    * returns the total seconds elapsed since program execution
    */
    const secondsElapsed = () => p.millis() / 1000;

    /**
    * Similar to lerpColor but changes the value of amt according
    * to how many possible "steps" can be made from 0f to 1f
    */
    const stepLerpColor = (a, b, amt, steps) => {
        return p.lerpColor(a, b, 1 * Math.floor(amt * steps) / steps);
    }

    /**
    * Calculates Perlin noise for a 3d point, adjusting for noise scale
    */
    const pixelNoise = (x, y, z, pixelSize, noiseScale) => {
        noiseScale *= pixelSize;
        return p.noise(noiseScale * x, noiseScale * y, noiseScale * z);
    }

    /**
    * Draws a pixel of size pixlSize at the x and y position
    */
    const drawPixel = (x, y) => {
        p.rect(x, y, 1, 1);
    }

    /**
    * Returns a color signifying terrain based on a given terrain height.
    * The height must be between 0f and 1f
    */
    const getColorFromHeight = height => {
        if(height < .3) return deepWaterColor;
        else if(height < .42) return stepLerpColor(deepWaterColor, waterColor, (height - .3) / .12, 3);
        else if(height < .48) return stepLerpColor(sandColor, waterColor, 1 - p.sqrt((height - .42) / .06), 3);
        else if(height < .58) return stepLerpColor(grassColor, darkGrassColor, p.sq((height - .48) / .1), 3);
        else if(height < .63) return rockColor;
        return snowColor;
    }

    const rangeCheck = p => {
        return 0 <= p.mouseX
               && p.mouseX < p.width
               && 0 <= p.mouseY
               && p.mouseY < p.height;
    }
});