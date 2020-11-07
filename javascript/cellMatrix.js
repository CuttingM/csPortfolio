let p5_cellMatrix = new p5(p => {
    let noiseInc;

    let cells;
    let cellSize;
    let rows;
    let cols;

    let noiseThresholdValue;
    let valFunc;
    let thresholdFunc;
    let interpolationFunc;

    let red;
    let green;
    let blue;
    let white;
    let black;

    p.setup = () => {
        p.canvas = p.createCanvas(640, 480);
        p.canvas.id('p5-cellMatrix');
        p.canvas.parent('p5-cellMatrix-container');

        p.noiseSeed(p.millis());

        cellSize = 3;
        noiseInc = .02 * cellSize;
        rows = Math.floor(p.height / cellSize) + 1;
        cols = Math.floor(p.width / cellSize) + 1;

        noiseThresholdValue = .3
        valFunc = (i, j) => (p.dist(0, 0, j - cols / 2, i - rows / 2) / p.dist(0, 0, cols / 2, rows / 2) * p.noise(j * noiseInc, i * noiseInc));
        thresholdFunc = x => x > noiseThresholdValue;
        interpolationFunc = (a, b) => {
            let x = (noiseThresholdValue - a) / (b - a);
            return x * x * (3 - 2 * x);
        };
        cells = initializeCellMatrix(rows, cols, valFunc);

        red = p.color(255, 0, 0);
        green = p.color(0, 255, 0);
        blue = p.color(0, 0, 255);
        white = p.color(255);
        black = p.color(0);
    }

    p.draw = () => {
        if(!rangeCheck(p)) return;
        if(p.frameCount % 10 != 0) return;

        /*
        let diff;
        do {
            let change = iterateCells(cells);
            cells = change.matrix;
            diff = change.diff;
            // let newIndexes = change.newIndexes;
        } while(diff != 0);
        p.push();
        p.translate(-cellSize / 2, -cellSize / 2);
        // showCells(cells, cellSize, black, p.color(120));
        // showCells(cells, cellSize, green, red, newIndexes);
        p.pop();
        p.background(green);
        */
        p.noStroke();
        p.background(green);
        p.fill(blue);
        marchSquares(cells, cellSize, thresholdFunc, interpolationFunc);
        p.noLoop();
    }

    p.mousePressed = () =>
    {
        if(!rangeCheck(p)) return;

        noiseThresholdValue = p.mouseY / p.height;
        cells = initializeCellMatrix(rows, cols, valFunc);
        //p.noiseSeed(p.millis());
        //cells = initializeCellMatrix(rows, cols, valFunc);
        p.loop();
    }

    const initializeCellMatrix = (rows, cols, valFunc) => {
        // Create cells array
        let cellMatrix = new Array(rows);
        for(let i = 0; i < rows; ++i)
            cellMatrix[i] = new Array(cols);

        // Generate values
        for(let i = 0; i < cellMatrix.length; ++i)
            for(let j = 0; j < cellMatrix[i].length; ++j)
            cellMatrix[i][j] = valFunc(i, j); //(dist(0, 0, j - cols / 2, i - rows / 2) / dist(0, 0, cols / 2, rows / 2) > .85) || (noise(j * .1, i * .1) > .5);

        return cellMatrix;
    }

    const countAlive = cellMatrix => {
        let count = 0;
        for(let i = 0; i < cellMatrix.length; ++i)
            for(let j = 0; j < cellMatrix[i].length; ++j)
                if(cellMatrix[i][j])
                    ++count;
        return count;
    }

    const showCells = (cellMatrix, cellSize, liveCol, deadCol, indexes) => {
        p.push();
        if(!liveCol) liveCol = p.color(0);
        if(!deadCol) deadCol = p.color(255);
        p.scale(cellSize);
        p.stroke(0);
        p.strokeWeight(0);
        if(indexes == null) {
            for(let i = 0; i < cellMatrix.length; ++i) {
                for(let j = 0; j < cellMatrix[i].length; ++j) {
                    if(cellMatrix[i][j]) p.fill(liveCol);
                    else p.fill(deadCol);
                    p.rect(j, i, 1, 1);
                }
            }
        } else {
            for(let pair of indexes) {
                if(cellMatrix[pair.i][pair.j])
                    p.fill(liveCol);
                else
                    p.fill(deadCol);
                p.rect(pair.j, pair.i, 1, 1);
            }
        }
        p.pop();
    }

    const getSurroundingStatus = (cellMatrix, r, c) => {
        let status = {live: 0, total: 0};
        for(let i = r - 1; i < r + 2; ++i)
        {
            for(let j = c - 1; j < c + 2; ++j)
            {
              if(i == r && j == c) continue;
              if(i < 0 || j < 0 || i >= cellMatrix.length || j >= cellMatrix[i].length) continue;
              ++status.total;
              if(cellMatrix[i][j]) ++status.live;
            }
        }
        status.frac = status.live / status.total;
        return status;
    }

    const iterateCells = cellMatrix => {
        let newMatrix = new Array(rows);
        for(let i = 0; i < rows; ++i)
            newMatrix[i] = new Array(cols);
        let cellDiff = 0;
        let changes = [];

        for(let i = 0; i < cellMatrix.length; ++i)
        {
            for(let j = 0; j < cellMatrix[i].length; ++j)
            {
            let frac = getSurroundingStatus(cellMatrix, i, j).frac;

            // Control how cells 'live' or 'die'
            if(cellMatrix[i][j])
            {
                if(frac < 4 / 8) newMatrix[i][j] = false;
                else newMatrix[i][j] = true;
            }
            else
            {
                if(frac >= 5 / 8) newMatrix[i][j] = true;
                else newMatrix[i][j] = false;
            }

            // Count cell changes per each generation
            if(cellMatrix[i][j] ^ newMatrix[i][j])
            {
                if(newMatrix[i][j]) ++cellDiff;
                else --cellDiff;
                changes.push({i: i, j: j});
            }
            }
        }
        return {matrix: newMatrix, diff: cellDiff, newIndexes: changes};
    }

    const marchSquares = (matrix, cellSize, threshold, interp) => {
        p.push();
        p.scale(cellSize);
        for(let i = 0; i < matrix.length - 1; ++i) {
            for(let j = 0; j < matrix[i].length - 1; ++j) {
                p.push();
                p.translate(j, i);
                marchSquare(matrix, i, j, threshold, interp);
                p.pop();
            }
        }
        p.pop();
    }

    /*
    const marchSquare = (matrix, i, j) => {
        let rotateShift = () => {
            p.rotate(p.HALF_PI);
            p.translate(0, -1);
        }

        let status = matrix[i][j] << 0
                    | matrix[i][j + 1] << 1
                    | matrix[i + 1][j + 1] << 2
                    | matrix[i + 1][j] << 3;

        p.beginShape();
        switch(status) {
            // No vertices
            case 0:
                break;
            // Small triangle symmetry
            case 8:
                rotateShift();
            case 4:
                rotateShift();
            case 2:
                rotateShift();
            case 1:
                p.vertex(0, 0);
                p.vertex(.5, 0);
                p.vertex(0, .5);
            break;
            // Large triangle symmetry
            case 11:
                rotateShift();
            case 13:
                rotateShift();
            case 14:
                rotateShift();
            case 7:
                p.vertex(0, 0);
                p.vertex(0, .5);
                p.vertex(.5, 1);
                p.vertex(1, 1);
                p.vertex(1, 0);
            break;
            // Half rectangle symmetry
            case 9:
                rotateShift();
            case 12:
                rotateShift();
            case 6:
                rotateShift();
            case 3:
                p.vertex(0, 0);
                p.vertex(0, .5);
                p.vertex(1, .5);
                p.vertex(1, 0);
            break;
            // Opposite symmetry
            case 10:
                rotateShift();
            case 5:
                p.vertex(0, 0);
                p.vertex(0, .5);
                p.vertex(.5, 1);
                p.vertex(1, 1);
                p.vertex(1, .5);
                p.vertex(.5, 0);
            break;
            // Full square
            case 15:
                p.vertex(0, 0);
                p.vertex(0, 1);
                p.vertex(1, 1);
                p.vertex(1, 0);
            break;
        }
        p.endShape(p.CLOSE);
    }
    */

    let marchSquare = (matrix, i, j, threshold, interp) => {
        p.push();
        p.scale(.1);
        let status = threshold(matrix[i][j]) << 0
                     | threshold(matrix[i][j + 1]) << 1
                     | threshold(matrix[i + 1][j + 1]) << 2
                     | threshold(matrix[i + 1][j]) << 3;

        let to = 10 * interp(matrix[i][j], matrix[i][j + 1]);
        let ri = 10 * interp(matrix[i][j + 1], matrix[i + 1][j + 1]);
        let bo = 10 * interp(matrix[i + 1][j + 1], matrix[i + 1][j]);
        let le = 10 * interp(matrix[i + 1][j], matrix[i][j]);

        let rotateShift = () => {
            p.rotate(p.HALF_PI);
            p.translate(0, -10);
            let t = to; to = ri; ri = bo; bo = le; le = t;
        }

        p.beginShape();
        switch(status) {
            // No vertices
            case 0:
                break;
            // Small triangle symmetry
            case 8:
                rotateShift();
            case 4:
                rotateShift();
            case 2:
                rotateShift();
            case 1:
                p.vertex(0, 0);
                p.vertex(to, 0);
                p.vertex(0, 10 - le);
                break;
            // Large triangle symmetry
            case 11:
                rotateShift();
            case 13:
                rotateShift();
            case 14:
                rotateShift();
            case 7:
                p.vertex(0, 0);
                p.vertex(0, 10 - le);
                p.vertex(10 - bo, 10);
                p.vertex(10, 10);
                p.vertex(10, 0);
                break;
            // Half rectangle symmetry
            case 9:
                rotateShift();
            case 12:
                rotateShift();
            case 6:
                rotateShift();
            case 3:
                p.vertex(0, 0);
                p.vertex(0, 10 - le);
                p.vertex(10, ri);
                p.vertex(10, 0);
                break;
            // Opposite symmetry
            case 10:
                rotateShift();
            case 5:
                p.vertex(0, 0);
                p.vertex(0, 10 - le);
                p.vertex(10 - bo, 10);
                p.vertex(10, 10);
                p.vertex(10, ri);
                p.vertex(to, 0);
                break;
            // Full square
            case 15:
                p.vertex(0, 0);
                p.vertex(0, 10);
                p.vertex(10, 10);
                p.vertex(10, 0);
                p.vertex(0, 0);
            break;
        }
        p.endShape(p.CLOSE);
        p.pop();
    }

    const rangeCheck = p => {
        return 0 <= p.mouseX
               && p.mouseX < p.width
               && 0 <= p.mouseY
               && p.mouseY < p.height;
    }
});
