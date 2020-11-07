let p5_string = new p5(p => {
    let fontSize;
    let translatePerChar;
    let initialRot;

    p.setup = () => {
        p.canvas = p.createCanvas(640, 480);
        p.canvas.id('p5-string');
        p.canvas.parent('p5-string-container');
        
        fontSize = 32;
        translatePerChar = fontSize / 2;
        p.textFont("serif", fontSize);
        
        initialRot = 0;
    }

    p.draw = () => {
        if(!rangeCheck(p)) return;
        p.background(0);
        
        p.push();
        p.fill(255);
        p.translate(p.width / 2, p.height * 5 / 8);
        p.scale(2);
        drawTextCircle(" Hello, world" + '!'.repeat(Math.floor(3 + 2 * p.sin(p.millis() / 1000))), initialRot, translatePerChar);
        p.pop();
        
        p.push();
        p.fill(255, 255, 0);
        p.translate(p.width / 4, p.height / 4);
        p.scale(.75);
        drawTextCircle("This is pretty neat. ", -initialRot, translatePerChar);
        p.pop();
        
        p.push();
        p.fill(0, 255, 255);
        p.translate(p.width * 3 / 4, p.height / 4);
        p.scale(1.5);
        drawTextCircle("Idk what to write. ", -initialRot, translatePerChar);
        p.pop();
        
        initialRot += p.PI / 256;
    }

    const drawTextCircle = (str, initialRotation, charTranslate) => {
        let radius = str.length * charTranslate / p.TWO_PI;
        let rotationFrac = p.TWO_PI / str.length;
        
        p.push();
        p.rotate(-initialRot);
        p.translate(0, -radius);
        for(let i = 0; i < str.length; ++i)
        {
            p.rotate(rotationFrac);
            p.text(str.charAt(i), 0, 0)
            p.translate(charTranslate, 0);
        }
        p.pop();
    }

    const rangeCheck = p => {
        return 0 <= p.mouseX
               && p.mouseX < p.width
               && 0 <= p.mouseY
               && p.mouseY < p.height;
    }
});
