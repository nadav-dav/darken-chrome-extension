var __darken;

(function () {
var $ = ___jq__;

function Color( r, g, b, a){
    return { r: r, g: g, b: b, a: isNaN(a) ? 1 : a}
}
Color.darken = function darken (color) {
    var lowestValue = Math.min(color.r, color.g, color.b);
    return Color(color.r - lowestValue, color.g - lowestValue, color.b - lowestValue, color.a)
}
Color.lighten = function lighten (color) {
    var maxValue = 255 - Math.max(color.r, color.g, color.b);
    return Color(color.r + maxValue, color.g + maxValue, color.b + maxValue, color.a)
}
Color.invert = function invert (color) {
    var lowestValue = Math.min(color.r, color.g, color.b);
    if( lowestValue < 127){
        return Color.lighten(color);
    }else{
        return Color.darken(color);
    }
}
Color.toCss = function toCss (color) {
    return "rgba("+color.r+","+color.g+","+color.b+","+color.a+")"
}
Color.inScope = function toCss (color, start, finish) {
    var range = finish - start;
    var inRange = function(value){ return Math.floor((value/255)* range) + start; }
    return Color( inRange(color.r), inRange(color.g), inRange(color.b), color.a )
}
 
function getColor( c ){
    try{
        var val = c.substring(c.indexOf('(')+1,c.indexOf(')')).split(',');
        return Color( parseInt(val[0]), parseInt(val[1]), parseInt(val[2]), parseInt(val[3]))
    }catch(e){
        return Color(0,0,0,0);
    }
}
 
function manipulateColorProp (obj, prop, manipulate){
    try{
        var color = getColor(obj.css(prop))        
        if(color.a !== 0){            
            color = manipulate(color);
            obj.css(prop, Color.toCss( color ));            
        }
    }catch(e){}
}
 
function makeItDark(obj){
    var type = obj.nodeName;
    obj = $(obj);
    if(obj.attr('darkened')) return;
 
 	if(type === 'IMG'){
 		if(obj.width()<10 && obj.height()<10){
    	    obj.css('-webkit-filter','invert:(100%)');
    	}
 	}else{

 		try{
 			var background = obj.css('background');
 			var hasImage = false;
 			var extraBgData = background.substring(background.indexOf(")")+1);
 			var bgColor = getColor(background);

            if (obj.css('background-image') != 'none'){
                hasImage = true;
                if (obj.css('background-image').indexOf('.png') === -1){
                    extraBgData = "";
                }
            }
 			if(bgColor.a !== 0 || hasImage){        
	            bgColor = Color.inScope( Color.darken(bgColor) , 30, 180);
	            console.log(extraBgData)
	            obj.css('background', Color.toCss( bgColor ) + extraBgData);            
	        }
	    }catch(e){}

	    try{
	        var txtColor = getColor(obj.css('color'))        
	        if(txtColor.a !== 0){            
	            txtColor = Color.inScope( Color.lighten(txtColor) , 30, 180);
	            obj.css('color', Color.toCss( txtColor ));            
	        }
	    }catch(e){}
	    
 	}    

 	try{
        var brdColor = getColor(obj.css('border-color'))        
        if(brdColor.a !== 0){            
            brdColor = Color.inScope( Color.lighten(brdColor) , 30, 100);
            obj.css('border-color', Color.toCss( brdColor ));            
        }
    }catch(e){}
 	
	obj.css('text-shadow','0px 0px 0px #000');


    obj.attr('darkened','true')
}
 
function DARK () {
    var $ = document.querySelectorAll.bind(document)
    var elem = Array.prototype.slice.call($("*"))
    elem.forEach(makeItDark);
}

__darken = DARK;


})();