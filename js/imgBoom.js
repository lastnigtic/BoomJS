	/*传入ID*/
	(function(){
		function imgBoom(option,img,order){
			option = option || {};
			this.drwImg = img;
			this.img = $(img);
			this.order = order;
			this.rows = option.rows || 8;
			this.columns = option.columns || 8;
			this.duration = option.duration || 1000;
			this.isBlur = option.isBlur || false;
			this.isBoom = option.isBoom || false;
			this.isCanvas = option.isCanvas || true;
			this.isInit = true;
			this.animationDuration = 0;
			this.direction = option.direction || 'center';

			if(this.drwImg.complete){
				this.height = this.img.height();
				this.width = this.img.width();
				this.init();
			}else{
				this.drwImg.onload = () => {
					this.height = this.img.height();
					this.width = this.img.width();
					this.init();
				};
			}
		}
		/**
		 * 初始化
		 */
		 imgBoom.prototype.init = function(){
		 	if(!canvasSupport()){
		 		this.createPieces();
		 	}else{
		 		this.isCanvas ? this.createPiecesCan() : this.createPieces();
		 	}
		 	this.piecesBoom();
		 	// 确保爆炸先执行再复原,考虑多个
		 	var timer = setInterval(() => {
		 		if(!this.isInit){
		 			setTimeout(() => {
		 				this.piecesRecover();
		 			},this.duration/2);
		 			clearInterval(timer);
		 		}
		 	},100);
		 	if(this.isBoom){
		 		this.img.on('click',() => {
		 			this.piecesBoom();
		 		})
		 	}
		 }

		 /**
		  * canvas块
		  */
		  imgBoom.prototype.createPiecesCan = function(){
		  	let id = this.img.attr('id');
		  	let can = document.createElement('canvas');
		  	can.height = this.height;
		  	can.width = this.width;
		  	let ctx = can.getContext('2d');
		  	ctx.drawImage(this.drwImg , 0, 0, this.width, this.height);
		  	this.pieces = [];

			//存放pieces的块
			this.children = $("<div></div>");
			this.children.css({
				'position': 'absolute',
				'top': 0,
				'left': 0,
				'margin-left': this.img.prop('offsetLeft') + 'px',
				'margin-top': this.img.prop('offsetTop') + 'px',
				'z-index': 100,
				'display': 'none'
			});
			this.children.attr('id', id+'Children');

			// 创造piece
			let pieceHeight = this.height / this.rows;
			let pieceWidth = this.width / this.columns; 
			let frag = document.createDocumentFragment();
			let transition = `all ${this.duration}ms ease-out`;
			for(let i = 0; i < this.columns; i++){
				let left = '-' + (pieceWidth * i) + 'px';
				for( let j = 0; j < this.rows; j++){
					let top = '-' + (pieceHeight * j) + 'px';
					let child = document.createElement('canvas');
					child.height = pieceHeight;
					child.width = pieceWidth;
					let childctx = child.getContext('2d');
					let imageData = ctx.getImageData(i*pieceWidth, j*pieceHeight, pieceWidth, pieceHeight);
					childctx.putImageData(imageData, 0, 0);
					$(child).css({
						'position': 'absolute',
						'left': left.substring(1),
						'top': top.substring(1),
						'transition': transition,
					});

					$(frag).append(child);
					this.pieces.push($(child));
				}
			};
			this.children.append(frag);
			this.children.insertAfter(this.img);
		};
		/**
		 * 创造块(单独负责创造小块)
		 */
		 imgBoom.prototype.createPieces = function(){
		 	let id = this.img.attr('id');
		 	this.pieces = [];

			//存放pieces的块
			this.children = $("<div></div>");
			this.children.css({
				'position': 'absolute',
				'top': 0,
				'left': 0,
				'margin-left': this.img.prop('offsetLeft') + 'px',
				'margin-top': this.img.prop('offsetTop') + 'px',
				'z-index': 100,
				'display': 'none'
			});
			this.children.attr('id', id+'Children');

			// 创造piece
			let pieceHeight = this.height / this.rows;
			let pieceWidth = this.width / this.columns; 
			let frag = document.createDocumentFragment();
			let background = `url(${this.img.attr('src')}) no-repeat`;
			let backgroundSize = `${this.width}px ${this.height}px`;
			let transition = `all ${this.duration}ms ease-out`;
			for(let i = 0; i < this.columns; i++){
				let left = '-' + (pieceWidth * i) + 'px';
				for( let j = 0; j < this.rows; j++){
					let top = '-' + (pieceHeight * j) + 'px';
					let child = $("<div class='boom-img-child'></div>");
					child.css({
						'position': 'absolute',
						'display': 'inline-block',
						'left': left.substring(1),
						'top': top.substring(1),
						'height': pieceHeight + 'px',
						'width': pieceWidth + 'px',
						'background': background,
						'background-size':backgroundSize,
						'background-position-x': left,
						'background-position-y': top,
						'transition': transition,
					});
					$(frag).append(child);
					this.pieces.push(child);
				}
			};
			this.children.append(frag);
			this.children.insertAfter(this.img);
		};

		/**
		 * 块爆炸,调整块的位置，让img隐藏，children显示
		 */
		 imgBoom.prototype.piecesBoom = function(){

			// 调整块的位置
			if(this.children){
				this.children.css({
					'margin-left': this.img.prop('offsetLeft') + 'px',
					'margin-top': this.img.prop('offsetTop') + 'px'
				})
			};

			// 设置爆炸方向 
			var i,
			deal,
			init = 0,
			total = this.rows*this.columns;

			if(this.isInit){
				i = 0;
				deal = () => {
					init++;
					if(init == total){
						this.isInit = false;
					}
				};
			}else{
				if(this.direction === 'left'){		
					i = 0;
					deal = () => {
						i++;
					};
					this.animationDuration = total*5;
				}else if(this.direction === 'right'){
					i = total;
					deal =() => {
						i--;
					};
					this.animationDuration = total*5;
				}else{
					i = 0;
					deal = () => {};
				}
			};

			setTimeout(() => {

				$(this.pieces).each((idx, item) => {
					(function(t){
						setTimeout(()=>{
							let x = (100-(Math.random()*200)).toFixed() + 'px';
							let y = (100-(Math.random()*200)).toFixed() + 'px';
							let transformPosition = `translate3D(${x}, ${y} ,0) `;
							let transformSize = `scale(${(Math.random()/2)})`;
							let  blur;

							if(this.isBlur){
								blur = `blur(${(Math.random()*10).toFixed()}px)`;
							}else{
								blur = 'none';
							}

							item.css({
								'border-radius':'50%',
								'transform': transformPosition + transformSize,
								'opacity': 0,
								'filter': blur
							});
						},t*5);
					}(i))
					deal();
				});
				this.img.css('opacity',0);
			},0);

			// 点击图片(删除全部元素)
			if(!this.isInit){
				this.children.show();
				setTimeout(() => {
					this.img.remove();
					this.children.remove();
				},this.duration+this.animationDuration+100);
			}
		};

		/**
		 * 块恢复,children隐藏,img显示(opacity)
		 */
		 imgBoom.prototype.piecesRecover = function(){	
		 	this.children.show();
		 	$(this.pieces).each((idx, item) => {
		 		item.css({
		 			'transform': 'none', 
		 			'opacity': 1,
		 			'filter':'none',
		 			'border-radius': '0px'
		 		})
		 	});
		 	setTimeout(()=>{
		 		this.img.css('opacity',1);
		 		this.children.hide();
		 	},this.duration);
		 };

		 function canvasSupport() {
		 	return !!document.createElement('canvas').getContext;
		 };

		 jQuery.fn.extend({
		 	imgBoom: function(option){
		 		option = option || {};
		 		for(let i = 0;i < this.length; i++){
		 			this[i].style.opacity = 0;
		 			setTimeout(()=>{
		 				new imgBoom(option, this[i], i);
		 			},i*(option.spaceTime ? option.spaceTime : 1000));
		 		}
		 		return this;
		 	}
		 });
		})()