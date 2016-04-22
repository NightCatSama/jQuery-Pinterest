# jQuery-Pinterest
基于jQuery编写的瀑布流图片墙插件

[DEMO](http://nightcatsama.github.io/jQuery-Pinterest/)

###HTML
```html
<link rel="stylesheet" href="css/Pinterest.css">
.
.
<script src="js/jquery-1.12.0.min.js"></script>
<script src="js/Pinterest.js"></script>
```

###Javascript
```js
  $('.container').pinterest( option );   //or $('#container').pinterest( option ) 支持同时设置多个
```

###Option
<br>
<br>
***********当option为空或者 Object 对象时，形成瀑布流图片墙*************
<br>
[ html中的图片的data-title="大标题" data-subtitle="小标题" ]

####Example
```js
  $('.container').pinterest({
    line： 4               //瀑布流列数( 默认 4列 )
    gap： 15               //瀑布流间距( 默认 15px间隔 )
    width： {auto}         //图片宽度（一般不设置，图片宽度自动按容器宽度分配,当容器没设置宽度时,则按照页面宽度自动分配）
  });
```
<br>
***********当option为String时，为添加删除瀑布流图片*************
<br>
####Example
```js
  $('.container').pinterest('add', 'images/picture.jpg', "大标题", "小标题");  //[ 标题为可选 ]
  $('.container').pinterest('remove', 1);  //[ 1为图片所在索引,为空则删除所有图片 ]
```
