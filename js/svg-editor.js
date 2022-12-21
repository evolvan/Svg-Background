"use strict";

window.addEventListener("DOMContentLoaded", initializeUI, false);
function initializeUI(){}

var codeL = [0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
var codeU = [10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100, 125, 150, 175, 200, 250, 300, 400, 500, 600, 750, 1000, 2000];
var codeKey = ['a', 'b', 'c', 'd', 'e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];

var COLOR_MODE = 0;
var ARR_COLOR_MODE = ['lch', 'hsl', 'lab', 'rgb', 'lrgb'];
var USE_DEFAULT = true;
var SHOW_UI = true;
var TEST_VAR = 'X';
var BG_NAME = '';
var CTRL_CODE = '';
var AUTHOR_INFO = '';
var BG_COLOR = '#AAA';
var BG_COLOR_TWO = '#FFF';
var BG_COLOR_THREE = '#000';
var DEFAULT_COLOR = '#AAA';
var DEFAULT_COLOR_TWO = '#FFF';
var DEFAULT_COLOR_THREE = '#000';
var COLOR_AVERAGE = false;
var DARK_LIGHT = false;
var ARR_DARK_LIGHT = [];
var ARR_DARK_LIGHT_NUMBER = [];
var BG_IMAGE = 'none';
var BG_ARRAY = [];
var ARR_COLOR1 = [];
var ARR_COLOR2 = [];
var ARR_COLOR3 = [];
var ARR_COLOR_STEP_3 = []; //blends between color 1 and 2
var ARR_COLOR_STEP_4 = []; //blends between color 1 and 3
var ARR_COLOR_STEP_5 = []; //blends between color 2 and 3
var ARR_COLOR_S3 = []; //blends between color 1 and 2
var ARR_COLOR_S4 = []; //blends between color 1 and 3
var ARR_COLOR_S5 = []; //blends between color 2 and 3
var ARR_SCALE = [];
var ARR_SIZE = [];
var ARR_SIZE_NUMBER = [];
var ARR_SIZE_ID = [];
var ARR_OPACITY = [];
var ARR_STROKE_WIDTH = [];
var ARR_ANGLE = [];
var ARR_ANGLE_NUMBER = [];
var ARR_RADIAL = [];
var ARR_RADIAL_NUMBER = [];
/*let CurrentClass;*/
function resetARRAYS(){
	COLOR_MODE = 0;
	DARK_LIGHT = false;
	COLOR_AVERAGE = false;
	ARR_DARK_LIGHT = [];
	ARR_DARK_LIGHT_NUMBER = [];
	ARR_COLOR1 = [];
	ARR_COLOR2 = [];
	ARR_COLOR3 = [];
	ARR_COLOR_STEP_3 = [];
	ARR_COLOR_STEP_4 = [];
	ARR_COLOR_STEP_5 = [];
	ARR_COLOR_S3 = [];
	ARR_COLOR_S4 = [];
	ARR_COLOR_S5 = [];
	ARR_ANGLE = [];
	ARR_ANGLE_NUMBER = [];
	ARR_RADIAL = [];
	ARR_RADIAL_NUMBER = [];
	ARR_SCALE = [];
	ARR_SIZE = [];
	ARR_SIZE_NUMBER = [];
	ARR_SIZE_ID = [];
	ARR_OPACITY = [];
	ARR_STROKE_WIDTH = [];
}

var SCALE = '';
var SCALE_MULTIPLE = '';
var SIZE_MULTIPLE = '';
var SIZE_MIN = '';
var SCALE_MIN = '';
var OPACITY = '';
var SIZE = '';
var ANGLE = '';
var RADIAL = '';
var STROKE_WIDTH = '';

//var WIDTH = '';
//var HEIGHT = '';
//var WEIGHT = '';
//var PADDING = '';
//var COUNT = '';
//var BG_POSITION = ''; X or Y position?


var BG_ATTACHMENT = 'scroll';
var BG_SIZE = 'auto';


function getCodeValue(code){	
	if ('0123456789'.indexOf(code) !== -1) {
		return parseInt(code);
	}else if(code === code.toUpperCase()){
		return Number(codeU[codeKey.indexOf(code.toLowerCase())]);
	}else{
		return Number(codeL[codeKey.indexOf(code)]);
	}
}
function selectBG(id){
	if(id === 'color-lock'){
		colorLocker();
		return;
	}else if(id === 'hide-ui'){
		hideInterface();
		return;
	}
    
    
    //alert( String(id).match(/\#([-0-9a-zA-Z]*)/)[1] );
    
    //var className = String(id).substr(32);
    var className = String(id).match(/\#([-0-9a-zA-Z]*)/)[1];
    
    className = className.replace("ref=producthunt#", "");  //probabl not needed anymore, but remove after product hunt traffic dies down
    

	BG_NAME = titleCase(className.replace("-", " "));
	var el = document.getElementById(className).getElementsByTagName("a")[0];
  
    DEFAULT_COLOR = rgb2hex(window.getComputedStyle( el, null).getPropertyValue('background-color'));
	
	if(USE_DEFAULT){		
		BG_COLOR = DEFAULT_COLOR;
	}

	BG_IMAGE = window.getComputedStyle( el, null).getPropertyValue('background-image');
    
	BG_IMAGE = BG_IMAGE.replace(/\%20/g, " ");
	BG_IMAGE = BG_IMAGE.replace(/\\\'/g, "'");
	BG_IMAGE = BG_IMAGE.replace("url('data:image/svg+xml", 'url("data:image/svg+xml');
	BG_IMAGE = BG_IMAGE.replace("%3C/svg%3E')", '%3C/svg%3E")');
	BG_IMAGE = BG_IMAGE.replace("</svg>')", '</svg>")');
		
	BG_ATTACHMENT = window.getComputedStyle( el, null).getPropertyValue('background-attachment');
	BG_SIZE = window.getComputedStyle( el, null).getPropertyValue('background-size');
	
	if(BG_SIZE === "115%"){
	   BG_SIZE = "auto";
	}
	
	CTRL_CODE = el.getAttribute('data-ctrl');
	AUTHOR_INFO = el.getAttribute('data-author');
	
	indexBG_Image();	
	setControls();
	updateBlends();
	if(DARK_LIGHT){
		updateDarkLight(); 
	}
	applyBackground();
}
function colorLocker(){
	if(USE_DEFAULT){
		USE_DEFAULT = false;
		document.getElementById("color-lock").className = "locked";
	}else{
		USE_DEFAULT = true;
		document.getElementById("color-lock").className = "unlocked";
	}	
}

var UI_LISTENER = document.getElementById("hide-ui").addEventListener('mouseout', function() {
	showInterface();	
});

function hideInterface(){ //add and remove mouseout would be ideal.
	if(SHOW_UI){
		SHOW_UI = false;
		document.getElementById("controls").className = "hideUI";
		document.getElementById("stage").className = "hideUI";
	}else{
		showInterface();
	}	
}
function showInterface(){
	if(!SHOW_UI){
		SHOW_UI = true;
		document.getElementById("controls").className = "showUI";
		document.getElementById("stage").className = "showUI";
	}
}

function indexBG_Image(){
	resetARRAYS();
	var str = BG_IMAGE;
	str = str.replace("svg+xml,", "svg+xml,|");	
	str = str.split("%3E%3C").join('%3E|%3C');
	BG_ARRAY = str.split("|");	
	var l = 0;
	while(l < BG_ARRAY.length){
		var temp = BG_ARRAY[l];
		if(temp.includes("class='")){
			var tempClass = temp.match(/class=\'([^']*)\'/)[1];   //// how to target class='' or width etc.			
			
			if(tempClass.includes("colorA")){
				COLOR_AVERAGE = true;
			}
			
			if(tempClass.includes("color1")){
				ARR_COLOR1[ARR_COLOR1.length] = l;
				if(!USE_DEFAULT){
					BG_ARRAY[l] = BG_ARRAY[l].replace(/\'\%23([^']*)\'/, "'%23" + BG_COLOR.replace('#', '') + "'");
				}
			}else if(tempClass.includes("color2")){
				ARR_COLOR2[ARR_COLOR2.length] = l;
				DEFAULT_COLOR_TWO = '#' + temp.match(/\'\%23([^']*)\'/)[1];
				if(USE_DEFAULT){
					BG_COLOR_TWO = DEFAULT_COLOR_TWO;
				}else{
					BG_ARRAY[l] = BG_ARRAY[l].replace(/\'\%23([^']*)\'/, "'%23" + BG_COLOR_TWO.replace('#', '') + "'");
				}
			}else if(tempClass.includes("color3")){
				ARR_COLOR3[ARR_COLOR3.length] = l;
				DEFAULT_COLOR_THREE = '#' + temp.match(/\'\%23([^']*)\'/)[1];
				if(USE_DEFAULT){
					BG_COLOR_THREE = DEFAULT_COLOR_THREE;
				}else{
					BG_ARRAY[l] = BG_ARRAY[l].replace(/\'\%23([^']*)\'/, "'%23" + BG_COLOR_THREE.replace('#', '') + "'");
				}
			}else if(tempClass.includes("colorS3")){
				ARR_COLOR_STEP_3[ARR_COLOR_STEP_3.length] = l;	
			}else if(tempClass.includes("colorS4")){
				ARR_COLOR_STEP_4[ARR_COLOR_STEP_4.length] = l;
			}else if(tempClass.includes("colorS5")){
				ARR_COLOR_STEP_5[ARR_COLOR_STEP_5.length] = l;
			}else if(tempClass.includes("dark")){
				ARR_DARK_LIGHT_NUMBER[ARR_DARK_LIGHT_NUMBER.length] = l;
				ARR_DARK_LIGHT[ARR_DARK_LIGHT.length] = tempClass.match(/dark([erst123]*)/)[0];
				DARK_LIGHT = true;
			}else if(tempClass.includes("light")){				
				ARR_DARK_LIGHT_NUMBER[ARR_DARK_LIGHT_NUMBER.length] = l;
				ARR_DARK_LIGHT[ARR_DARK_LIGHT.length] = tempClass.match(/light([erst123]*)/)[0];
				DARK_LIGHT = true;
			}
			
			if(tempClass.includes("scale")){
				ARR_SCALE[ARR_SCALE.length] = l;
			}
			
			if(tempClass.includes("size1")){
				ARR_SIZE_NUMBER[ARR_SIZE.length] = 'size1';
				ARR_SIZE[ARR_SIZE.length] = l;				
			}else if(tempClass.includes("size2")){
				ARR_SIZE_NUMBER[ARR_SIZE.length] = 'size2';	
				ARR_SIZE[ARR_SIZE.length] = l;				
			}else if(tempClass.includes("size3")){
				ARR_SIZE_NUMBER[ARR_SIZE.length] = 'size3';
				ARR_SIZE[ARR_SIZE.length] = l;		
			}
			
			BG_ARRAY[l] = BG_ARRAY[l].replace(tempClass, "");
			BG_ARRAY[l] = BG_ARRAY[l].replace("class=''", "");
		}
		if(temp.includes("opacity=")){
			ARR_OPACITY[ARR_OPACITY.length] = l;
		}
		if(temp.includes("stroke-width=")){
			ARR_STROKE_WIDTH[ARR_STROKE_WIDTH.length] = l;
		}		
		if(temp.includes("%3ClinearGradient")){
			ARR_ANGLE[ARR_ANGLE.length] = l;
		}else if(temp.includes("%3CradialGradient")){
			ARR_RADIAL[ARR_RADIAL.length] = l;			
			//fx="5%" fy="5%" r="65%" Radial touches r='65%'
		}
		
		l++;
	}

}
function createBlends(){
	var l = 0;
	var l3 = ARR_COLOR_STEP_3.length;
	var l4 = ARR_COLOR_STEP_4.length;
	var l5 = ARR_COLOR_STEP_5.length;
	var colorMode = ARR_COLOR_MODE[COLOR_MODE];
	while(l < l3 || l < l4 || l < l5){
		if(l3 > l){	
			if(COLOR_AVERAGE){
				ARR_COLOR_S3[l] = String(chroma.mix(BG_COLOR, BG_COLOR_TWO, 0.5, colorMode)).replace("#", '');				
			}else{
				ARR_COLOR_S3[l] = String(chroma.mix(BG_COLOR, BG_COLOR_TWO, (1/(l3+1))*(l+1), colorMode)).replace("#", '');
			}
		}
		if(l4 > l){			
			if(COLOR_AVERAGE){
				ARR_COLOR_S4[l] = String(chroma.mix(BG_COLOR, BG_COLOR_THREE, 0.5, colorMode)).replace("#", '');
			}else{
				ARR_COLOR_S4[l] = String(chroma.mix(BG_COLOR, BG_COLOR_THREE, (1/(l4+1))*(l+1), colorMode)).replace("#", '');
			}
		}
		if(l5 > l){			
			if(COLOR_AVERAGE){
				ARR_COLOR_S5[l] = String(chroma.mix(BG_COLOR_TWO, BG_COLOR_THREE, 0.5, colorMode)).replace("#", '');
			}else{
				ARR_COLOR_S5[l] = String(chroma.mix(BG_COLOR_TWO, BG_COLOR_THREE, (1/(l5+1))*(l+1), colorMode)).replace("#", '');
			}			
		}		
		l++;
	}
}
function updateBlendMode(val){
	COLOR_MODE = COLOR_MODE + val;
	if(COLOR_MODE > 4){
		COLOR_MODE = 0;
	}else if(COLOR_MODE < 0){
		COLOR_MODE = 4;
	}
	document.getElementById('blendMode').innerHTML = ARR_COLOR_MODE[COLOR_MODE].toUpperCase() + " MODE";
	updateBlends();
	applyBackground();
}

function setControls(){
	document.getElementById('svgName').getElementsByTagName("H2")[0].innerHTML = BG_NAME;
	var codeParts = CTRL_CODE.split("-");
	

	var numOfColors = codeParts[0];
	var size_part = 0;
	var arr_angle_count = 0;
	var arr_radial_count = 0;
	hideSliders(codeParts.length);
	
	for(var i=1;i<codeParts.length;i++){
		var range = codeParts[i];
		var rangeType = range.charAt(0);
		var rangeName = "";
		var rangeMin = 0;
		var rangeMax = 1;
		var rangeStep = 0.01;
		var rangeValue = 1;
		
		if(rangeType === "S"){
			rangeName = "SIZE";
			size_part++;
			ARR_SIZE_ID[i] = size_part;
		}else if (rangeType === "X"){
			rangeName = "SCALE";			
		}else if (rangeType === "O"){
			rangeName = "OPACITY";
		}else if (rangeType === "W"){
			rangeName = "WEIGHT";
		}else if (rangeType === "C"){
			rangeName = "COUNT";
			rangeMin = 1;
			rangeMax = 20;
			rangeStep = 1;
		}else if (rangeType === "K"){ //stroke-width	
			rangeName = "STROKE";
			rangeMin = 1;
			rangeMax = 20;
			rangeStep = 0.1;
			rangeValue = 1;
		}else if(rangeType === "A"){
			rangeName = "ANGLE";
			rangeMin = 0;
			rangeMax = 360;
			rangeStep = 1;
			rangeValue = 0;
			ANGLE = 0;		
			ARR_ANGLE_NUMBER[i] = arr_angle_count;
			arr_angle_count++;
		}else if(rangeType === "R"){
			rangeName = "RADIAL";
			rangeMin = 0;
			rangeMax = 100;
			rangeStep = 0.1;
			rangeValue = 50;			
			RADIAL = 50;
			ARR_RADIAL_NUMBER[i] = arr_radial_count;
			arr_radial_count++;
		}
		
		if(range.length === 2){
			rangeValue = getCodeValue(range.charAt(1));			
		}else if(range.length === 4 && rangeName === "SCALE"){
			SCALE_MIN = getCodeValue(range.charAt(1));
			var scale_max = getCodeValue(range.charAt(2));			
			var scale_difference = scale_max - SCALE_MIN;
			SCALE_MULTIPLE = scale_difference/100;
			rangeMin = 0;
			rangeMax = 100;
			rangeStep = 1;
			rangeValue = getCodeValue(range.charAt(3));
			
			if(rangeValue > 100){
				rangeValue = 100;
			}else if(rangeValue < 0){
				rangeValue = 0;
			}
		   	SCALE = rangeValue;
		}else if(range.length === 4 && rangeName === "SIZE"){
			SIZE_MIN = getCodeValue(range.charAt(1));
			var size_max = getCodeValue(range.charAt(2));			
			var size_difference = size_max - SIZE_MIN;
			SIZE_MULTIPLE = size_difference/100;
			rangeMin = 0;
			rangeMax = 100;
			rangeStep = 1;
			rangeValue = getCodeValue(range.charAt(3));
			
			if(rangeValue > 100){
				rangeValue = 100;
			}else if(rangeValue < 0){
				rangeValue = 0;
			}
		   	SIZE = rangeValue;
		}else if(range.length === 5 && rangeName !== "SCALE"){
			rangeMin = getCodeValue(range.charAt(1));
			rangeMax = getCodeValue(range.charAt(2));
			rangeStep = getCodeValue(range.charAt(3));
			rangeValue = getCodeValue(range.charAt(4));
		}else if(rangeName === "ANGLE" || rangeName === "RADIAL"){
			
		}else if(rangeName === "OPACITY" || rangeName === "STROKE"){
			if(range.length === 4){
				rangeMin = getCodeValue(range.charAt(1));
				rangeMax = getCodeValue(range.charAt(2));
				rangeValue = getCodeValue(range.charAt(3));
				if(rangeName === "STROKE"){
					STROKE_WIDTH = rangeValue;
				}
			}
		}else{
			o('Bad data-ctrl code!');
		}
		setupRange(i, rangeName, rangeMin, rangeMax, rangeStep, rangeValue);
	}
	if(numOfColors.includes("F")){
		numOfColors = numOfColors.replace("F", "");
		BG_ATTACHMENT = "fixed";
	}
	if(numOfColors.includes("B")){
		var blend_num = numOfColors.match(/B[01234]*/);
		numOfColors = numOfColors.replace(/B[01234]*/, "");
		blend_num = String(blend_num).replace('B', '');
		if(blend_num === ''){
			blend_num = 0;
		}
		COLOR_MODE = Number(blend_num);
		document.getElementById('blendMode').innerHTML = ARR_COLOR_MODE[COLOR_MODE].toUpperCase() + " MODE";		
		if(document.getElementById('blend-mode').className === "hideSlider" || document.getElementById('blend-mode').className === "hiddenSliderInit"){
		   document.getElementById('blend-mode').className = "showSlider";		   
		}
	}else{
		if(document.getElementById('blend-mode').className === "showSlider"){
		   document.getElementById('blend-mode').className = "hideSlider";		   
		}
	}
	if(numOfColors !== '1' && numOfColors !== '2'){
		numOfColors = '3';
	}
	var colorClass = 'colr' + numOfColors;
	document.getElementById('color-1').jscolor.fromString(BG_COLOR);
	document.getElementById('color-2').jscolor.fromString(BG_COLOR_TWO);
	document.getElementById('color-3').jscolor.fromString(BG_COLOR_THREE);	
	document.getElementById('color-2').classList.add('hiddenColor');
	document.getElementById('color-3').classList.add('hiddenColor');	
	if(numOfColors === '2'){
		document.getElementById('color-2').classList.remove('hiddenColor');
	
	}else if(numOfColors === '3'){
		document.getElementById('color-2').classList.remove('hiddenColor');
		document.getElementById('color-3').classList.remove('hiddenColor');
	}	
	document.getElementById("custom-color").className = colorClass;
}

function convertScale(value){	
	value = SCALE_MIN + (value * SCALE_MULTIPLE);
	return Math.round(value);
	
}
function convertSize(value){	
	value = SIZE_MIN + (value * SIZE_MULTIPLE);
	return Math.round(value);
}

function hideSliders(num){	
	while (num < 6){		   
		if(document.getElementById('slider-' + num).className === "showSlider"){
		   document.getElementById('slider-' + num).className = "hideSlider";		   
		}		   
		num++;
	}
}
function setupRange(num, name, min, max, step, value){
	var divRange = document.getElementById('slider-' + num);
	var inputRange = divRange.getElementsByTagName("input")[0];
	divRange.className = "showSlider";
	divRange.getElementsByTagName("label")[0].innerHTML = name;
	inputRange.setAttribute('min', min);
	inputRange.setAttribute('max', max);
	inputRange.setAttribute('step', step);
	inputRange.setAttribute('value', value);
	inputRange.value = value;
}

function updateColor(id, color){
	var l = 0;
	var temp = '';
	var oldColor = '';
	var newColor = '';
	if(id === 1){
		BG_COLOR = '#' + color;	// # only needed for background-color css
		while(l < ARR_COLOR1.length){			
			temp = BG_ARRAY[ARR_COLOR1[l]];
			oldColor = "'%23" + temp.match(/\'\%23([^']*)[']/)[1] + "'";
			newColor = "'%23" + color + "'";
			temp = temp.replace(oldColor,  newColor);
			BG_ARRAY[ARR_COLOR1[l]] = temp;
			l++;
		}
	}
	if(id === 2){
		BG_COLOR_TWO = '#' + color;
		while(l < ARR_COLOR2.length){			
			temp = BG_ARRAY[ARR_COLOR2[l]];
			oldColor = "'%23" + temp.match(/\'\%23([^']*)[']/)[1] + "'";
			newColor = "'%23" + color + "'";
			temp = temp.replace(oldColor,  newColor);
			BG_ARRAY[ARR_COLOR2[l]] = temp;
			l++;
		}
	}
	if(id === 3){
		BG_COLOR_THREE = '#' + color;		
		while(l < ARR_COLOR3.length){			
			temp = BG_ARRAY[ARR_COLOR3[l]];
			oldColor = "'%23" + temp.match(/\'\%23([^']*)[']/)[1] + "'";
			newColor = "'%23" + color + "'";
			temp = temp.replace(oldColor,  newColor);
			BG_ARRAY[ARR_COLOR3[l]] = temp;
			l++;
		}
	}
	if(DARK_LIGHT){
		updateDarkLight(); 
	}	
	updateBlends();
	applyBackground();
}


function updateDarkLight(){
	
	var l = 0;
	while(ARR_DARK_LIGHT_NUMBER.length > l){
		var temp = BG_ARRAY[ARR_DARK_LIGHT_NUMBER[l]];
		var dark_light = ARR_DARK_LIGHT[l];
		var type = dark_light.match(/[darklightes]*/)[0];
		var num = dark_light.replace(type, '');
		var color = BG_COLOR;
		
		if(num === "2"){
			color = BG_COLOR_TWO;
		}else if (num === "3"){
			color = BG_COLOR_THREE;
		}
		
		if(type === "darkest"){
			color = String(chroma.mix(color, '#000000', 0.6)).replace("#", '');
		}else if(type === "darker"){
			color = String(chroma.mix(color, '#000000', 0.4)).replace("#", '');
		}else if(type === "dark"){
			color = String(chroma.mix(color, '#000000', 0.2)).replace("#", '');
		}else if(type === "lightest"){
			color = String(chroma.mix(color, '#FFFFFF', 0.6)).replace("#", '');
		}else if(type === "lighter"){
			color = String(chroma.mix(color, '#FFFFFF', 0.4)).replace("#", '');
		}else if(type === "light"){
			color = String(chroma.mix(color, '#FFFFFF', 0.2)).replace("#", '');
		}
		
		temp = temp.replace( /%23[0-9a-fA-F]*/, '%23' + color);		
		BG_ARRAY[ARR_DARK_LIGHT_NUMBER[l]] = temp;
		
		l++;
	}	
}


function updateBlends(){
	createBlends();
	var l = 0;
	var l3 = ARR_COLOR_STEP_3.length;
	var l4 = ARR_COLOR_STEP_4.length;
	var l5 = ARR_COLOR_STEP_5.length;
	while(l < l3 || l < l4 || l < l5){
		if(l3 > l){
			 BG_ARRAY[ARR_COLOR_STEP_3[l]] = BG_ARRAY[ARR_COLOR_STEP_3[l]].replace(/%23[0-9a-fA-F]*/, "%23" + ARR_COLOR_S3[l]);	
		}
		if(l4 > l){
			BG_ARRAY[ARR_COLOR_STEP_4[l]] = BG_ARRAY[ARR_COLOR_STEP_4[l]].replace(/%23[0-9a-fA-F]*/, '%23' + ARR_COLOR_S4[l]);
		}
		if(l5 > l){
			BG_ARRAY[ARR_COLOR_STEP_5[l]] = BG_ARRAY[ARR_COLOR_STEP_5[l]].replace(/%23[0-9a-fA-F]*/, '%23' + ARR_COLOR_S5[l]);
		}
		l++;
	}	
}


function updateRange(id, value){ //this triggers twice in FF Chrome ... might want to gaurd against that... 
//https://stackoverflow.com/questions/18544890/onchange-event-on-input-type-range-is-not-triggering-in-firefox-while-dragging
	
	//safely handle id and value
	//if id.length > 1 return?
	//if id.length > 1 return?
	//o(String(id).length);
	
	
	var rType = document.getElementById("slider-" + id).getElementsByTagName("label")[0].innerHTML;
	if(rType === "SIZE"){
		SIZE = value;
		updateSize(id);
	}else if (rType === "SCALE"){
		SCALE = value;
		updateScale();
	}else if (rType === "OPACITY"){
		OPACITY = value;
		updateOpacity();		
	}else if (rType === "STROKE"){
		STROKE_WIDTH = value;
		updateStrokeWidth();
	}else if (rType === "WEIGHT"){
		
	}else if (rType === "COUNT"){
		
	}else if (rType === "ANGLE"){
		ANGLE = value;
		updateAngle(id);		
	}else if (rType === "RADIAL"){
		RADIAL = value;
		updateRadial(id);
	}else{
		o('bad rType');
	}	
	applyBackground();
}

function updateStrokeWidth(){	
	var l = 0;
	while(l < ARR_STROKE_WIDTH.length){		
		var temp = BG_ARRAY[ARR_STROKE_WIDTH[l]];		
		BG_ARRAY[ARR_STROKE_WIDTH[l]] = temp.replace(/stroke-width=\'[0-9.]*\'/, "stroke-width='" + STROKE_WIDTH + "'");
		l++;		
	}
}

function updateAngle(num){ //0 - 360;	
	var temp = BG_ARRAY[ARR_ANGLE[ARR_ANGLE_NUMBER[num]]];	
	if(ANGLE > 360){
		ANGLE = 360;
	}else if(ANGLE < 0){
		ANGLE = 0;
	}
	var y2;
	if(temp.includes("gradientTransform")){
	}else{		
		y2 = temp.match(/y2=\'[0-9%]*\'/)[0];	
		temp = temp.replace(y2, y2 + " gradientTransform='rotate(0)'");
	}	
	temp = temp.replace(/gradientTransform=\'rotate\([0-9,]*\)\'/, "gradientTransform='rotate(" + ANGLE + ")'");
	BG_ARRAY[ARR_ANGLE[ARR_ANGLE_NUMBER[num]]] = temp;
}

function updateRadial(num){ //0 - 100;	
	var temp = BG_ARRAY[ARR_RADIAL[ARR_RADIAL_NUMBER[num]]];
	if(RADIAL > 100){
		RADIAL = 100;
	}else if(RADIAL < 0){
		RADIAL = 0;
	}
	temp = temp.replace(/ r=\'[0-9%.]*\'/, " r='" + RADIAL + "%25'");
	BG_ARRAY[ARR_RADIAL[ARR_RADIAL_NUMBER[num]]] = temp;
}

function updateScale(){
	var value = convertScale(SCALE);
	var wValue = value;
	var hValue = value;
	var w = value;
	var h = value;
	var circle;
	var cx;
	var cy;
	var cr;
	
	var l = 0;
	while(l < ARR_SCALE.length){		
		var temp = BG_ARRAY[ARR_SCALE[l]];		
		if(temp.includes("width")){
			w = Number(temp.match(/width=\'([^']*)\'/)[1]);
			h = Number(temp.match(/height=\'([^']*)\'/)[1]);
		}else{
			cx = Number(temp.match(/cx=\'([^']*)\'/)[1]);
			cy = Number(temp.match(/cy=\'([^']*)\'/)[1]);
			cr = Number(temp.match(/ r=\'([^']*)\'/)[1]);
		}

		if(w > h){ //decide whether w or h is bigger
			hValue = Math.round(h/w * value * 10)/10;
			circle = wValue/2;
		}else{
			wValue = Math.round(w/h * value * 10)/10;
			circle = hValue/2;
		}

		if(temp.includes("width")){
			temp = temp.replace("width='" + w + "'", "width='" + wValue + "'");
			temp = temp.replace("height='" + h + "'", "height='" + hValue + "'");
		}else{
			temp = temp.replace("cx='" + cx + "'", "cx='" + circle + "'");
			temp = temp.replace("cy='" + cy + "'", "cy='" + circle + "'");
			temp = temp.replace(" r='" + cr + "'", " r='" + circle + "'");
		}		
		BG_ARRAY[ARR_SCALE[l]] = temp;
		l++;		
	}
}

function updateSize(sizeID){
	var value = convertSize(SIZE);
	var wValue = value;
	var hValue = value;
	var l = 0;	
	
	
	while(l < ARR_SIZE.length){
		
		var temp = BG_ARRAY[ARR_SIZE[l]];		
		if(temp.includes("width") && temp.includes("height")){
			var w = Number(temp.match(/width=[']([^']*)[']/)[1]);
			var h = Number(temp.match(/height=[']([^']*)[']/)[1]);
			if(w > h){ //decide whether w or h is bigger
				hValue = w/h * value;
			}else{
				wValue = h/w * value;
			}
			temp = temp.replace("width='" + w + "'", "width='" + wValue + "'");
			temp = temp.replace("height='" + h + "'", "height='" + hValue + "'");
		}
		if(temp.includes(" r='")){
			temp = temp.replace(/[ ]*r=\'[0-9.]*\'/, " r='" + value + "'");
		}		
		if(ARR_SIZE_NUMBER[l] === 'size' + ARR_SIZE_ID[sizeID]){
			BG_ARRAY[ARR_SIZE[l]] = temp;
		}
		l++;
	}
}
function updateOpacity(){
	var l = 0;
		while(l < ARR_OPACITY.length){			
			var temp = BG_ARRAY[ARR_OPACITY[l]];		
			var oldOpacity = "opacity='" + temp.match(/opacity=\'([^']*)[']/)[1] + "'";
			var newOpacity = "opacity='" + OPACITY + "'";
			temp = temp.replace(oldOpacity,  newOpacity);
			BG_ARRAY[ARR_OPACITY[l]] = temp;
			l++;
		}
}



function applyBackground(){	
	BG_IMAGE = BG_ARRAY.join("");
	document.body.style.backgroundColor = BG_COLOR;
	document.body.style.backgroundImage = BG_IMAGE;
	document.body.style.backgroundAttachment = BG_ATTACHMENT;
	document.body.style.backgroundSize = BG_SIZE;
	outputCode();
   
   /* $('a.'+CurrentClass.classList[1]+' ').css({'background-color':`${BG_COLOR}`,'background-image':`${BG_IMAGE}`});*/
   
   
   
}

function o(code){
	if(TEST_VAR === 'X'){
	   TEST_VAR = "";
	}
	TEST_VAR += code + '\n\n'; //document.getElementById('codeOutput').innerHTML = code;
}

function outputCode(){
	var bgOutput = 'background-color: ' + BG_COLOR + ';';
	if(BG_IMAGE.length > 1){
		optimizeOutput();
		bgOutput += '\nbackground-image: ' + BG_IMAGE + ';';        
	}
	if(BG_ATTACHMENT !== 'scroll'){
        bgOutput += '\nbackground-attachment: ' + BG_ATTACHMENT + ';';
	}
	if(BG_SIZE !== 'auto'){
        bgOutput += '\nbackground-size: ' + BG_SIZE + ';';
        bgOutput += '\nbackground-position: center;';
	}
	if(TEST_VAR === 'X'){
		document.getElementById('codeOutput').innerHTML = bgOutput;
	}else{
		document.getElementById('codeOutput').innerHTML = TEST_VAR;
		TEST_VAR = 'X';
	}
}
var REMOVE_EXCESS_CODE = ["gradientTransform='rotate(0)'", "gradientTransform='rotate(360)'", "fill-opacity='1'", "stroke-opacity='1'", "opacity='1'"];
function optimizeOutput(){
	var l = 0;
	while(l < REMOVE_EXCESS_CODE.length){
		BG_IMAGE = BG_IMAGE.replace(REMOVE_EXCESS_CODE[l], '');
		l++;
	}
	BG_IMAGE = BG_IMAGE.replace(/  +/g, ' ');
}
function transformCode(){	//assistant
	var inputer = document.getElementById('codeInputer'); 
	var outputer = document.getElementById('codeOutputer');
	outputer.innerHTML = encodeOptimizedSVGDataUri_assistant(inputer.value);
}

function titleCase(str){
	return str.toLowerCase().split(' ').map(function(word) {
	    return (word.charAt(0).toUpperCase() + word.slice(1));
	}).join(' ');
}
function rgb2hex(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return '#' + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}
function encodeOptimizedSVGDataUri(svgString){ //https://codepen.io/tigt/post/optimizing-svgs-in-data-uris
  var uriPayload = encodeURIComponent(svgString) // encode URL-unsafe characters
	.replace(/%0A/g, '') // remove newlines
	.replace(/%20/g, ' ') // put spaces back in
	.replace(/%3D/g, '=') // ditto equals signs
	.replace(/%3A/g, ':') // ditto colons
	.replace(/%2F/g, '/') // ditto slashes
	.replace(/%22/g, "'"); // replace quotes with apostrophes (may break certain SVGs)
  return 'data:image/svg+xml,' + uriPayload;
}

function encodeOptimizedSVGDataUri_assistant(svgString){ //https://codepen.io/tigt/post/optimizing-svgs-in-data-uris
	svgString = svgString.replace(/\r?\n|\r/g, '');
	svgString = svgString.replace(/ +(?= )/g, '');
	var uriPayload = encodeURIComponent(svgString) // encode URL-unsafe characters
	.replace(/%0A/g, '') // remove newlines
	.replace(/%20/g, ' ') // put spaces back in
	.replace(/%3D/g, '=') // ditto equals signs
	.replace(/%3A/g, ':') // ditto colons
	.replace(/%2F/g, '/') // ditto slashes
	.replace(/%22/g, "'"); // replace quotes with apostrophes (may break certain SVGs)
	uriPayload = uriPayload.replace(/\%3E \%3C/g,'%3E%3C');
	uriPayload = uriPayload.replace(/\%09/g,'');
  return 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100%25\' height=\'100%25\' viewBox=\'0 0 100%25 100%25\'%3E' + uriPayload + '%3C/svg%3E';
}

/*
function getGradientColor(start_color, end_color, percent) { //find steps between colors ; //0 - 1
	//https://stackoverflow.com/questions/3080421/javascript-color-gradient
   // strip the leading # if it's there
   start_color = start_color.replace(/^\s*#|\s*$/g, '');
   end_color = end_color.replace(/^\s*#|\s*$/g, '');

   // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
   if(start_color.length === 3){
     start_color = start_color.replace(/(.)/g, '$1$1');
   }

   if(end_color.length === 3){
     end_color = end_color.replace(/(.)/g, '$1$1');
   }

   // get colors
   var start_red = parseInt(start_color.substr(0, 2), 16),
       start_green = parseInt(start_color.substr(2, 2), 16),
       start_blue = parseInt(start_color.substr(4, 2), 16);

   var end_red = parseInt(end_color.substr(0, 2), 16),
       end_green = parseInt(end_color.substr(2, 2), 16),
       end_blue = parseInt(end_color.substr(4, 2), 16);

   // calculate new color
   var diff_red = end_red - start_red;
   var diff_green = end_green - start_green;
   var diff_blue = end_blue - start_blue;

   diff_red = ( (diff_red * percent) + start_red ).toString(16).split('.')[0];
   diff_green = ( (diff_green * percent) + start_green ).toString(16).split('.')[0];
   diff_blue = ( (diff_blue * percent) + start_blue ).toString(16).split('.')[0];

   // ensure 2 digits by color
   if( diff_red.length === 1 ){
	   diff_red = '0' + diff_red;
   }
   if( diff_green.length === 1 ){
	   diff_green = '0' + diff_green;
   }
   if( diff_blue.length === 1 ){
	   diff_blue = '0' + diff_blue;
   }     
   return diff_red + diff_green + diff_blue;
}

*/
































/**
 * Zenscroll 4.0.0  * https://github.com/zengabor/zenscroll/
 */


(function (root, factory) {
	if (typeof define === "function" && define.amd) {
		define([], factory());
	} else if (typeof module === "object" && module.exports) {
		module.exports = factory();
	} else {
		(function install() {
			// To make sure Zenscroll can be referenced from the header, before `body` is available
			if (document && document.body) {
				root.zenscroll = factory();
			} else {
				// retry 9ms later
				setTimeout(install, 9);
			}
		})();
	}
}(this, function () {
	//"use strict";  //took out since this opens my document


	// Detect if the browser already supports native smooth scrolling (e.g., Firefox 36+ and Chrome 49+) and it is enabled:
	var isNativeSmoothScrollEnabledOn = function (elem) {
		return ("getComputedStyle" in window) &&
			window.getComputedStyle(elem)["scroll-behavior"] === "smooth";
	}


	// Exit if it’s not a browser environment:
	if (typeof window === "undefined" || !("document" in window)) {
		return {};
	}


	var makeScroller = function (container, defaultDuration, edgeOffset) {

		// Use defaults if not provided
		defaultDuration = defaultDuration || 999; //ms
		if (!edgeOffset && edgeOffset !== 0) {
			// When scrolling, this amount of distance is kept from the edges of the container:
			edgeOffset = 9; //px
		}

		// Handling the life-cycle of the scroller
		var scrollTimeoutId;
		var setScrollTimeoutId = function (newValue) {
			scrollTimeoutId = newValue;
		}

		/**
		 * Stop the current smooth scroll operation immediately
		 */
		var stopScroll = function () {
			clearTimeout(scrollTimeoutId);
			setScrollTimeoutId(0);
		}

		var getTopWithEdgeOffset = function (elem) {
			return Math.max(0, container.getTopOf(elem) - edgeOffset);
		}

		/**
		 * Scrolls to a specific vertical position in the document.
		 *
		 * @param {targetY} The vertical position within the document.
		 * @param {duration} Optionally the duration of the scroll operation.
		 *        If not provided the default duration is used.
		 * @param {onDone} An optional callback function to be invoked once the scroll finished.
		 */
		var scrollToY = function (targetY, duration, onDone) {
			stopScroll();
			if (duration === 0 || (duration && duration < 0) || isNativeSmoothScrollEnabledOn(container.body)) {
				container.toY(targetY);
				if (onDone) {
					onDone();
				}
			} else {
				var startY = container.getY();
				var distance = Math.max(0, targetY) - startY;
				var startTime = new Date().getTime();
				duration = duration || Math.min(Math.abs(distance), defaultDuration);
				(function loopScroll() {
					setScrollTimeoutId(setTimeout(function () {
						// Calculate percentage:
						var p = Math.min(1, (new Date().getTime() - startTime) / duration);
						// Calculate the absolute vertical position:
						var y = Math.max(0, Math.floor(startY + distance*(p < 0.5 ? 2*p*p : p*(4 - p*2)-1)));
						container.toY(y);
						if (p < 1 && (container.getHeight() + y) < container.body.scrollHeight) {
							loopScroll();
						} else {
							setTimeout(stopScroll, 99); // with cooldown time
							if (onDone) {
								onDone();
							}
						}
					}, 9));
				})();
			}
		};

		/**
		 * Scrolls to the top of a specific element.
		 *
		 * @param {elem} The element to scroll to.
		 * @param {duration} Optionally the duration of the scroll operation.
		 * @param {onDone} An optional callback function to be invoked once the scroll finished.
		 */
		var scrollToElem = function (elem, duration, onDone) {
			scrollToY(getTopWithEdgeOffset(elem), duration, onDone);
		};

		/**
		 * Scrolls an element into view if necessary.
		 *
		 * @param {elem} The element.
		 * @param {duration} Optionally the duration of the scroll operation.
		 * @param {onDone} An optional callback function to be invoked once the scroll finished.
		 */
		var scrollIntoView = function (elem, duration, onDone) {
			var elemHeight = elem.getBoundingClientRect().height;
			var elemBottom = container.getTopOf(elem) + elemHeight;
			var containerHeight = container.getHeight();
			var y = container.getY();
			var containerBottom = y + containerHeight;
			if (getTopWithEdgeOffset(elem) < y || (elemHeight + edgeOffset) > containerHeight) {
				// Element is clipped at top or is higher than screen.
				scrollToElem(elem, duration, onDone);
			} else if ((elemBottom + edgeOffset) > containerBottom) {
				// Element is clipped at the bottom.
				scrollToY(elemBottom - containerHeight + edgeOffset, duration, onDone);
			} else if (onDone) {
				onDone();
			}
		};

		/**
		 * Scrolls to the center of an element.
		 *
		 * @param {elem} The element.
		 * @param {duration} Optionally the duration of the scroll operation.
		 * @param {offset} Optionally the offset of the top of the element from the center of the screen.
		 * @param {onDone} An optional callback function to be invoked once the scroll finished.
		 */
		var scrollToCenterOf = function (elem, duration, offset, onDone) {
			scrollToY(Math.max(0, container.getTopOf(elem) - container.getHeight()/2 + (offset || elem.getBoundingClientRect().height/2)), duration, onDone);
		}

		/**
		 * Changes default settings for this scroller.
		 *
		 * @param {newDefaultDuration} Optionally a new value for default duration, used for each scroll method by default.
		 *        Ignored if null or undefined.
		 * @param {newEdgeOffset} Optionally a new value for the edge offset, used by each scroll method by default. Ignored if null or undefined.
		 * @returns An object with the current values.
		 */
		var setup = function (newDefaultDuration, newEdgeOffset) {
			if (newDefaultDuration === 0 || newDefaultDuration) {
				defaultDuration = newDefaultDuration;
			}
			if (newEdgeOffset === 0 || newEdgeOffset) {
				edgeOffset = newEdgeOffset;
			}
			return {
				defaultDuration: defaultDuration,
				edgeOffset: edgeOffset
			}
		}

		return {
			setup: setup,
			to: scrollToElem,
			toY: scrollToY,
			intoView: scrollIntoView,
			center: scrollToCenterOf,
			stop: stopScroll,
			moving: function () { return !!scrollTimeoutId },
			getY: container.getY,
			getTopOf: container.getTopOf
		}

	}


	var docElem = document.documentElement;
	var getDocY = function () { return window.scrollY || docElem.scrollTop };

	// Create a scroller for the document:
	var zenscroll = makeScroller({
		body: document.scrollingElement || document.body,
		toY: function (y) { window.scrollTo(0, y) },
		getY: getDocY,
		getHeight: function () { return window.innerHeight || docElem.clientHeight },
		getTopOf: function (elem) { return elem.getBoundingClientRect().top + getDocY() - docElem.offsetTop }
	});


	/**
	 * Creates a scroller from the provided container element (e.g., a DIV)
	 *
	 * @param {scrollContainer} The vertical position within the document.
	 * @param {defaultDuration} Optionally a value for default duration, used for each scroll method by default.
	 *        Ignored if 0 or null or undefined.
	 * @param {edgeOffset} Optionally a value for the edge offset, used by each scroll method by default. 
	 *        Ignored if null or undefined.
	 * @returns A scroller object, similar to `zenscroll` but controlling the provided element.
	 */
	zenscroll.createScroller = function (scrollContainer, defaultDuration, edgeOffset) {
		return makeScroller({
			body: scrollContainer,
			toY: function (y) { scrollContainer.scrollTop = y },
			getY: function () { return scrollContainer.scrollTop },
			getHeight: function () { return Math.min(scrollContainer.clientHeight, window.innerHeight || docElem.clientHeight) },
			getTopOf: function (elem) { return elem.offsetTop }
		}, defaultDuration, edgeOffset);
	};


	// Automatic link-smoothing on achors
	// Exclude IE8- or when native is enabled or Zenscroll auto- is disabled
	if ("addEventListener" in window && !window.noZensmooth && !isNativeSmoothScrollEnabledOn(document.body)) {


		var isScrollRestorationSupported = "scrollRestoration" in history;

		// On first load & refresh make sure the browser restores the position first
		if (isScrollRestorationSupported) {
			history.scrollRestoration = "auto";
		}

		window.addEventListener("load", function () {

			if (isScrollRestorationSupported) {
				// Set it to manual
				setTimeout(function () { history.scrollRestoration = "manual" ;}, 9);
				window.addEventListener("popstate", function (event) {
					if (event.state && "zenscrollY" in event.state) {
						zenscroll.toY(event.state.zenscrollY);
					}
				}, false);
			}

			// Add edge offset on first load if necessary
			// This may not work on IE (or older computer?) as it requires more timeout, around 100 ms
			if (window.location.hash) {
				setTimeout(function () {
					// Adjustment is only needed if there is an edge offset:
					var edgeOffset = zenscroll.setup().edgeOffset;
					if (edgeOffset) {
						var targetElem = document.getElementById(window.location.href.split("#")[1]);
						if (targetElem) {
							var targetY = Math.max(0, zenscroll.getTopOf(targetElem) - edgeOffset);
							var diff = zenscroll.getY() - targetY;
							// Only do the adjustment if the browser is very close to the element:
							if (0 <= diff && diff < 9 ) {
								window.scrollTo(0, targetY);
							}
						}
					}
				}, 9);
			}

		}, false);

		// Handling clicks on anchors
		var RE_noZensmooth = new RegExp("(^|\\s)noZensmooth(\\s|$)");
		window.addEventListener("click", function (event) {
            
			var anchor = event.target;
			while (anchor && anchor.tagName !== "A") {
				if(anchor.tagName === "LABEL"){
				   if(anchor.getAttribute("id") === "color-lock"){
					   selectBG('color-lock');
					   return;
				   }
				}else if(anchor.tagName === "BUTTON"){
					if(anchor.getAttribute("id") === "hide-ui"){
						selectBG('hide-ui');
						return;
					}
				}
				anchor = anchor.parentNode;
			}
			// Let the browser handle the click if it wasn't with the primary button, or with some modifier keys:
			if (!anchor || event.which !== 1 || event.shiftKey || event.metaKey || event.ctrlKey || event.altKey) {
				return;				
			}
			//color-lock
            /*CurrentClass = anchor ;*/
            
/*MY CODE*/	selectBG(anchor); /*MY CODE*/			
			
			// Save the current scrolling position so it can be used for scroll restoration:
			if (isScrollRestorationSupported) {
				try {
					history.replaceState({ zenscrollY: zenscroll.getY() }, "");
				} catch (e) {
					// Avoid the Chrome Security exception on file protocol, e.g., file://index.html
				}
			}
			// Find the referenced ID:
			var href = anchor.getAttribute("href") || "";
			if (href.indexOf("#") === 0 && !RE_noZensmooth.test(anchor.className)) {
				var targetY = 0;
				var targetElem = document.getElementById(href.substring(1));
				if (href !== "#") {
					if (!targetElem) {
						// Let the browser handle the click if the target ID is not found.
						return;
					}
					targetY = zenscroll.getTopOf(targetElem);
				}
				event.preventDefault();
				// By default trigger the browser's `hashchange` event...
				var onDone = function () { window.location = href; };
				// ...unless there is an edge offset specified
				var edgeOffset = zenscroll.setup().edgeOffset;
				if (edgeOffset) {
					targetY = Math.max(0, targetY - edgeOffset);
					onDone = function () { history.pushState(null, "", href); };
				}
				zenscroll.toY(targetY, null, onDone);
			}
		}, false);

	}
	return zenscroll;
}));



/*
chroma.js - JavaScript library for color conversions

Copyright (c) 2011-2017, Gregor Aisch
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

3. The name Gregor Aisch may not be used to endorse or promote products
   derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL GREGOR AISCH OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/
(function(){var a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,$,_,aa,ba,ca,da,ea,fa,ga,ha,ia,ja,ka,la,ma,na,oa,pa,qa,ra,sa,ta,ua,va,wa,xa,ya,za,Aa,Ba,Ca=[].slice;xa=function(){var a,b,c,d,e;for(a={},e="Boolean Number String Function Array Date RegExp Undefined Null".split(" "),d=0,b=e.length;d<b;d++)c=e[d],a["[object "+c+"]"]=c.toLowerCase();return function(b){var c;return c=Object.prototype.toString.call(b),a[c]||"object"}}(),U=function(a,b,c){return null==b&&(b=0),null==c&&(c=1),a<b&&(a=b),a>c&&(a=c),a},ya=function(a){return a.length>=3?[].slice.call(a):a[0]},u=function(a){var b,c;for(a._clipped=!1,a._unclipped=a.slice(0),b=c=0;c<3;b=++c)b<3?((a[b]<0||a[b]>255)&&(a._clipped=!0),a[b]<0&&(a[b]=0),a[b]>255&&(a[b]=255)):3===b&&(a[b]<0&&(a[b]=0),a[b]>1&&(a[b]=1));return a._clipped||delete a._unclipped,a},d=Math.PI,sa=Math.round,w=Math.cos,B=Math.floor,ba=Math.pow,V=Math.log,ua=Math.sin,va=Math.sqrt,n=Math.atan2,Y=Math.max,m=Math.abs,g=2*d,e=d/3,b=d/180,f=180/d,t=function(){return arguments[0]instanceof a?arguments[0]:function(a,b,c){c.prototype=a.prototype;var d=new c,e=a.apply(d,b);return Object(e)===e?e:d}(a,arguments,function(){})},t.default=t,l=[],"undefined"!=typeof module&&null!==module&&null!=module.exports&&(module.exports=t),"function"==typeof define&&define.amd?define([],function(){return t}):(ra="undefined"!=typeof exports&&null!==exports?exports:this,ra.chroma=t),t.version="1.3.5",k={},i=[],j=!1,a=function(){function a(){var a,b,c,d,e,f,g,h,l;for(f=this,b=[],h=0,d=arguments.length;h<d;h++)null!=(a=arguments[h])&&b.push(a);if(b.length>1&&(g=b[b.length-1]),null!=k[g])f._rgb=u(k[g](ya(b.slice(0,-1))));else{for(j||(i=i.sort(function(a,b){return b.p-a.p}),j=!0),l=0,e=i.length;l<e&&(c=i[l],!(g=c.test.apply(c,b)));l++);g&&(f._rgb=u(k[g].apply(k,b)))}null==f._rgb&&console.warn("unknown format: "+b),null==f._rgb&&(f._rgb=[0,0,0]),3===f._rgb.length&&f._rgb.push(1)}return a.prototype.toString=function(){return this.hex()},a.prototype.clone=function(){return t(me._rgb)},a}(),t._input=k,t.brewer=r={OrRd:["#fff7ec","#fee8c8","#fdd49e","#fdbb84","#fc8d59","#ef6548","#d7301f","#b30000","#7f0000"],PuBu:["#fff7fb","#ece7f2","#d0d1e6","#a6bddb","#74a9cf","#3690c0","#0570b0","#045a8d","#023858"],BuPu:["#f7fcfd","#e0ecf4","#bfd3e6","#9ebcda","#8c96c6","#8c6bb1","#88419d","#810f7c","#4d004b"],Oranges:["#fff5eb","#fee6ce","#fdd0a2","#fdae6b","#fd8d3c","#f16913","#d94801","#a63603","#7f2704"],BuGn:["#f7fcfd","#e5f5f9","#ccece6","#99d8c9","#66c2a4","#41ae76","#238b45","#006d2c","#00441b"],YlOrBr:["#ffffe5","#fff7bc","#fee391","#fec44f","#fe9929","#ec7014","#cc4c02","#993404","#662506"],YlGn:["#ffffe5","#f7fcb9","#d9f0a3","#addd8e","#78c679","#41ab5d","#238443","#006837","#004529"],Reds:["#fff5f0","#fee0d2","#fcbba1","#fc9272","#fb6a4a","#ef3b2c","#cb181d","#a50f15","#67000d"],RdPu:["#fff7f3","#fde0dd","#fcc5c0","#fa9fb5","#f768a1","#dd3497","#ae017e","#7a0177","#49006a"],Greens:["#f7fcf5","#e5f5e0","#c7e9c0","#a1d99b","#74c476","#41ab5d","#238b45","#006d2c","#00441b"],YlGnBu:["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"],Purples:["#fcfbfd","#efedf5","#dadaeb","#bcbddc","#9e9ac8","#807dba","#6a51a3","#54278f","#3f007d"],GnBu:["#f7fcf0","#e0f3db","#ccebc5","#a8ddb5","#7bccc4","#4eb3d3","#2b8cbe","#0868ac","#084081"],Greys:["#ffffff","#f0f0f0","#d9d9d9","#bdbdbd","#969696","#737373","#525252","#252525","#000000"],YlOrRd:["#ffffcc","#ffeda0","#fed976","#feb24c","#fd8d3c","#fc4e2a","#e31a1c","#bd0026","#800026"],PuRd:["#f7f4f9","#e7e1ef","#d4b9da","#c994c7","#df65b0","#e7298a","#ce1256","#980043","#67001f"],Blues:["#f7fbff","#deebf7","#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#08519c","#08306b"],PuBuGn:["#fff7fb","#ece2f0","#d0d1e6","#a6bddb","#67a9cf","#3690c0","#02818a","#016c59","#014636"],Viridis:["#440154","#482777","#3f4a8a","#31678e","#26838f","#1f9d8a","#6cce5a","#b6de2b","#fee825"],Spectral:["#9e0142","#d53e4f","#f46d43","#fdae61","#fee08b","#ffffbf","#e6f598","#abdda4","#66c2a5","#3288bd","#5e4fa2"],RdYlGn:["#a50026","#d73027","#f46d43","#fdae61","#fee08b","#ffffbf","#d9ef8b","#a6d96a","#66bd63","#1a9850","#006837"],RdBu:["#67001f","#b2182b","#d6604d","#f4a582","#fddbc7","#f7f7f7","#d1e5f0","#92c5de","#4393c3","#2166ac","#053061"],PiYG:["#8e0152","#c51b7d","#de77ae","#f1b6da","#fde0ef","#f7f7f7","#e6f5d0","#b8e186","#7fbc41","#4d9221","#276419"],PRGn:["#40004b","#762a83","#9970ab","#c2a5cf","#e7d4e8","#f7f7f7","#d9f0d3","#a6dba0","#5aae61","#1b7837","#00441b"],RdYlBu:["#a50026","#d73027","#f46d43","#fdae61","#fee090","#ffffbf","#e0f3f8","#abd9e9","#74add1","#4575b4","#313695"],BrBG:["#543005","#8c510a","#bf812d","#dfc27d","#f6e8c3","#f5f5f5","#c7eae5","#80cdc1","#35978f","#01665e","#003c30"],RdGy:["#67001f","#b2182b","#d6604d","#f4a582","#fddbc7","#ffffff","#e0e0e0","#bababa","#878787","#4d4d4d","#1a1a1a"],PuOr:["#7f3b08","#b35806","#e08214","#fdb863","#fee0b6","#f7f7f7","#d8daeb","#b2abd2","#8073ac","#542788","#2d004b"],Set2:["#66c2a5","#fc8d62","#8da0cb","#e78ac3","#a6d854","#ffd92f","#e5c494","#b3b3b3"],Accent:["#7fc97f","#beaed4","#fdc086","#ffff99","#386cb0","#f0027f","#bf5b17","#666666"],Set1:["#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00","#ffff33","#a65628","#f781bf","#999999"],Set3:["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9","#bc80bd","#ccebc5","#ffed6f"],Dark2:["#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02","#a6761d","#666666"],Paired:["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6","#6a3d9a","#ffff99","#b15928"],Pastel2:["#b3e2cd","#fdcdac","#cbd5e8","#f4cae4","#e6f5c9","#fff2ae","#f1e2cc","#cccccc"],Pastel1:["#fbb4ae","#b3cde3","#ccebc5","#decbe4","#fed9a6","#ffffcc","#e5d8bd","#fddaec","#f2f2f2"]},function(){var a,b;b=[];for(a in r)b.push(r[a.toLowerCase()]=r[a])}(),za={aliceblue:"#f0f8ff",antiquewhite:"#faebd7",aqua:"#00ffff",aquamarine:"#7fffd4",azure:"#f0ffff",beige:"#f5f5dc",bisque:"#ffe4c4",black:"#000000",blanchedalmond:"#ffebcd",blue:"#0000ff",blueviolet:"#8a2be2",brown:"#a52a2a",burlywood:"#deb887",cadetblue:"#5f9ea0",chartreuse:"#7fff00",chocolate:"#d2691e",coral:"#ff7f50",cornflower:"#6495ed",cornflowerblue:"#6495ed",cornsilk:"#fff8dc",crimson:"#dc143c",cyan:"#00ffff",darkblue:"#00008b",darkcyan:"#008b8b",darkgoldenrod:"#b8860b",darkgray:"#a9a9a9",darkgreen:"#006400",darkgrey:"#a9a9a9",darkkhaki:"#bdb76b",darkmagenta:"#8b008b",darkolivegreen:"#556b2f",darkorange:"#ff8c00",darkorchid:"#9932cc",darkred:"#8b0000",darksalmon:"#e9967a",darkseagreen:"#8fbc8f",darkslateblue:"#483d8b",darkslategray:"#2f4f4f",darkslategrey:"#2f4f4f",darkturquoise:"#00ced1",darkviolet:"#9400d3",deeppink:"#ff1493",deepskyblue:"#00bfff",dimgray:"#696969",dimgrey:"#696969",dodgerblue:"#1e90ff",firebrick:"#b22222",floralwhite:"#fffaf0",forestgreen:"#228b22",fuchsia:"#ff00ff",gainsboro:"#dcdcdc",ghostwhite:"#f8f8ff",gold:"#ffd700",goldenrod:"#daa520",gray:"#808080",green:"#008000",greenyellow:"#adff2f",grey:"#808080",honeydew:"#f0fff0",hotpink:"#ff69b4",indianred:"#cd5c5c",indigo:"#4b0082",ivory:"#fffff0",khaki:"#f0e68c",laserlemon:"#ffff54",lavender:"#e6e6fa",lavenderblush:"#fff0f5",lawngreen:"#7cfc00",lemonchiffon:"#fffacd",lightblue:"#add8e6",lightcoral:"#f08080",lightcyan:"#e0ffff",lightgoldenrod:"#fafad2",lightgoldenrodyellow:"#fafad2",lightgray:"#d3d3d3",lightgreen:"#90ee90",lightgrey:"#d3d3d3",lightpink:"#ffb6c1",lightsalmon:"#ffa07a",lightseagreen:"#20b2aa",lightskyblue:"#87cefa",lightslategray:"#778899",lightslategrey:"#778899",lightsteelblue:"#b0c4de",lightyellow:"#ffffe0",lime:"#00ff00",limegreen:"#32cd32",linen:"#faf0e6",magenta:"#ff00ff",maroon:"#800000",maroon2:"#7f0000",maroon3:"#b03060",mediumaquamarine:"#66cdaa",mediumblue:"#0000cd",mediumorchid:"#ba55d3",mediumpurple:"#9370db",mediumseagreen:"#3cb371",mediumslateblue:"#7b68ee",mediumspringgreen:"#00fa9a",mediumturquoise:"#48d1cc",mediumvioletred:"#c71585",midnightblue:"#191970",mintcream:"#f5fffa",mistyrose:"#ffe4e1",moccasin:"#ffe4b5",navajowhite:"#ffdead",navy:"#000080",oldlace:"#fdf5e6",olive:"#808000",olivedrab:"#6b8e23",orange:"#ffa500",orangered:"#ff4500",orchid:"#da70d6",palegoldenrod:"#eee8aa",palegreen:"#98fb98",paleturquoise:"#afeeee",palevioletred:"#db7093",papayawhip:"#ffefd5",peachpuff:"#ffdab9",peru:"#cd853f",pink:"#ffc0cb",plum:"#dda0dd",powderblue:"#b0e0e6",purple:"#800080",purple2:"#7f007f",purple3:"#a020f0",rebeccapurple:"#663399",red:"#ff0000",rosybrown:"#bc8f8f",royalblue:"#4169e1",saddlebrown:"#8b4513",salmon:"#fa8072",sandybrown:"#f4a460",seagreen:"#2e8b57",seashell:"#fff5ee",sienna:"#a0522d",silver:"#c0c0c0",skyblue:"#87ceeb",slateblue:"#6a5acd",slategray:"#708090",slategrey:"#708090",snow:"#fffafa",springgreen:"#00ff7f",steelblue:"#4682b4",tan:"#d2b48c",teal:"#008080",thistle:"#d8bfd8",tomato:"#ff6347",turquoise:"#40e0d0",violet:"#ee82ee",wheat:"#f5deb3",white:"#ffffff",whitesmoke:"#f5f5f5",yellow:"#ffff00",yellowgreen:"#9acd32"},t.colors=za,P=function(){var a,b,d,e,f,g,h,i,j;return b=ya(arguments),f=b[0],a=b[1],d=b[2],i=(f+16)/116,h=isNaN(a)?i:i+a/500,j=isNaN(d)?i:i-d/200,i=c.Yn*Q(i),h=c.Xn*Q(h),j=c.Zn*Q(j),g=Ba(3.2404542*h-1.5371385*i-.4985314*j),e=Ba(-.969266*h+1.8760108*i+.041556*j),d=Ba(.0556434*h-.2040259*i+1.0572252*j),[g,e,d,b.length>3?b[3]:1]},Ba=function(a){return 255*(a<=.00304?12.92*a:1.055*ba(a,1/2.4)-.055)},Q=function(a){return a>c.t1?a*a*a:c.t2*(a-c.t0)},c={Kn:18,Xn:.95047,Yn:1,Zn:1.08883,t0:.137931034,t1:.206896552,t2:.12841855,t3:.008856452},ja=function(){var a,b,c,d,e,f,g,h;return d=ya(arguments),c=d[0],b=d[1],a=d[2],e=oa(c,b,a),f=e[0],g=e[1],h=e[2],[116*g-16,500*(f-g),200*(g-h)]},pa=function(a){return(a/=255)<=.04045?a/12.92:ba((a+.055)/1.055,2.4)},Aa=function(a){return a>c.t3?ba(a,1/3):a/c.t2+c.t0},oa=function(){var a,b,d,e,f,g,h;return e=ya(arguments),d=e[0],b=e[1],a=e[2],d=pa(d),b=pa(b),a=pa(a),f=Aa((.4124564*d+.3575761*b+.1804375*a)/c.Xn),g=Aa((.2126729*d+.7151522*b+.072175*a)/c.Yn),h=Aa((.0193339*d+.119192*b+.9503041*a)/c.Zn),[f,g,h]},t.lab=function(){return function(a,b,c){c.prototype=a.prototype;var d=new c,e=a.apply(d,b);return Object(e)===e?e:d}(a,Ca.call(arguments).concat(["lab"]),function(){})},k.lab=P,a.prototype.lab=function(){return ja(this._rgb)},o=function(a){var b,c,d,e,f,g,h,i,j,k,l;return a=function(){var b,c,d;for(d=[],c=0,b=a.length;c<b;c++)e=a[c],d.push(t(e));return d}(),2===a.length?(j=function(){var b,c,d;for(d=[],c=0,b=a.length;c<b;c++)e=a[c],d.push(e.lab());return d}(),f=j[0],g=j[1],b=function(a){var b,c;return c=function(){var c,d;for(d=[],b=c=0;c<=2;b=++c)d.push(f[b]+a*(g[b]-f[b]));return d}(),t.lab.apply(t,c)}):3===a.length?(k=function(){var b,c,d;for(d=[],c=0,b=a.length;c<b;c++)e=a[c],d.push(e.lab());return d}(),f=k[0],g=k[1],h=k[2],b=function(a){var b,c;return c=function(){var c,d;for(d=[],b=c=0;c<=2;b=++c)d.push((1-a)*(1-a)*f[b]+2*(1-a)*a*g[b]+a*a*h[b]);return d}(),t.lab.apply(t,c)}):4===a.length?(l=function(){var b,c,d;for(d=[],c=0,b=a.length;c<b;c++)e=a[c],d.push(e.lab());return d}(),f=l[0],g=l[1],h=l[2],i=l[3],b=function(a){var b,c;return c=function(){var c,d;for(d=[],b=c=0;c<=2;b=++c)d.push((1-a)*(1-a)*(1-a)*f[b]+3*(1-a)*(1-a)*a*g[b]+3*(1-a)*a*a*h[b]+a*a*a*i[b]);return d}(),t.lab.apply(t,c)}):5===a.length&&(c=o(a.slice(0,3)),d=o(a.slice(2,5)),b=function(a){return a<.5?c(2*a):d(2*(a-.5))}),b},t.bezier=function(a){var b;return b=o(a),b.scale=function(){return t.scale(b)},b},t.cubehelix=function(a,b,c,d,e){var f,h,i;return null==a&&(a=300),null==b&&(b=-1.5),null==c&&(c=1),null==d&&(d=1),null==e&&(e=[0,1]),f=0,"array"===xa(e)?h=e[1]-e[0]:(h=0,e=[e,e]),i=function(i){var j,k,l,m,n,o,p,q,r;return j=g*((a+120)/360+b*i),p=ba(e[0]+h*i,d),o=0!==f?c[0]+i*f:c,k=o*p*(1-p)/2,m=w(j),r=ua(j),q=p+k*(-.14861*m+1.78277*r),n=p+k*(-.29227*m-.90649*r),l=p+k*(1.97294*m),t(u([255*q,255*n,255*l]))},i.start=function(b){return null==b?a:(a=b,i)},i.rotations=function(a){return null==a?b:(b=a,i)},i.gamma=function(a){return null==a?d:(d=a,i)},i.hue=function(a){return null==a?c:(c=a,"array"===xa(c)?0===(f=c[1]-c[0])&&(c=c[1]):f=0,i)},i.lightness=function(a){return null==a?e:("array"===xa(a)?(e=a,h=a[1]-a[0]):(e=[a,a],h=0),i)},i.scale=function(){return t.scale(i)},i.hue(c),i},t.random=function(){var b,c,d;for(c="0123456789abcdef",b="#",d=0;d<6;++d)b+=c.charAt(B(16*Math.random()));return new a(b)},l=[],I=function(a,b,c,d){var e,f,g,h;for(null==c&&(c=.5),null==d&&(d="rgb"),"object"!==xa(a)&&(a=t(a)),"object"!==xa(b)&&(b=t(b)),g=0,f=l.length;g<f;g++)if(e=l[g],d===e[0]){h=e[1](a,b,c,d);break}if(null==h)throw"color mode "+d+" is not supported";return h.alpha(a.alpha()+c*(b.alpha()-a.alpha()))},t.interpolate=I,a.prototype.interpolate=function(a,b,c){return I(this,a,b,c)},t.mix=I,a.prototype.mix=a.prototype.interpolate,k.rgb=function(){var a,b,c,d;b=ya(arguments),c=[];for(a in b)d=b[a],c.push(d);return c},t.rgb=function(){return function(a,b,c){c.prototype=a.prototype;var d=new c,e=a.apply(d,b);return Object(e)===e?e:d}(a,Ca.call(arguments).concat(["rgb"]),function(){})},a.prototype.rgb=function(a){return null==a&&(a=!0),a?this._rgb.map(Math.round).slice(0,3):this._rgb.slice(0,3)},a.prototype.rgba=function(a){return null==a&&(a=!0),a?[Math.round(this._rgb[0]),Math.round(this._rgb[1]),Math.round(this._rgb[2]),this._rgb[3]]:this._rgb.slice(0)},i.push({p:3,test:function(a){var b;return b=ya(arguments),"array"===xa(b)&&3===b.length?"rgb":4===b.length&&"number"===xa(b[3])&&b[3]>=0&&b[3]<=1?"rgb":void 0}}),k.lrgb=k.rgb,L=function(b,c,d,e){var f,g;return f=b._rgb,g=c._rgb,new a(va(ba(f[0],2)*(1-d)+ba(g[0],2)*d),va(ba(f[1],2)*(1-d)+ba(g[1],2)*d),va(ba(f[2],2)*(1-d)+ba(g[2],2)*d),e)},h=function(b){var c,d,e,f,g,h;for(d=1/b.length,h=[0,0,0,0],f=0,e=b.length;f<e;f++)c=b[f],g=c._rgb,h[0]+=ba(g[0],2)*d,h[1]+=ba(g[1],2)*d,h[2]+=ba(g[2],2)*d,h[3]+=g[3]*d;return h[0]=va(h[0]),h[1]=va(h[1]),h[2]=va(h[2]),new a(h)},l.push(["lrgb",L]),t.average=function(a,b){var c,e,f,g,i,j,k,l,m,o,p,q,r;if(null==b&&(b="rgb"),m=a.length,a=a.map(function(a){return t(a)}),k=a.splice(0,1)[0],"lrgb"===b)return h(a);q=k.get(b),g=[],i=0,j=0;for(l in q)q[l]=q[l]||0,g.push(isNaN(q[l])?0:1),"h"!==b.charAt(l)||isNaN(q[l])||(c=q[l]/180*d,i+=w(c),j+=ua(c));for(e=k.alpha(),p=0,o=a.length;p<o;p++){f=a[p],r=f.get(b),e+=f.alpha();for(l in q)isNaN(r[l])||(q[l]+=r[l],g[l]+=1,"h"===b.charAt(l)&&(c=q[l]/180*d,i+=w(c),j+=ua(c)))}for(l in q)if(q[l]=q[l]/g[l],"h"===b.charAt(l)){for(c=n(j/g[l],i/g[l])/d*180;c<0;)c+=360;for(;c>=360;)c-=360;q[l]=c}return t(q,b).alpha(e/m)},D=function(a){var b,c,d,e,f,g;if(a.match(/^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/))return 4!==a.length&&7!==a.length||(a=a.substr(1)),3===a.length&&(a=a.split(""),a=a[0]+a[0]+a[1]+a[1]+a[2]+a[2]),g=parseInt(a,16),e=g>>16,d=g>>8&255,c=255&g,[e,d,c,1];if(a.match(/^#?([A-Fa-f0-9]{8})$/))return 9===a.length&&(a=a.substr(1)),g=parseInt(a,16),e=g>>24&255,d=g>>16&255,c=g>>8&255,b=sa((255&g)/255*100)/100,[e,d,c,b];if(null!=k.css&&(f=k.css(a)))return f;throw"unknown color: "+a},fa=function(a,b){var c,d,e,f,g,h,i;return null==b&&(b="rgb"),g=a[0],e=a[1],d=a[2],c=a[3],g=Math.round(g),e=Math.round(e),d=Math.round(d),i=g<<16|e<<8|d,h="000000"+i.toString(16),h=h.substr(h.length-6),f="0"+sa(255*c).toString(16),f=f.substr(f.length-2),"#"+function(){switch(b.toLowerCase()){case"rgba":return h+f;case"argb":return f+h;default:return h}}()},k.hex=function(a){return D(a)},t.hex=function(){return function(a,b,c){c.prototype=a.prototype;var d=new c,e=a.apply(d,b);return Object(e)===e?e:d}(a,Ca.call(arguments).concat(["hex"]),function(){})},a.prototype.hex=function(a){return null==a&&(a="rgb"),fa(this._rgb,a)},i.push({p:4,test:function(a){if(1===arguments.length&&"string"===xa(a))return"hex"}}),G=function(){var a,b,c,d,e,f,g,h,i,j,k,l,m,n;if(a=ya(arguments),e=a[0],k=a[1],g=a[2],0===k)i=d=b=255*g;else{for(n=[0,0,0],c=[0,0,0],m=g<.5?g*(1+k):g+k-g*k,l=2*g-m,e/=360,n[0]=e+1/3,n[1]=e,n[2]=e-1/3,f=h=0;h<=2;f=++h)n[f]<0&&(n[f]+=1),n[f]>1&&(n[f]-=1),6*n[f]<1?c[f]=l+6*(m-l)*n[f]:2*n[f]<1?c[f]=m:3*n[f]<2?c[f]=l+(m-l)*(2/3-n[f])*6:c[f]=l;j=[sa(255*c[0]),sa(255*c[1]),sa(255*c[2])],i=j[0],d=j[1],b=j[2]}return a.length>3?[i,d,b,a[3]]:[i,d,b]},ha=function(a,b,c){var d,e,f,g,h;return void 0!==a&&a.length>=3&&(g=a,a=g[0],b=g[1],c=g[2]),a/=255,b/=255,c/=255,f=Math.min(a,b,c),Y=Math.max(a,b,c),e=(Y+f)/2,Y===f?(h=0,d=Number.NaN):h=e<.5?(Y-f)/(Y+f):(Y-f)/(2-Y-f),a===Y?d=(b-c)/(Y-f):b===Y?d=2+(c-a)/(Y-f):c===Y&&(d=4+(a-b)/(Y-f)),d*=60,d<0&&(d+=360),[d,h,e]},t.hsl=function(){return function(a,b,c){c.prototype=a.prototype;var d=new c,e=a.apply(d,b);return Object(e)===e?e:d}(a,Ca.call(arguments).concat(["hsl"]),function(){})},k.hsl=G,a.prototype.hsl=function(){return ha(this._rgb)},H=function(){var a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r;if(a=ya(arguments),e=a[0],p=a[1],r=a[2],r*=255,0===p)i=d=b=r;else switch(360===e&&(e=0),e>360&&(e-=360),e<0&&(e+=360),e/=60,f=B(e),c=e-f,g=r*(1-p),h=r*(1-p*c),q=r*(1-p*(1-c)),f){case 0:j=[r,q,g],i=j[0],d=j[1],b=j[2];break;case 1:k=[h,r,g],i=k[0],d=k[1],b=k[2];break;case 2:l=[g,r,q],i=l[0],d=l[1],b=l[2];break;case 3:m=[g,h,r],i=m[0],d=m[1],b=m[2];break;case 4:n=[q,g,r],i=n[0],d=n[1],b=n[2];break;case 5:o=[r,g,h],i=o[0],d=o[1],b=o[2]}return[i,d,b,a.length>3?a[3]:1]},ia=function(){var a,b,c,d,e,f,g,h,i;return g=ya(arguments),f=g[0],c=g[1],a=g[2],e=Math.min(f,c,a),Y=Math.max(f,c,a),b=Y-e,i=Y/255,0===Y?(d=Number.NaN,h=0):(h=b/Y,f===Y&&(d=(c-a)/b),c===Y&&(d=2+(a-f)/b),a===Y&&(d=4+(f-c)/b),(d*=60)<0&&(d+=360)),[d,h,i]},t.hsv=function(){return function(a,b,c){c.prototype=a.prototype;var d=new c,e=a.apply(d,b);return Object(e)===e?e:d}(a,Ca.call(arguments).concat(["hsv"]),function(){})},k.hsv=H,a.prototype.hsv=function(){return ia(this._rgb)},_=function(a){var b,c,d;return"number"===xa(a)&&a>=0&&a<=16777215?(d=a>>16,c=a>>8&255,b=255&a,[d,c,b,1]):(console.warn("unknown num color: "+a),[0,0,0,1])},ma=function(){var a,b,c,d;return d=ya(arguments),c=d[0],b=d[1],a=d[2],(c<<16)+(b<<8)+a},t.num=function(b){return new a(b,"num")},a.prototype.num=function(a){return null==a&&(a="rgb"),ma(this._rgb,a)},k.num=_,i.push({p:1,test:function(a){if(1===arguments.length&&"number"===xa(a)&&a>=0&&a<=16777215)return"num"}}),C=function(){var a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t;if(c=ya(arguments),h=c[0],e=c[1],b=c[2],e/=100,g=g/100*255,a=255*e,0===e)l=g=d=b;else switch(360===h&&(h=0),h>360&&(h-=360),h<0&&(h+=360),h/=60,i=B(h),f=h-i,j=b*(1-e),k=j+a*(1-f),s=j+a*f,t=j+a,i){case 0:m=[t,s,j],l=m[0],g=m[1],d=m[2];break;case 1:n=[k,t,j],l=n[0],g=n[1],d=n[2];break;case 2:o=[j,t,s],l=o[0],g=o[1],d=o[2];break;case 3:p=[j,k,t],l=p[0],g=p[1],d=p[2];break;case 4:q=[s,j,t],l=q[0],g=q[1],d=q[2];break;case 5:r=[t,j,k],l=r[0],g=r[1],d=r[2]}return[l,g,d,c.length>3?c[3]:1]},ea=function(){var a,b,c,d,e,f,g,h,i;return i=ya(arguments),h=i[0],e=i[1],b=i[2],g=Math.min(h,e,b),Y=Math.max(h,e,b),d=Y-g,c=100*d/255,a=g/(255-d)*100,0===d?f=Number.NaN:(h===Y&&(f=(e-b)/d),e===Y&&(f=2+(b-h)/d),b===Y&&(f=4+(h-e)/d),(f*=60)<0&&(f+=360)),[f,c,a]},t.hcg=function(){return function(a,b,c){c.prototype=a.prototype;var d=new c,e=a.apply(d,b);return Object(e)===e?e:d}(a,Ca.call(arguments).concat(["hcg"]),function(){})},k.hcg=C,a.prototype.hcg=function(){return ea(this._rgb)},x=function(a){var b,c,d,e,f,g,h,i;if(a=a.toLowerCase(),null!=t.colors&&t.colors[a])return D(t.colors[a]);if(f=a.match(/rgb\(\s*(\-?\d+),\s*(\-?\d+)\s*,\s*(\-?\d+)\s*\)/)){for(h=f.slice(1,4),e=g=0;g<=2;e=++g)h[e]=+h[e];h[3]=1}else if(f=a.match(/rgba\(\s*(\-?\d+),\s*(\-?\d+)\s*,\s*(\-?\d+)\s*,\s*([01]|[01]?\.\d+)\)/))for(h=f.slice(1,5),e=i=0;i<=3;e=++i)h[e]=+h[e];else if(f=a.match(/rgb\(\s*(\-?\d+(?:\.\d+)?)%,\s*(\-?\d+(?:\.\d+)?)%\s*,\s*(\-?\d+(?:\.\d+)?)%\s*\)/)){for(h=f.slice(1,4),e=b=0;b<=2;e=++b)h[e]=sa(2.55*h[e]);h[3]=1}else if(f=a.match(/rgba\(\s*(\-?\d+(?:\.\d+)?)%,\s*(\-?\d+(?:\.\d+)?)%\s*,\s*(\-?\d+(?:\.\d+)?)%\s*,\s*([01]|[01]?\.\d+)\)/)){for(h=f.slice(1,5),e=c=0;c<=2;e=++c)h[e]=sa(2.55*h[e]);h[3]=+h[3]}else(f=a.match(/hsl\(\s*(\-?\d+(?:\.\d+)?),\s*(\-?\d+(?:\.\d+)?)%\s*,\s*(\-?\d+(?:\.\d+)?)%\s*\)/))?(d=f.slice(1,4),d[1]*=.01,d[2]*=.01,h=G(d),h[3]=1):(f=a.match(/hsla\(\s*(\-?\d+(?:\.\d+)?),\s*(\-?\d+(?:\.\d+)?)%\s*,\s*(\-?\d+(?:\.\d+)?)%\s*,\s*([01]|[01]?\.\d+)\)/))&&(d=f.slice(1,4),d[1]*=.01,d[2]*=.01,h=G(d),h[3]=+f[4]);return h},da=function(a){var b;return b=a[3]<1?"rgba":"rgb","rgb"===b?b+"("+a.slice(0,3).map(sa).join(",")+")":"rgba"===b?b+"("+a.slice(0,3).map(sa).join(",")+","+a[3]+")":void 0},qa=function(a){return sa(100*a)/100},F=function(a,b){var c;return c=b<1?"hsla":"hsl",a[0]=qa(a[0]||0),a[1]=qa(100*a[1])+"%",a[2]=qa(100*a[2])+"%","hsla"===c&&(a[3]=b),c+"("+a.join(",")+")"},k.css=function(a){return x(a)},t.css=function(){return function(a,b,c){c.prototype=a.prototype;var d=new c,e=a.apply(d,b);return Object(e)===e?e:d}(a,Ca.call(arguments).concat(["css"]),function(){})},a.prototype.css=function(a){return null==a&&(a="rgb"),"rgb"===a.slice(0,3)?da(this._rgb):"hsl"===a.slice(0,3)?F(this.hsl(),this.alpha()):void 0},k.named=function(a){return D(za[a])},i.push({p:5,test:function(a){if(1===arguments.length&&null!=za[a])return"named"}}),a.prototype.name=function(a){var b,c;arguments.length&&(za[a]&&(this._rgb=D(za[a])),this._rgb[3]=1),b=this.hex();for(c in za)if(b===za[c])return c;return b},R=function(){var a,c,d,e;return e=ya(arguments),d=e[0],a=e[1],c=e[2],c*=b,[d,w(c)*a,ua(c)*a]},S=function(){var a,b,c,d,e,f,g,h,i,j,k;return c=ya(arguments),h=c[0],e=c[1],g=c[2],j=R(h,e,g),a=j[0],b=j[1],d=j[2],k=P(a,b,d),i=k[0],f=k[1],d=k[2],[i,f,d,c.length>3?c[3]:1]},O=function(){var a,b,c,d,e,g;return g=ya(arguments),e=g[0],a=g[1],b=g[2],c=va(a*a+b*b),d=(n(b,a)*f+360)%360,0===sa(1e4*c)&&(d=Number.NaN),[e,c,d]},ka=function(){var a,b,c,d,e,f,g;return f=ya(arguments),e=f[0],c=f[1],b=f[2],g=ja(e,c,b),d=g[0],a=g[1],b=g[2],O(d,a,b)},t.lch=function(){var b;return b=ya(arguments),new a(b,"lch")},t.hcl=function(){var b;return b=ya(arguments),new a(b,"hcl")},k.lch=S,k.hcl=function(){var a,b,c,d;return d=ya(arguments),b=d[0],a=d[1],c=d[2],S([c,a,b])},a.prototype.lch=function(){return ka(this._rgb)},a.prototype.hcl=function(){return ka(this._rgb).reverse()},ca=function(a){var b,c,d,e,f,g,h,i,j;return null==a&&(a="rgb"),i=ya(arguments),h=i[0],e=i[1],b=i[2],h/=255,e/=255,b/=255,f=1-Math.max(h,Math.max(e,b)),d=f<1?1/(1-f):0,c=(1-h-f)*d,g=(1-e-f)*d,j=(1-b-f)*d,[c,g,j,f]},v=function(){var a,b,c,d,e,f,g,h,i;return b=ya(arguments),d=b[0],g=b[1],i=b[2],f=b[3],a=b.length>4?b[4]:1,1===f?[0,0,0,a]:(h=d>=1?0:255*(1-d)*(1-f),e=g>=1?0:255*(1-g)*(1-f),c=i>=1?0:255*(1-i)*(1-f),[h,e,c,a])},k.cmyk=function(){return v(ya(arguments))},t.cmyk=function(){return function(a,b,c){c.prototype=a.prototype;var d=new c,e=a.apply(d,b);return Object(e)===e?e:d}(a,Ca.call(arguments).concat(["cmyk"]),function(){})},a.prototype.cmyk=function(){return ca(this._rgb)},k.gl=function(){var a,b,c,d,e;for(d=function(){var a,c;a=ya(arguments),c=[];for(b in a)e=a[b],c.push(e);return c}.apply(this,arguments),a=c=0;c<=2;a=++c)d[a]*=255;return d},t.gl=function(){return function(a,b,c){c.prototype=a.prototype;var d=new c,e=a.apply(d,b);return Object(e)===e?e:d}(a,Ca.call(arguments).concat(["gl"]),function(){})},a.prototype.gl=function(){var a;return a=this._rgb,[a[0]/255,a[1]/255,a[2]/255,a[3]]},la=function(a,b,c){var d;return d=ya(arguments),a=d[0],b=d[1],c=d[2],a=W(a),b=W(b),c=W(c),.2126*a+.7152*b+.0722*c},W=function(a){return a/=255,a<=.03928?a/12.92:ba((a+.055)/1.055,2.4)},N=function(b,c,d,e){var f,g;return f=b._rgb,g=c._rgb,new a(f[0]+d*(g[0]-f[0]),f[1]+d*(g[1]-f[1]),f[2]+d*(g[2]-f[2]),e)},l.push(["rgb",N]),a.prototype.luminance=function(a,b){var c,d,e,f;return null==b&&(b="rgb"),arguments.length?(0===a?this._rgb=[0,0,0,this._rgb[3]]:1===a?this._rgb=[255,255,255,this._rgb[3]]:(d=1e-7,e=20,f=function(c,g){var h,i;return i=c.interpolate(g,.5,b),h=i.luminance(),Math.abs(a-h)<d||!e--?i:h>a?f(c,i):f(i,g)},c=la(this._rgb),this._rgb=(c>a?f(t("black"),this):f(this,t("white"))).rgba()),this):la(this._rgb)},wa=function(a){var b,c,d,e;return e=a/100,e<66?(d=255,c=-155.25485562709179-.44596950469579133*(c=e-2)+104.49216199393888*V(c),b=e<20?0:.8274096064007395*(b=e-10)-254.76935184120902+115.67994401066147*V(b)):(d=351.97690566805693+.114206453784165*(d=e-55)-40.25366309332127*V(d),c=325.4494125711974+.07943456536662342*(c=e-50)-28.0852963507957*V(c),b=255),[d,c,b]},na=function(){var a,b,c,d,e,f,g,h;for(f=ya(arguments),e=f[0],f[1],a=f[2],d=1e3,c=4e4,b=.4;c-d>b;)h=.5*(c+d),g=wa(h),g[2]/g[0]>=a/e?c=h:d=h;return sa(h)},t.temperature=t.kelvin=function(){return function(a,b,c){c.prototype=a.prototype;var d=new c,e=a.apply(d,b);return Object(e)===e?e:d}(a,Ca.call(arguments).concat(["temperature"]),function(){})},k.temperature=k.kelvin=k.K=wa,a.prototype.temperature=function(){return na(this._rgb)},a.prototype.kelvin=a.prototype.temperature,t.contrast=function(b,c){var d,e,f,g;return"string"!==(f=xa(b))&&"number"!==f||(b=new a(b)),"string"!==(g=xa(c))&&"number"!==g||(c=new a(c)),d=b.luminance(),e=c.luminance(),d>e?(d+.05)/(e+.05):(e+.05)/(d+.05)},t.distance=function(b,c,d){var e,f,g,h,i,j,k;null==d&&(d="lab"),"string"!==(i=xa(b))&&"number"!==i||(b=new a(b)),"string"!==(j=xa(c))&&"number"!==j||(c=new a(c)),g=b.get(d),h=c.get(d),k=0;for(f in g)e=(g[f]||0)-(h[f]||0),k+=e*e;return Math.sqrt(k)},t.deltaE=function(b,c,e,f){var g,h,i,j,k,l,o,p,q,r,s,t,u,v,x,y,z,A,B,C,D,E,F,G,H,I,J;for(null==e&&(e=1),null==f&&(f=1),"string"!==(z=xa(b))&&"number"!==z||(b=new a(b)),"string"!==(A=xa(c))&&"number"!==A||(c=new a(c)),B=b.lab(),g=B[0],i=B[1],k=B[2],C=c.lab(),h=C[0],j=C[1],l=C[2],o=va(i*i+k*k),p=va(j*j+l*l),F=g<16?.511:.040975*g/(1+.01765*g),D=.0638*o/(1+.0131*o)+.638,y=o<1e-6?0:180*n(k,i)/d;y<0;)y+=360;for(;y>=360;)y-=360;return G=y>=164&&y<=345?.56+m(.2*w(d*(y+168)/180)):.36+m(.4*w(d*(y+35)/180)),q=o*o*o*o,x=va(q/(q+1900)),E=D*(x*G+1-x),v=g-h,u=o-p,s=i-j,t=k-l,r=s*s+t*t-u*u,H=v/(e*F),I=u/(f*D),J=E,va(H*H+I*I+r/(J*J))},a.prototype.get=function(a){var b,c,d,e,f,g;return d=this,f=a.split("."),e=f[0],b=f[1],g=d[e](),b?(c=e.indexOf(b),c>-1?g[c]:console.warn("unknown channel "+b+" in mode "+e)):g},a.prototype.set=function(a,b){var c,d,e,f,g,h;if(e=this,g=a.split("."),f=g[0],c=g[1],c)if(h=e[f](),(d=f.indexOf(c))>-1)if("string"===xa(b))switch(b.charAt(0)){case"+":case"-":h[d]+=+b;break;case"*":h[d]*=+b.substr(1);break;case"/":h[d]/=+b.substr(1);break;default:h[d]=+b}else h[d]=b;else console.warn("unknown channel "+c+" in mode "+f);else h=b;return t(h,f).alpha(e.alpha())},a.prototype.clipped=function(){return this._rgb._clipped||!1},a.prototype.alpha=function(a){return arguments.length?t.rgb([this._rgb[0],this._rgb[1],this._rgb[2],a]):this._rgb[3]},a.prototype.darken=function(a){var b,d;return null==a&&(a=1),d=this,b=d.lab(),b[0]-=c.Kn*a,t.lab(b).alpha(d.alpha())},a.prototype.brighten=function(a){return null==a&&(a=1),this.darken(-a)},a.prototype.darker=a.prototype.darken,a.prototype.brighter=a.prototype.brighten,a.prototype.saturate=function(a){var b,d;return null==a&&(a=1),d=this,b=d.lch(),b[1]+=a*c.Kn,b[1]<0&&(b[1]=0),t.lch(b).alpha(d.alpha())},a.prototype.desaturate=function(a){return null==a&&(a=1),this.saturate(-a)},a.prototype.premultiply=function(){var a,b;return b=this.rgb(),a=this.alpha(),t(b[0]*a,b[1]*a,b[2]*a,a)},p=function(a,b,c){if(!p[c])throw"unknown blend mode "+c;return p[c](a,b)},q=function(a){return function(b,c){var d,e;return d=t(c).rgb(),e=t(b).rgb(),t(a(d,e),"rgb")}},A=function(a){return function(b,c){var d,e,f;for(f=[],d=e=0;e<=3;d=++e)f[d]=a(b[d],c[d]);return f}},$=function(a,b){return a},Z=function(a,b){return a*b/255},y=function(a,b){return a>b?b:a},T=function(a,b){return a>b?a:b},ta=function(a,b){return 255*(1-(1-a/255)*(1-b/255))},aa=function(a,b){return b<128?2*a*b/255:255*(1-2*(1-a/255)*(1-b/255))},s=function(a,b){return 255*(1-(1-b/255)/(a/255))},z=function(a,b){return 255===a?255:(a=b/255*255/(1-a/255),a>255?255:a)},p.normal=q(A($)),p.multiply=q(A(Z)),p.screen=q(A(ta)),p.overlay=q(A(aa)),p.darken=q(A(y)),p.lighten=q(A(T)),p.dodge=q(A(z)),p.burn=q(A(s)),t.blend=p,t.analyze=function(a){var b,c,d,e;for(d={min:Number.MAX_VALUE,max:-1*Number.MAX_VALUE,sum:0,values:[],count:0},c=0,b=a.length;c<b;c++)null==(e=a[c])||isNaN(e)||(d.values.push(e),d.sum+=e,e<d.min&&(d.min=e),e>d.max&&(d.max=e),d.count+=1);return d.domain=[d.min,d.max],d.limits=function(a,b){return t.limits(d,a,b)},d},t.scale=function(a,b){var c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,u,v,w,x;return k="rgb",l=t("#ccc"),p=0,!1,g=[0,1],o=[],n=[0,0],c=!1,e=[],m=!1,j=0,i=1,f=!1,d={},q=!0,h=1,w=function(a){var b,c,d,f,g,h;if(null==a&&(a=["#fff","#000"]),null!=a&&"string"===xa(a)&&null!=t.brewer&&(a=t.brewer[a]||t.brewer[a.toLowerCase()]||a),"array"===xa(a)){for(a=a.slice(0),b=d=0,f=a.length-1;0<=f?d<=f:d>=f;b=0<=f?++d:--d)c=a[b],"string"===xa(c)&&(a[b]=t(c));for(o.length=0,b=h=0,g=a.length-1;0<=g?h<=g:h>=g;b=0<=g?++h:--h)o.push(b/(a.length-1))}return v(),e=a},s=function(a){var b,d;if(null!=c){for(d=c.length-1,b=0;b<d&&a>=c[b];)b++;return b-1}return 0},x=function(a){return a},function(a){var b,d,e,f,g;return g=a,c.length>2&&(f=c.length-1,b=s(a),e=c[0]+(c[1]-c[0])*(0+.5*p),d=c[f-1]+(c[f]-c[f-1])*(1-.5*p),g=j+(c[b]+.5*(c[b+1]-c[b])-e)/(d-e)*(i-j)),g},u=function(a,b){var f,g,m,p,r,u,v,w;if(null==b&&(b=!1),isNaN(a))return l;if(b?w=a:c&&c.length>2?(f=s(a),w=f/(c.length-2)):w=i!==j?(a-j)/(i-j):1,b||(w=x(w)),1!==h&&(w=ba(w,h)),w=n[0]+w*(1-n[0]-n[1]),w=Math.min(1,Math.max(0,w)),p=Math.floor(1e4*w),q&&d[p])g=d[p];else{if("array"===xa(e))for(m=r=0,v=o.length-1;0<=v?r<=v:r>=v;m=0<=v?++r:--r){if(u=o[m],w<=u){g=e[m];break}if(w>=u&&m===o.length-1){g=e[m];break}if(w>u&&w<o[m+1]){w=(w-u)/(o[m+1]-u),g=t.interpolate(e[m],e[m+1],w,k);break}}else"function"===xa(e)&&(g=e(w));q&&(d[p]=g)}return g},v=function(){return d={}},w(a),r=function(a){var b;return b=t(u(a)),m&&b[m]?b[m]():b},r.classes=function(a){var b;return null!=a?("array"===xa(a)?(c=a,g=[a[0],a[a.length-1]]):(b=t.analyze(g),c=0===a?[b.min,b.max]:t.limits(b,"e",a)),r):c},r.domain=function(a){var b,c,d,f,h,k,l;if(!arguments.length)return g;if(j=a[0],i=a[a.length-1],o=[],d=e.length,a.length===d&&j!==i)for(h=0,f=a.length;h<f;h++)c=a[h],o.push((c-j)/(i-j));else for(b=l=0,k=d-1;0<=k?l<=k:l>=k;b=0<=k?++l:--l)o.push(b/(d-1));return g=[j,i],r},r.mode=function(a){return arguments.length?(k=a,v(),r):k},r.range=function(a,b){return w(a,b),r},r.out=function(a){return m=a,r},r.spread=function(a){return arguments.length?(p=a,r):p},r.correctLightness=function(a){return null==a&&(a=!0),f=a,v(),x=f?function(a){var b,c,d,e,f,g,h,i,j;for(b=u(0,!0).lab()[0],c=u(1,!0).lab()[0],h=b>c,d=u(a,!0).lab()[0],f=b+(c-b)*a,e=d-f,i=0,j=1,g=20;Math.abs(e)>.01&&g-- >0;)!function(){h&&(e*=-1),e<0?(i=a,a+=.5*(j-a)):(j=a,a+=.5*(i-a)),d=u(a,!0).lab()[0],e=d-f}();return a}:function(a){return a},r},r.padding=function(a){return null!=a?("number"===xa(a)&&(a=[a,a]),n=a,r):n},r.colors=function(b,d){var f,h,i,j,k,l,m,n;if(arguments.length<2&&(d="hex"),k=[],0===arguments.length)k=e.slice(0);else if(1===b)k=[r(.5)];else if(b>1)h=g[0],f=g[1]-h,k=function(){l=[];for(var a=0;0<=b?a<b:a>b;0<=b?a++:a--)l.push(a);return l}.apply(this).map(function(a){return r(h+a/(b-1)*f)});else{if(a=[],m=[],c&&c.length>2)for(i=n=1,j=c.length;1<=j?n<j:n>j;i=1<=j?++n:--n)m.push(.5*(c[i-1]+c[i]));else m=g;k=m.map(function(a){return r(a)})}return t[d]&&(k=k.map(function(a){return a[d]()})),k},r.cache=function(a){return null!=a?(q=a,r):q},r.gamma=function(a){return null!=a?(h=a,r):h},r},null==t.scales&&(t.scales={}),t.scales.cool=function(){return t.scale([t.hsl(180,1,.9),t.hsl(250,.7,.4)])},t.scales.hot=function(){return t.scale(["#000","#f00","#ff0","#fff"],[0,.25,.75,1]).mode("rgb")},t.analyze=function(a,b,c){var d,e,f,g,h,i,j;if(h={min:Number.MAX_VALUE,max:-1*Number.MAX_VALUE,sum:0,values:[],count:0},null==c&&(c=function(){return!0}),d=function(a){null==a||isNaN(a)||(h.values.push(a),h.sum+=a,a<h.min&&(h.min=a),a>h.max&&(h.max=a),h.count+=1)},j=function(a,e){if(c(a,e))return d(null!=b&&"function"===xa(b)?b(a):null!=b&&"string"===xa(b)||"number"===xa(b)?a[b]:a)},"array"===xa(a))for(g=0,f=a.length;g<f;g++)i=a[g],j(i);else for(e in a)i=a[e],j(i,e)
;return h.domain=[h.min,h.max],h.limits=function(a,b){return t.limits(h,a,b)},h},t.limits=function(a,b,c){var d,e,f,g,h,i,j,k,l,n,o,p,q,r,s,u,v,w,x,y,z,A,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,W,X,Z,$,_,aa,ca,da,ea,fa,ga,ha,ia,ja;if(null==b&&(b="equal"),null==c&&(c=7),"array"===xa(a)&&(a=t.analyze(a)),E=a.min,Y=a.max,a.sum,ia=a.values.sort(function(a,b){return a-b}),1===c)return[E,Y];if(C=[],"c"===b.substr(0,1)&&(C.push(E),C.push(Y)),"e"===b.substr(0,1)){for(C.push(E),y=K=1,O=c-1;1<=O?K<=O:K>=O;y=1<=O?++K:--K)C.push(E+y/c*(Y-E));C.push(Y)}else if("l"===b.substr(0,1)){if(E<=0)throw"Logarithmic scales are only possible for values > 0";for(F=Math.LOG10E*V(E),D=Math.LOG10E*V(Y),C.push(E),y=ja=1,P=c-1;1<=P?ja<=P:ja>=P;y=1<=P?++ja:--ja)C.push(ba(10,F+y/c*(D-F)));C.push(Y)}else if("q"===b.substr(0,1)){for(C.push(E),y=d=1,W=c-1;1<=W?d<=W:d>=W;y=1<=W?++d:--d)L=(ia.length-1)*y/c,M=B(L),M===L?C.push(ia[M]):(N=L-M,C.push(ia[M]*(1-N)+ia[M+1]*N));C.push(Y)}else if("k"===b.substr(0,1)){for(H=ia.length,r=new Array(H),w=new Array(c),ea=!0,I=0,u=null,u=[],u.push(E),y=e=1,X=c-1;1<=X?e<=X:e>=X;y=1<=X?++e:--e)u.push(E+y/c*(Y-E));for(u.push(Y);ea;){for(z=f=0,Z=c-1;0<=Z?f<=Z:f>=Z;z=0<=Z?++f:--f)w[z]=0;for(y=g=0,$=H-1;0<=$?g<=$:g>=$;y=0<=$?++g:--g){for(ha=ia[y],G=Number.MAX_VALUE,z=h=0,_=c-1;0<=_?h<=_:h>=_;z=0<=_?++h:--h)(x=m(u[z]-ha))<G&&(G=x,s=z);w[s]++,r[y]=s}for(J=new Array(c),z=i=0,aa=c-1;0<=aa?i<=aa:i>=aa;z=0<=aa?++i:--i)J[z]=null;for(y=j=0,ca=H-1;0<=ca?j<=ca:j>=ca;y=0<=ca?++j:--j)v=r[y],null===J[v]?J[v]=ia[y]:J[v]+=ia[y];for(z=k=0,da=c-1;0<=da?k<=da:k>=da;z=0<=da?++k:--k)J[z]*=1/w[z];for(ea=!1,z=l=0,Q=c-1;0<=Q?l<=Q:l>=Q;z=0<=Q?++l:--l)if(J[z]!==u[y]){ea=!0;break}u=J,I++,I>200&&(ea=!1)}for(A={},z=n=0,R=c-1;0<=R?n<=R:n>=R;z=0<=R?++n:--n)A[z]=[];for(y=o=0,S=H-1;0<=S?o<=S:o>=S;y=0<=S?++o:--o)v=r[y],A[v].push(ia[y]);for(fa=[],z=p=0,T=c-1;0<=T?p<=T:p>=T;z=0<=T?++p:--p)fa.push(A[z][0]),fa.push(A[z][A[z].length-1]);for(fa=fa.sort(function(a,b){return a-b}),C.push(fa[0]),y=q=1,U=fa.length-1;q<=U;y=q+=2)ga=fa[y],isNaN(ga)||-1!==C.indexOf(ga)||C.push(ga)}return C},E=function(a,b,c){var d,f,h,i;return d=ya(arguments),a=d[0],b=d[1],c=d[2],isNaN(a)&&(a=0),a/=360,a<1/3?(f=(1-b)/3,i=(1+b*w(g*a)/w(e-g*a))/3,h=1-(f+i)):a<2/3?(a-=1/3,i=(1-b)/3,h=(1+b*w(g*a)/w(e-g*a))/3,f=1-(i+h)):(a-=2/3,h=(1-b)/3,f=(1+b*w(g*a)/w(e-g*a))/3,i=1-(h+f)),i=U(c*i*3),h=U(c*h*3),f=U(c*f*3),[255*i,255*h,255*f,d.length>3?d[3]:1]},ga=function(){var a,b,c,d,e,f,h,i;return h=ya(arguments),f=h[0],b=h[1],a=h[2],g=2*Math.PI,f/=255,b/=255,a/=255,e=Math.min(f,b,a),d=(f+b+a)/3,i=1-e/d,0===i?c=0:(c=(f-b+(f-a))/2,c/=Math.sqrt((f-b)*(f-b)+(f-a)*(b-a)),c=Math.acos(c),a>b&&(c=g-c),c/=g),[360*c,i,d]},t.hsi=function(){return function(a,b,c){c.prototype=a.prototype;var d=new c,e=a.apply(d,b);return Object(e)===e?e:d}(a,Ca.call(arguments).concat(["hsi"]),function(){})},k.hsi=E,a.prototype.hsi=function(){return ga(this._rgb)},J=function(a,b,c,d){var e,f,g,h,i,j,k,l,m,n,o,p;return"hsl"===d?(o=a.hsl(),p=b.hsl()):"hsv"===d?(o=a.hsv(),p=b.hsv()):"hcg"===d?(o=a.hcg(),p=b.hcg()):"hsi"===d?(o=a.hsi(),p=b.hsi()):"lch"!==d&&"hcl"!==d||(d="hcl",o=a.hcl(),p=b.hcl()),"h"===d.substr(0,1)&&(g=o[0],m=o[1],j=o[2],h=p[0],n=p[1],k=p[2]),isNaN(g)||isNaN(h)?isNaN(g)?isNaN(h)?f=Number.NaN:(f=h,1!==j&&0!==j||"hsv"===d||(l=n)):(f=g,1!==k&&0!==k||"hsv"===d||(l=m)):(e=h>g&&h-g>180?h-(g+360):h<g&&g-h>180?h+360-g:h-g,f=g+c*e),null==l&&(l=m+c*(n-m)),i=j+c*(k-j),t[d](f,l,i)},l=l.concat(function(){var a,b,c,d;for(c=["hsv","hsl","hsi","hcl","lch","hcg"],d=[],b=0,a=c.length;b<a;b++)X=c[b],d.push([X,J]);return d}()),M=function(a,b,c,d){var e,f;return e=a.num(),f=b.num(),t.num(e+(f-e)*c,"num")},l.push(["num",M]),K=function(b,c,d,e){var f,g;return f=b.lab(),g=c.lab(),new a(f[0]+d*(g[0]-f[0]),f[1]+d*(g[1]-f[1]),f[2]+d*(g[2]-f[2]),e)},l.push(["lab",K])}).call(this);
