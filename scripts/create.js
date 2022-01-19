exports.start = (fs, item, psd, imagesPath, spriteSheetPath, spriteSheetJsonPath, jsonName, imageName, dirImages, packer, packerMethod ) =>{
	var images = new Array();

	const texturePacker = require("free-tex-packer-core");
	
	psd.parse();
	let birds_pivot = new Array();
	let items_pivot = new Array();
	
	psd.tree().descendants().forEach(node => {
		if(node.name.includes('Bird') == true){
			birds_pivot.length = node._children.length;
			node._children.forEach((bird)=>{
				let bird_pivot = {x: bird.coords.left + (bird.width / 2), y: bird.coords.bottom}
				birds_pivot[bird.name] = bird_pivot;
			})
		}
		if(node.name.includes('Item') == true){
			items_pivot.length = node._children.length;
			node._children.forEach((item) =>{
				let item_pivot = {x: item.coords.left + (item.width / 2), y: item.coords.top}
				items_pivot[item.name] = item_pivot;
			})
		}
	});
	
	for(let i = 1; i < birds_pivot.length; i++){
		items_pivot[i].x -= birds_pivot[i].x;
		items_pivot[i].y -= birds_pivot[i].y;
	}
	
	dirImages.filter((file)=>{
		if(file.includes('.png') == true && file !== 'items.png'){ //Gets the files that have the prefix wanted
			images.push({path: file, contents: fs.readFileSync(`${imagesPath}/${file}`)});
		}
	})
	
	texturePacker(images, {allowRotation: false, packer: packer , packerMethod: packerMethod, exporter:"Pixi", textureName: item}, (files, error) => {
		if (error) {
			return	console.log(error);
		} else {
			let item_name = item;
			originalJson = JSON.parse(fs.readFileSync(`${spriteSheetJsonPath}/${jsonName}.json`, 'utf-8'));
			for(let item of files){
				if(item.name.includes('.json')){
					let wholeBuffer = JSON.parse(item.buffer);
					let frame = wholeBuffer.frames;
					for(let images in frame){
						let newPos = items_pivot[images.split('.png')[0].split(`${item_name}_`)[1]]; //Get the pos object
						if(newPos !== undefined){
							frame[images].position = {x: newPos.x, y: newPos.y}
						}else if(originalJson.frames[images] !== undefined && originalJson.frames[images].position !== undefined){
							frame[images].position = originalJson.frames[images].position
						}
					}
					wholeBuffer.frames = frame;
					wholeBuffer.meta.image = `../Sprites/items/items.png`;
					item.buffer = Buffer.from(JSON.stringify(wholeBuffer, null, 2));
					fs.writeFile(`${spriteSheetJsonPath}/${jsonName}.json`, item.buffer, function(err) {
						if(err) {
							return console.log(err);
						}
						console.log(`${jsonName}.json was saved at ${spriteSheetJsonPath}`);
					});
				}else{
					fs.writeFile(`${spriteSheetPath}/${imageName}.png`, item.buffer, function(err) {
						if(err) {
							return console.log(err);
						}
						console.log(`${imageName}.png was saved at ${spriteSheetPath}`);
					});
				}
			}
	
		}
	});
}