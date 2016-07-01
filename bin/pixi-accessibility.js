(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * isMobile.js v0.4.0
 *
 * A simple library to detect Apple phones and tablets,
 * Android phones and tablets, other mobile devices (like blackberry, mini-opera and windows phone),
 * and any kind of seven inch device, via user agent sniffing.
 *
 * @author: Kai Mallea (kmallea@gmail.com)
 *
 * @license: http://creativecommons.org/publicdomain/zero/1.0/
 */
(function (global) {

    var apple_phone         = /iPhone/i,
        apple_ipod          = /iPod/i,
        apple_tablet        = /iPad/i,
        android_phone       = /(?=.*\bAndroid\b)(?=.*\bMobile\b)/i, // Match 'Android' AND 'Mobile'
        android_tablet      = /Android/i,
        amazon_phone        = /(?=.*\bAndroid\b)(?=.*\bSD4930UR\b)/i,
        amazon_tablet       = /(?=.*\bAndroid\b)(?=.*\b(?:KFOT|KFTT|KFJWI|KFJWA|KFSOWI|KFTHWI|KFTHWA|KFAPWI|KFAPWA|KFARWI|KFASWI|KFSAWI|KFSAWA)\b)/i,
        windows_phone       = /IEMobile/i,
        windows_tablet      = /(?=.*\bWindows\b)(?=.*\bARM\b)/i, // Match 'Windows' AND 'ARM'
        other_blackberry    = /BlackBerry/i,
        other_blackberry_10 = /BB10/i,
        other_opera         = /Opera Mini/i,
        other_chrome        = /(CriOS|Chrome)(?=.*\bMobile\b)/i,
        other_firefox       = /(?=.*\bFirefox\b)(?=.*\bMobile\b)/i, // Match 'Firefox' AND 'Mobile'
        seven_inch = new RegExp(
            '(?:' +         // Non-capturing group

            'Nexus 7' +     // Nexus 7

            '|' +           // OR

            'BNTV250' +     // B&N Nook Tablet 7 inch

            '|' +           // OR

            'Kindle Fire' + // Kindle Fire

            '|' +           // OR

            'Silk' +        // Kindle Fire, Silk Accelerated

            '|' +           // OR

            'GT-P1000' +    // Galaxy Tab 7 inch

            ')',            // End non-capturing group

            'i');           // Case-insensitive matching

    var match = function(regex, userAgent) {
        return regex.test(userAgent);
    };

    var IsMobileClass = function(userAgent) {
        var ua = userAgent || navigator.userAgent;

        // Facebook mobile app's integrated browser adds a bunch of strings that
        // match everything. Strip it out if it exists.
        var tmp = ua.split('[FBAN');
        if (typeof tmp[1] !== 'undefined') {
            ua = tmp[0];
        }

        // Twitter mobile app's integrated browser on iPad adds a "Twitter for
        // iPhone" string. Same probable happens on other tablet platforms.
        // This will confuse detection so strip it out if it exists.
        tmp = ua.split('Twitter');
        if (typeof tmp[1] !== 'undefined') {
            ua = tmp[0];
        }

        this.apple = {
            phone:  match(apple_phone, ua),
            ipod:   match(apple_ipod, ua),
            tablet: !match(apple_phone, ua) && match(apple_tablet, ua),
            device: match(apple_phone, ua) || match(apple_ipod, ua) || match(apple_tablet, ua)
        };
        this.amazon = {
            phone:  match(amazon_phone, ua),
            tablet: !match(amazon_phone, ua) && match(amazon_tablet, ua),
            device: match(amazon_phone, ua) || match(amazon_tablet, ua)
        };
        this.android = {
            phone:  match(amazon_phone, ua) || match(android_phone, ua),
            tablet: !match(amazon_phone, ua) && !match(android_phone, ua) && (match(amazon_tablet, ua) || match(android_tablet, ua)),
            device: match(amazon_phone, ua) || match(amazon_tablet, ua) || match(android_phone, ua) || match(android_tablet, ua)
        };
        this.windows = {
            phone:  match(windows_phone, ua),
            tablet: match(windows_tablet, ua),
            device: match(windows_phone, ua) || match(windows_tablet, ua)
        };
        this.other = {
            blackberry:   match(other_blackberry, ua),
            blackberry10: match(other_blackberry_10, ua),
            opera:        match(other_opera, ua),
            firefox:      match(other_firefox, ua),
            chrome:       match(other_chrome, ua),
            device:       match(other_blackberry, ua) || match(other_blackberry_10, ua) || match(other_opera, ua) || match(other_firefox, ua) || match(other_chrome, ua)
        };
        this.seven_inch = match(seven_inch, ua);
        this.any = this.apple.device || this.android.device || this.windows.device || this.other.device || this.seven_inch;

        // excludes 'other' devices and ipods, targeting touchscreen phones
        this.phone = this.apple.phone || this.android.phone || this.windows.phone;

        // excludes 7 inch devices, classifying as phone or tablet is left to the user
        this.tablet = this.apple.tablet || this.android.tablet || this.windows.tablet;

        if (typeof window === 'undefined') {
            return this;
        }
    };

    var instantiate = function() {
        var IM = new IsMobileClass();
        IM.Class = IsMobileClass;
        return IM;
    };

    if (typeof module !== 'undefined' && module.exports && typeof window === 'undefined') {
        //node
        module.exports = IsMobileClass;
    } else if (typeof module !== 'undefined' && module.exports && typeof window !== 'undefined') {
        //browserify
        module.exports = instantiate();
    } else if (typeof define === 'function' && define.amd) {
        //AMD
        define('isMobile', [], global.isMobile = instantiate());
    } else {
        global.isMobile = instantiate();
    }

})(this);

},{}],2:[function(require,module,exports){

var  Device = require('ismobilejs');

// add some extra variables to the container..
Object.assign(
    PIXI.DisplayObject.prototype,
    require('./accessibleTarget')
);


/**
 * The Accessibility manager reacreates the ability to tab and and have content read by screen readers. This is very important as it can possibly help people with disabilities access pixi content.
 * Much like interaction any DisplayObject can be made accessible. This manager will map the events as if the mouse was being used, minimizing the efferot required to implement.
 *
 * @class
 * @memberof PIXI
 * @param renderer {PIXI.CanvasRenderer|PIXI.WebGLRenderer} A reference to the current renderer
 */
function AccessibilityManager(renderer)
{
	// first we create a div that will sit over the pixi element. This is where the div overlays will go.
    var div = document.createElement('div');

    div.style.width = 100 + 'px';
    div.style.height = 100 + 'px';
    div.style.position = 'fixed';
    div.style.top = 0;
    div.style.left = 0;
   //
    div.style.zIndex = 2;

   	/**
   	 * This is the dom element that will sit over the pixi element. This is where the div overlays will go.
   	 *
   	 * @type {HTMLElement}
   	 * @private
   	 */
   	this.div = div;

   	/**
   	 * A simple pool for storing divs.
   	 *
   	 * @type {*}
   	 * @private
   	 */
 	this.pool = [];

 	/**
 	 * This is a tick used to check if an object is no longer being rendered.
 	 *
 	 * @type {Number}
 	 * @private
 	 */
   	this.renderId = 0;

   	/**
   	 * Setting this to true will visually show the divs
   	 *
   	 * @type {boolean}
   	 */
   	this.debug = false;

  	/**
     * The renderer this accessibility manager works for.
     *
     * @member {PIXI.SystemRenderer}
     */
   	this.renderer = renderer;

   	/**
     * The array of currently active accessible items.
     *
     * @member {Array<*>}
     * @private
     */
   	this.children = [];

   	/**
     * pre-bind the functions
	 *
 	 * @private
     */
   	this._onKeyDown = this._onKeyDown.bind(this);
   	this._onMouseMove = this._onMouseMove.bind(this);

   	/**
     * stores the state of the manager. If there are no accessible objects or the mouse is moving the will be false.
     *
     * @member {Array<*>}
     * @private
     */
   	this.isActive = false;
   	this.isMobileAccessabillity = false;
    this.isAlwaysOn = false;

   	// let listen for tab.. once pressed we can fire up and show the accessibility layer
   	window.addEventListener('keydown', this._onKeyDown, false);

    //check for mobile specific solutions
    if(this.isMobileDevice())
    {
        if (this.hasFocusEvents())
        {
            this.createTouchHook();
        }
        else
        {
            this.alwaysOn();
        }
    }
}


AccessibilityManager.prototype.constructor = AccessibilityManager;
module.exports = AccessibilityManager;

AccessibilityManager.prototype.createTouchHook = function()
{
	var hookDiv = document.createElement('button');
	hookDiv.style.width = 1 + 'px';
    hookDiv.style.height = 1 + 'px';
    hookDiv.style.position = 'absolute';
    hookDiv.style.top = -1000+'px';
    hookDiv.style.left = -1000+'px';
    hookDiv.style.zIndex = 2;
    hookDiv.style.backgroundColor = '#FF0000';
    hookDiv.title = 'HOOK DIV';

    hookDiv.addEventListener('focus', function(){

    	this.isMobileAccessabillity = true;
    	this.activate();
    	document.body.removeChild(hookDiv);

    }.bind(this));

    document.body.appendChild(hookDiv);

};

/**
 * some mobile devices fire Focus Events in accessibility mode eg. IOS Voiceover
 * other mobile devices do not fire Focus Events eg. Android Talkback or Kindle Fire VoiceView
 * default to false unless tested
 */
AccessibilityManager.prototype.hasFocusEvents = function() {
    return (Device.apple.device);
};


AccessibilityManager.prototype.isMobileDevice = function()
{
    return (Device.tablet || Device.phone);
};

AccessibilityManager.prototype.alwaysOn = function()
{
    this.isAlwaysOn = true;

    //render is undefined until the next tick
    setTimeout(this.activate.bind(this));
};

/**
 * Activating will cause the Accessibility layer to be shown. This is called when a user preses the tab key
 * @private
 */
AccessibilityManager.prototype.activate = function()
{
	if(this.isActive )
	{
		return;
	}

	this.isActive = true;

	window.document.addEventListener('mousemove', this._onMouseMove, true);
	window.removeEventListener('keydown', this._onKeyDown, false);

	this.renderer.on('postrender', this.update, this);

	if(this.renderer.view.parentNode)
	{
		this.renderer.view.parentNode.appendChild(this.div);
	}
};

/**
 * Deactivating will cause the Accessibility layer to be hidden. This is called when a user moves the mouse
 * @private
 */
AccessibilityManager.prototype.deactivate = function()
{

	if(!this.isActive || this.isMobileAccessabillity)
	{
		return;
	}

	this.isActive = false;

	window.document.removeEventListener('mousemove', this._onMouseMove);
	window.addEventListener('keydown', this._onKeyDown, false);

	this.renderer.off('postrender', this.update);

	if(this.div.parentNode)
	{
		this.div.parentNode.removeChild(this.div);
	}

};

/**
 * This recursive function will run throught he scene graph and add any new accessible objects to the DOM layer.
 * @param displayObject {PIXI.Container} the DisplayObject to check.
 * @private
 */
AccessibilityManager.prototype.updateAccessibleObjects = function(displayObject)
{
	if(!displayObject.visible)
	{
		return;
	}

	if(displayObject.accessible && displayObject.interactive)
	{
		if(!displayObject._accessibleActive)
		{
			this.addChild(displayObject);
		}

	   	displayObject.renderId = this.renderId;
	}

	var children = displayObject.children;

	for (var i = children.length - 1; i >= 0; i--) {

		this.updateAccessibleObjects(children[i]);
	}
};

/**
 * Sort children by tab index
 * The divs seem to tab in order of being added as a child regardless of the tab order set
 * This sorts the children whenever a new one is set
 * @param  {DOMElement} element the one which will have children sorted.
 */
AccessibilityManager.prototype.updateTabOrders = function()
{
    if (!this._tabOrderDirty) {
        return;
    }

    var element = this.div;
    var children = element.childNodes;

    var list = [];
    for (var i = 0; i < children.length; i++) {
        if (children[i].nodeType === 1) {
            list.push(children[i]);
        }
    }

    list = list.sort(function(a, b) {
        var ta = a.getAttribute('tabindex');
        var tb = b.getAttribute('tabindex');
        return ta === tb ? 0 : tb > ta ? -1 : 1;
    });

    for (var j in list) {
        element.appendChild(list[j]);
    }

    this._tabOrderDirty = false;
};


/**
 * Before each render this function will ensure that all divs are mapped correctly to their DisplayObjects
 * @private
 */
AccessibilityManager.prototype.update = function()
{
	//change this to strict equality comparison so that it will work with PIXI v3 where renderingToScreen is not set.
    if (this.renderer.renderingToScreen === false) {
    	return;
  	}

	// update children...
	this.updateAccessibleObjects(this.renderer._lastObjectRendered);

    //sort out tab orders
    this.updateTabOrders();

	var rect = this.renderer.view.getBoundingClientRect();
	var sx = rect.width  / this.renderer.width;
	var sy = rect.height / this.renderer.height;

	var div = this.div;

	div.style.left = rect.left + 'px';
	div.style.top = rect.top + 'px';
	div.style.width = this.renderer.width + 'px';
	div.style.height = this.renderer.height + 'px';

	for (var i = 0; i < this.children.length; i++)
	{

		var child = this.children[i];

		if(child.renderId !== this.renderId)
		{
			child._accessibleActive = false;

            PIXI.utils.removeItems(this.children, i, 1);
			this.div.removeChild( child._accessibleDiv );
			this.pool.push(child._accessibleDiv);
			child._accessibleDiv = null;

			i--;

			if(this.children.length === 0)
			{
				this.deactivate();
			}
		}
		else
		{
			// map div to display..
			div = child._accessibleDiv;
			var hitArea = child.hitArea;
			var wt = child.worldTransform;

			if(child.hitArea)
			{
				div.style.left = ((wt.tx + (hitArea.x * wt.a)) * sx) + 'px';
				div.style.top =  ((wt.ty + (hitArea.y * wt.d)) * sy) +  'px';

				div.style.width = (hitArea.width * wt.a * sx) + 'px';
				div.style.height = (hitArea.height * wt.d * sy) + 'px';

			}
			else
			{
				hitArea = child.getBounds();

				this.capHitArea(hitArea);

				div.style.left = (hitArea.x * sx) + 'px';
				div.style.top =  (hitArea.y * sy) +  'px';

				div.style.width = (hitArea.width * sx) + 'px';
				div.style.height = (hitArea.height * sy) + 'px';
			}
		}
	}

	// increment the render id..
	this.renderId++;
};

AccessibilityManager.prototype.capHitArea = function (hitArea)
{
    if (hitArea.x < 0)
    {
        hitArea.width += hitArea.x;
        hitArea.x = 0;
    }

    if (hitArea.y < 0)
    {
        hitArea.height += hitArea.y;
        hitArea.y = 0;
    }

    if ( hitArea.x + hitArea.width > this.renderer.width )
    {
        hitArea.width = this.renderer.width - hitArea.x;
    }

    if ( hitArea.y + hitArea.height > this.renderer.height )
    {
        hitArea.height = this.renderer.height - hitArea.y;
    }
};


/**
 * Adds a DisplayObject to the accessibility manager
 * @private
 */
AccessibilityManager.prototype.addChild = function(displayObject)
{
//	this.activate();

	var div = this.pool.pop();

	if(!div)
	{
		div = document.createElement('button');

	    div.style.width = 100 + 'px';
	    div.style.height = 100 + 'px';
	    div.style.backgroundColor = this.debug ? 'rgba(255,0,0,0.5)' : 'transparent';
	    div.style.position = 'absolute';
	    div.style.zIndex = 2;
	    div.style.borderStyle = 'none';

        if (this.isAlwaysOn) {
            //remove the focus highlight from the div so you cannot see the hidden div during normal touch to click
            div.style['-webkit-tap-highlight-color'] = 'rgba(0,0,0,0)';
            div.style.border = 0;
            div.style.outline = 'none';
        }


	    div.addEventListener('click', this._onClick.bind(this));
	    div.addEventListener('focus', this._onFocus.bind(this));
	    div.addEventListener('focusout', this._onFocusOut.bind(this));
	}


	if(displayObject.accessibleTitle)
	{
		div.title = displayObject.accessibleTitle;
	}
	else if (!displayObject.accessibleTitle && !displayObject.accessibleHint)
	{
		div.title = 'displayObject ' + this.tabIndex;
	}

	if(displayObject.accessibleHint)
	{
		div.setAttribute('aria-label', displayObject.accessibleHint);
	}


	//

	displayObject._accessibleActive = true;
	displayObject._accessibleDiv = div;
	div.displayObject = displayObject;


	this.children.push(displayObject);
	this.div.appendChild( displayObject._accessibleDiv );
	displayObject._accessibleDiv.tabIndex = displayObject.tabIndex;

    //set this to true so we know to sort the tab order of the divs
    this._tabOrderDirty = true;
};


/**
 * Maps the div button press to pixi's InteractionManager (click)
 * @private
 */
AccessibilityManager.prototype._onClick = function(e)
{
	var interactionManager = this.renderer.plugins.interaction;
	interactionManager.dispatchEvent(e.target.displayObject, 'click', interactionManager.eventData);
};

/**
 * Maps the div focus events to pixis InteractionManager (mouseover)
 * @private
 */
AccessibilityManager.prototype._onFocus = function(e)
{
	var interactionManager = this.renderer.plugins.interaction;
	interactionManager.dispatchEvent(e.target.displayObject, 'mouseover', interactionManager.eventData);
};

/**
 * Maps the div focus events to pixis InteractionManager (mouseout)
 * @private
 */
AccessibilityManager.prototype._onFocusOut = function(e)
{
	var interactionManager = this.renderer.plugins.interaction;
	interactionManager.dispatchEvent(e.target.displayObject, 'mouseout', interactionManager.eventData);
};

/**
 * Is called when a key is pressed
 *
 * @private
 */
AccessibilityManager.prototype._onKeyDown = function(e)
{
	if(e.keyCode !== 9)
	{
		return;
	}

	this.activate();
};

/**
 * Is called when the mouse moves across the renderer element
 *
 * @private
 */
AccessibilityManager.prototype._onMouseMove = function()
{
	this.deactivate();
};


/**
 * Destroys the accessibility manager
 *
 */
AccessibilityManager.prototype.destroy = function ()
{
	this.div = null;

	for (var i = 0; i < this.children.length; i++)
	{
		this.children[i].div = null;
	}


	window.document.removeEventListener('mousemove', this._onMouseMove);
	window.removeEventListener('keydown', this._onKeyDown);

	this.pool = null;
	this.children = null;
	this.renderer = null;

};

PIXI.WebGLRenderer.registerPlugin('accessibility', AccessibilityManager);
PIXI.CanvasRenderer.registerPlugin('accessibility', AccessibilityManager);

},{"./accessibleTarget":3,"ismobilejs":1}],3:[function(require,module,exports){
/**
 * Default property values of accessible objects
 * used by {@link PIXI.accessibility.AccessibilityManager}.
 *
 * @mixin
 * @memberof PIXI
 * @example
 *      function MyObject() {}
 *
 *      Object.assign(
 *          MyObject.prototype,
 *          PIXI.accessibility.accessibleTarget
 *      );
 */
var accessibleTarget = {
    
    /**
     * @todo Needs docs.
     */
    accessible:false,

    /**
     * @todo Needs docs.
     */
    accessibleTitle:null,

    /**
     * @todo Needs docs.
     */
    tabIndex:0,

    /**
     * @todo Needs docs.
     */
    _accessibleActive:false,

    /**
     * @todo Needs docs.
     */
    _accessibleDiv:false

};

module.exports = accessibleTarget;

},{}],4:[function(require,module,exports){
/**
 * @file        Main export of the PIXI accessibility library
 * @author      Mat Groves <mat@goodboydigital.com>
 * @copyright   2013-2015 GoodBoyDigital
 * @license     {@link https://github.com/pixijs/pixi.js/blob/master/LICENSE|MIT License}
 */

/**
 * @namespace PIXI.interaction
 */
module.exports = PIXI.accessibility = {
    accessibleTarget:     require('./accessibleTarget'),
    AccessibilityManager: require('./AccessibilityManager')
};

},{"./AccessibilityManager":2,"./accessibleTarget":3}]},{},[4])


//# sourceMappingURL=pixi-accessibility.js.map
