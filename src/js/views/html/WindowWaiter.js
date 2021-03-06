/**
 * Waiter to handle events related to the window object.
 *
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 *
 * @constructor
 * @param {HTMLApp} app - The main view object for CyberChef.
 */
var WindowWaiter = function(app) {
    this.app = app;
};


/**
 * Handler for window resize events.
 * Resets the layout of CyberChef's panes after 200ms (so that continuous resizing doesn't cause
 * continuous resetting).
 */
WindowWaiter.prototype.windowResize = function() {
    clearTimeout(this.resetLayoutTimeout);
    this.resetLayoutTimeout = setTimeout(this.app.resetLayout.bind(this.app), 200);
};


/**
 * Handler for window blur events.
 * Saves the current time so that we can calculate how long the window was unfocussed for when
 * focus is returned.
 */
WindowWaiter.prototype.windowBlur = function() {
    this.windowBlurTime = new Date().getTime();
};


/**
 * Handler for window focus events.
 *
 * When a browser tab is unfocused and the browser has to run lots of dynamic content in other
 * tabs, it swaps out the memory for that tab.
 * If the CyberChef tab has been unfocused for more than a minute, we run a silent bake which will
 * force the browser to load and cache all the relevant JavaScript code needed to do a real bake.
 * This will stop baking taking a long time when the CyberChef browser tab has been unfocused for
 * a long time and the browser has swapped out all its memory.
 */
WindowWaiter.prototype.windowFocus = function() {
    var unfocusedTime = new Date().getTime() - this.windowBlurTime;
    if (unfocusedTime > 60000) {
        this.app.silentBake();
    }
};
