# 豆丁文档

## 项目介绍

这个[豆丁网](https://www.docin.com/)也是我无意间发现的，然后点进去看了一下，发现挺多不错的文档、PPT 等等...

它有些文档，全部内容都已经在前端已经全部展现出来了，但下载需要付费。

所以，我就想写一个能够在线将这些文档、PPT 等等...转为图片并保存。

以上，便是这个脚本的由来。

<div class="tip custom-block">

<p class="tip">Tip：</p>

我的每个脚本都会结合着视频讲解，如果懒得看字的朋友，可以直接看视频。

我对编程有很大的兴趣爱好，也喜欢分享这些有意思的脚本。

由于我的技术有限，并且大多数时间和精力都花在了工作上。

如果我哪里有写错了的，欢迎<span style="color: #fb7299">[哔哩哔哩](https://space.bilibili.com/20923960)</span>私信我提出，红豆泥阿里嘎多！！

</div>

## 解析网站

1. **查看资源的网页元素，我们按下 <u>F12</u>，随后定位到资源处，可以发现是 <u>canvas</u> 元素。**

2. **我们滚动网页时，可以发现，它的资源是<u>懒加载</u>的，有些朋友可能不知道<u>懒加载</u>是啥意思，我这里通俗易懂地说一下**

   - 假如有 50 页文档，在网页加载完成后，它并不是 50 页的文档全部都已经加载好了的。

   - 它可能只加载了前面 5 页，剩余 45 页的文档，需要我们滚动页面之后才会一张一张加载。

   - 假设，当我们滚到第 6 页的文档时，这时候，前端就会向后端发送请求，获取文档资源。

   - 第 7 页、第 8 页等等...我们以此类推，是不是只有我们不断滚动，文档资源才会不断加载

   - 直到滚到页面底部，全部文档资源才会加载完成，而这，就是<u>**懒加载**</u>

3. **遇到了有预览范围的文档后，我测试了一下范围之外的文档页能否通过 Ajax 请求拿到文档资源，答案是，<u>不行</u>！**

   - 状态码为 <u>**510**</u>，说明服务端做了验证，无法获取文档资源

## 了解需求

<div style="padding-bottom: 4px">

1. **预览当前所有的资源，如文档、PPT 等等...**

2. **将网页中对应的多个 canvas 元素转为图片，并打包成压缩包下载**

<div class="tip custom-block">

<p class="tip">吐槽：</p>

- 之所以打包成压缩包下载，就是因为图片多的时候，点下载点到手发麻，直接压缩包比较省事

- 一开始的话，其实是没有预览文档的，只有一个下载按钮，但我觉得有点不好看，所以加了个预览文档

</div>

</div>

## 脚本难点

### 1. 如何将 canvas 元素转为图片并打包为压缩包保存。

<div style="margin-top: 12px">

#### 1-1 canvas 元素的 toBlob()方法，可以将 canvas 元素和第三方库 JSZip、FileSaver 实现！

```js
// 先导入两个第三方库
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.0/FileSaver.min.js

/**
 * 以下为下载单张图片并打包为压缩包的方法，仅供示例，详细可到核心代码（右侧导航栏）查看！
 */

const jsZip = new JSZip(); // 声明一个jsZip对象

// canvas元素的toBlob方法，传入一个回调函数，回调函数内接收blob对象
HTMLCanvasElement.toBlob((blob) => {
	jsZip.file(imgName, blob); // 调用file方法，传入保存的图片名称和blob对象

	// 调用generateAsync方法，返回一个期约，并且传递的值为全部图片的blob对象
	jsZip.generateAsync({ type: "blob" }).then((content) => {
		saveAs(content, `zipName.zip`); // FileSaver库中的saveAs方法，打包成压缩包
	});
});
```

</div>

### 2. 如何在页面不滚动的情况下，加载全部 canvas 元素。

<div style="margin-top: 12px">

#### 2-1 设置 id 为 page\_ 开头的元素的 CSS 样式。

```css
div[id^="page_"] {
	width: 0px;
	height: 0px;
	overflow: hidden;
}
```

</div>

<div style="margin-top: 12px">

#### 2-2 设置 id 为 contentcontainer 的元素的 CSS 样式。

```css
#contentcontainer {
	display: flex;
	width: 0px;
}
```

</div>

<div style="margin-top: 12px">

#### 2-3 设置类为 doc_reader_mod 的元素的 CSS 样式

```css
.doc_reader_mod {
	min-height: 0px;
}
```

</div>

<div style="margin-top: 12px">

#### 2-4 删除 id 为 moveHandel 的元素

```js
// 获取嵌套资源页的容器
const contentContainer = document.querySelector("#contentcontainer");
// 删除#moveHandel
contentContainer.removeChild(contentContainer.querySelector("#moveHandel"));
```

</div>

以上示例使用 CSS 只是便于展示需要设置的元素和对应的样式，其实现都是基于 JS。

至于设置这些样式的原因，具体实现流程中讲解！

## 实现流程-文字

<div style="padding-top: 4px">

### 第一步：将没用的元素设置对应的 CSS 样式

- 步骤 👇：

  1. [删除#movehandel](/documents/dou-ding.html#_2-4-删除-id-为-movehandel-的元素)
  2. 将所有广告元素隐藏
  3. [将.doc_reader_mod 的 min-height 设置为 0](/documents/dou-ding.html#_2-3-设置类为-doc-reader-mod-的元素的-css-样式)

  <div class="info custom-block">

  <p class="info">步骤讲解：</p>

  （步骤-1）比较碍事的元素，由于它相当于一个遮罩层，不删除它会影响左侧下载容器的布局。

  （步骤-2）因为个别广告会撑开页面，会导致出现滚动条，最终会无法自动加载全部 canvas 元素。

  （步骤-3）因为默认最低高度为 500px，也会撑开页面，理由同上 ↑

  </div>

  <div class="tip custom-block">

    <p class="tip">解惑：</p>

  最终的核心目的只有一个，那就是为了<span style="color: red">去掉滚动条</span>。

  因为如果存在滚动条，每次都需要你进行滚动到最底部才会加载全部的 canvas 元素。

  这样的话根本不算是全自动脚本了，自然失去了脚本的意义。

  </div>

</div>

<div style="padding-top: 4px">

### 第二步：<span style="color: red">\*</span>将嵌套着 canvas 的容器设置对应的 CSS 样式

- 步骤 👇：

  1. [设置 id 为 page\_开头的元素的 CSS 样式](/documents/dou-ding.html#_2-1-设置-id-为-page-开头的元素的-css-样式。)
  2. [设置 id 为 contentcontainer 的元素的 CSS 样式。](/documents/dou-ding.html#_2-2-设置-id-为-contentcontainer-的元素的-css-样式。)

  <div class="info custom-block">

  <p class="info">步骤讲解：</p>

  （步骤-1）用于加载全部 canvas 元素，因为高和宽都为 0，全部元素都已经显示在当前未滚动的浏览器视口中了。

  （步骤-2）步骤 2 的话，其实设置不设置都无所谓，只是怕影响布局才设置的（可以略过）。

  </div>

  <div class="tip custom-block">

  <p class="tip">解惑：</p>

  可能有朋友会疑惑，为什么要给这些元素设置这些奇怪的 CSS 样式。

  首先，我在<u>[解析网站的第二项](/documents/dou-ding.html#解析网站)</u>中就已经说了。

  它的资源是基于懒加载的，听到这，你应该已经明白大致情况了。

  我之所以设置这些 CSS 样式，就是为了<span style="color: red">让全部 canvas 元素同时显示在当前浏览器视口</span>！

  我们虽然肉眼看不见这些元素，因为宽高都已经为 0 了。

  但是，它仍然是网页中的元素，并且可以被浏览器当作是当前视口的元素。

  所以，这个时候，你会发现你的电脑风扇已经在狂转了，因为资源正在不断加载。

  </div>

</div>

<div style="padding-top: 4px">

### 第三步：加载左侧下载容器

- 步骤 👇：

  1. 创建一个下载容器
  2. 往下载容器中添加加载动画容器
  3. 将原本在网站中间的资源转移到下载容器中（所以会看见中间没有显示资源）

  <div class="info custom-block">

  <p class="info">步骤讲解：</p>

  （步骤-1）创建左侧的最外层的容器。

  （步骤-2）往左侧容器中添加动画。

  （步骤-3）如果动画还在加载的时候，我们是看不见的，动画加载完后就会显示。

  </div>

  <div class="tip custom-block">

  <p class="tip">解惑：</p>

  由于资源内容已经在<u>[第二步](/documents/dou-ding.html#第二步-将嵌套着-canvas-的容器设置对应的-css-样式)</u>中设置了 CSS 样式，所以它现在是不占空间的。

  这时候，我们就添加加载动画，至于何时删除动画容器，在<u>[第四步](/documents/dou-ding.html#第四步-监视资源的最后一页)</u>有说明。

  </div>

</div>

<div style="padding-top: 4px">

### 第四步：监视资源的最后一页

- 步骤 👇：

  1. 通过 **MutationObserver()** 创建一个监视器
  2. 判断监视的元素是否新增了 canvas 元素
  3. 删除动画容器
  4. 添加下载按钮
  5. 将[第二步](/documents/dou-ding.html#第二步-将嵌套着-canvas-的容器设置对应的-css-样式)设置的 CSS 样式全部清除，恢复资源的默认样式
  6. 以上所有步骤，用于监视资源的最后一页

  <div class="info custom-block">

  <p class="info">步骤讲解：</p>

  （步骤-1）通过 new MutationObserver()创建监视器。

  （步骤-2）结合 for 和 if，判断是否新增 canvas 元素。

  （步骤-3）在新增了 canvas 元素的情况下，则删除动画。

  （步骤-4）将下载容器添加至左侧容器中。

  （步骤-5）删除<u>[第二步](/documents/dou-ding.html#第二步-将嵌套着-canvas-的容器设置对应的-css-样式)</u>中设置的 CSS 样式，恢复默认样式

  （步骤-6）以上监视流程，我们将其用于监视资源的最后一页。

  </div>

  <div class="tip custom-block">

  <p class="tip">解惑：</p>

  对于恢复默认样式，这个点是很容易理解的。

  当我们将自己设置的 CSS 样式去除后，它不就变成了网站默认样式吗？

  只不过，位置变成了左侧容器中而已，这么一讲，你应该已经懂了！

  还有一点，就是对于 canvas 元素的监视。

  首先，你需要记住，我们是不是监视的是资源的最后一页？

  由于<u>[第二步](/documents/dou-ding.html#第二步-将嵌套着-canvas-的容器设置对应的-css-样式)</u>的原因，我们全部资源是不是都已经在加载了？

  所以当资源的最后一页都加载出 canvas 元素了，是不是就代表全部资源加载完成了？

  你懂了吗？我的朋友。

  </div>

</div>

<div style="padding-top: 4px">

### 第五步：canvas 元素转换为图片

- 步骤 👇：

  1. 创建生成器函数，迭代图片名和 canvas 元素
  2. 遍历所有的 canvas 元素，调用 toBlob()获取 Blob 对象
  3. 调用 JSZip 的 file()将所有资源写入压缩包对象中

  <div class="info custom-block">

  <p class="info">步骤讲解：</p>

  （步骤-1）意义在于防止资源页数过多，导致数组数据过多，占用内存资源过大。

  （步骤-2）toBlob()为 canvas 元素自带的方法，调用并传入一个回调函数，接收一个 Blob 对象。

  （步骤-3）file()需要传入两个参数：(文件名, Blob 对象)。

  </div>

  <div class="tip custom-block">

  <p class="tip">解惑：</p>

  在生成器函数中返回的迭代器，我贪图方便，直接通过解构赋值，将所有迭代值存入数组中了。

  这样子的话，就跟使用普通数组没区别了，这个可以自己优化一下，我懒得改了。

  canvas 自带的 toBlob()应该没啥好说的，传入个函数就行了。

  JSZip 的 file()也是如此，直接用就完事了。

  </div>

</div>

<div style="padding-top: 4px">

### 最后一步：打包为压缩包并下载

- 步骤 👇：

  1. 调用 JSZip 的 generateAsync()获取压缩包的 Blob 对象。
  2. 调用 FileSaver 的 saveAs()，打包为压缩包并下载。

  <div class="info custom-block">

  <p class="info">步骤讲解：</p>

  （步骤-1）generateAsync()返回一个 Promise，我们调用 then()，传入回调函数，接收压缩包的 Blob 对象。

  （步骤-2）saveAs()需要传入两个参数：(Blob 对象, 压缩包名字)。

  </div>

  <div class="tip custom-block">

  <p class="tip">解惑：</p>

  如果说看到最后一步还没看懂，可以看看我的解说视频（哔哩哔哩），由博主亲自讲解，简单易懂！

  </div>

</div>
