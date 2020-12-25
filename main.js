"use strict";

/**
 * DEVELOPMENT
 */
console.info('%c Kingdoms of Ru', 'font-size: 13px; color: #15d640;');

const devMode = true;
let startingFrame;

if (devMode) {
  console.log('%c DEV MODE: TRUE', 'color: red');
  startingFrame = '2';
}


/**
 * Game object
 */
let game = {
    feed: '',
    character: {
        Name: 'Burnie',
    },
    currentSceneId: '1',
    currentFrameId: '1',
    currentSceneObj: '',
    currentFrameObj: ''
};


/**
 * Init (called by loadJSON)
 */
function init() {
  game.feed = document.getElementById('feed');
  let frame = '1';
  if (devMode) {
    frame = startingFrame;
  }
  loadFrame(frame);
}


/**
 * Load scenes from JSON then call init()
 */
function loadJSON() {
    const url = "scenes/scene-01.json"
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4){
          game.currentSceneObj = JSON.parse(xhr.response);
          init();
      }
    }
    xhr.send();

}

loadJSON();


/**
 * Set and keep focus on the prompt
 */
const prompt = document.getElementById("prompt");
window.onload = prompt.focus();
document.getElementById("prompt").onblur = function (event) {
  var blurEl = this;
  setTimeout(function () {
    blurEl.focus();
  }, 10);
};


/**
 * Load frame
 */
function loadFrame(frameId) {
  const frameDiv = document.createElement('div');
  feed.append(frameDiv);

  const sceneObj = game.currentSceneObj.frames;

  sceneObj.forEach((obj)=>{
    if (obj.ID === frameId) {
      game.currentFrameObj = obj;
    }
  });

  frameDiv.classList.add('frame');
  frameDiv.classList.add(`frame-${game.currentFrameObj.ID}`);

  // text
  let text = game.currentFrameObj.text;
  text = text.split('\r');
  text.forEach((paragraph) => {
    frameDiv.innerHTML += `<p>${paragraph}</p>`;
  });

  // continue
  if (game.currentFrameObj.continue) {
    frameDiv.innerHTML += '<p class="continue">Press ENTER to continue</p>';
  }

  // instruction
  if (game.currentFrameObj.instruction) {
    const instruction = game.currentFrameObj.instruction;
    frameDiv.innerHTML += `<p class="instruction">${instruction}</p>`;
  }

  // choices
  if (game.currentFrameObj.choices) {
    let html = '<ul class="choices">';
    const choices = game.currentFrameObj.choices;
    for (const property in choices) {
      html += `<li>${property}</li>`;
    }
    html += '</ul>';
    frameDiv.innerHTML += html;
  }
}

/**
 * Increment frame (+1 frame in the game object)
 */
function incrementFrame() {
  let num = parseInt(game.currentFrameId) + 1;
  game.currentFrameId = num.toString();
}

/**
 * Prompt input on enter
 */
document.addEventListener('keydown', function(e) {
    if (e.keyCode === 13) { // if key is enter
        // if continue
        if (game.currentFrameObj.continue) {
          incrementFrame();
          loadFrame(game.currentFrameId);
        }
        // else if choices
        else if (game.currentFrameObj.choices) {
          let input = prompt.value.toLowerCase();
          let choice = game.currentFrameObj.choices[input];
          loadFrame(choice.goToFrame);
          prompt.value = '';
        }
    }
});


