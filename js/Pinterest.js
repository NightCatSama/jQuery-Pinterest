;(function(w, d, $, undefined) {
	/**
	 * 拖拽图片状态
	 * flag 可拖拽标志
	 * startX, startY 拖拽起点
	 * left, top 拖拽位置
	 */
	var ImgStatus = {
			flag: false,
			startX: 0,
			startY: 0,
			left: 0,
			top: 0
		}

	/* ******************* 瀑布流构造函数 ********************* */
	var Pinterest = function(elem, config) {
		this.$elem = elem;
		this.$imgs = this.$elem.find('img');
		this.images = [];
		this.config = config;
		this.streams = [];
		this.line = config.line ? config.line : 4;
		this.gap = config.gap ? config.gap : 15;
		this.width = config.width ? config.width : this.getWidth();
	}

	Pinterest.prototype = {
		/**
		 * 得到每列瀑布流宽度和图片宽度
		 * @return {number} [default: 200]
		 */
		getWidth: function() {
			var width = this.$elem.width();
			var index = this.line + 1;
			return width ? (width - (this.gap * index)) / this.line : 200;
		},
		/**
		 * 得到当前最短的瀑布流
		 * @return {number} [瀑布流序号]
		 */
		getMinStreams: function() {
			var that = this;
			var min = that.streams[0].height();
			var index = 0;
			for (var i = 1; i < that.line; i++) {
				var height = that.streams[i].height();
				if (min > height) {
					min = height;
					index = i;
				}
			};
			return index;
		},
		/**
		 * 插件绑定事件
		 */
		onEvent: function(){
			//图片全屏显示
			this.$elem.on('click', 'img', this.fullScreen);
			//显示完整图片
			$(d).on('click', '.priterest-full-img', this.fullImg);
			//完整图片缩小
			$(d).on('click', '.priterest-shrink-btn', this.shrinkImg);
			//完整图片拖动
			$(d).on('mousedown', '.priterest-big-img', this.dragImg);
			$(d).on('mousemove', '.priterest-big-img', this.moveImg);
			$(d).on('mouseup', '.priterest-big-img', this.dropImg);
			$(d).on('mouseout', this.dropImg);
		},
		/**
		 * 设置图片下方标题
		 * @param { dom } img
		 */
		setTitle: function(img) {
			var __this = img;
			var that = this;
			var title = $(__this).data('title');
			var subTitle = $(__this).data('subtitle');
			var $img_wrap = $("<div class='pinterest-img-wrap' style='margin-top:" + that.gap + "px'></div>");
			$(__this).wrap($img_wrap);
			if (subTitle) {
				var $img_subtitle = $("<div class='pinterest-img-subtitle'>" + subTitle + "</div>");
				$img_subtitle.insertAfter($(__this));
			}
			if (title) {
				var $img_title = $("<div class='pinterest-img-title'>" + title + "</div>");
				$img_title.insertAfter($(__this));
			}
		},
		/* ******************* 瀑布流初始化 ********************* */
		init: function() {
			var that = this;
			for (var i = 0; i < this.line; i++) {
				that.streams.push($("<div class='pinterest-stream' style='width:" + that.width + "px; margin-left:" + that.gap + "px; margin-bottom:" + that.gap + "px;'></div>"));
				that.streams[i].appendTo(this.$elem);
			};
			that.$imgs.width(that.width);
			$.each(that.$imgs, function(i, v) {
				var index = that.getMinStreams(); //得到当前最短的瀑布流
				that.$imgs.eq(i).appendTo(that.streams[index]);
			});

			//为实例绑定事件
			that.onEvent();

			//图片下方显示标题( 遍历单个绑定 - 方便添加新图时片绑定 )
			that.$imgs.each(function(i, v) {
				that.setTitle(v);
			});
		},
		/**
		 * 为瀑布流添加图片
		 * @param { Array[ src, {title}, {subtitle} ] } parameter     [ src: 图片路径 | title: 主标题 | subtitle: 副标题 ]
		 */
		add: function(parameter) {
			var $img = $("<img src=" + parameter[0] + " />");
			if (parameter[1]) {
				$img.attr('data-title', parameter[1]);
			}
			if (parameter[2]) {
				$img.attr('data-subtitle', parameter[2]);
			}
			$img.width(this.width);
			this.$imgs.push($img[0]);
			var index = this.getMinStreams();
			$img.appendTo(this.streams[index]);
			this.setTitle($img[0]);
		},
		/**
		 * 移除图片
		 * @param { int } index 图片序号
		 */
		remove: function(index) {
			index = parseInt(index);
			if (index === undefined) {
				this.$elem.children().remove();
				return false;
			}
			var i = index < 0 ? (index + this.$imgs.length) : index;
			this.$imgs.eq(i - 1).parent().remove();
		},
		/**
		 * 全屏显示图片
		 */
		fullScreen: function() {
			var $wrap = $("<div class='priterest-wrap'></div>");
			var $fade = $("<div class='priterest-fade'></div>");
			var $full_img = $("<img src=" + this.src + " class='priterest-full-img priterest-off'/>");

			//遮罩层点击事件
			$fade.click(function() {
				$wrap.remove();
			});

			$wrap.append($fade);
			$wrap.append($full_img);
			$wrap.appendTo('body');

			//当全屏图片小于等于完整图片时, 放大无效
			if( $full_img[0].naturalWidth <= $full_img.width() ){
				$full_img.css('cursor', 'default');
			}
			else {
				var $shrink_btn = $("<a class='priterest-shrink-btn'></a>");
				$shrink_btn.css('cursor', setCursor('zoom-out'));
				$full_img.css('cursor', setCursor('zoom-in'));
				$wrap.append($shrink_btn);
			}

			//将全屏图片出现效果交付给CSS样式, 方便插件使用者自定义
			setTimeout(function(){
				$full_img.removeClass('priterest-off');
			},0);
		},
		/**
		 * 显示完整图片
		 */
		fullImg: function() {
			if (!$(this).hasClass('priterest-big-img') && this.width < this.naturalWidth ) {
				$(this).css("cursor", setCursor('grab')).addClass('priterest-big-img');
				$('.priterest-shrink-btn').show();
			}
		},
		/**
		 * 缩小完整图片
		 */
		shrinkImg: function() {
			$('.priterest-full-img').css({
				"left": "50%",
				"top": "50%",
				'cursor': setCursor('zoom-in')
			}).removeClass('priterest-big-img');
			$(this).hide();
		},
		/**
		 * 设置图片初始状态
		 */
		dragImg: function(event) {
			event.preventDefault();
			$(this).css("cursor", setCursor('grabbing'));

			ImgStatus.flag = true;
			ImgStatus.startX = event.pageX;
			ImgStatus.startY = event.pageY;
			ImgStatus.left = parseInt(w.getComputedStyle(this, null)['left']);
			ImgStatus.top = parseInt(w.getComputedStyle(this, null)['top']);
		},
		/**
		 * 拖拽图片位置改变
		 */
		moveImg: function(event) {
			if (ImgStatus.flag) {
				this.style.left = (event.pageX - ImgStatus.startX + ImgStatus.left) + 'px';
				this.style.top = (event.pageY - ImgStatus.startY + ImgStatus.top) + 'px';
			}
		},
		/**
		 * 拖拽结束
		 */
		dropImg: function() {
			ImgStatus.flag = false;
			$(this).css('cursor', setCursor('grab'));
		}
	};
	/**
	 * @return { string } [ 根据浏览器修改cursor属性 ]
	 */
	(function() {
		var v = navigator.userAgent;
		var prefix = v.indexOf('AppleWebKit') > -1 ? "-webkit-" : v.indexOf('Firefox') > -1 ? "-moz-" : ((v.indexOf('Trident') > -1 && v.indexOf('rv:11') > -1) || u_agent.indexOf('MSIE') > -1) ? 'IE' : '';

		return setCursor = function(prop) {
		 	if( prop === 'grabbing' || prop === 'grab'){
		 		if (prefix === 'IE') {
					return "move";
				} else {
					return prefix + prop;
				}
		 	}
		 	if( prop === 'zoom-in' || prop === 'zoom-out'){
		 		if (prefix === 'IE') {
					return "pointer";
				} else {
					return prop;
				}
		 	}
		};
	})();

	/**
	 * 瀑布流插件入口
	 * @param { object[ {line}, {gap}, {width} ] } option      [ line: 瀑布流列数 | gap: 瀑布流间距 | width: 瀑布流宽度 ]
	 * 	      { string } option  [ "add", "remove" ]           [ "add": 第二个参数为图片路径(必须), 第三个参数为主标题, 第四个参数为副标题]
	 * 	                                                       [ "remove": 第二个参数为删除图片的序号( 为空时清空图片 ) ]
	 */
	$.fn.pinterest = function(option) {
		var config = option ? option : {};
		var arg = arguments;

		return this.each(function() {
			var $this = $(this),
				data = $this.data('pinterest');

			if (!data) {
				$this.data('pinterest', (data = new Pinterest($this, config)));
			}

			if (typeof config === 'string') {
				var parameter = Array.prototype.slice.call(arg, 1);
				switch (config) {
					case 'add':
						{
							data.add(parameter);
							break;
						}
					case 'remove':
						{
							data.remove(parameter);
							break;
						}
					default:
						{
							data.init();
							break;
						}
				}
			} else {
				data.init();
			}
		});
	}
})(window, document, jQuery)