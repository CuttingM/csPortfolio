let p5_marchingSquares = new p5(p => {
    let x = 100;
    let y = 100;
    let squares;
    let noise_off = .1;
    let threshold = 0.5;

    let changed = true;

    p.setup = () => {
        p.canvas = p.createCanvas(500, 500);
        p.canvas.id('p5-marchingSquares');
        p.canvas.parent('p5-marchingSquares-container');

        squares = [];
        for(let j = 0; j < y; ++j) {
            squares[j] = []
            for(let i = 0; i < x; ++i) {
                squares[j][i] = false;
            }
        }
        
        // Generate noise
        generate_values(squares);
    }

    p.draw = () => {
        /*
        for(int i = 0; i < squares.length; ++i)
        {
            for(int j = 0; j < squares[i].length; ++j)
            System.out.print(squares[i][j] ? '#' : '_');
            System.out.println();
        }
        */
        let x_scale = 1. * p.width / (squares[0].length - 1);
        let y_scale = 1. * p.height / (squares.length - 1);
        
        if(changed) {
            p.background(0);
            draw_cubes(squares, x_scale, y_scale);
            changed = false;
        }
        if(p.mouseIsPressed) {
            let pos_x = Math.floor(p.mouseX / x_scale);
            let pos_y = Math.floor(p.mouseY / y_scale);
            remove_cave(squares, pos_y, pos_x);
            changed = true;
        }
    }

    const generate_values = array => {
        let hlen_x = array[0].length / 2.;
        let hlen_y = array.length / 2.;
        let dist = p.min(hlen_x, hlen_y);
        for(let i = 0; i < array.length; ++i)
            for(let j = 0; j < array[i].length; ++j)
            if(i == 0 || j == 0 || i == array.length - 1 || j == array[i].length - 1 || p.sqrt(p.pow(i - hlen_x, 2) + p.pow(j - hlen_y, 2)) > dist)
                array[i][j] = true;
            else
                array[i][j] = p.noise(j * noise_off, i * noise_off) > threshold;
    }

    const draw_cubes = (array, x_scale, y_scale) => {
        p.push();
        
        p.scale(x_scale, y_scale);
        p.strokeWeight(2. / (x_scale + y_scale));
        p.fill(255);
        p.stroke(255);
        for(let i = 0; i < array.length - 1; ++i) {
            for(let j = 0; j < array[i].length - 1; ++j) {
                draw_cube(array, i, j);
            }
        }
        p.pop();
    }

    const draw_cube = (array, i, j) => {
        let tl = array[i][j];
        let tr = array[i][j + 1];
        let bl = array[i + 1][j];
        let br = array[i + 1][j + 1];
        
        p.beginShape();
        
        if(tl) p.vertex(j, i);
        if(tl || tr) p.vertex(j + .5, i);
        if(tr) p.vertex(j + 1, i);
        if(tr || br) p.vertex(j + 1, i + .5);
        if(br) p.vertex(j + 1, i + 1);
        if(br || bl) p.vertex(j + .5, i + 1);
        if(bl) p.vertex(j, i + 1);
        if(bl || tl) p.vertex(j, i + .5);
        
        p.endShape();
        
    }

    const copy_matrix = matrix => {
        if(matrix.length == 0) return null;
        let copy = [];
        for(let i = 0; i < matrix.length; ++i)
            for(let j = 0; j < matrix[0].length; ++j)
                copy[i][j] = matrix[i][j];
        return copy;
    }

    const num_caves = matrix => {
        let copy = copy_matrix(matrix);
        let count = 0;
        for(let i = 0; i < copy.length; ++i) {
            for(let j = 0; j < copy[i].length; ++j) {
                if(!copy[i][j]) {
                    ++count;
                    remove_cave(copy, i, j);
                }
            }
        }
        return count;
    }

    const remove_cave = (matrix, i, j) => {
        if(i < 0 || i >= matrix.length || j < 0 || j >= matrix[i].length || matrix[i][j]) return;
        matrix[i][j] = true;
        
        remove_cave(matrix, i - 1, j);
        remove_cave(matrix, i, j + 1);
        remove_cave(matrix, i + 1, j);
        remove_cave(matrix, i, j - 1);
    }
});
