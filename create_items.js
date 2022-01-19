const fs = require('fs')
var PSD = require('psd')
const item = 'name of the item'; //Write the name of the item
var psd = PSD.fromFile(`./items/${item}/${item}.psd`); //Do not change this
const imagesPath = `./items`; //Do not change this
const spriteSheetPath = `C:/Users/path/to/sprite_sheet`; //Path to where the sprite sheet will be created
const spriteSheetJsonPath = `C:/Users/path/to/sprite_sheet_json`; //Path to where the sprite sheet json will be created
const jsonName = 'items'; //Do not change this
const imageName = 'items'; //Do not change this
let dirImages = fs.readdirSync(imagesPath); //Read the data from the directory of your images
const packer = 'MaxRectsBin'; //Change it if you want
//Options of packerMethod = BestShortSideFit, BestLongSideFit, BestAreaFit, BottomLeftRule, ContactPointRule
const packerMethod = 'BestLongSideFit'; //Change it if you want
const crete_json_and_png = require('./scripts/create'); //Do not change this
const create_frame_pngs = require('./scripts/create_pngs'); //Do not change this

create_frame_pngs.start(item, imagesPath, PSD, psd).then(()=>{
	crete_json_and_png.start(fs, item, psd, imagesPath, spriteSheetPath, spriteSheetJsonPath, jsonName, imageName, dirImages, packer, packerMethod);
})