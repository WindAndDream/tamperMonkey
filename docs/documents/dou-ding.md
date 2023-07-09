---
outline: deep
---

# 豆丁文档

## 项目介绍

这个[豆丁网](https://www.docin.com/)也是我无意间发现的，然后点进去看了一下，发现挺多不错的文档、PPT 等等...

它有些文档，全部内容都已经在前端已经全部展现出来了，但下载需要付费。

所以，我就想写一个能够在线将这些文档、PPT 等等... 转为图片并保存。

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

   - 第 7 页、第 8 页等等... 我们以此类推，是不是只有我们不断滚动，文档资源才会不断加载

   - 直到滚到页面底部，全部文档资源才会加载完成，而这，就是<u>**懒加载**</u>

3. **遇到了有预览范围的文档后，我测试了一下范围之外的文档页能否通过 Ajax 请求拿到文档资源，答案是，<u>不行</u>！**

   - 状态码为 <u>**510**</u>，说明服务端做了验证，无法获取文档资源

## 了解需求

1. **预览当前所有的资源，如文档、PPT 等等...**

2. **将网页中对应的多个 canvas 元素转为图片，并打包成压缩包下载**

<div class="tip custom-block">

<p class="tip">吐槽：</p>

* 之所以打包成压缩包下载，就是因为图片多的时候，点下载点到手发麻，直接压缩包比较省事

* 一开始的话，其实是没有预览文档的，只有一个下载按钮，但我觉得有点不好看，所以加了个预览文档

</div>

## 脚本难点

### 1. 如何将 canvas 元素转为图片并打包为压缩包保存。

<div style="margin-top: var(--block-space-large)">

#### 1-1 canvas 元素的 toBlob()方法，可以将 canvas 元素和第三方库 JSZip、FileSaver 实现！

```js
// 先导入两个第三方库
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.0/FileSaver.min.js

/**
 * 以下为下载单张图片并打包为压缩包的方法，仅供示例，详细可到实现流程-代码查看！
 */

const jsZip = new JSZip(); // 声明一个jsZip对象

// canvas元素的toBlob方法，传入一个回调函数，回调函数内接收blob对象
HTMLCanvasElement.toBlob((blob) => {
    // 调用file方法，传入保存的图片名称和blob对象，将资源写入压缩包对象中
    jsZip.file(imgName, blob);

    // 调用generateAsync方法，返回一个期约，并且传递的值为压缩包的blob对象
    jsZip.generateAsync({ type: "blob", }).then((content) => {
            saveAs(content, `zipName.zip`); // FileSaver库中的saveAs方法，打包成压缩包
    });
});
```

</div>

### 2. 如何在页面不滚动的情况下，加载全部 canvas 元素。

<div style="margin-top: var(--block-space-large)">

#### 2-1 设置 id 为 page\_ 开头的元素的 CSS 样式。

```css
div[id^="page_"] {
    width: 0px;
    height: 0px;
    overflow: hidden;
}
```

</div>

<div style="margin-top: var(--block-space-large)">

#### 2-2 设置 id 为 contentcontainer 的元素的 CSS 样式。

```css
#contentcontainer {
    display: flex;
    width: 0px;
}
```

</div>

<div style="margin-top: var(--block-space-large)">

#### 2-3 设置类为 doc_reader_mod 的元素的 CSS 样式

```css
.doc_reader_mod {
    min-height: 0px;
}
```

</div>

<div style="margin-top: var(--block-space-large)">

#### 2-4 删除 id 为 moveHandel 的元素

```js
// 获取嵌套资源页的容器
const contentContainer = document.querySelector("#contentcontainer");
// 删除#moveHandel
contentContainer.removeChild(contentContainer.querySelector("#moveHandel"));
```

</div>

以上示例使用 CSS 只是便于展示需要设置的元素和对应的样式，其实现都是基于 JS。

至于设置这些样式的原因，具体在实现流程中讲解！

## 实现流程-文字

**这里的实现流程是基于文字描述的，可能会有个别地方有缺漏。**

**注意点：文字描述顺序 ≠ 代码执行顺序。**

**简单来说，文字描述重点阐述的逻辑，更加注重如何获取最终结果。**

**如果想看基于代码的可以直接跳转：[实现流程-代码](/documents/dou-ding.html#实现流程-代码)，会更加完整！**

<div style="padding-top: var(--block-space-small)">

### 1. 将没用的元素设置对应的 CSS 样式

* 步骤 👇：

  1. [删除#movehandel](/documents/dou-ding.html#_2-4-删除-id-为-movehandel-的元素)
  2. 将所有广告元素隐藏
  3. [将.doc_reader_mod 的 min-height 设置为 0](/documents/dou-ding.html#_2-3-设置类为-doc-reader-mod-的元素的-css-样式)

  <div class="tip custom-block">

    <p class="tip">解惑：</p>

  最终的核心目的只有一个，那就是为了<span style="color: red">去掉滚动条</span>。

  因为如果存在滚动条，每次都需要你进行滚动到最底部才会加载全部的 canvas 元素。

  这样的话根本不算是全自动脚本了，自然失去了脚本的意义。

  </div>

  <details class="details custom-block">

    <summary>步骤讲解：</summary>

  （步骤-1）比较碍事的元素，由于它相当于一个遮罩层，不删除它会影响左侧下载容器的布局。

  （步骤-2）因为个别广告会撑开页面，会导致出现滚动条，最终会无法自动加载全部 canvas 元素。

  （步骤-3）因为默认最低高度为 500px，也会撑开页面，理由同上 ↑

  </details>

</div>

<div style="padding-top: var(--block-space-small)">

### 2. <span style="color: red">\*</span>将嵌套着 canvas 的容器设置对应的 CSS 样式

* 步骤 👇：

  1. [设置 id 为 page\_开头的元素的 CSS 样式](/documents/dou-ding.html#_2-1-设置-id-为-page-开头的元素的-css-样式。)
  2. [设置 id 为 contentcontainer 的元素的 CSS 样式。](/documents/dou-ding.html#_2-2-设置-id-为-contentcontainer-的元素的-css-样式。)

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

  <details class="details custom-block">

  <summary>步骤讲解：</summary>

  （步骤-1）用于加载全部 canvas 元素，因为高和宽都为 0，全部元素都已经显示在当前未滚动的浏览器视口中了。

  （步骤-2）步骤 2 的话，其实设置不设置都无所谓，只是怕影响布局才设置的（可以略过）。

  </details>

</div>

<div style="padding-top: var(--block-space-small)">

### 3. 加载左侧下载容器

* 步骤 👇：

  1. 创建一个下载容器
  2. 往下载容器中添加加载动画容器
  3. 将原本在网站中间的资源转移到下载容器中（所以会看见中间没有显示资源）

  <div class="tip custom-block">

  <p class="tip">解惑：</p>

  由于资源内容已经在<u>[第二步](/documents/dou-ding.html#第二步-将嵌套着-canvas-的容器设置对应的-css-样式)</u>中设置了 CSS 样式，所以它现在是不占空间的。

  这时候，我们就添加加载动画，至于何时删除动画容器，在<u>[第四步](/documents/dou-ding.html#第四步-监视资源的最后一页)</u>有说明。

  </div>

  <details class="details custom-block">

  <summary>步骤讲解：</summary>

  （步骤-1）创建左侧的最外层的容器。

  （步骤-2）往左侧容器中添加动画。

  （步骤-3）如果动画还在加载的时候，我们是看不见的，动画加载完后就会显示。

  </details>

</div>

<div style="padding-top: var(--block-space-small)">

### 4. 监视资源的最后一页

* 步骤 👇：

  1. 通过 **MutationObserver()** 创建一个监视器
  2. 判断监视的元素是否新增了 canvas 元素
  3. 删除动画容器
  4. 添加下载按钮
  5. 将[第二步](/documents/dou-ding.html#第二步-将嵌套着-canvas-的容器设置对应的-css-样式)设置的 CSS 样式全部清除，恢复资源的默认样式
  6. 以上所有步骤，用于监视资源的最后一页

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

  <details class="details custom-block">

  <summary>步骤讲解：</summary>

  （步骤-1）通过 new MutationObserver()创建监视器。

  （步骤-2）结合 for 和 if，判断是否新增 canvas 元素。

  （步骤-3）在新增了 canvas 元素的情况下，则删除动画。

  （步骤-4）将下载容器添加至左侧容器中。

  （步骤-5）删除<u>[第二步](/documents/dou-ding.html#第二步-将嵌套着-canvas-的容器设置对应的-css-样式)</u>中设置的 CSS 样式，恢复默认样式

  （步骤-6）以上监视流程，我们将其用于监视资源的最后一页。

  </details>

</div>

<div style="padding-top: var(--block-space-small)">

### 5. canvas 元素转换为图片

* 步骤 👇：

  1. 创建生成器函数，迭代图片名和 canvas 元素
  2. 遍历所有的 canvas 元素，调用 toBlob()获取 Blob 对象
  3. 调用 JSZip 的 file()将所有资源写入压缩包对象中

  <div class="tip custom-block">

  <p class="tip">解惑：</p>

  在生成器函数中返回的迭代器，我贪图方便，直接通过解构赋值，将所有迭代值存入数组中了。

  这样子的话，就跟使用普通数组没区别了，这个可以自己优化一下，我懒得改了。

  canvas 自带的 toBlob()应该没啥好说的，传入个函数就行了。

  JSZip 的 file()也是如此，直接用就完事了。

  </div>

  <details class="details custom-block">

  <summary>步骤讲解：</summary>

  （步骤-1）意义在于防止资源页数过多，导致数组数据过多，占用内存资源过大。

  （步骤-2）toBlob()为 canvas 元素自带的方法，调用并传入一个回调函数，接收一个 Blob 对象。

  （步骤-3）file()需要传入两个参数：(文件名, Blob 对象)。

  </details>

</div>

<div style="padding-top: var(--block-space-small)">

### 6. 打包为压缩包并下载

* 步骤 👇：

  1. 调用 JSZip 的 generateAsync()获取压缩包的 Blob 对象。
  2. 调用 FileSaver 的 saveAs()，打包为压缩包并下载。

  <div class="tip custom-block">

  <p class="tip">解惑：</p>

  如果说看到第六步还没看懂，可以看看我的解说视频（哔哩哔哩），由博主亲自讲解，简单易懂！

  </div>

  <details class="details custom-block">

  <summary>步骤讲解：</summary>

  （步骤-1）generateAsync()返回一个 Promise，我们调用 then()，传入回调函数，接收压缩包的 Blob 对象。

  （步骤-2）saveAs()需要传入两个参数：(Blob 对象, 压缩包名字)。

  </details>

</div>

## 实现流程-代码

**这里的话，就是本篇文章比较核心的内容了，我会尽量以通俗易懂的方式讲解！**

**既有专业词汇，也有接地气的讲解，主打的就是双管齐下！**

**你可以跟着一步一步看，并且边复制代码边看，不知不觉你就会理解整个逻辑了。**

**代码中如果有<span style="color: red">{/\*\* ... \*/}</span>，说明就是按照上一步的内容的不变，不用更改！**

<div style="padding-top: var(--block-space-small)">

### 1. 声明一个 DouDingDoc 类

```ts
(function () {
	// 声明类
	class DouDingDoc {}
});
```

<div class="tip custom-block">

<p class="tip">解惑：</p>

这个... 应该没疑惑的地方，就声明一个类，方便代码的整合。

</div>

<details class="details custom-block">

<summary>代码讲解：</summary>

* 创建了一个“自执行函数”。

* 声明了一个 DouDingDoc 类。

</details>

</div>

<div style="padding-top: var(--block-space-small)">

### 2. 添加动画加载的 style 元素

```ts{3-5,8-20}
(function () {
	class DouDingDoc {
		constructor() { // [!code focus:3]
			this.initStyle(); // 初始化用于动画加载的style元素
		}

		// [!code focus:14]
		/**
		 * 创建一个style元素，往里面添加名为spin的CSS动画
		 * 在文档加载的时候，中间不是会有个蓝色的圈在转吗？就是用在那里的！
		 */
		initStyle() {
			const styleElement = document.createElement("style"); // 创建style元素
			document.head.appendChild(styleElement); // 添加head元素中
			// 添加CSS动画
			styleElement.sheet?.insertRule(
				 `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }` ,
				0
			);
		}
	}

})(); 

```

<div class="tip custom-block">

<p class="tip">解惑：</p>

当我们的资源在加载完成之前，是不是需要一个加载动画来提示用户。

我们可以看见资源加载时会有一个蓝色的圈在转，其中使用的 CSS 动画就是通过这个方法创建的。

</div>

<details class="details custom-block">

<summary>代码讲解：</summary>

- 创建一个 initStyle()。

- 创建一个构造方法。

- 将 initStyle()添加至构造方法中。

</details>

</div>

<div style="padding-top: var(--block-space-small)">

### 3. 创建下载容器

```ts{2-4,10-12,17-88}
class DouDingDoc {
	downloadContainer: HTMLDivElement; // [!code focus:3]
	loadingAnimeContainer: HTMLDivElement;
	downloadBtn: HTMLDivElement;

	constructor() {
		// 初始化用于动画加载的style元素
		this.initStyle();
		// [!code focus:4]
		this.downloadContainer = this.createDownloadContainer(); // 左侧的下载容器
		this.loadingAnimeContainer = this.createLoadingAnimeContainer(); // 加载动画的容器
		this.downloadBtn = this.createDownloadButton(); // 下载按钮
	}

	initStyle() { /** ... */ }
	// [!code focus:72]
	/**
	 * 创建容器，初始化样式
	 * @returns 左侧内容的最外层容器
	 */
	createDownloadContainer() {
		const downloadDiv = document.createElement("div");
		const downloadStyle = `
						position: fixed;
						left: 0px;
						top: 160px;
						display: flex;
						flex-direction: column;
						width: 300px;
						min-width: 150px;
						height: 60vh;
						padding: 30px 0;
						border-radius: 16px;
						background-color: #fff;
						border: 2px solid #f3f3f3;
						overflow-y: auto;
						resize: horizontal;
						z-index: 10000;
					`;
		downloadDiv.setAttribute("style", downloadStyle);
		return downloadDiv;
	}

	/**
	 * 创建容器，初始化样式
	 * @returns 动画加载的容器
	 */
	createLoadingAnimeContainer() {
		const loadAnimeDiv = document.createElement("div");
		const loadStyle = `
						position: absolute;
						top: 50%;
						left: 50%;
						box-sizing: border-box;
						border: 4px solid #f3f3f3;
						border-top: 4px solid #3498db;
						border-radius: 50%;
						width: 50px;
						height: 50px;
						translate: -50% -50%;
						animation: spin 2s linear infinite;
						z-index: 999999;
					`;
		loadAnimeDiv.setAttribute("style", loadStyle);
		return loadAnimeDiv;
	}

	/**
	 * 创建容器，初始化样式
	 * @returns 下载按钮的容器
	 */
	createDownloadButton() {
		const btn = document.createElement("div");
		const btnStyle = `
						margin: 30px auto;
						padding: 8px 10px;
						font-size: 16px;
						font-weight: 600;
						border-radius: 8px;
						color: #2b2b2b;
						background-color: #efefefa6;
						cursor: pointer;
					`;
		btn.textContent = "确定下载";
		btn.setAttribute("style", btnStyle);
		return btn;
	}
}
```

<div class="tip custom-block">

<p class="tip">解惑：</p>

我们添加了几个实例属性，分别是：左侧的下载容器、加载动画的容器、下载按钮。

这些都不难理解，只是用来创建容器和初始化一些 CSS 样式。

只需要记住，这些都是左侧下载框使用的，就是下载框、会转的蓝色圈圈、最下面的下载按钮。

</div>

<details class="details custom-block">

<summary>代码讲解：</summary>

* 声明三个实例属性：downloadContainer、loadingAnimeContainer、downloadBtn。

* 声明三个实例方法：createDownloadContainer()、createLoadingAnimeContainer()、createDownloadButton()。

* 三个实例属性和方法都是一一对应的，意义在于创建左侧下载框中所需要的容器以及 CSS 样式。

</details>

</div>

<div style="padding-top: var(--block-space-small)">

### 4. 获取资源标题、所有资源内容的容器和实例化第三方库

```ts{3,7-8,17-18,20-21,23-24}
(function () {
	class DouDingDoc {
		contentContainer: HTMLDivElement; // [!code focus:1]
		downloadContainer: HTMLDivElement;
		loadingAnimeContainer: HTMLDivElement;
		downloadBtn: HTMLDivElement; 
		docTitle: string; // [!code focus:2]
		jsZip: any;

		constructor() {
			// 初始化用于动画加载的style元素
			this.initStyle();

			this.downloadContainer = this.createDownloadContainer(); // 左侧的下载容器
			this.loadingAnimeContainer = this.createLoadingAnimeContainer(); // 加载动画的容器
			this.downloadBtn = this.createDownloadButton(); // 下载按钮
			// 文档标题，用于压缩包下载的时候命名 // [!code focus:2]
			this.docTitle = document.querySelector(".doc_title")?.textContent?.replace(/[?\\/*"<>|]/g, "_") as string;
				
			// 获取所有资源内容的容器 // [!code focus:2]
			this.contentContainer = document.querySelector("#contentcontainer") as HTMLDivElement;

			// @ts-ignore // [!code focus:2]
			this.jsZip = new JSZip(); // 实例化JSZip（第三方库）
		}

		initStyle() { /** ... */ }

		createDownloadContainer() { /** ... */ }

		createLoadingAnimeContainer() { /** ... */ }

		createDownloadButton() { /** ... */ }
	}
});
```

<div class="tip custom-block">

<p class="tip">解惑：</p>

获取资源标题是为了在压缩包下载的时候，能够给压缩包命名。

而“所有资源内容的容器”，自然而然，就是为了获取资源。

或许我说的“所有资源内容的容器”有点抽象，让人感觉有点迷糊。

你可以按下 F12，在“元素”中按下 Ctrl + F，搜索<span style="color: red">#contentcontainer</span>，你就知道是啥东西了。

只是我不知道如何用文字来表达这个东西，我觉得就叫“所有资源内容的容器”挺合适的。

实例化 JSZip 类，这个第三方库没啥好说的，用来加载图片资源和压缩包资源的。

</div>

<details class="details custom-block">

<summary>代码讲解：</summary>

* 获取了文档标题，属性名为 docTitle，为了给压缩包命名使用。

* 获取了“所有资源内容的容器”，用于资源获取，并且给后续的其他方法调用。

* 调用第三方库（JSZip），将多个图片打包成压缩包用的。

</details>

</div>

<div style="padding-top: var(--block-space-small)">

### 5. 创建下载所有资源的方法，并添加 load 事件

```ts{21-29,32-35}
(function () {
	// 声明类
	class DouDingDoc {
		contentContainer: HTMLDivElement;
		downloadContainer: HTMLDivElement;
		loadingAnimeContainer: HTMLDivElement;
		downloadBtn: HTMLDivElement;
		docTitle: string;
		jsZip: any;

		constructor() { /** ... */ }

		initStyle() { /** ... */ }

		createDownloadContainer() { /** ... */ }

		createLoadingAnimeContainer() { /** ... */ }

		createDownloadButton() { /** ... */ }
		// [!code focus:10]
		/**
		 * 下载所有资源
		 */
		downloadImgs() {
			// 判断“所有资源内容的容器”是否存在
			if (this.contentContainer !== null) {
				// 后面几步会逐渐完善方法体
			}
		}
	}
	// [!code focus:5]
	window.addEventListener("load", function () {
		const douDingDoc = new DouDingDoc(); // 将类实例化
		douDingDoc.downloadImgs(); // 调用方法
	});
});
```

<div class="tip custom-block">

<p class="tip">解惑：</p>

可能有的朋友对 load 事件会有疑惑，我们可以参考<u>[mdn](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/load_event)</u>上的描述。

简单来说，就是等页面所有资源都加载完成后（不包括懒加载），就会触发该事件。

对于 downloadImgs()，这里只进行了一个“所有资源内容的容器”是否存在的判断。

我们后面几步会逐渐补充方法体，让你能够拥有更深的印象！

</div>

<details class="details custom-block">

<summary>代码讲解：</summary>

* 创建了 downloadImgs()，并判断“所有资源内容的容器”是否存在。

* 使用 load 事件，监听浏览器是否加载完成。

* 事件的回调函数中，将 DouDingDoc 实例化，并调用 downloadImgs()。

</details>

</div>

<div style="padding-top: var(--block-space-small)">

### 6. 隐藏广告、删除没用的元素、设置元素的min-height样式

```ts{20-33,41}
(function () {
	class DouDingDoc {
		contentContainer: HTMLDivElement;
		downloadContainer: HTMLDivElement;
		loadingAnimeContainer: HTMLDivElement;
		downloadBtn: HTMLDivElement;
		docTitle: string;
		jsZip: any;

		constructor() { /** ... */ }

		initStyle() { /** ... */ }

		createDownloadContainer() { /** ... */ }

		createLoadingAnimeContainer() { /** ... */ }

		createDownloadButton() { /** ... */ }
		// [!code focus:15]
		/**
         * 移除没用的元素，并且把一些广告隐藏，将个别元素的最高度设置为0
         */
        removeUselessElement() {
			// 删除资源内容的遮罩层（这个其实无所谓）
            this.contentContainer.removeChild(this.contentContainer.querySelector('#moveHandel') as HTMLDivElement);

			// 广告也会撑开页面，所以必须要隐藏广告
            this.contentContainer.querySelectorAll('*[id^="ad"]').forEach((element) => element.setAttribute('style', 'display: none;'));
            document.body.querySelectorAll('div[class^="gg"]').forEach((element) => element.setAttribute('style', 'display: none;'));

            // 这里要把最低高度设置为0，因为默认为500px，会撑开页面，导致有滚动条
            document.body.querySelector('.doc_reader_mod')?.setAttribute('style', `min-height: 0px;`);
        }
		
		/**
		 * 下载所有资源
		 */
		downloadImgs() { 
			// 判断“所有资源内容的容器”是否存在
			if (this.contentContainer !== null) {
				this.removeUselessElement(); // 处理和隐藏元素 // [!code focus:1]
			}
		}
	}

	window.addEventListener("load", function () {
		// ...
	});
});
```

<div class="tip custom-block">

<p class="tip">解惑：</p>

删除资源的遮罩层那里，其实可有可无，但为了元素的整齐排版还是选择删除。

删除广告和设置 min-height 都是为了防止出现滚动条。

如果说页面出现滚动条后，则必须滚动之后才能加载 canvas 元素，那都属于半自动脚本了，就没意义了。

</div>

<details class="details custom-block">

<summary>代码讲解：</summary>

* 创建了 removeUselessElement()，用于处理无用的元素。

* 将 removeUselessElement()放至 downloadImgs()中。

</details>

</div>

<div style="padding-top: var(--block-space-small)">

### 7. <span style="color: red">*</span>让所有资源显示在当前浏览器视口，加载全部canvas元素！

```ts{22-33,42}
(function () {
	class DouDingDoc {
		contentContainer: HTMLDivElement;
		downloadContainer: HTMLDivElement;
		loadingAnimeContainer: HTMLDivElement;
		downloadBtn: HTMLDivElement;
		docTitle: string;
		jsZip: any;

		constructor() { /** ... */ }

		initStyle() { /** ... */ }

		createDownloadContainer() { /** ... */ }

		createLoadingAnimeContainer() { /** ... */ }

		createDownloadButton() { /** ... */ }

        removeUselessElement() { /** ... */ }
		// [!code focus:13]
		/**
         * 方法的意义只有一个，为了让所有资源都能展现在当前浏览器视口中，并且是在没有滚动条的情况下！
         */
        setContainerStyle() {
            // 设置“所有资源内容的容器”为flex布局和宽度为0
            this.contentContainer.setAttribute('style', `display: flex; width: 0px`);

            // 所有资源内容的高宽度都设置为0，并且设置overflow: hidden
            this.contentContainer.querySelectorAll('div[id^="page_"]').forEach((element) => {
                element.setAttribute('style', `width: 0px; height: 0px; overflow: hidden;`);
            });
        }

		/**
		 * 下载所有资源
		 */
		downloadImgs() { 
			// 判断“所有资源内容的容器”是否存在
			if (this.contentContainer !== null) {
				this.removeUselessElement(); // 处理和隐藏元素
				this.setContainerStyle(); // 处理元素，让所有资源显示在当前浏览器视口 // [!code focus:1]
			}
		}
	}

	window.addEventListener("load", function () {
		// ...
	});
});
```

<div class="tip custom-block">

<p class="tip">解惑：</p>

这是及其核心的一步，并且关系到全部 canvas 元素的加载！

首先，我们从<u>[解析网站](/documents/dou-ding.html#解析网站)</u>中已经得知，页面是基于懒加载的。

然后，我们在<u>[第六步](/documents/dou-ding.html#第六步-隐藏广告、删除没用的元素、设置元素的min-height样式)</u>中，已经将页面的滚动条去掉了。

而这个方法的作用也是很直接的，就是将“全部资源内容的容器”设置为flex布局和宽度为0。

并且把“全部资源内容”设置高宽为 0 和溢出隐藏（overflow: hidden）。

这时候，我们可以有个视觉上的感受，是不是全部元素都看不见了？

因为我们把高宽都设置为0，但没有移除元素和没有使用 display: none。

是不是相当于我们肉眼看不见，但它还在存在于浏览器当中的？

而且全部都在当前浏览器视口中（因为我们已经把浏览器滚动条去掉了）。

那这时候，canvas 元素还有什么理由不加载呢？

我们所有的资源内容都在当前浏览器视口，只是我们肉眼看不见，但浏览器还是存在。

所以说，它这时候就会将全部 canvas 元素都加载！

</div>

<details class="details custom-block">

<summary>代码讲解：</summary>

* 创建了 setContainerStyle()，用于设置“所有的资源内容”和“所有的资源内容的容器”。

* 将 setContainerStyle()放至 downloadImgs()中。

</details>

</div>

<div style="padding-top: var(--block-space-small)">

### 8. 加载下载容器，将其添加至body元素中

```ts{24-31,41}
(function () {
	class DouDingDoc {
		contentContainer: HTMLDivElement;
		downloadContainer: HTMLDivElement;
		loadingAnimeContainer: HTMLDivElement;
		downloadBtn: HTMLDivElement;
		docTitle: string;
		jsZip: any;

		constructor() { /** ... */ }

		initStyle() { /** ... */ }

		createDownloadContainer() { /** ... */ }

		createLoadingAnimeContainer() { /** ... */ }

		createDownloadButton() { /** ... */ }

        removeUselessElement() { /** ... */ }

        setContainerStyle() { /** ... */ }
		// [!code focus:9]
		/**
         * 初始化dom元素，往下载容器中添加需要的元素，并将下载容器添加至body元素中
         */
        initDom() {
            this.downloadContainer.appendChild(this.loadingAnimeContainer);
            this.downloadContainer.appendChild(this.contentContainer);
            document.body.appendChild(this.downloadContainer);
        }

		/**
		 * 下载所有资源
		 */
		downloadImgs() { 
			// 判断“所有资源内容的容器”是否存在
			if (this.contentContainer !== null) {
				this.removeUselessElement(); // 处理和隐藏元素
				this.setContainerStyle(); // 处理元素，让所有资源显示在当前浏览器视口
				this.initDom(); //将下载容器添加至body中 // [!code focus:1]
			}
		}
	}

	window.addEventListener("load", function () {
		// ...
	});
});
```

<div class="tip custom-block">

<p class="tip">解惑：</p>

这一步不难理解，就是把加载动画的容器和“所有资源内容的容器”添加至下载容器中。

然后将下载容器添加至 body 元素中。

</div>

<details class="details custom-block">

<summary>代码讲解：</summary>

* 创建了 initDom() ，用于设置下载容器所需要的内容

* 将 initDom() 放至 downloadImgs() 中。

</details>

</div>

<div style="padding-top: var(--block-space-small)">

### 9. 观察最后一个 canvas 元素，在其加载完成时，恢复资源内容的默认样式

```ts{26-40,42-70,81}
(function () {
	class DouDingDoc {
		contentContainer: HTMLDivElement;
		downloadContainer: HTMLDivElement;
		loadingAnimeContainer: HTMLDivElement;
		downloadBtn: HTMLDivElement;
		docTitle: string;
		jsZip: any;

		constructor() { /** ... */ }

		initStyle() { /** ... */ }

		createDownloadContainer() { /** ... */ }

		createLoadingAnimeContainer() { /** ... */ }

		createDownloadButton() { /** ... */ }

        removeUselessElement() { /** ... */ }

        setContainerStyle() { /** ... */ }

        initDom() { /** ... */ }
		// [!code focus:16]
		/**
         * 等canvas全部加载完后就会执行这个函数
         *
         * 用于将之前“所有资源内容的容器”和“所有资源内容”都恢复成网站默认的CSS样式
         *
         * 以及将“所有资源内容的容器”设置为居中状态
         */
        removeContainerStyle() {
            this.contentContainer.removeAttribute('style'); // 移除style属性
            this.contentContainer.setAttribute('style', 'margin: 0 auto'); // 添加剧中
            // 移除所有资源内容的style属性
            this.contentContainer.querySelectorAll('div[id^="page_"]').forEach((element) => {
                element.removeAttribute('style');
            });
        }
		// [!code focus:30]
        /**
         * 简单来说，就是看最后一个canvas有没有加载出来，加载出来了就当于全部canvas都加载了
         *
         * 全部加载完后就把canvas展现出来，移除加载动画的容器，显示下载按钮
         */
        #observeContent() {
            // 创建一个观察器
            const obs = new MutationObserver((mutations: MutationRecord[]) => {
                // 这个数组是所有新增的dom元素，我们增加的dom元素进行遍历
                for (const mutation of mutations) {
                    // 判断是不是网页dom元素节点的变化
                    if (mutation.type === 'childList') {
                        // 变化的目标，即新增的dom元素
                        const target = mutation.target as HTMLDivElement;
                        // 判断新增的dom元素中是否已经包含canvas元素
                        if (target.querySelector('canvas') !== null) {
                            this.downloadContainer.removeChild(this.loadingAnimeContainer); // 删除动画
                            this.downloadContainer.appendChild(this.downloadBtn); // 添加下载按钮
                            this.removeContainerStyle(); // 删除用于加载canvas的CSS样式
                            obs.disconnect(); // 停止观察
                            break;
                        }
                    }
                }
            });
            // 需要观察的元素
            const lastCanvas = this.contentContainer.querySelector('div[id^="page_"]:last-child') as HTMLDivElement;
            obs.observe(lastCanvas, { childList: true, subtree: true }); // 观察元素，并且观察其子孙节点
        }

		/**
		 * 下载所有资源
		 */
		downloadImgs() { 
			// 判断“所有资源内容的容器”是否存在
			if (this.contentContainer !== null) {
				this.removeUselessElement(); // 处理和隐藏元素
				this.setContainerStyle(); // 处理元素，让所有资源显示在当前浏览器视口
				this.initDom(); //将下载容器添加至body中 
                this.#observeContent(); // 观察最后一个canvas元素是否加载成功 // [!code focus:1]
			}
		}
	}

	window.addEventListener("load", function () {
		// ...
	});
});
```

<div class="tip custom-block">

<p class="tip">解惑：</p>

其实这里，我一开始是想用 proxy 实现的，因为我平时前端开发用 vue3 用得比较多。

但我问了 bing，回复我可以使用 api，结果不用不知道，一用吓一跳，还蛮不错的。

由于我对这个 api 不是特别熟悉，如果我有写错的地方还请多多见谅。

如果说想要深入了解这个接口，我们可以直接看<u>[mdn文档](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver)</u>中给出的讲解。

这一步的意义其实挺好理解的，因为网页中的 canvas 元素按顺序加载的（从第一页到最后一页）。

这就代表着，如果最后一个 canvas 元素加载完成后，整个页面的资源也就加载完了。

而 #observeContent()作用就是为了观察最后一页的资源内容，判断它的子孙节点中是否有 canvas 元素。

如果存在，就代表全部资源已经加载完成了，之后就删除加载动画的容器，添加下载按钮。

回想前面的步骤，我们不是在<u>[第七步](/documents/dou-ding.html#第七步-让所有资源显示在当前浏览器视口-加载全部canvas元素)</u>设置了CSS样式吗？我们的肉眼看不见所有的资源了。

所以 removeContainerStyle()的意义就是将资源恢复成默认样式，让我们看得见，并且加个居中。

</div>

<details class="details custom-block">

<summary>代码讲解：</summary>

* 创建了 removeContainerStyle()，用于恢复“所有资源内容”和“所有资源内容的容器”中的 CSS 样式。

* 创建了 #observeContent，用于观察最后一个 canvas 元素是否加载成功。

* 如canvas元素加载完成，删除加载动画的容器，添加下载按钮。

* 最后调用 removeContainerStyle()，恢复 CSS 样式

</details>

</div>

<div style="padding-top: var(--block-space-small)">

### 10. 创建点击事件，获取 canvas 元素，创建 Blob 对象并写入压缩包对象

```ts{30-56,58-74,87-89}
(function () {
	class DouDingDoc {
		contentContainer: HTMLDivElement;
		downloadContainer: HTMLDivElement;
		loadingAnimeContainer: HTMLDivElement;
		downloadBtn: HTMLDivElement;
		docTitle: string;
		jsZip: any;

		constructor() { /** ... */ }

		initStyle() { /** ... */ }

		createDownloadContainer() { /** ... */ }

		createLoadingAnimeContainer() { /** ... */ }

		createDownloadButton() { /** ... */ }

        removeUselessElement() { /** ... */ }

        setContainerStyle() { /** ... */ }

        initDom() { /** ... */ }

        removeContainerStyle() { /** ... */ }

        #observeContent() { /** ... */ }
		// [!code focus:28]
		/**
         * 一个生成器函数，用来获取canvas元素和文件名
         *
         * 迭代器的迭代值为保存时的文件名和canvas元素
         */
        *generatorCanvasData() {
            let pageIndex = 0; // 页面索引，相当于资源内容的页数
            while (++pageIndex) {
                // 获取对应页数的资源内容
                const page = this.contentContainer.querySelector(`div[id^="page_"]:nth-child(${pageIndex})`);
                // 判断是否为空
                if (page !== null) {
                    const canvasEle = page?.querySelector('canvas'); // 获取资源内容中的canvas元素
                    // 判断canvas元素是否为空
                    if (canvasEle !== null) {
                        // 保存的文件名
                        const fileName = `（${pageIndex}）${this.docTitle}__${pageIndex}.png`;
                        yield { fileName, canvasElement: canvasEle }; // 通过迭代器返回
                    } else {
                        // 如果为空，则说明当前资源内容中的canvas元素没有加载
                        // 这里使用pageIndex--的原因就是先回到上一页，然后进入下一次循环又pageIndex++，等于说又再次检查当前页数
                        pageIndex--;
                        setTimeout(() => alert(`第${pageIndex}页资源还未加载好，请稍等一会！`), 500); // 加个定时器延迟一下，并给个提示
                    }
                } else break; // 如果说获取到的page为空，不就代表已经超出最后一页了吗？所以直接break就行了
            }
        }
		// [!code focus:20]
        /**
         * 将图片资源写入至压缩包对象中
         */
        async loadingFile() {
            // 获取全部canvas数据
            for (const data of this.generatorCanvasData()) {
                const fileName = data.fileName; // 图片名
                // 这里用Promsie的原因是因为toBlob是异步加载，得阻塞，不然会导致打包成压缩包后发现没文件
                await new Promise<void>((resolve) => {
                    // 调用toBlob方法，用于获取blob对象
                    data.canvasElement.toBlob((blob) => {
                        this.jsZip.file(fileName, blob); // 写入压缩包对象中
                        resolve();
                    });
                });
            }
        }


		/**
		 * 下载所有资源
		 */
		downloadImgs() { 
			// 判断“所有资源内容的容器”是否存在
			if (this.contentContainer !== null) {
				this.removeUselessElement(); // 处理和隐藏元素
				this.setContainerStyle(); // 处理元素，让所有资源显示在当前浏览器视口
				this.initDom(); //将下载容器添加至body中 
                this.#observeContent(); // 观察最后一个canvas元素是否加载成功
				this.downloadBtn.addEventListener('click', async () => { // [!code focus:3]
                    await this.loadingFile(); // 将图片资源写入压缩包对象中
                });
			}
		}
	}

	window.addEventListener("load", function () {
		// ...
	});
});
```


<div class="tip custom-block">

<p class="tip">解惑：</p>

比较难理解的地方可能是 *generatorCanvasData()，使用生成器函数的原因就是怕资源内容过多。

如果说，页面中只有几十页的资源内容还好，但遇到那种几百页的，占用内存太大了。

代码逻辑呢，也不会特别复杂，说白了，while 循环就是拿来不断循环下一页的。

而对于 page !== null 的判断，就是看是不是超出了最后一页。

如果说，超出了最后一页，是不是就为 null 了？那肯定就直接 break 了嘛。

而 canvasEle !== null 就是判断当前资源容器是否加载了 canvas 元素。

loadingFile()中，用 Promise 阻塞，因为 toBlob()是异步执行。

最后，给下载按钮添加个点击事件，将 loadingFile()放入事件函数中。

</div>

<details class="details custom-block">

<summary>代码讲解：</summary>

* 创建 *removeContainerStyle()，用于获取图片名和 canvas 元素。

* 创建 loadingFile()，用于将图片资源写入压缩包对象中

* 为下载按钮添加点击事件，并且 loadingFile()放入事件函数中。

</details>

</div>

<div style="padding-top: var(--block-space-small)">

### 11. 通过 FileSaver（第三方库） 下载压缩包

```ts{34-43,57}
(function () {
	class DouDingDoc {
		contentContainer: HTMLDivElement;
		downloadContainer: HTMLDivElement;
		loadingAnimeContainer: HTMLDivElement;
		downloadBtn: HTMLDivElement;
		docTitle: string;
		jsZip: any;

		constructor() { /** ... */ }

		initStyle() { /** ... */ }

		createDownloadContainer() { /** ... */ }

		createLoadingAnimeContainer() { /** ... */ }

		createDownloadButton() { /** ... */ }

        removeUselessElement() { /** ... */ }

        setContainerStyle() { /** ... */ }

        initDom() { /** ... */ }

        removeContainerStyle() { /** ... */ }

        #observeContent() { /** ... */ }

        *generatorCanvasData() { /** ... */ }

        async loadingFile() { /** ... */ }
		// [!code focus:11]
		/**
         * 下载压缩包
         */
        downloadZip() {
            // 将压缩包的blob对象进行下载，保存为压缩包
            this.jsZip.generateAsync({ type: 'blob' }).then((content: any) => {
                // @ts-ignore
                saveAs(content, `${this.docTitle}.zip`); // 调用第三方库
            });
        }

		/**
		 * 下载所有资源
		 */
		downloadImgs() { 
			// 判断“所有资源内容的容器”是否存在
			if (this.contentContainer !== null) {
				this.removeUselessElement(); // 处理和隐藏元素
				this.setContainerStyle(); // 处理元素，让所有资源显示在当前浏览器视口
				this.initDom(); //将下载容器添加至body中 
                this.#observeContent(); // 观察最后一个canvas元素是否加载成功
				this.downloadBtn.addEventListener('click', async () => { 
                    await this.loadingFile(); // 将图片资源写入压缩包对象中
                    this.downloadZip(); // 下载压缩包 // [!code focus:1]
                });
			}
		}
	}

	window.addEventListener("load", function () {
		// ...
	});
});
```

<div class="tip custom-block">

<p class="tip">解惑：</p>

最后这里应该没什么疑惑了，saveAs()是 FileSaver（第三方库）中的方法，用于下载压缩包。

</div>

<details class="details custom-block">

<summary>代码讲解：</summary>

* 创建 downloadZip()，用于下载压缩包。

* 并将 downloadImgs()放至点击事件中的事件函数中。

</details>

</div>

## 完整代码
```ts
// ==UserScript==
// @name         豆丁网下载
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  快乐每一天
// @author       WindAndDream
// @match        https://www.docin.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=docin.com
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.0/FileSaver.min.js
// ==/UserScript==

(function () {
    class DouDingDoc {
        contentContainer: HTMLDivElement;
        downloadContainer: HTMLDivElement;
        loadingAnimeContainer: HTMLDivElement;
        downloadBtn: HTMLDivElement;
        docTitle: string;
        jsZip: any;

        constructor() {
            this.initStyle(); // 初始化用于动画加载的style元素

            this.downloadContainer = this.createDownloadContainer(); // 左侧的下载容器
            this.loadingAnimeContainer = this.createLoadingAnimeContainer(); // 加载动画的容器
            this.downloadBtn = this.createDownloadButton(); // 下载按钮

            // 文档标题，用于压缩包下载的时候命名
            this.docTitle = document.querySelector('.doc_title')?.textContent?.replace(/[?\\/*"<>|]/g, '_') as string;

            // 获取所有资源内容的容器
            this.contentContainer = document.querySelector('#contentcontainer') as HTMLDivElement;

            // @ts-ignore
            this.jsZip = new JSZip(); // 实例化JSZip（第三方库）
        }

        /**
         * 创建一个style元素，往里面添加名为spin的CSS动画
         * 在文档加载的时候，中间不是会有个蓝色的圈在转吗？就是用在那里的！
         */
        initStyle() {
            const styleElement = document.createElement('style'); // 创建style元素
            document.head.appendChild(styleElement); // 添加head元素中
            // 添加CSS动画
            styleElement.sheet?.insertRule(`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`, 0);
        }

        /**
         * 创建容器，初始化样式
         * @returns 左侧内容的最外层容器
         */
        createDownloadContainer() {
            const downloadDiv = document.createElement('div');
            const downloadStyle = `
						position: fixed;
						left: 0px;
						top: 160px;
						display: flex;
						flex-direction: column;
						width: 300px;
						min-width: 150px;
						height: 60vh;
						padding: 30px 0;
						border-radius: 16px;
						background-color: #fff;
						border: 2px solid #f3f3f3;
						overflow-y: auto;
						resize: horizontal;
						z-index: 10000;
					`;
            downloadDiv.setAttribute('style', downloadStyle);
            return downloadDiv;
        }

        /**
         * 创建容器，初始化样式
         * @returns 动画加载的容器
         */
        createLoadingAnimeContainer() {
            const loadAnimeDiv = document.createElement('div');
            const loadStyle = `
						position: absolute;
						top: 50%;
						left: 50%;
						box-sizing: border-box;
						border: 4px solid #f3f3f3;
						border-top: 4px solid #3498db;
						border-radius: 50%;
						width: 50px;
						height: 50px;
						translate: -50% -50%;
						animation: spin 2s linear infinite;
						z-index: 999999;
					`;
            loadAnimeDiv.setAttribute('style', loadStyle);
            return loadAnimeDiv;
        }

        /**
         * 创建容器，初始化样式
         * @returns 下载按钮的容器
         */
        createDownloadButton() {
            const btn = document.createElement('div');
            const btnStyle = `
						margin: 30px auto;
						padding: 8px 10px;
						font-size: 16px;
						font-weight: 600;
						border-radius: 8px;
						color: #2b2b2b;
						background-color: #efefefa6;
						cursor: pointer;
					`;
            btn.textContent = '确定下载';
            btn.setAttribute('style', btnStyle);
            return btn;
        }

        /**
         * 移除没用的元素，并且把一些广告隐藏，将个别元素的最高度设置为0
         */
        removeUselessElement() {
            // 删除资源内容的遮罩层（这个其实无所谓）
            this.contentContainer.removeChild(this.contentContainer.querySelector('#moveHandel') as HTMLDivElement);

            // 广告也会撑开页面，所以必须要隐藏广告
            this.contentContainer.querySelectorAll('*[id^="ad"]').forEach((element) => element.setAttribute('style', 'display: none;'));
            document.body.querySelectorAll('div[class^="gg"]').forEach((element) => element.setAttribute('style', 'display: none;'));

            // 这里要把最低高度设置为0，因为默认为500px，会撑开页面，导致有滚动条
            document.body.querySelector('.doc_reader_mod')?.setAttribute('style', `min-height: 0px;`);
        }

        /**
         * 方法的意义只有一个，为了让所有资源都能展现在当前浏览器视口中，并且是在没有滚动条的情况下！
         */
        setContainerStyle() {
            // 设置“所有资源内容的容器”为flex布局和宽度为0
            this.contentContainer.setAttribute('style', `display: flex; width: 0px`);

            // 所有资源内容的高宽度都设置为0，并且设置overflow: hidden
            this.contentContainer.querySelectorAll('div[id^="page_"]').forEach((element) => {
                element.setAttribute('style', `width: 0px; height: 0px; overflow: hidden;`);
            });
        }

        /**
         * 初始化dom元素，往下载容器中添加需要的元素，并将下载容器添加至body元素中
         */
        initDom() {
            this.downloadContainer.appendChild(this.loadingAnimeContainer);
            this.downloadContainer.appendChild(this.contentContainer);
            document.body.appendChild(this.downloadContainer);
        }

        /**
         * 等canvas全部加载完后就会执行这个函数
         *
         * 用于将之前“所有资源内容的容器”和“所有资源内容”都恢复成网站默认的CSS样式
         *
         * 以及将“所有资源内容的容器”设置为居中状态
         */
        removeContainerStyle() {
            this.contentContainer.removeAttribute('style'); // 移除style属性
            this.contentContainer.setAttribute('style', 'margin: 0 auto'); // 添加剧中
            // 移除所有资源内容的style属性
            this.contentContainer.querySelectorAll('div[id^="page_"]').forEach((element) => {
                element.removeAttribute('style');
            });
        }

        /**
         * 简单来说，就是看最后一个canvas有没有加载出来，加载出来了就当于全部canvas都加载了
         *
         * 全部加载完后就把canvas展现出来，移除加载动画的容器，显示下载按钮
         */
        #observeContent() {
            // 创建一个观察器
            const obs = new MutationObserver((mutations: MutationRecord[]) => {
                // 这个数组是所有新增的dom元素，我们增加的dom元素进行遍历
                for (const mutation of mutations) {
                    // 判断是不是网页dom元素节点的变化
                    if (mutation.type === 'childList') {
                        // 变化的目标，即新增的dom元素
                        const target = mutation.target as HTMLDivElement;
                        // 判断新增的dom元素中是否已经包含canvas元素
                        if (target.querySelector('canvas') !== null) {
                            this.downloadContainer.removeChild(this.loadingAnimeContainer); // 删除动画
                            this.downloadContainer.appendChild(this.downloadBtn); // 添加下载按钮
                            this.removeContainerStyle(); // 删除用于加载canvas的CSS样式
                            obs.disconnect(); // 停止观察
                            break;
                        }
                    }
                }
            });
            // 需要观察的元素
            const lastCanvas = this.contentContainer.querySelector('div[id^="page_"]:last-child') as HTMLDivElement;
            obs.observe(lastCanvas, { childList: true, subtree: true }); // 观察元素，并且观察其子孙节点
        }

        /**
         * 一个生成器函数，用来获取canvas元素和文件名
         *
         * 迭代器的迭代值为保存时的文件名和canvas元素
         */
        *generatorCanvasData() {
            let pageIndex = 0; // 页面索引，相当于资源内容的页数
            while (++pageIndex) {
                // 获取对应页数的资源内容
                const page = this.contentContainer.querySelector(`div[id^="page_"]:nth-child(${pageIndex})`);
                // 判断是否为空
                if (page !== null) {
                    const canvasEle = page?.querySelector('canvas'); // 获取资源内容中的canvas元素
                    // 判断canvas元素是否为空
                    if (canvasEle !== null) {
                        // 保存的文件名
                        const fileName = `（${pageIndex}）${this.docTitle}__${pageIndex}.png`;
                        yield { fileName, canvasElement: canvasEle }; // 通过迭代器返回
                    } else {
                        // 如果为空，则说明当前资源内容中的canvas元素没有加载
                        // 这里使用pageIndex--的原因就是先回到上一页，然后进入下一次循环又pageIndex++，等于说又再次检查当前页数
                        pageIndex--;
                        setTimeout(() => alert(`第${pageIndex}页资源还未加载好，请稍等一会！`), 500); // 加个定时器延迟一下，并给个提示
                    }
                } else break; // 如果说获取到的page为空，不就代表已经超出最后一页了吗？所以直接break就行了
            }
        }

        /**
         * 将图片资源写入至压缩包对象中
         */
        async loadingFile() {
            // 获取全部canvas数据
            for (const data of this.generatorCanvasData()) {
                const fileName = data.fileName; // 图片名
                // 这里用Promsie的原因是因为toBlob是异步加载，得阻塞，不然会导致打包成压缩包后发现没文件
                await new Promise<void>((resolve) => {
                    // 调用toBlob方法，用于获取blob对象
                    data.canvasElement.toBlob((blob) => {
                        this.jsZip.file(fileName, blob); // 写入压缩包对象中
                        resolve();
                    });
                });
            }
        }

        /**
         * 下载压缩包
         */
        downloadZip() {
            // 将压缩包的blob对象进行下载，保存为压缩包
            this.jsZip.generateAsync({ type: 'blob' }).then((content: any) => {
                // @ts-ignore
                saveAs(content, `${this.docTitle}.zip`); // 调用第三方库
            });
        }

        /**
         * 下载所有资源
         */
        downloadImgs() {
            // 判断“所有资源内容的容器”是否存在
            if (this.contentContainer !== null) {
                this.removeUselessElement(); // 处理和隐藏元素
                this.setContainerStyle(); // 处理元素，让所有资源显示在当前浏览器视口
                this.initDom(); //将下载容器添加至body中
                this.#observeContent(); // 观察最后一个canvas元素是否加载成功
                this.downloadBtn.addEventListener('click', async () => {
                    await this.loadingFile(); // 将图片资源写入压缩包对象中
                    this.downloadZip(); // 下载压缩包
                });
            }
        }
    }

    window.addEventListener('load', function () {
        const douDingDoc = new DouDingDoc(); // 将类实例化
        douDingDoc.downloadImgs(); // 调用方法
    });
})();
```

希望我的博客能给你带来帮助，如果你对代码有疑惑，结合着我的视频观看，会更加通俗易懂！

## 运行代码

### 1. tsconfig.json 配置项
```json
{
	"compilerOptions": {
		"target": "ES2022",
		"module": "CommonJS",
		"esModuleInterop": true,
		"forceConsistentCasingInFileNames": true,
		"strict": true,
		"skipLibCheck": true
	},
	"include": ["*.ts"]
}
```

### 2. 运行命令
```sh
$ tsc --target es2022 文件路径.ts -w
```
