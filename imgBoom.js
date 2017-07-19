	/*传入ID*/
	function imgBoom(option){
		this.img = option.img;
		this.rows = option.rows;
		this.columns = option.columns;
		this.isInit = true;
		this.arr = ['margin-left', 'margin-top'];
		$(this.img).css('opacity',0);
		this.img.onload = () => {
			this.height = $(this.img).height();
			this.width = $(this.img).width();
			this.init();
		}
		return this;
	}
	// 点击事件
	imgBoom.prototype.init = function(){
		this.createPieces();
		this.piecesBoom();
		this.isInit = false;
		setTimeout(() => {
			this.piecesRecover()
		},1000);
		$(this.img).on('click',() => {
			this.piecesBoom();
		})
	}

	// 创造块
	imgBoom.prototype.createPieces = function(){
		let id = this.img.id;
		this.pieces = [];
		this.children = $("<div></div>");
		$(this.children).css({
			'position': 'absolute',
			'top': 0,
			'left': 0,
			'margin-left': this.img.offsetLeft + 'px',
			'margin-top': this.img.offsetTop + 'px',
			'z-index': 100,
			'display': 'none'
		});
		this.children.attr('id', id+'Children');

		let pieceHeight = this.height / this.rows;
		let pieceWidth = this.width / this.columns; 
		let frag = document.createDocumentFragment();
		let background = 'url('+this.img.src+')'+' no-repeat';
		let backgroundSize = this.width + 'px' +' '+this.height + 'px';
		for(let i = 0; i < this.columns; i++){
			let left = '-' + (pieceWidth * i) + 'px';
			for( let j = 0; j < this.rows; j++){
				let top = '-' + (pieceHeight * j) + 'px';
				let child = $("<div class='boom-img-child'></div>");
				$(child).css({
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
					'transition': 'all 1s ease-out',
				});
				$(frag).append(child);
				this.pieces.push(child);
			}
		}
		$(this.children).append(frag);
		$(this.children).insertAfter(this.img);
	};

	// 块爆炸,让img隐藏，children显示
	imgBoom.prototype.piecesBoom = function(){
		// 不是初始化
		if(!this.isInit){
			$(this.img).css('opacity',0);
			$(this.children).show();
			setTimeout(() => {
				$(this.img).remove();
				$(this.children).remove();
			},2000);
		}
		setTimeout(() => {
			$(this.pieces).each((idx, item) => {
				let random = Math.round(Math.random());
				let position = this.arr[random];
				let transform = 'scale('+(Math.random()/2)+')';
				$(item).css(position, Math.random()*100+'px');
				$(item).css({
					'border-radius':'50%',
					'transform': transform,
					'opacity': 0,
					'filter': 'blur(10px)'
				});
			});
		},0);		
	};
	// 块恢复,children隐藏,img显示(opacity)
	imgBoom.prototype.piecesRecover = function(){	
		$(this.children).show();
		$(this.pieces).each((idx, item) => {
			$(item).css({'margin':0,'transform': 'none', 
				'opacity': 1,'filter':'none',
				'border-radius': '0px'})
		});
		setTimeout(()=>{
			$(this.children).hide();
			$(this.img).css('opacity',1);
		},1000);
	};