exports.start = async (item, path, PSD, psd)=>{
	return await new Promise((resolve, reject) =>{
		psd.parse();
    let imagesSaved = 0;
		let totalImages = 0;
		psd.tree().descendants().forEach((node) => {
			if(node.name == 'Item'){
        totalImages = node._children.length;
				node._children.forEach((layer) =>{
					PSD.open(`${path}/${item}/${item}.psd`).then(function (psd) {
							return layer.layer.image.saveAsPng(`${path}/${item}_${layer.layer.name}.png`);
						}).then(function () {
						console.log(`Saved ${item}_${layer.layer.name}.png at ${path}`);
						imagesSaved += 1;
					})
				})
			}
		});
		function waitImage(){
			if(imagesSaved === totalImages){
				setTimeout(()=>{
					resolve('Finished!');
				}, 3000)
			}else{
				setTimeout(waitImage, 1000 / 60)
			}
		}
		setTimeout(waitImage, 1000 / 60)
	})
}