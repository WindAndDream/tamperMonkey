import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
	title: "WindAndDream | 油猴项目",
	lang: "zh-CN",
	themeConfig: {
		// https://vitepress.dev/reference/default-theme-config
		nav: [
			{ text: "首页", link: "/" },
			{ text: "油猴项目", link: "/temper_monkey/edge" },
			{ text: "GitHub", link: "https://github.com/WindAndDream" },
		],

		sidebar: [
			{
				text: "配置油猴",
				collapsed: true,
				items: [
					{ text: "Edge", link: "/temper_monkey/edge" },
					{
						text: "Google",
						link: "/temper_monkey/google",
					},
				],
			},
			{
				text: "文档",
				collapsed: true,
				items: [
					{
						text: "豆丁文档",
						link: "/documents/dou-ding",
					},
				],
			},
		],

		socialLinks: [{ icon: "github", link: "https://github.com/WindAndDream" }],

		docFooter: {
			prev: "上一篇",
			next: "下一篇",
		},

		darkModeSwitchLabel: "主题",
		sidebarMenuLabel: "菜单",
		returnToTopLabel: "回到顶部",
		langMenuLabel: "多语言",
		outlineTitle: "所有内容👇",
	},
	base: "/tamperMonkey/",
	markdown: {
		lineNumbers: true,
	},
});
