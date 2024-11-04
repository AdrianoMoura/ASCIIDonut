const density = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1    ?    i!lI;:,^'.         ";

const pixelSize = 10;
const width = 480;
const height = 640;

let gif;
let gifLowRes;
let maxFrame;
let frameCount = 0;

function preload() {
    gif = loadImage('./donut-donut-spin.gif');
    gifLowRes = loadImage('./donut-donut-spin.gif');
}

function setup() {
    noCanvas();
    maxFrame = gif.numFrames() - 1;

    gifLowRes.resize(width / pixelSize, height / pixelSize);
    
    sketchMain(gif, 'canvasOrig');
    sketchLowRes(gifLowRes, 'canvasLowRes');
    sketchLowResBW(gifLowRes, 'canvasLowResBW');
    sketchASCII(gifLowRes, 'ascii');

    document.getElementById('loading').style.display = 'none';
}

function draw() {
    frameCount = (frameCount + 1) % maxFrame;

    gif.setFrame(frameCount);
    gifLowRes.setFrame(frameCount);
    
    gif.loadPixels();
    gifLowRes.loadPixels();
}

const sketchMain = (gif, parentId) => {
    function sketch(p) {
        p.setup = () => {
            const canvas = p.createCanvas(width, height);
            canvas.parent(parentId);
        }

        p.draw = () => {
            p.background(255);

            drawImage(gif);
        }

        function drawImage(gif) {
            p.image(gif, 0, 0);
        }
    }

    new p5(sketch);
}

const sketchLowRes = (gif, parentId) => {
    function sketch(p) {
        p.setup = () => {
            const canvas = p.createCanvas(width, height);
            canvas.parent(parentId);
        }

        p.draw = () => {
            p.background(255);

            drawImage(gif);
        }

        function drawImage(gif) {
            for (let y = 0; y < gif.height; y++) {
                for (let x = 0; x < gif.width; x++) {
                    const pixelIndex = (x + y * gif.width) * 4;
                    const r = gif.pixels[pixelIndex + 0];
                    const g = gif.pixels[pixelIndex + 1];
                    const b = gif.pixels[pixelIndex + 2];

                    p.noStroke();
                    p.fill(r, g, b);

                    p.rect(
                        x * pixelSize,
                        y * pixelSize,
                        pixelSize,
                        pixelSize
                    )
                }
            }
        }
    }

    new p5(sketch);
}

const sketchLowResBW = (gif, parentId) => {
    function sketch(p) {
        p.setup = () => {
            const canvas = p.createCanvas(width, height);
            canvas.parent(parentId);
        }

        p.draw = () => {
            p.background(255);

            drawImage(gif);
        }

        function drawImage(gif) {
            for (let y = 0; y < gif.height; y++) {
                for (let x = 0; x < gif.width; x++) {
                    const pixelIndex = (x + y * gif.width) * 4;
                    const r = gif.pixels[pixelIndex + 0];
                    const g = gif.pixels[pixelIndex + 1];
                    const b = gif.pixels[pixelIndex + 2];
                    const avg = r * 0.3 + g * 0.59 + b * 0.11;

                    p.noStroke();
                    p.fill(avg);

                    p.rect(
                        x * pixelSize,
                        y * pixelSize,
                        pixelSize,
                        pixelSize
                    )
                }
            }
        }
    }

    new p5(sketch);
}

const sketchASCII = (gif, parentId) => {
    function sketch(p) {
        let asciiDiv = '';

        p.setup = () => {
            p.noCanvas();

            asciiDiv = p.createDiv();
            asciiDiv.parent(parentId);
        }

        p.draw = () => {
            p.background(255);

            drawImage(gif);
        }

        function drawImage(gif) {
            let asciiImage = '';

            for (let y = 0; y < gif.height; y++) {
                for (let x = 0; x < gif.width; x++) {
                    const pixelIndex = (x + y * gif.width) * 4;
                    const r = gif.pixels[pixelIndex + 0];
                    const g = gif.pixels[pixelIndex + 1];
                    const b = gif.pixels[pixelIndex + 2];

                    const avg = r * 0.3 + g * 0.59 + b * 0.11;
                    const len = density.length - 1;
                    const charIndex = p.floor(p.map(avg, 0, 255, len, 0));
                    const c = density.charAt(charIndex);

                    asciiImage += c === " " ? "&nbsp;" : c;
                }

                asciiImage += '<br/>';
            }

            asciiDiv.html(asciiImage);
        }
    }

    new p5(sketch);
}