const density = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1    ?    i!lI;:,^'.         ";

const pixelSize = 8;
const width = 480;
const height = 640;
const padding = 20;

let gif;
let gifSmallResolution;
let maxFrame;
let frameCount = 1
let asciiDiv = '';

function preload() {
    gif = loadImage('./donut-donut-spin.gif');
    gifSmallResolution = loadImage('./donut-donut-spin.gif');
}

function setup() {
    const canvas = createCanvas((width + padding) * 3, height);

    canvas.parent('main');

    maxFrame = gif.numFrames() - 1;
    asciiDiv = createDiv();

    asciiDiv.parent('main');

    gifSmallResolution.resize(width / pixelSize, height / pixelSize);
}

function draw() {
    background(255);

    gif.setFrame(frameCount);
    gifSmallResolution.setFrame(frameCount);

    frameCount = (frameCount + 1) % maxFrame

    gif.loadPixels();
    gifSmallResolution.loadPixels();

    drawImageColor(gif);
    drawImageColorSmallResolution(gifSmallResolution);
    drawImageColorSmallResolutionBW(gifSmallResolution);
    drawImageAscii(gifSmallResolution);
    // noLoop();
}

function drawImageColor(gif) {
    image(gif, 0, 0);
}

function drawImageColorSmallResolution(gif) {
    for (let y = 0; y < gif.height; y++) {
        for (let x = 0; x < gif.width; x++) {
            const pixelIndex = (x + y * gif.width) * 4;
            const r = gif.pixels[pixelIndex + 0];
            const g = gif.pixels[pixelIndex + 1];
            const b = gif.pixels[pixelIndex + 2];

            noStroke();
            fill(r, g, b);

            rect(
                x * pixelSize + width + padding,
                y * pixelSize,
                pixelSize,
                pixelSize
            )
        }
    }
}

function drawImageColorSmallResolutionBW(gif) {
    for (let y = 0; y < gif.height; y++) {
        for (let x = 0; x < gif.width; x++) {
            const pixelIndex = (x + y * gif.width) * 4;
            const r = gif.pixels[pixelIndex + 0];
            const g = gif.pixels[pixelIndex + 1];
            const b = gif.pixels[pixelIndex + 2];

            const avg = r * 0.3 + g * 0.59 + b * 0.11;
            
            noStroke();
            fill(avg);

            rect(
                x * pixelSize + (width + padding) * 2,
                y * pixelSize,
                pixelSize,
                pixelSize
            )
        }
    }
}


function drawImageAscii(gif) {
    let asciiImage = '';

    for (let y = 0; y < gif.height; y++) {
        for (let x = 0; x < gif.width; x++) {
            const pixelIndex = (x + y * gif.width) * 4;
            const r = gif.pixels[pixelIndex + 0];
            const g = gif.pixels[pixelIndex + 1];
            const b = gif.pixels[pixelIndex + 2];

            const avg = r * 0.3 + g * 0.59 + b * 0.11;
            const len = density.length - 1;
            const charIndex = floor(map(avg, 0, 255, len, 0));
            const c = density.charAt(charIndex);

            asciiImage += c === " " ? "&nbsp;" : c;
        }

        asciiImage += '<br/>';
    }

    asciiDiv.html(asciiImage);
}