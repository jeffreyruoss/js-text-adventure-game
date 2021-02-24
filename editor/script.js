const framesContainer = document.getElementById('frames-container');
const addFrameBtn = document.getElementById('add-frame');
let frameId = 1;

const addFrame = () => {
    const frame = document.createElement('div');
    frame.classList.add('frame', 'card');
    frame.innerHTML = `This is a frame ID #${frameId}`;
    frameId++;
    framesContainer.appendChild(frame);
};

addFrameBtn.addEventListener('click', addFrame);