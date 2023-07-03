import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
	title: "WindAndDream | 油猴项目",
	lang: "zh-CN",
	themeConfig: {
		// https://vitepress.dev/reference/default-theme-config
		nav: [
			{ text: "首页", link: "/" },
			{ text: "油猴项目", link: "/temper_monkey/installation" },
			{ text: "GitHub", link: "https://github.com/WindAndDream" },
		],

		sidebar: [
			{
				text: "油猴",
				collapsed: true,
				items: [
					{ text: "安装", link: "/temper_monkey/installation" },
					{
						text: "配置",
						link: "/temper_monkey/configuation",
					},
					{
						text: "使用",
						link: "/temper_monkey/use",
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
	},
	base: "/tamperMonkey/",
});
