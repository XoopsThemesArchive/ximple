/**************************************

	Letter-Spacing Marquee
	v1.0
	last revision: 06.26.2004
	steve@slayeroffice.com
	http://slayeroffice.com/code/lspace_marquee/

	Please leave this notice in tact.

	Should you modify/improve upon this 
	code, please let me know so that I can 
	update the version hosted at slayeroffice

**************************************/

window.onload = init;			// what to do when the document loads
var d=document;				// reference variable to the document object

var SPACE_INCREMENT=4;			// the amount to increase the letter-spacing
var MIN_SPACING=5;			// the minimum letter spacing
var currentSpacing = 5;			// the current space. incremented by SPACE_INCREMENT
var PARENT_WIDTH,PARENT_HEIGHT;		// the width and height of the parent element
var roundabout=0;				// boolean var that tells us if the message string has "flipped"
var pauseAnim=false;			// used to pause the marquee when a user mouse's over

var messageArray = new Array();		// array to store the strings to display
var messageIndex=0;			// index in messageArray to display

function init() {
	// older browser...bail out
	if(!d.getElementById)return;
	// object reference to the parent element
	mObj=d.getElementById("mContainer");
	// loop over the DIV elements in the parent element and put their innerHTML in the messageArray
	for(i=0;i<mObj.getElementsByTagName("div").length;i++) {
		messageArray[i]=mObj.getElementsByTagName("div")[i].innerHTML;
		// replace spaces in the strings with non-breaking spaces to prevent wrapping when the letter-spacing becomes very wide
		messageArray[i]=messageArray[i].replace(/ /g,"&nbsp;");
	}
	// create the element that will hold the message strings
	nObj=mObj.appendChild(d.createElement("div"));
	nObj.id="nContainer";
	nObj.innerHTML = messageArray[0];

	// get the width and height of the parent element
	PARENT_WIDTH=d.getElementById("mContainer").offsetWidth;
	PARENT_HEIGHT=d.getElementById("mContainer").offsetHeight;
	// set up the mouseout and mouseover handlers
	d.getElementById("mContainer").onmouseover = mContainer_mouseover;
	d.getElementById("mContainer").onmouseout = mContainer_mouseout;
	// start the animation
	zInterval=setTimeout("pauser("+0+")",1000);
}

function mContainer_mouseover() {
	// normalizes a bunch of stuff. the animation essentially starts over when a user mouses over 
	// the parent element.
	clearInterval(zInterval);
	pauseAnim=true;
	d.getElementById("nContainer").style.top=0;
	this.style.letterSpacing="5px";
	currentSpacing=5;
	roundabout=0;
}

function mContainer_mouseout() {
	// restart the animation
	pauseAnim=false;
	zInterval=setTimeout("pauser("+0+")",1000);
}

function expandText() {
	// if the user has moused over, bail out
	if(pauseAnim)return;
	// we increase the letter spacing until it is greater than the width of the parent element.
	// if the current spacing is less than 30, we increment by 1 to slow it down. looks nicer, i think.
	if(currentSpacing<PARENT_WIDTH) {
		if(currentSpacing<=30) {
			currentSpacing++;
		} else {
			currentSpacing+=SPACE_INCREMENT;
		}
		// opera doesnt seem to like adjusting letter-spacing on the fly, so we wont 
		// annoy that browser with it. it will just flip through the messages.
		if(!window.opera)d.getElementById("mContainer").style.letterSpacing = currentSpacing+"px";
	} else {
		// the spacing is greater than the parent width. do the flip.
		// first, we scroll nContainer down until its top is greater than the parents height multiplied by 3
		// it makes for a nice pause
		nTop =d.getElementById("nContainer").offsetTop;
		nTop++;
		d.getElementById("nContainer").style.top = nTop+"px";
		if(nTop>PARENT_HEIGHT*3) {
			// once nContainer has reached the above point, flip it to the top of the parent element
			d.getElementById("nContainer").style.top = "-50px";
			// we change the message here. increment messageIndex, set it to 0 if it gets higher 
			// then the number of messages.
			messageIndex++;
			if(messageIndex>=messageArray.length)messageIndex=0;
			d.getElementById("nContainer").innerHTML = messageArray[messageIndex];
			// roundabout tells the script that we've done the flip, so the next conditional will execute.
			roundabout=1;
		}
		// if nContainers top is greater than 5 *AND* we've flipped...
		if(d.getElementById("nContainer").offsetTop>=5 && roundabout) {
			clearInterval(zInterval);
			roundabout=0;
			// we're done with this iteration. contract the text.
			d.getElementById("nContainer").style.top=0;
			zInterval=setTimeout("pauser("+1+")",1000);
		}
	}
}

function pauser(callWho) {
	// this function creates the intervals to expand and contract the text. it itself is called after a one second timeout.
	// 0: expand, 1: contract
	clearInterval(zInterval);
	zInterval = callWho?setInterval("contractText()",10):setInterval("expandText()",10);
}


function contractText() {
	// do nothing if the application is paused.
	if(pauseAnim)return;
	// if the spacing is greater than the minimum, decrease it
	if(currentSpacing>MIN_SPACING) {
		// spacing greater than 30 still? use SPACE_INCREMENT, otherwise decrement by 1.
		if(currentSpacing>=30) {
			currentSpacing-=SPACE_INCREMENT;
		} else {
			currentSpacing--;
		}
		// opera. doesnt like it.
		if(!window.opera)d.getElementById("mContainer").style.letterSpacing = currentSpacing+"px";
	} else {
		// we're all done. expand this text, which starts everything over.
		clearInterval(zInterval);
		zInterval=setTimeout("pauser("+0+")",1000);
	}
}