/*		
                       0000
                  0000000000000
              0000000000000000000000
         00000000000000000000000000000000
    000000000000000000000000000000000000000000
  000000000000000000000000000000000000000000000
       000000000000000000000000000000000000
00000       00000000000000000000000000       00000
000000000        0000000000000000        000000000
00000000000000        000000        00000000000000
0000000000000000000            0000000000000000000
00000000000000000000000   000000000000000000000000
000000000000000000000000  000000000000000000000000
00000000    000000000000  000000000000000000000000
00000000       000000000  000000000000000000000000
00000000  00000000000000  00000000000  00000000000
00000000  00000000000000  00000000000  00000000000
00000000    000000000000  0000000000       0000000
00000000      0000000000  0000000       0000000000
00000000  00000000000000  00000000000  00000000000
00000000  00000000000000  00000000000  00000000000
00000000   0000000000000  000000000000000000000000
00000000      0000000000  000000000000000000000000
000000000000000000000000  000000000000000000000000
000000000000000000000000  000000000000000000000000
   000000000000000000000  000000000000000000000
        0000000000000000  0000000000000000
             00000000000  00000000000
                 0000000  000000
                      00  00
*/

////////////////////////////////////////////////////////////////////////////////
//
//  RESHAPE MEDIA
//  Copyright 2020 Export Kit, Reshape Media.
//  All Rights Reserved.
//
//  NOTICE: You may not use this file except in accordance with the terms 
//  of the license agreement accompanying it.
//
////////////////////////////////////////////////////////////////////////////////

figma.showUI(__html__);
figma.ui.resize(345,520);

const types = {

    registerEvents: function(_proto){ // ,events){
    
        _proto.RENDER                     = 'EKEvent.RENDER';
        _proto.SHOW                       = 'EKEvent.SHOW';
        _proto.HIDE                       = 'EKEvent.HIDE';
        _proto.UPDATE                     = 'EKEvent.UPDATE';
        _proto.ALIVE                      = 'EKEvent.ALIVE';
    
        _proto.VIEWS                      = 'EKEvent.VIEWS';
        _proto.DISPLAY                    = 'EKEvent.DISPLAY';
        _proto.READY                      = 'EKEvent.READY';
    
        _proto.LAYERS_REFRESH             = 'EKEvent.LAYERS_REFRESH';
        _proto.LAYERS_SAVE_IMAGE          = 'EKEvent.LAYERS_SAVE_IMAGE';
        _proto.LAYERS_UPDATE              = 'EKEvent.LAYERS_UPDATE';
    
        _proto.IMAGES_SNAP                = 'EKEvent.IMAGES_SNAP';
        _proto.IMAGES_ICON                = 'EKEvent.IMAGES_ICON';

        _proto.TOOLS_STATS                = 'EKEvent.TOOLS_STATS';
        _proto.TOOLS_DOCINFO              = 'EKEvent.TOOLS_DOCINFO';
        _proto.TOOLS_DOCINFO_SAVE         = 'EKEvent.TOOLS_DOCINFO_SAVE';
        _proto.TOOLS_LAYER_FOUND          = 'EKEvent.TOOLS_LAYER_FOUND';
        _proto.TOOLS_LAYER_EDIT           = 'EKEvent.TOOLS_LAYER_EDIT';
        _proto.TOOLS_RESPONSIVE_CREATE    = 'EKEvent.TOOLS_RESPONSIVE_CREATE';
    
        _proto.EXPORT_NOW                 = 'EKEvent.EXPORT_NOW';
    
        _proto.POPUP_ALERT                = 'EKEvent.POPUP_ALERT';
        _proto.POPUP_CONFIRM              = 'EKEvent.POPUP_CONFIRM';
        _proto.POPUP_LOG                  = 'EKEvent.POPUP_LOG';
        _proto.POPUP_ERROR                = 'EKEvent.POPUP_ERROR';
        _proto.POPUP_UPDATE               = 'EKEvent.POPUP_UPDATE';
    
        _proto.LOCALE                     = 'EKEvent.LOCALE';

        //figma ui events
        _proto.OPTION                     = 'EKEvent.OPTION';
        _proto.EXCACHE                    = 'EKEvent.EXCACHE';
        _proto.EXPORT_BUILD               = 'EKEvent.EXPORT_BUILD';
        _proto.EXPORT_LOG                 = 'EKEvent.EXPORT_LOG';
        _proto.EXPORT_UPDATE              = 'EKEvent.EXPORT_UPDATE';
        _proto.EXPORT_RENDITIONS          = 'EKEvent.EXPORT_RENDITIONS'; 
    
    }
  
}

class EKEvent{

    constructor(type, args = null){
        this._type = type;
        this._args = args;
    }

    get type(){ return this._type; }

    get args(){ return this._args; }

}

class EKDispatcher{
    
    constructor(){
        this._events = {};
    }
    
    listen(type, callback){
    
        if(!this._events[type]) this._events[type] = [];
        this._events[type].push(callback);

    }
    
    ignore(type){
        
        if(!this._events[type]) return;
        this._events[type] = [];
    
    }
    
    dispatch(event,notify = true){

        if(!event || !event.type) return;
        if(event.type == 'message') return;

        events.sleep();
        if(this._events[event.type]) this._events[event.type].map(evt => { evt(event); }); 

        //figma events
        if(notify){
            figma.ui.postMessage({type:event.type, args:event.args});
        }

    }

}

const events = {

    sleep: async function (timeout = 100, callback = null){
        await new Promise(res => setTimeout((callback ? callback : res), timeout));
    }
    
    ,_globalDispatcher: false
    ,globalDispatcher: function (){
        if(!events._globalDispatcher){
            events._globalDispatcher = new EKDispatcher();
        } 
        return events._globalDispatcher;
    }

    //legacy node support
    ,EKEvent: EKEvent
    ,EKDispatcher: EKDispatcher
    
    ,listen: function (type, callback){ events.globalDispatcher().listen(type, callback); }
    ,ignore: function (type){ events.globalDispatcher().ignore(type); }
    ,dispatch: function (event,notify){ events.globalDispatcher().dispatch(event,notify); }
    ,broadcast: function (event){ setTimeout(async function(){ events.dispatch(event,false); }, 150); }      

}

const options = {

    VALIDATION_AUTO_VALIDATE:     true
    ,RUNNING:                     false
    ,LAYERS_REFRESH:              true
    ,DEFAULT_EXPORT_IMAGE_TYPE:   "png"
    ,ICON_SIZES:                  "32,64,96,128"
    ,SCREEN_SIZES:                "450,850,1100"
    ,RESPONSIVE_SCREEN_CONSTRAIN: false
    ,WATERMARK_TEXT:              ""
    ,OUTPUT_HIDDEN_LAYERS:        false
    ,OUTPUT_WEB_FONTS:            true
    ,OUTPUT_SVG_SHAPES:           false
    ,OUTPUT_INLINE_CONTENT:       false
    ,OUTPUT_HTML_BG_IMAGE:        false
    ,OUTPUT_OVERFLOW:             false
    ,OUTPUT_ALIGN:                "Center"
    ,OUTPUT_TYPE:                 "HTML5"
    ,OUTPUT_LAYERS_TYPE:          "HTML5"
    ,OUTPUT_DYNAMIC_HEIGHT:       false
    ,OUTPUT_HYBRID:               false
    ,ALLOW_SCREEN_IMAGES:         false
    ,SNAP_SHOT_SIZE:              100
    ,MARKUP:                      "opt"
    ,DATASET:                     "data"
    ,SPRITE_CSS:                  true
    ,SPRITE_JSON:                 false
    ,SPRITE_XML:                  false

}

const data = {

    LANGUAGE: {
        '&#20013;&#22269;': 'zh'
        ,'Deutsch': 'de'
        ,'English': 'en'
        ,'Espa&#241;ol': 'es'
        ,'&#949;&#955;&#955;&#951;&#957;&#953;&#954;&#940;': 'el'
        ,'&#269;e&#353;tina': 'cs'
        ,'Italiano': 'it'
        ,'Fran&#231;ais': 'fr'
        ,'&#2361;&#2367;&#2306;&#2342;&#2368;': 'hi'
        ,'&#26085;&#26412;&#20154;': 'ja'
        ,'&#54620;&#44397;&#50612;': 'ko'
        ,'&#1601;&#1575;&#1585;&#1587;&#1740;': 'fa'
        ,'Polski': 'pl'
        ,'Portugu&#234;s': 'pt'
        ,'&#2602;&#2672;&#2588;&#2622;&#2604;&#2624;': 'pa'
        ,'&#1056;&#1091;&#1089;&#1089;&#1082;&#1080;&#1081;': 'ru'
    }

    ,ICON_SETS: {
        "Windows": "16,32,48,256,512"
        ,"Mac OS": "16,32,128,512"
        ,"Android": "32,36,48,72,96,128,512"
        ,"WordPress": "880:660,1200:900"
        ,"Banner (General)": "120:60,234:60,300:100,728:90"
        ,"Banner (Square)": "125,180:150,250,300:250,336:280"
        ,"Banner (Skyscraper)": "120:600,160:600"
        ,"IPhone/Pad": "57,64,72,114,320,512"
        ,"IPhone/Pad (Retina)": "48,96,114,144,640,1024"
        ,"IPhone/Pad (Small)": "29,50,58"
        ,"Portrait": "900:1500,1200:1800,1500:2100"
        ,"Landscape": "2400:3000,2700:3600,3300:4200"
    }

    ,SCREEN_SIZES:{
        "Web": "300,450,600,850,1000,1400,1900"
        ,"Android": "320,360:385,400:595,480:533,600:593,720:800,840:899,960:1023,1280,1440:383"
        ,"iOS": "418"
        ,"Xamarin": "768:385,1080:410"
    }

    ,LAYER_TYPES: {
        "SVG": "SVG"
        ,"PHP": "PHP"
        ,"CSS3": "CSS3"
        ,"LESS": "LESS"
        ,"SASS": "SASS"
        ,"JavaScript": "JavaScript"
        ,"jQuery": "jQuery"
        ,"JSON": "JSON"
        ,"XML": "XML"
        ,"ASP": "ASP"
        ,"SilverLight": "SilverLight"
        ,"VB": "VB"
        ,"XAML": "XAML"
        ,"Android UI": "Android UI"
        ,"Android Styles": "Android Styles"
        ,"Swift": "Swift"
        ,"XCode": "XCode"
        ,"Storyboard": "Storyboard"
    }

    ,EXPORT_TYPES: {
        "PHP": "PHP"
        ,"CSS": "CSS"
        ,"JavaScript": "JavaScript"
        ,"jQuery": "jQuery"
        ,"JSON": "JSON"
        ,"XML": "XML"
        ,"WordPress": "WordPress"
        ,"Android Studio": "Android"
        ,"XCode": "iOS"
        ,"Xamarin Forms": "Visual Studio"
        ,"Python": "Python"
        ,"React JS/Native": "React"
        ,"JavaFX": "JavaFX"
        ,"API Map": "API Map"
    }

    ,VERSION: "220506"

}

var exportKind_out = {
	DOCUMENT: "DOCUMENT"
	,LAYER: "LAYER"
	,SPRITE: "SPRITE"
	,kind: ""
}
const exportKind = function (kind = ""){
	if(kind != "") exportKind_out.kind = kind;
	return exportKind_out;
}

var _excache = {"screen":"default","validate":true};
var EXCache = function(key,value){
    if(key == 0) _excache = {"screen":"default","validate":true};
    if(value || value === false) _excache[key+""] = value;

    events.dispatch(new events.EKEvent(events.EKEvent.EXCACHE,{key:key,value:value}));  

    return _excache[key+""] ? _excache[key+""] : false;
}

var activeDocument_activeDocument = null;
var activeDocument = function(doc){ 
    if(doc) activeDocument_activeDocument = doc; 
    return activeDocument_activeDocument;
};

var clean = function(){
	options.RUNNING = false;
    logger("",true);
    EXCache(0);
    _logs = [];
    _OUTPUT = {};
}

var ltArgs = function(name,lt){
	return name.split('${'+lt)[1].split('}')[0].split(':')[1];
}

let _logs = [];
let _time = 0;
let _layers = 0;
let _start, _end;

const logger = function(log = "", reset = false){

    if(reset) _logs = [];
    if(_logs.length == 0){
        _start = new Date();
        _layers = 0;
    }

    if(log.indexOf(':') != 0) _logs.push(log);
    if(_logs.length > 5) _logs.shift();
    
    if(log.indexOf('[ERROR]') > -1){ 

        (async () => {

            let logOut = _logs;
            if(_logs.length == 5) logOut = _logs.slice(2,4);

            let errorMsg = logOut[logOut.length-1];
            let errorTitle = errorMsg.indexOf('] ') > -1 ? errorMsg.split('] ').reverse()[1]+']' : '';
            let errorLink = 
                "https://exportkit.com/figma-api/error/?l="+encodeURIComponent(logOut.reverse().join(','))
                +"&e="+log
                +"&v="+data.VERSION;

            if(errorMsg.indexOf(': ') > -1) errorMsg = errorMsg.split(': ').reverse()[0];
            else errorMsg = errorMsg.split('] ').reverse()[0];
            
            errorMsg = errorMsg.split("\\n").join("<br/>");
            _logs.pop();

            events.dispatch(new events.EKEvent(
                events.EKEvent.POPUP_ERROR
                ,{
                    title:'Error '+errorTitle
                    ,msg:errorMsg
                    ,link:errorLink
                }
            ));
    
            clean();

        })();

    }else if(log.indexOf('All Files Saved') > -1){

        _end = new Date();
        _time = _end - _start;

        let _mstime = logger_msToTime(_time);

        setTimeout(function(){
            events.dispatch(new events.EKEvent(
                events.EKEvent.POPUP_LOG
                ,{
                    layers:_layers
                    ,title:"Export Complete"
                    ,lps:Math.round(_layers/(_mstime.secs+(_mstime.ms/1000)))
                    ,ellapse:_mstime.time
                }
            )); 
            
            clean();
        },1500);

    }else if(log.indexOf("All Images Saved") > -1){
        EXUtil.imageRenditions = [];
        options.RUNNING = false;
        EXCache(0);
    }else if(log.indexOf('New Layer | ') > -1){
        _layers++;
    }
    
    //events.dispatch(new events.EKEvent(events.EKEvent.POPUP_UPDATE,{ msg:log }));

}

function logger_msToTime(s) {
    let ms = s % 1000; s = (s - ms) / 1000;
    let secs = s % 60; s = (s - secs) / 60;
    let mins = s % 60;
    let hrs = (s - mins) / 60;

    return { hrs:hrs, mins:mins, secs:secs, ms:ms, time:(mins + ':' + secs + ':' + ms) };
}

var EXUtil = {

    "cleanName" : function(name, validName = false){

        try{

            if(!options.VALIDATION_AUTO_VALIDATE) return name;

            logger(":cleanName");
            let validate = EXCache("validate");  

            name = EXUtil.removeLayerTag(name);
            name = name.replace(/[^\x00-\x7F]/g,"_");                                                                               //non utf8

            if(validate || validName) name = name.replace(/[\/\\*\?\$\'\:\;\`\^\=\"\<\>\(\)\|\-\,\.\~\#\%\&\{\}\+\s]/g,"_");        //all bad chars
            else name = name.replace(/[\/\\?\$\<\(\)\|\~\%\&\{\}\s]/g,"_");                                                         //css safe

        }catch(utilError){
            throw "[CLEAN_NAME] "+utilError;
        }

        return name.toLowerCase();
    },

    "uniqueName" : function(name){

        try{

            logger(":uniqueName");
            let _name = name;
            let _tags = [];

            if(_name.indexOf("${") > -1){
                let _tag = _name.slice(_name.indexOf("${"),_name.lastIndexOf("}")+1);
                _name = _name.split(_tag).join("");
                _tags.push(_tag);
            }

            let _fLetter = _name.charAt(0);
            if(_fLetter.toUpperCase() == _fLetter.toLowerCase()) _name = "_"+_name;
            _name = EXUtil.cleanName(_name);

            let nameCache = EXCache(EXCache("screen")) || {};
            let validate = EXCache("validate");
            let count = nameCache[_name];
            
            if(count > 0) count++;
            else count = 1;

            nameCache[_name] = count;
            EXCache(EXCache("screen"),nameCache);

            if(!validate) count = 1;

            name = 
                (_tags.length > 0 ? _tags.join(" ") : "")
                +_name
                +(count > 1 ? "_ek"+(count-1) : "");

        }catch(utilError){
            throw "[UNIQUE_NAME] "+utilError;
        }

        return name;
    },

    "createFolderPath" : async function(path){

        try{

            path = path.split("\\").join("/");
            let _paths = path.split('/');
            let _curFolder = EXCache("outFolder");
            let _curPath;

            for(let i=0;i<_paths.length;i++){

                let entry = _paths[i];

                _curPath = _curFolder+entry+"/";
                _curFolder = _curPath;

                if(
                    entry.indexOf("layout-") > -1 
                    || entry.indexOf("imageset") > -1 
                    || entry.indexOf("Layouts") > -1 
                ){
                    if(!EXCache(entry+"Folder")) EXCache(entry+"Folder",_curPath);
                }

            }

            return _curFolder;

        }catch(createFolderError){
            throw "[CREATE_FOLDER] "+createFolderError;
        }

    },

    "cacheFolder" : async function(path){

        if(!EXCache("folderCache")) EXCache("folderCache",{});
        let cache = EXCache("folderCache");
        cache[path.split("/").join("_")] = path;
        EXCache("folderCache",cache);

    },

    "createFolders" : async function(){

        try{

            logger(":createTempFolders");
            let outFolderName = 
                "_"+activeDocument().type+"_"
                +activeDocument().name;                 

            let outFolder = outFolderName+"/";
            let skinsFolder = null; 

            switch(EXCache("exportType")){

                case "Android":

                    let resFolder = outFolder+"res/";
                    let valuesFolder = resFolder+"values/";
                    let layoutFolder = resFolder+"layout/";
                    let srcFolder = outFolder+"java/";
                    let exportkitFolder = srcFolder+"exportkit/";
                    let xdFolder = exportkitFolder+"xd/";

                    skinsFolder = resFolder+"drawable-nodpi/";

                    EXCache("resFolder",resFolder);
                    EXCache("valuesFolder",valuesFolder);
                    EXCache("layoutFolder",layoutFolder);
                    EXCache("srcFolder",srcFolder);
                    EXCache("exportkitFolder",exportkitFolder);
                    EXCache("xdFolder",xdFolder);

                    break;

                case "iOS":

                    let xcodeFolder = outFolder+activeDocument().name+"/";
                    let projFolder = xcodeFolder+activeDocument().name+"/";
                    let xcodeprojFolder = xcodeFolder+activeDocument().name+".xcodeproj/";

                    skinsFolder = projFolder+"Assets.xcassets/";

                    let AppIconappiconsetFolder = skinsFolder+"AppIcon.appiconset/";
                    let BaselprojFolder = projFolder+"Base.lproj/";

                    EXCache("AppIcon.appiconsetFolder",AppIconappiconsetFolder);
                    EXCache("Base.lprojFolder",BaselprojFolder);
                    EXCache("Assets.xcassetsFolder",skinsFolder);
                    EXCache(activeDocument().name+".xcodeprojFolder",xcodeprojFolder);
                    EXCache(activeDocument().name+"Folder",projFolder);

                    break;

                case "Visual Studio":

                    let pagesFolder = outFolder+"Pages/";
                    let propertiesFolder = outFolder+"Properties/";
                    let macImagesFolder = outFolder+"Assets.xcassets/";

                    skinsFolder = outFolder+"Assets/";

                    EXCache("PagesFolder",pagesFolder);
                    EXCache("PropertiesFolder",propertiesFolder);
                    EXCache("Assets.xcassetsFolder",macImagesFolder);

                    break;

                case "API Map":

                    let apiMacImagesFolder = outFolder+"Assets.xcassets/";
                    skinsFolder = outFolder+"Assets/";
                    EXCache("Assets.xcassetsFolder",apiMacImagesFolder);

                    break;

                default:

                    skinsFolder = outFolder+"skins/";

                    break;
            }

            EXCache("outFolder",outFolder);
            EXCache("skinsFolder",skinsFolder);
            EXCache("outFolderName",outFolderName);

        }catch(utilError){
            throw "[TEMP_FOLDERS] "+utilError;
        }

    },

    "imageRenditions" : [],

    "resScreen" : "default",

    "saveImage" : async function(name, node, contentType = "png", exportType = "", scale = 1) {

        try{

            logger(":saveImage");

            let image;
            let path = "";
            let folder = "skins";

            if( name.indexOf("/") > -1 ){
                path = name.split("/");
                name = path.pop();
                path = path.join("/");
            }

            let res_screen = "__"+EXCache("screen");

            if(options.ALLOW_SCREEN_IMAGES && (res_screen != "__default")){

                if(!EXCache(res_screen)){ 

                    if( EXCache("exportType") == "Android" || exportType == "Android"){

                        let screenSizeOut = "res/drawable-w";
                        let screenSize = EXCache("screen").split("screen").join("");

                        if(screenSize.indexOf("-land") > -1){
                            screenSize = screenSize.split("-land").join("");
                            screenSizeOut += screenSize+"dp-land";
                        }else{
                            screenSizeOut += screenSize+"dp";
                        }

                        folder = screenSizeOut;

                    }else if( EXCache("exportType") == "iOS" || exportType == "iOS" ){
                        
                        let names = name.split(".");
                        let imgScale = parseInt(EXCache("screen").split("screen").join(""));

                        if(imgScale > 700){ imgScale = "@3x"; }
                        else if(imgScale > 450){ imgScale = "@2x"; }
                        else{ imgScale = ""; }

                        let selfContain = exportType != "iOS" ? activeDocument().name+"/"+activeDocument().name+"/" : "";
                        folder = selfContain+"Assets.xcassets/"+name.split(".")[0]+(exportType == "iOS" ? ".png" : "")+".imageset";
                        name = names[0]+imgScale+"."+names[1];
                    
                    }else{

                        folder = "skins/"+EXCache("screen");
                        EXCache(res_screen,1);

                        if( 
                            EXCache("exportType") == "Visual Studio" 
                            || EXCache("exportType") == "API Map" 
                        ){

                            folder = "Assets/"+EXCache("screen");
                            EXUtil.saveImage(name,node,contentType,"Android");
                            EXUtil.saveImage(name,node,contentType,"iOS");
                        }

                    }

                    EXUtil.resScreen = EXCache("screen");

                }

            }else if( path != "" ){

                folder = "skins/"+path;

            }else{
                
                if( EXCache("exportType") == "Android" || exportType == "Android" ){
                    folder = "res/drawable";
                }else if( EXCache("exportType") == "iOS" || exportType == "iOS" ){
                    let selfContain = exportType != "iOS" ? activeDocument().name+"/"+activeDocument().name+"/" : "";
                    folder = selfContain+"Assets.xcassets/"+name.split(".")[0]+(exportType == "iOS" ? ".png" : "")+".imageset";
                }else{
                    folder = "skins";

                    if( 
                        EXCache("exportType") == "Visual Studio" 
                        || EXCache("exportType") == "API Map" 
                    ){
                        folder = "Assets";
                        EXUtil.saveImage(name,node,contentType,"Android");
                        EXUtil.saveImage(name,node,contentType,"iOS");
                    }
                }

            }

            EXUtil.cacheFolder(folder);

            EXUtil.imageRenditions.push({
                "node":node
                ,"outputFile":image
                ,"type":contentType
                ,"scale":1
                ,"filePath":folder
                ,"name":name
                ,"scale":scale
            });

        }catch(utilError){
            throw "[SAVE_IMAGE] "+utilError;
        }

    },

    "removeLayerTag" : function(name){

        if(name.indexOf("${") > -1){
            let _tag = name.slice(name.indexOf("${"),name.lastIndexOf("} ")+1);
            name = name.split(_tag).join("");
        }

        return name;

    },

    "hexToRgb": function (hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : {r:0,g:0,b:0};
    },
      
    "rgbToHex": function (color) {
        var bin = (color.r*255) << 16 | (color.g*255) << 8 | (color.b*255);
        return (function(h){ return new Array(7-h.length).join("0")+h })( bin.toString(16).toUpperCase() );
    },

    "layerRotation": function (x, y, xm, ym, a) {
        var cos = Math.cos, sin = Math.sin,
        a = (360 - a) * Math.PI / 180, 
        xr = (x - xm) * cos(a) - (y - ym) * sin(a)   + xm,
        yr = (x - xm) * sin(a) + (y - ym) * cos(a)   + ym;
        
        return [Math.round(xr), Math.round(yr)];
    }
}

Number.prototype.round = function(){ return +(Math.round(this+"e+2") +"e-2"); }

const kind = {
    
    layerBase: function (node, localize){

        try{

            logger(":Base");
            localize._output.guid = node.id;
            localize._output.name = EXUtil.uniqueName(node.name);
            localize._output.typename = "ArtLayer";
            localize._output.kind = 'layer';

            if(
                node.name.indexOf("${img}") > -1 
                || node.name.indexOf("${image}") > -1 
                || (node.children && node.children.length > 0 && node.children[0].isMask)

                || ( !options.OUTPUT_SVG_SHAPES && (
                    ( node.constructor.name != "LineNode" && node.constructor.name == "VectorNode" )
                    || node.constructor.name == "PolygonNode" 
                    || node.constructor.name == "StarNode" 
                    ) )
                || node.constructor.name == "BooleanOperationNode"

                //hybrid for mobiles
                || ( options.OUTPUT_HYBRID && ( 
                    node.constructor.name == "VectorNode" 
                    || (node.fills && node.fills[0] && node.fills[0].gradientStops)
                 ) )
            ){

                logger("Rendering as Image");
                localize._output.asImage = true;
                localize._output.constructor = "RectangleNode";
                localize._output.imgPath = EXUtil.cleanName(activeDocument().name);

            }

            if(exportKind().kind == exportKind().LAYER){

                switch (localize._output.constructor){

                    case "GroupNode":
                    case "FrameNode":
                    case "ComponentNode":
                    case "InstanceNode":

                        logger("Reassign Containers for LayersView");
                        localize._output.constructor = "RectangleNode";
                        break;

                }
            }

            localize._output.opacity = (node.opacity*100).round();
            localize._output.visible = node.visible;
            localize._output.effects = {"scale":100};

            logger("Assigning Bounds");
            localize._output.bounds = {x:0,y:0,width:0,height:0};
            localize._output.bounds.x = node.x.round();
            localize._output.bounds.y = node.y.round();
            localize._output.bounds.width = node.width.round();
            localize._output.bounds.height = node.height.round();
            localize._output.rotation = -node.rotation.round();

            if(node.rotation != 0){
                logger("Adjusting Bunds for Figma Rotation");
                let origBounds = EXUtil.layerRotation(node.x,node.y,node.x-(node.width/2),node.y-(node.height/2),node.rotation);
                localize._output.bounds.x = origBounds[0].round();
                localize._output.bounds.y = origBounds[1].round();
            }

            if(localize._output.constructor == "LineNode"){
                logger("Adjusting Bounds for Line");
                localize._output.bounds.width = node.width.round();
            }
            
            logger("Assigning Path");
            if(node.vectorPaths && node.vectorPaths.length > 0) localize._output.path = node.vectorPaths[0].data;

            logger("Assigning Interactions");
            let _interactions = [];

            function layerIsFolder(__node){
                return (
                    __node.constructor.name == "GroupNode"
                    || __node.constructor.name == "FrameNode"
                    || __node.constructor.name == "ComponentNode"
                    || __node.constructor.name == "InstanceNode"
                );
            }

            if(node.reactions && node.reactions.length > 0){
                node.reactions.map(interaction => {
                    try{

                        switch(interaction.action.type){ 

                            case 'BACK':
                                
                                if(layerIsFolder(node)){
                                    localize._output.name = 
                                        (EXCache("exportType") == "HTML5" ? "${class|a:href=\"javascript:history.back()\"} " : "")
                                        +localize._output.name;
                                }else{
                                    localize._output.name = 
                                        (EXCache("exportType") == "HTML5" ? "${link:javascript:history.back()} " : "")
                                        +localize._output.name;
                                }

                                break;

                            case 'URL':
                                
                                if(layerIsFolder(node)){
                                    localize._output.name = 
                                        (EXCache("exportType") == "HTML5" ? "${class|a:href=\""+interaction.url+"\"} " : "")
                                        +localize._output.name;
                                }else{
                                    localize._output.name = 
                                        (EXCache("exportType") == "HTML5" ? "${link:"+interaction.url+"} " : "")
                                        +localize._output.name;
                                }

                                break;

                            case 'NODE':

                                let __node, _nodeName;
                                
                                __node = figma.currentPage.findOne(n => n.id === interaction.action.destinationId); 
                                try{ _nodeName = EXUtil.cleanName(__node.name); }catch(e){ break; } //possible deleted
                                
                                switch(interaction.action.navigation){

                                    case 'NAVIGATE':
                                        
                                        if(layerIsFolder(node)){
                                            localize._output.name = 
                                                (EXCache("exportType") == "HTML5" ? "${class|a:href=\""+_nodeName+".html\"} " : "${link:"+_nodeName+"} ")
                                                +localize._output.name;
                                        }else{
                                            localize._output.name = 
                                                "${link:"+_nodeName
                                                +(EXCache("exportType") == "HTML5" ? ".html" : "")+"} "
                                                +localize._output.name;
                                        }

                                        break;

                                    case 'SCROLL_TO':

                                        if(layerIsFolder(node)){
                                            localize._output.name = 
                                                (EXCache("exportType") == "HTML5" ? "${class|a:href=\"#"+_nodeName+"\"} " : "")
                                                +localize._output.name;
                                        }else{
                                            localize._output.name = 
                                                (EXCache("exportType") == "HTML5" ? "${link:#"+_nodeName+"} " : "") 
                                                +localize._output.name;
                                        }

                                        break;

                                }

                                if(interaction.action.transition) interaction.action.transition.name = interaction.action.transition.constructor.name;

                                break;
                        }

                        _interactions.push(interaction);
                                
                    }catch(interactionError){
                        return; //possible deleted
                    }

                });

                localize._output.interactions = _interactions;

            }
        
        }catch(baseError){
            throw "[BASE] "+baseError;
        }

    }

    ,layerRectangle: function (node, localize){

        try{

            logger(":Rectangle");

            localize._output.kind = 'shape';
            localize._output.vector = [[]];      
            localize._output.shapeType = 'rectangle';
            localize._output.radius = "0px";

            if(
                node.topLeftRadius 
                && node.cornerRadius
                && (
                    node.topLeftRadius > 0
                    || node.topRightRadius > 0
                    || node.bottomRightRadius > 0
                    || node.bottomLeftRadius > 0
                )
            ){

                logger(":hasRoundedCorners");
                localize._output.shapeType = 'roundRectangle';
                localize._output.radius = (typeof(node.cornerRadius) != "symbol" && parseInt(node.cornerRadius) > 0) ? node.cornerRadius.round()+"px" : node.topLeftRadius.round()+"px";

                localize._output.topLeft = node.topLeftRadius.round();
                localize._output.topRight = node.topRightRadius.round();
                localize._output.bottomRight = node.bottomRightRadius.round();
                localize._output.bottomLeft = node.bottomLeftRadius.round();

            }

            localize._output.fillColor = {
                'red': 255,
                'green': 255,
                'blue': 255,
                'alpha': 0,
                'hexValue': '#ffffff'
            };

            if (node.fills && node.fills[0]){ 

                logger(":fillEnabled");

                if(node.fills[0].type == 'SOLID') {

                    logger("Adding Solid Color");
                    let shapeAlpha = node.fills[0].opacity;

                    localize._output.fillColor = {
                        'red': (node.fills[0].color.r*255).round(),
                        'green': (node.fills[0].color.g*255).round(),
                        'blue': (node.fills[0].color.b*255).round(),
                        'alpha': shapeAlpha.round(),
                        'hexValue': EXUtil.rgbToHex(node.fills[0].color)
                    };

                    if(shapeAlpha*100 < localize._output.opacity) localize._output.opacity = shapeAlpha*100;
                    if(!node.fills[0].visible) localize._output.fillColor.alpha = 0;
                    
                }

                if(node.fills[0].type == 'GRADIENT_LINEAR' || node.fills[0].type == 'GRADIENT_RADIAL'){

                    logger("Adding Gradient Colors");
                    let gradientColors = [];

                    node.fills[0].gradientStops.map(color => {

                        gradientColors.push({
                            "location": color.position*100,
                            "color": {
                                'red': (color.color.r*255).round(),
                                'green': (color.color.g*255).round(),
                                'blue': (color.color.b*255).round(),
                                'alpha': (color.color.a).round(),
                                'hexValue': EXUtil.rgbToHex(color.color)
                            }
                        });

                    });

                    localize._output.effects['gradientFill'] = {
                        "enabled": true     
                        ,"gradient":{
                            'interfaceIconFrameDimmed': 100,
                            'colors': gradientColors
                        }
                        ,"opacity": 100                     //defined in each color stop?
                        ,"angle": (Math.atan2(
                                node.fills[0].gradientTransform[0][1] -node.fills[0].gradientTransform[1][1], node.fills[0].gradientTransform[0][0] - node.fills[0].gradientTransform[1][0]
                            ) * 180 / Math.PI) - 45
                        ,"type": (node.fills[0].type == "GRADIENT_LINEAR" ? "linear" : "radial")
                        ,"reverse": false
                    }; 

                }

            }

        }catch(rectangleError){
            throw "[RECTANGLE] "+rectangleError;
        }

    }

    ,layerEllipse: function (node, localize){

        try{
    
            if(node.type == 'ELLIPSE'){

                logger(":Ellipse");
                if(node.width != node.height){
        
                    logger(":radius");
                    localize._output.shapeType = 'ellipse';
                    localize._output.radiusX = (node.width/2).round();
                    localize._output.radiusY = (node.height/2).round();
                    localize._output.radius = (node.width/2).round()+"px / "+(node.height/2).round()+"px";
        
                }else{
        
                    logger(":isCircle");
                    localize._output.shapeType = 'circle';
                    localize._output.isCircle = true;
                    localize._output.radius = (node.width/2).round()+"px / "+(node.width/2).round()+"px";

                }   
            }
    
        }catch(ellipseError){
            throw "[ELLIPSE] "+ellipseError;
        }
    
    }
    
    ,layerImage: async function (node, localize){

        try{

            if (
                (node.fills && node.fills[0] && node.fills[0].type == "IMAGE")
                || localize._output.asImage
            ){

                logger(":Image");
                localize._output.opacity = node.opacity*100;
                localize._output.kind = 'image';
                localize._output.mime = "png";
                localize._output.img = EXUtil.cleanName(localize._output.name,true)+".png";
      
                if(exportKind().kind != exportKind().LAYER){
    
                  let _stylesPath = layerImage_getStylesPath(node);
                  localize._output.img = 
                    _stylesPath + (_stylesPath.length > 0 ? "/" : "") +
                    EXUtil.cleanName(localize._output.name,true)+".png";
    
                  logger("Saving Image Rendition: "+localize._output.img);
                  EXUtil.saveImage(localize._output.img,node);
    
                } 
    
                delete localize._output.path;
                delete localize._output.shapeType;
    
            }
    
        }catch(imageError){
            throw "[IMAGE] "+imageError;
        }
    
    }
    
    ,layerEffects: function (node, localize){

        try{

            logger(":Effects");

            if(node.strokes && node.strokes[0] && localize._output.constructor != "LineNode"){

                logger(":stroke");
                if(node.strokes[0].type == "SOLID"){
                 
                    localize._output.effects['frameFX'] = {
                        "enabled": node.strokes[0].visible
                        ,"opacity": node.strokes[0].opacity.round()   
                        ,"size": node.strokeWeight.round()
                        ,"position": node.strokeAlign
                        ,"linejoin": node.strokeJoin
                        ,"linecaps": node.strokeCap !== figma.mixed ? node.strokeCap : "NONE"
                        ,"color":{
                            'red': (node.strokes[0].color.r*255).round(),
                            'green': (node.strokes[0].color.g*255).round(),
                            'blue': (node.strokes[0].color.b*255).round(),
                            'hexValue': EXUtil.rgbToHex(node.strokes[0].color)
                        }
                    };

                }
            }else if(localize._output.constructor == "LineNode"){
                localize._output.bounds.height = node.strokeWeight.round();
                localize._output.fillColor = {
                    'red': (node.strokes[0].color.r*255).round(),
                    'green': (node.strokes[0].color.g*255).round(),
                    'blue': (node.strokes[0].color.b*255).round(),
                    'hexValue': EXUtil.rgbToHex(node.strokes[0].color)
                };
            }

            if(node.effects.length > 0){
                node.effects.map(effect => {

                    if((effect.type == 'DROP_SHADOW' || effect.type == 'INNER_SHADOW') && effect.visible){

                        logger(":shadow ["+effect.type+']');

                        let shadowObj = {
                            "enabled": true     
                            ,"color":{
                                'red': (effect.color.r*255).round(),
                                'green': (effect.color.g*255).round(),
                                'blue': (effect.color.b*255).round(),
                                'hexValue': EXUtil.rgbToHex(effect.color)
                            }
                            ,"opacity": (effect.color.a*100).round()
                            ,"offsetX": effect.offset.x.round()
                            ,"offsetY": effect.offset.y.round()
                            ,"blur": effect.radius
                            ,"chokeMatte": effect.spread
                        }; 
        
                        if(effect.type == 'DROP_SHADOW') localize._output.effects['dropShadow'] = shadowObj;
                        else localize._output.effects['innerShadow'] = shadowObj;
                        
                    }
        
                    //outer glow                                    //not supported
                    //inner glow                                    //not supported

                });
            };

        }catch(effectsError){
            throw "[EFFECTS] "+effectsError;
        }

    }

    ,layerFolder: function (node, localize){

        try{
    
            logger(":Folder");
            localize._output.isArtboard = false;
            if(localize._output.constructor == "FrameNode" && node.parent.constructor.name == "PageNode"){
                localize._output.isArtboard = true;
                localize._output.bounds.x = 0;
                localize._output.bounds.y = 0;
            }
    
            localize._output.typename = "LayerSet"
            localize._output.kind = "folder";
            localize._output.layers = [];
    
        }catch(folderError){
            throw "[FOLDER] "+folderError;
        }
    
    }
       
    ,layerText: function (node, localize){

        try{

            if(node.type == 'TEXT'){

                logger(":Text  | :paragraph");
                localize._output.kind = 'text';
                localize._output.textkind = "paragraph";

                logger("Mapping Style Ranges");
                let lastRange = 1;
                let styleCount = 0;
                let len = node.characters.length;
                
                localize._output.ranges = [];
                
                if(len > 1){

                    let 
                        _lastSize = 0
                        , _lastName = {family:""}
                        , _lastColor = [{color:{r:0,g:0,b:0}}]
                        , _lastStyle = ""
                        , _lastDecoration = ""
                        , _lastCase = ""
                        , _lastLineHeight = {value:0}
                        ;

                    for (let i = 0; i < len; i++) {

                        let isDiff = false;
                        if(!localize._output.ranges[styleCount]) localize._output.ranges[styleCount] = {};
                        
                        localize._output.ranges[styleCount]['range'] = [lastRange-1,i];
                        
                        if(
                            _lastSize != node.getRangeFontSize(i, i+1)
                            || _lastName.family != node.getRangeFontName(i, i+1).family
                            || EXUtil.rgbToHex(_lastColor[0].color) != EXUtil.rgbToHex(node.getRangeFills(i, i+1)[0].color)
                            || _lastStyle != _lastName.style
                            || _lastDecoration != node.getRangeTextDecoration(i, i+1)
                            || _lastCase != node.getRangeTextCase(i, i+1)
                            //|| _lastLineHeight.value != node.getRangeLineHeight(i, i+1).value
                        ){
                            logger("New Style Range");
                            if(_lastSize > 0) isDiff = true;
                        }
                        
                        localize._output.ranges[styleCount]['color'] = "#"+EXUtil.rgbToHex(_lastColor[0].color);
                        localize._output.ranges[styleCount]['font-family'] = _lastName.family;
                        localize._output.ranges[styleCount]['font-size'] = _lastSize;
                        localize._output.ranges[styleCount]['font-style'] = _lastStyle.toLowerCase().indexOf("italic") > -1 ? "italic" : "normal";
                        localize._output.ranges[styleCount]['font-weight'] = _lastStyle.toLowerCase().indexOf("bold") > -1 ? "bold" : "normal";
                        localize._output.ranges[styleCount]['text-decoration'] = _lastDecoration;
                        //localize._output.ranges[styleCount]['line-height'] = (_lastLineHeight.value/100)*_lastSize;
                        localize._output.ranges[styleCount]['capitalization'] = (_lastCase == "UPPER" ? true : false);

                        _lastSize = node.getRangeFontSize(i, i+1);
                        _lastName = node.getRangeFontName(i, i+1);
                        _lastColor = node.getRangeFills(i, i+1);
                        _lastStyle = _lastName.style;
                        _lastDecoration = node.getRangeTextDecoration(i, i+1);
                        _lastCase = node.getRangeTextCase(i, i+1);
                        _lastLineHeight = node.getRangeLineHeight(i, i+1);

                        if(isDiff){
                            styleCount++;
                            lastRange = i+1;
                        }

                    }
                }

                logger("Assign Text Properties");
                let _node = node;
                if(localize._output.ranges.length > 0){
                    _node = localize._output.ranges[0];
                    _node.fontName = { 
                        family:_node['font-family']
                        ,style:_node['font-style']
                        ,weight:_node['font-weight'] 
                    };
                    _node.fontSize = _node['font-size'];
                    //_node.lineHeight = _node['line-height'];
                    _node.textDecoration = _node['text-decoration'];
                    _node.fills = node.getRangeFills(1, 2);
                } 

                let fontBuffer = _node.fontSize/2;
            
                logger(":multiline");
                localize._output.name = "${p} "+localize._output.name;
                localize._output.bounds.height += fontBuffer;
                localize._output.bounds.width += fontBuffer;

                localize._output.font = _node.fontName.family;
                localize._output.webFont = _node.fontName.family;
                localize._output.size = _node.fontSize.round();

                if(_node.fontName.style.toLowerCase().indexOf("bold") > -1) localize._output.bold = true;
                if(_node.fontName.style.toLowerCase().indexOf("italic") > -1) localize._output.italic = true;
                if(_node.fontName.weight && _node.fontName.weight.toLowerCase().indexOf("bold") > -1) localize._output.bold = true;
                if(_node.textDecoration == "UNDERLINE") localize._output.underline = true;
                if(_node.textDecoration == "STRIKETHROUGH") localize._output.strikeThru = true;
                if(_node.textCase == "UPPER") localize._output.capitalization = true;

                try{ 
                    localize._output.charSpacing = node.letterSpacing.unit == "PIXELS" ? node.letterSpacing.value : localize._output.size *node.letterSpacing.value/100; 
                }catch(e){
                    localize._output.charSpacing = 0;
                }

                localize._output.justification = node.textAlignHorizontal.toLowerCase();
                localize._output.contents = encodeURIComponent(node.characters);
                localize._output.position = [node.x.round(),node.y.round()];

                try{ 
                    localize._output.leading = node.lineHeight.unit == "PIXELS" ? node.lineHeight.value : localize._output.size *node.lineHeight.value/100; 
                }catch(e){
                    localize._output.leading = localize._output.size;
                }

                logger("Assign Text Color");  
                if(_node.fills && _node.fills.length && _node.fills.length > 0){      
                    localize._output.fontColor = {
                        'red': (_node.fills[0].color.r).round(),
                        'green': (_node.fills[0].color.g).round(),
                        'blue': (_node.fills[0].color.b).round(),
                        'alpha': (_node.fills[0].opacity*100).round(),
                        'hexValue': EXUtil.rgbToHex(_node.fills[0].color)
                    };
                }else{
                    localize._output.fontColor = {
                        'red': 0,
                        'green': 0,
                        'blue': 0,
                        'alpha': 1,
                        'hexValue': '#000000'
                    };
                }

            }

        }catch(textError){
            throw "[TEXT] "+textError;
        }
    }

}

function layerImage_getStylesPath(layer){

    let stylesPath = "";

    if(EXCache("styles")){

        let _paths = [];
        let _parent = layer.parent;

        logger(":cssStyles: "+_parent.name);
        if( _parent.name.indexOf("${css|styles}") > 0 ) _paths.push(_parent.name);
        while( _parent.name.indexOf("${css|styles}") == -1 ){
            _paths.push(layerImage_cleanPath(_parent.name));
            _parent = _parent.parent;
        }

        let _outPath = "styles";
        if(_paths.length > 0) _outPath += "/"+_paths.reverse().join("/");

        stylesPath = _outPath;

    }

    return stylesPath;

}

function layerImage_cleanPath(path){

    return path
        .split("-").join("")
        .split(".").join("")
        .split(":").join("_")
        .split(" > ").join("_");

}

class EXLayer {

    get output() {
        return this._output;
    }

    constructor(node, stack) {

        this._output = {};
        
        try{

            logger("New Layer | "+node.name+" ["+node.constructor.name+"]");
            this._output.id = stack || 0;
            this._output.constructor = node.constructor.name;

            kind.layerBase(node, this);
            
            switch (this._output.constructor){

                case "RectangleNode":
                case "EllipseNode":
                case "LineNode":    
                case "VectorNode":    
                case "PolygonNode":    
                case "StarNode":    
                case "BooleanOperationNode": 

                    kind.layerRectangle(node, this);
                    kind.layerEllipse(node, this);
                    kind.layerImage(node, this);
                    kind.layerEffects(node, this);

                    break;

                case "GroupNode":
                case "ComponentNode":
                case "InstanceNode":
                case "FrameNode":

                    kind.layerFolder(node, this);

                    break;

                case "TextNode":

                    kind.layerText(node, this);
                    kind.layerEffects(node, this);

                    break;

            }
           
            Object.assign(this, this._output);

        }catch(layerError){
            throw "[LAYER: "+node.name+"] "+layerError;
        }

        return this._output;

    }

}

const _autoBackground = function(node,parent,stack){

    try{

        logger("Auto Background");
        let bgLayer = new EXLayer(node, stack);

        bgLayer.typename = 'ArtLayer';
        bgLayer.kind = 'shape';
        bgLayer.vector = [[]];
        bgLayer.shapeType = 'rectangle';
        bgLayer.radius = "0px";
        bgLayer.name = "_bg__"+bgLayer.name;

        bgLayer.bounds.x = 0;
        bgLayer.bounds.y = 0;

        delete bgLayer.layers;

        if(node.fills[0]){

            logger(":fillEnabled");

            if(node.fills[0].type == 'SOLID') {

                logger("Adding Solid Color");
                let abFillColor = node.fills[0].color;
                let abShapeAlpha = node.fills[0].opacity.round();

                bgLayer.fillColor = {
                    'red': (abFillColor.r*255).round(),
                    'green': (abFillColor.g*255).round(),
                    'blue': (abFillColor.b*255).round(),
                    'alpha': abShapeAlpha,
                    'hexValue': EXUtil.rgbToHex(node.fills[0].color)
                };
                
            }
            
            if(node.fills[0].type == 'GRADIENT_LINEAR' || node.fills[0].type == 'GRADIENT_RADIAL'){

                logger("Adding Gradient Colors");
                let gradientColors = [];

                node.fills[0].gradientStops.map(color => {

                    let gradientColorStop = color.color;
                    gradientColors.push({
                        "location": color.position*100,
                        "color": {
                            'red': (gradientColorStop.r*255).round(),
                            'green': (gradientColorStop.g*255).round(),
                            'blue': (gradientColorStop.b*255).round(),
                            'alpha': gradientColorStop.a,
                            'hexValue': EXUtil.rgbToHex(color.color)
                        }
                    });

                });

                bgLayer.effects['gradientFill'] = {
                    "enabled": true     
                    ,"gradient": {
                        'interfaceIconFrameDimmed': 100,
                        'colors': gradientColors
                    }
                    ,"opacity": 100                     //defined in each color stop?
                    ,"angle": (Math.atan2(
                            node.fills[0].gradientTransform[0][1] - node.fills[0].gradientTransform[1][1], node.fills[0].gradientTransform[0][0] - node.fills[0].gradientTransform[1][0]
                        ) * 180 / Math.PI) - 45
                    ,"type": (node.fills[0].type == "GRADIENT_LINEAR" ? "linear" : "radial")
                    ,"reverse": false
                }; 

            }

        }

        logger("Adding Background to Parent");
        parent.layers.push(bgLayer);

    }catch(bakgroundError){
        throw "[BACKGROUND] "+bakgroundError;
    }

}

let _render_artLayer = false;
var _render = function(root, out, localize) {

    try{

        if(exportKind().kind != exportKind().LAYER){

            logger("Rendering Documents | "+root.name);
            let pageCache = {};

            root.children.forEach(node => {

                localize._STACKORDER++;

                if(node.name.indexOf("${skip}") == -1){

                    try{

                        logger("Creating Layer");
                        let layer = new EXLayer(node, localize._STACKORDER);

                        if(layer.isArtboard 
                            && layer.name.indexOf("${global}") == -1
                            && layer.name.indexOf("${css|screen") == -1
                        ){

                            try{

                                layer.name = "${page:"+EXUtil.cleanName(node.name)+"} "+EXUtil.cleanName(node.name);
                                _render_artLayer = true;

                                if(!options.OUTPUT_DYNAMIC_HEIGHT){

                                    logger("Creating Frame Page");
                                    let aContainer = new EXLayer(node, localize._STACKORDER+100000);
                                    aContainer.name = "page_"+aContainer.name;

                                    logger("Creating Background");
                                    _autoBackground(node, aContainer, localize._STACKORDER+200001);

                                    logger("Rendering Child Layers");
                                    _render(node, aContainer, localize);
                                    layer.layers.push(aContainer);

                                }else{

                                    logger("Creating Dynamic Frame Page");
                                    _render(node, layer, localize);

                                }

                                pageCache[EXUtil.cleanName(node.name)] = layer;
                                _render_artLayer = false;

                            }catch(artboardError){
                                throw "[FRAME: "+node.name+"] "+artboardError;
                            }

                        }else if(layer.layers){

                            try{

                                logger("Checking Folder Type");
                                if(node.name.indexOf("${css|screen") > -1){ 

                                    let screenSize = ltArgs(node.name,"css|screen");
                                    let cacheScreen = screenSize;

                                    logger("Rendering Responsive Screen: "+screenSize);
                                    if(cacheScreen != "default") cacheScreen = "screen"+cacheScreen;
                                    EXCache("screen",cacheScreen);

                                    if(EXCache("exportType") == "Android"){

                                        let screenSizeOut = "res/layout-w";
                                        if(screenSize.indexOf("-land") > -1){
                                            screenSize = screenSize.split("-land").join("");
                                            screenSizeOut += screenSize+"dp-land";
                                        }else{ screenSizeOut += screenSize+"dp"; }

                                        EXUtil.cacheFolder(screenSizeOut);
                                    }

                                    if(EXCache("exportType") == "Visual Studio") EXUtil.cacheFolder("Pages/Layouts");
                                  
                                }

                                if(node.name.indexOf("${css|styles}") > -1){ 
                                    logger("Rendering Styles");
                                    EXCache("styles",true); 
                                    EXCache("validate",false); 
                                }

                                logger("Rendering Child Layers");
                                if(node.name.indexOf("${global}") > -1){
                                    layer.name = "${css|style:ek_global} ek_global";
                                    _render(node, out, localize);
                                }else if(node.name.indexOf("${css|screen") > -1 && layer.isArtboard){ 
                                    _render(node, layer, localize);
                                    pageCache[EXUtil.cleanName(node.name.split('} ')[1])].layers.push(layer);
                                }else{
                                    _render(node, layer, localize);
                                }
             
                                if(node.name.indexOf("${css|styles}") > -1){ 
                                    EXCache("styles",false); 
                                    EXCache("stylesFolder",false);
                                    EXCache("validate",true); 
                                }

                                if(node.name.indexOf("${css|screen") > -1) EXCache("screen","default");

                            }catch(folderError){
                                 throw "[FOLDER: "+node.name+"] "+folderError;
                            }

                        }

                        logger("Adding Layer to Build");
                        if(
                            node.name.indexOf("${global}") == -1 
                            && !(node.name.indexOf("${css|screen") > -1 && layer.isArtboard)
                        ) out.layers.push(layer);

                    }catch(parseError){
                        throw "[PARSE] "+parseError;
                    }

                }

            });

        }else{

            logger("Rendering Layer | "+root.name);
            let layer = new EXLayer(root, localize._STACKORDER);

            logger("Adding Layer to Build");
            out.layers.push(layer);

        }

    }catch(renderError){
        throw "[RENDER] "+renderError;
    }

    return out;

}

let _lastLayerMap = "";
let _lastOutputType = "";
var _build = async function(output, onload){

    output.apiVersion = figma.apiVersion;

    if(exportKind().kind != exportKind().LAYER){ 
        await preBuild(); 
    }else{

        let layerMap = JSON.stringify(output.layers[0]);

        if(layerMap == _lastLayerMap && output.type == _lastOutputType) return;

        _lastLayerMap = layerMap;
        _lastOutputType = output.type;

    }

    events.dispatch(new events.EKEvent(events.EKEvent.EXPORT_BUILD,{output:output,outputKind:exportKind().kind}));

}

async function tools_set(){

    if(options.RUNNING) return;
    
    //docinfo
    if(figma.currentPage){
        try{
            events.dispatch(new events.EKEvent(events.EKEvent.TOOLS_DOCINFO,{
                name: figma.currentPage.selection[0] ? displayList.activeDocument().name : figma.root.name
                ,title: figma.currentPage.name
            }));
        }catch(e){ /* figma element removed */ return; }
    }

    //stats
    let doc = figma.currentPage;
    
    if(doc.selection.length > 0){ doc = displayList.activeDocument(); }
    
    try{ doc.children.map(test=>{test;}); }catch(e){ /* figma element removed */ return; }

    if(doc.children && doc.children.length > 0){

        let _stats = { 

            //base
            frames:0, layers:0, folders:0, text:0, shapes:0, images:0,

            //full
            masks:0, rectangles:0, ellipses:0, lines:0, vectors:0, polygons:0, 
            stars:0, operations:0, components:0, 

            map:[], filesize:0, screens:0, exporttime:0, exporttype:0

        };

        let _timeouts = [];
        let _map = async function(node){

            let _timeout = 200;
            if(_stats.layers > 2000) _timeout = 300;
            else if(_stats.layers > 4000) _timeout = 500;
            else if(_stats.layers > 6000) _timeout = 600;
            else if(_stats.layers > 8000) _timeout = 750;

            _timeouts[_timeouts.length] = setTimeout(async function(){

                try{ node.children.map(test=>{test;}); }catch(e){ /* figma element removed */ return; }

                let layerType, folderFX = false;
                let mapCount = 0;
                
                node.children.map(ele => {

                    try{ ele.name; }catch(e){ /* figma element removed */ return; }
                    if(ele.name.indexOf('${skip}') > -1) return;

                    _timeouts[_timeouts.length] = setTimeout(async function(){

                        try{ doc.name; }catch(e){ /* figma element removed */ return; }

                        if(doc.name == figma.currentPage.name && (figma.currentPage.selection[0] && doc.name != findLayerPage(figma.currentPage.selection[0]).name)){
                            _timeouts.map( t => { clearTimeout(t); } );
                            _timeouts = [];
                            return;  
                        }

                        let eleConstruct = ele.constructor.name;
                        if(ele.name.indexOf('${img}') > -1 || ele.name.indexOf('${image}') > -1) eleConstruct = "RectangleNode";

                        switch(eleConstruct){

                            case "FrameNode":

                                if(ele.name.indexOf('${css|styles}') > -1) return;
                                if(ele.parent.constructor.name == "PageNode"){ 
                                    if(ele.name.indexOf('${css|screen') > -1){ _stats.screens++ }
                                    else{
                                        _stats.frames++;
                                        _map(ele);
                                    }
                                }else{ 
                                    _stats.folders++;
                                    _timeouts[_timeouts.length] = setTimeout(fn => { _map(ele); }, _timeout*mapCount);
                                }

                                folderFX = (ele.fills && ele.fills[0]) ? true : false;
                                layerType = "folder";

                                break;
                            
                            case "RectangleNode":
                            case "EllipseNode":
                            case "LineNode":    
                            case "VectorNode":    
                            case "PolygonNode":    
                            case "StarNode":    
                            case "BooleanOperationNode": 

                                if(
                                    (ele.fills && ele.fills[0] && ele.fills[0].type == "IMAGE")
                                    || (ele.name.indexOf('${img}') > -1 || ele.name.indexOf('${image}') > -1)
                                ){
                                    _stats.images++;
                                    layerType = "image";
                                }else{
                                    _stats.shapes++;
                                    layerType = "shape";
                                }

                                _stats[ele.constructor.name.split('Node')[0].toLowerCase()+"s"]++;

                                break;
                                    
                            case "GroupNode":
                            case "ComponentNode":
                            case "InstanceNode":

                                _stats.folders++;
                                if(ele.children){
                                    if(ele.children.length > 0 && ele.children[0].isMask) _stats.masks++;
                                    _map(ele);
                                }

                                folderFX = (ele.fills && ele.fills[0]) ? true : false;
                                layerType = "folder";

                                if(ele.constructor.name == "ComponentNode" || ele.constructor.name == "InstanceNode") _stats.components++;

                                break;

                            case "TextNode":

                                _stats.text++;
                                _stats.filesize += 650;
                                layerType = "text";

                                break;

                        }

                        _stats.map.push({ name:ele.name, id:ele.id, type:layerType, cls:ele.constructor.name, folderFX:folderFX });
                        _stats.layers++;
                        _stats.filesize += 350;

                        _stats.exporttime = ((_stats.filesize/100) * 30);
                        if(_stats.layers > 1000) _stats.exporttime /= 4;
                        else if(_stats.layers > 150) _stats.exporttime /= 4.5;//_stats.exporttime / (_stats.layers / 105);
                        else _stats.exporttime /= 2;

                        _stats.exporttype = _stats.filesize/10000;

                        mapCount++;
                        if(mapCount == node.children.length) events.dispatch(new events.EKEvent(events.EKEvent.TOOLS_STATS,{stats:_stats})); 

                    },_timeout*mapCount);

                });

            },_timeout);
            
        }

        _map(doc); 
            
    }

}

setTimeout(tools_set,1500);

async function preBuild(){

    logger("Prebuild");
    let cacheFile, ren;

    try{

        let cache = EXCache("folderCache");
        if(cache != false){
            logger("Saving Cached Folders");
            for(let f in cache){
                cacheFile = cache[f];
                await EXUtil.createFolderPath(cacheFile);
            } 
        } 

    }catch(folderError){
        throw "[FOLDERS] "+cacheFile+" - "+folderError;
    }

    if(EXUtil.imageRenditions.length > 0){

        let imgFolder;

        try{

            logger("Saving All Images");
            for(var i=0;i<EXUtil.imageRenditions.length;i++){
                
                ren = EXUtil.imageRenditions[i];
                if(ren.processed) continue;

                imgFolder = await EXUtil.createFolderPath(ren.filePath);
                ren.outputFile = imgFolder;
                
                if(ren.type == "SVG"){

                    ren.node = await ren.node.exportAsync({
                        format: ren.type.toUpperCase(),
                        suffix: '',
                        svgOutlineText: true,
                    });

                }else{

                    ren.node = await ren.node.exportAsync({
                        format: ren.type.toUpperCase(),
                        suffix: '',
                        constraint: { type: 'SCALE', value: ren.scale },
                        contentsOnly: true,
                    });

                }

                ren.processed = true;
                EXUtil.imageRenditions[i] = ren;
            }
            
            EXCache("imageRenditions",EXUtil.imageRenditions);

        }catch(imageError){
            throw "[RENDITIONS] "+ren.name+" - "+imageError;
        }

    } 

}

types.registerEvents(EKEvent.prototype.constructor);
figma.ui.onmessage = async pluginMessage => { events.broadcast(new events.EKEvent(pluginMessage.type,pluginMessage.args)); }

let _document = { desc:"", author:"", ownerUrl:"", keywords:"", title:"", name:"" };
function DocumentInfo(type, documentInfo, _VERSION){

    let title =   _document.title == "" ? documentInfo.name : _document.title;
    let name =   _document.name == "" ? documentInfo.name : _document.name;

	return {
	    "layers" : []
	    ,"type" : type
	    ,"info" : {
	        "desc"  : _document.desc
	        ,"date" : Date.now()
	        ,"title" : title
	        ,"author" : _document.author
	        ,"ownerUrl" : _document.ownerUrl
	        ,"keywords" : _document.keywords
	        ,"file" : name+".fig"
	        ,"width" : documentInfo.width
	        ,"height" : documentInfo.height
	        ,"name" : name
	        ,"generator" : "Export Kit v"+_VERSION
	    }
	    ,"name" : EXUtil.cleanName(name)
	};
}

events.listen(events.EKEvent.TOOLS_DOCINFO_SAVE,function(e){
    Object.assign(_document, e.args);
});

events.listen(events.EKEvent.TOOLS_LAYER_FOUND,function(e){

    if(displayList.activeLayer().id == e.args) return;

    let _layer = e.args;
    let _node = figma.getNodeById(_layer);
    try{ _node.name; }catch(e){ /* figma element removed */ return; }
    figma.currentPage.selection = [_node];
    figma.viewport.scrollAndZoomIntoView([_node]);

});

events.listen(events.EKEvent.TOOLS_LAYER_EDIT,function(e){

    let _layer = e.args.id;
    let _node = figma.getNodeById(_layer);

    _node.name = e.args.name;

});

let _allDocuments, _activeDocument, _activeLayer, _selection, _selected;
const displayList = {

    allDocuments: function (){ return _allDocuments; }
    ,activeDocument: function (){ return _activeDocument; }
    ,activeLayer: function (){ return _activeLayer; }
    ,selection: function (){ return _selection; }
    ,selected: function (){ return _selected; }

}

let _OUTPUT = {};
let _VERSION = "1.3.figma";

const ekls = { Export: async function (root, type = "HTML5", kind = "DOCUMENT", onload = null) {

    exportKind(kind);
    if(kind == exportKind().DOCUMENT) options.RUNNING = true;
    logger("",true);

    let doc, localize, cleanName;

    try{

        try{

            logger("Generating Document Info");

            if(!root) root = displayList.allDocuments();
            doc = (root.children && root.children.length > 0) ? ((kind == exportKind().DOCUMENT) ? root : root.children[0]) : displayList.activeDocument();

            if(!displayList.activeDocument()) throw "Create your design first then select a Frame or the Canvas (nothing) and re-export.";

            if(
                kind == exportKind().DOCUMENT
                && (
                    (displayList.allDocuments.children > 0 && displayList.allDocuments.children[0].constructor.name != "FrameNode")
                    || displayList.activeDocument().constructor.name != "FrameNode"
                )
            ){
                logger("[WARNING] Frames must be top-level in your layers.");
                throw "Do not place your Frame Pages inside Groups.";
            }

            localize = this;
            cleanName = EXUtil.cleanName(doc.name);

            if(kind != exportKind().SPRITE){

                _OUTPUT = DocumentInfo(
                    type
                    ,doc
                    ,_VERSION
                );
                if(!doc.width){
                    _OUTPUT.info.width = root.children[0].width;
                    _OUTPUT.info.height = root.children[0].height;
                }

            }else{
                _OUTPUT = DocumentInfo(
                    type
                    ,displayList.activeDocument()
                    ,_VERSION
                );
            }

        }catch(buildError){
            throw "[INFO] "+buildError;
        }

        try{

        logger("Assign activeDocument");
        activeDocument(_OUTPUT);
        EXCache(0);
        
        if(root.constructor.name == "FrameNode") _autoBackground(root,_OUTPUT,99999);

        }catch(buildError){
            throw "[DOCUMENT] "+buildError;
        }

        if(kind == exportKind().DOCUMENT){

            try{

                logger("Creating Temp Folders");

                EXUtil.resScreen = "default";
                EXUtil.imageRenditions = [];

                EXCache(0);
                EXCache('exportType',type);
                EXCache('exportName',cleanName);

                await EXUtil.createFolders();
                this._STACKORDER = 0;

            }catch(buildError){
                throw "[TEMP] "+buildError;
            }

        }

        try{

            logger("Rendering and Building");
            _render(root, _OUTPUT, localize);
            await _build(_OUTPUT,onload);

        }catch(buildError){
            throw "[BUILD] "+buildError;
        }

    }catch(exportError){
        logger("[ERROR] "+exportError);
    }

} };

events.listen(events.EKEvent.EXPORT_LOG,function(e){
    logger(e.args);
});

events.listen(events.EKEvent.UPDATE,function(e){

    _allDocuments = e.args.root;
    _activeDocument = _allDocuments.children[0];
    _selection = e.args.selection;
    _selected = [];

    if(_selection.length > 0){

        _activeLayer = _selection[0];
        _activeDocument = findLayerPage(_selection[0]);

        _selection.map(sel => {
            if(sel.constructor.name == "FrameNode") _selected.push(sel.name);
        });

    }

});

function findLayerPage(node){
    try{ node.parent; }catch(e){ return ndoe; }
    while(node.parent && node.parent.constructor.name != 'PageNode'){ node = node.parent; }
    return node;
}

async function SaveLayerAsImage(selection, type = "png", scale = 1, prefix = "IMAGE"){

    let cleanName = EXUtil.cleanName(selection.name);

    logger("Saving Layer ["+cleanName+"] As "+type);
    await EXUtil.saveImage(cleanName+'.'+type,selection,type,scale);
    await preBuild();

    events.dispatch(new events.EKEvent(events.EKEvent.EXPORT_RENDITIONS,{name:cleanName,type:prefix}));  

}

async function SaveDocumentAsImage(scale = 1){
    await SaveLayerAsImage(displayList.activeDocument(),options.DEFAULT_EXPORT_IMAGE_TYPE,scale);
}

async function SaveDocumentAsWatermark(text, scale = 1){

    let activeDocument = displayList.activeDocument();
    let txt = figma.createText();
    let proof = '';

    for(var i=0; i<125; i++){ proof += text+' '; }

    txt.characters = proof;
    txt.resize(activeDocument.width*2,activeDocument.height*2);
    txt.opacity = 0.1;
    txt.fontSize = (activeDocument.height/10);

    activeDocument.appendChild(txt);

    let fileName = EXUtil.cleanName(activeDocument.name) + "_watermark." + options.DEFAULT_EXPORT_IMAGE_TYPE.toLowerCase();
    await EXUtil.saveImage(fileName,activeDocument,options.DEFAULT_EXPORT_IMAGE_TYPE,scale);
    await preBuild();

    events.dispatch(new events.EKEvent(events.EKEvent.EXPORT_RENDITIONS,{name:EXUtil.cleanName(activeDocument.name),type:"WATERMARK"})); 

    txt.remove(); 

}

async function SaveDocumentAsIcons(sizes = [], original = []){

    let ad = displayList.activeDocument();
    let imgFill = {"type":"IMAGE", "scaleMode":"FILL"};
    let newBytes = await ad.exportAsync({ format:'PNG', suffix:'', constraint:{ type:'SCALE', value:1 }, contentsOnly:true });

    sizes = sizes.reverse();

    for(var s=0; s<sizes.length; s++){

        let size = sizes[s];
        let tmpicon = figma.createRectangle();

        size[0] = parseInt(size[0]);
        size[1] = parseInt(size[1]);
        
        await tmpicon.resize(size[0],size[1]);
        
        imgFill.imageHash = figma.createImage(newBytes).hash;
        tmpicon.fills = [imgFill];
        ad.appendChild(tmpicon);

        let fileName = EXUtil.cleanName(ad.name)+"_"+size[0]+"x"+size[1]+".png";

        await ad.resize(size[0],size[1]);
        await EXUtil.saveImage(fileName,ad,options.DEFAULT_EXPORT_IMAGE_TYPE,1);
        await preBuild();

        tmpicon.remove();

    }

    await ad.resize(original[0],original[1]);
    events.dispatch(new events.EKEvent(events.EKEvent.EXPORT_RENDITIONS,{name:EXUtil.cleanName(ad.name),type:"ICONS"})); 

}

async function SaveResponsiveScreens(sizes = []){
    
    //sizes = sizes.reverse();
    
    let lWidth = parseInt(sizes[sizes.length-1][0]);
    let screens = figma.currentPage.children;
    let lastPos = [];
    let allScreenSizes = [];
    
    lastPos = [screens[0].x, screens[0].y];

    function organizeScreens(scrs){
        
        scrs.map( scr => {

            scr.x = lastPos[0];
            scr.y = lastPos[1];
            lastPos = [scr.x + lWidth + (lWidth/3), scr.y];

        });

        lastPos[0] = screens[0].x;
        lastPos[1] = scrs[0].y + scrs[0].height + (scrs[0].height/3);

    }

    sizes.map( size => {

        size[0] = parseInt(size[0]);
        size[1] = parseInt(size[1]);

        let newScreens = [];

        screens.map( scr => {

            if(scr.name.indexOf('${css|screen') > -1) return;
            if(scr.children && scr.children.length > 1){

                let content = figma.group(scr.children,scr);
                content.name = 'Content';

                if(scr.fills && scr.fills[0]){
                    
                    let bgRect = figma.createRectangle();
                    
                    content.insertChild(0,bgRect);
    
                    bgRect.x = 0;
                    bgRect.y = 0;
                    bgRect.resize(scr.width, scr.height);
                    bgRect.fills = scr.fills;
                    bgRect.name = 'BG';
    
                }
                
            }

            let newScreen = scr.clone();

            if(options.RESPONSIVE_SCREEN_CONSTRAIN) newScreen.resize(size[1],newScreen.height);
            else newScreen.rescale(size[1]/newScreen.width);

            newScreen.name = "${css|screen:"+size[0]+"} "+newScreen.name;
            newScreens.push(newScreen);

        });

        allScreenSizes.push(newScreens);

    });
    
    organizeScreens(screens);
    allScreenSizes.reverse();
    allScreenSizes.map( scr => { organizeScreens(scr); } );

    figma.currentPage.name += " (Screens"+(options.RESPONSIVE_SCREEN_CONSTRAIN ? " +Constrain" : "")+")";
    figma.viewport.scrollAndZoomIntoView(figma.currentPage.children);

}

events.listen(events.EKEvent.UPDATE,function(e){
    events.dispatch(new events.EKEvent(events.EKEvent.LAYERS_REFRESH));  
});

events.listen(events.EKEvent.LAYERS_SAVE_IMAGE,async function(e){
    await SaveLayerAsImage(displayList.selection()[0],e.args);
});

events.listen(events.EKEvent.IMAGES_SNAP,async function(e){
    if(options.WATERMARK_TEXT == "") await SaveDocumentAsImage(options.SNAP_SHOT_SIZE / 100);
    else await SaveDocumentAsWatermark(options.WATERMARK_TEXT, (options.SNAP_SHOT_SIZE / 100));
});

events.listen(events.EKEvent.IMAGES_ICON,async function(e){

    let activeDocument = displayList.activeDocument();
    let originalSize = [activeDocument.width, activeDocument.height];
    let icon_sizes = e.args.split(',');
    let size_map = [];

    icon_sizes.map(size => {
        let sizes = size.split(':');
        if(!sizes[1]) sizes[1] = sizes[0];
        size_map.push(sizes);
    });

    await SaveDocumentAsIcons(size_map,originalSize);

});

events.listen(events.EKEvent.TOOLS_RESPONSIVE_CREATE,async function(e){

    let _sizes = e.args.split(',');
    let size_map = [];

    _sizes.map(size => {
        let sizes = size.split(':');
        if(!sizes[1]) sizes[1] = sizes[0];
        size_map.push(sizes);
    });

    await SaveResponsiveScreens(size_map);

});

events.listen(events.EKEvent.EXPORT_NOW,function(e){

    let type = e.args;
    let ele = displayList.allDocuments();
    
    if(figma.currentPage.selection.length > 0) ele = displayList.activeDocument();
    ekls.Export(ele,type); 
    
  });

let _lastUpdate = new Date('-4 second');
events.listen(events.EKEvent.LAYERS_REFRESH,function(e){

  if(!options.LAYERS_REFRESH) return;
  if((new Date()) - _lastUpdate < 1500){
    setTimeout(getLayerInfo, 1500);
    return;
  }

  setTimeout(getLayerInfo, 20);

});

events.listen(events.EKEvent.OPTION,function(e){
    Object.assign(options,e.args);
});

let _lastFrameName = "-_-ek-_-all-_-frames-_-";
var __update = setInterval(function(){

    let frameName = '-_-ek-_-all-_-frames-_-'; 
    
    if(figma.currentPage.selection.length == 0 && !displayList.activeDocument()) return;
    if(figma.currentPage.selection.length > 0) try{ frameName = displayList.activeDocument().name; }catch(e){}
    if(_lastFrameName != frameName) tools_set();

    _lastFrameName = frameName;

    if(figma.currentPage.selection.length == 0) return;
    events.dispatch(new events.EKEvent(events.EKEvent.UPDATE,{root:figma.currentPage, selection:figma.currentPage.selection}));

},1250);

//figma pre-select
if(figma.currentPage.children.length > 0) figma.currentPage.selection = [figma.currentPage.children[0]];
events.dispatch(new events.EKEvent(events.EKEvent.UPDATE,{root:figma.currentPage, selection:figma.currentPage.selection}));

setTimeout(async function(){
    await figma.loadFontAsync({family:"Roboto",style:"Regular"})
    figma.currentPage.selection = [];
},1000);

function getLayerInfo(){
    if(options.RUNNING) return;
    ekls.Export(displayList.activeLayer(),options.OUTPUT_LAYERS_TYPE,exportKind().LAYER);
}
  