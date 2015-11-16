# pixi-accessibility

A plugin that adds accessibility to Pixi.js

**Note**: This modules *requires* v3.0.9 (or higher) of pixi.js.

The Accessibility manager reacreates the ability to tab and and have content read by screen readers. This is very important as it can possibly help people with disabilities access pixi content.

Much like interaction any DisplayObject can be made accessible. This manager will map the events as if the mouse was being used, minimizing the efferot required to implement.

Check it out in action here (try tabbing):

[demo]: http://www.goodboydigital.com/pixijs/accessibility/accessibility.html

## Usage

I have made this as easy as possible to use in the hope that all those awesome pixi sites and games can become usable by people without the ability to use the mouse or see content.


```js

// Create a sprite as usual..
var mySprite = PIXI.Sprite.fromImage('myImage.png');

// Make sprite interactive..
mySprite.interactive = true;

// Make it accessible..
mySprite.accessible = true;
// The description of the button for the screen reader
mySprite.accessibleTitle = 'Hello Button';

mySprite.click = function(){

  alert("Hello")

}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(stage);
}

animate();

```

## Building

You normally don't need to build this module, you can just download a release from the
releases page.

However, if you are developing on the project or want a bleeding edge build then you
will need to have [node][node] and [gulp][gulp] setup on your machine.

Then you can install dependencies and build:

```js
npm i && npm run build
```

That will output the built distributables to `./bin`.

[node]:       http://nodejs.org/
[gulp]:       http://gulpjs.com/

**Your support helps us make Pixi.js even better. Make your pledge on [Patreon](https://www.patreon.com/user?u=2384552&ty=h&u=2384552) and we'll love you forever!**
