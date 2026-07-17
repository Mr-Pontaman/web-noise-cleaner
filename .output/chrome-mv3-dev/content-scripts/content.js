var content = (function() {
	//#region node_modules/.pnpm/wxt@0.20.27_@types+node@26.1.1_eslint@10.7.0_jiti@2.7.0__jiti@2.7.0_rolldown@1.1.5/node_modules/wxt/dist/utils/define-content-script.mjs
	function defineContentScript(definition) {
		return definition;
	}
	//#endregion
	//#region src/constants.ts
	var SITE_CONFIGS = {
		google: {
			label: "Google",
			keywordContainer: "#search div[class*='MjjYud'], #search > div > div",
			elementSelectors: [],
			forceEnglish: () => {
				const url = new URL(window.location.href);
				if (!url.hostname.includes("google.")) return;
				const isHome = url.pathname === "/";
				const isSearch = url.pathname === "/search";
				if (!isHome && !isSearch) return;
				if (url.searchParams.get("hl") === "en" && url.searchParams.get("gl") === "US") return;
				url.searchParams.set("hl", "en");
				url.searchParams.set("gl", "US");
				window.location.replace(url.toString());
			}
		},
		twitter: {
			label: "X (Twitter)",
			keywordContainer: "article",
			elementSelectors: [
				"[aria-label*=\"トレンド\"]",
				"[aria-label*=\"Trends\"]",
				"[aria-label*=\"おすすめユーザー\"]",
				"[aria-label*=\"Who to follow\"]"
			]
		},
		youtube: {
			label: "YouTube",
			keywordContainer: "ytd-compact-video-renderer, ytd-rich-item-renderer, ytd-video-renderer, .ytd-item-section-renderer",
			elementSelectors: [
				"ytd-rich-section-renderer",
				"ytd-ad-slot-renderer",
				"ytd-banner-promo-renderer",
				"#secondary"
			]
		},
		yahoo: {
			label: "Yahoo! JAPAN",
			keywordContainer: ".sw-Card, .newsFeed-entry, .TopicListItem, .TweetList_item",
			elementSelectors: []
		}
	};
	Object.entries(SITE_CONFIGS).map(([id, cfg]) => ({
		id,
		label: cfg.label
	}));
	var DEFAULT_SETTINGS = {
		force_english: {
			enabled: true,
			targets: {
				google: true,
				twitter: false,
				youtube: false,
				yahoo: false
			}
		},
		element_filter: {
			enabled: true,
			targets: {
				google: false,
				twitter: true,
				youtube: true,
				yahoo: false
			}
		},
		keyword_filter: {
			enabled: true,
			targets: {
				google: true,
				twitter: true,
				youtube: true,
				yahoo: true
			}
		},
		noise_keywords: [
			"海外の反応",
			"日本絶賛",
			"日本称賛"
		]
	};
	//#endregion
	//#region src/lib/filter.ts
	var applyElementFilter = (root, selectors) => {
		if (!selectors || selectors.length === 0) return;
		selectors.forEach((selector) => {
			Array.from(root.querySelectorAll(selector)).forEach((el) => {
				const target = el;
				if (target.style.display !== "none") target.style.display = "none";
			});
		});
	};
	var applyKeywordFilter = (root, containerSelector, keywords) => {
		if (!containerSelector) return;
		Array.from(root.querySelectorAll(containerSelector)).forEach((container) => {
			const target = container;
			if (target.style.display === "none") return;
			const combinedText = `${target.textContent || ""} ${Array.from(target.querySelectorAll("[aria-label]")).map((el) => el.getAttribute("aria-label")).filter(Boolean).join(" ")}`;
			if (keywords.some((keyword) => combinedText.includes(keyword))) target.style.display = "none";
		});
	};
	//#endregion
	//#region node_modules/.pnpm/wxt@0.20.27_@types+node@26.1.1_eslint@10.7.0_jiti@2.7.0__jiti@2.7.0_rolldown@1.1.5/node_modules/wxt/dist/browser.mjs
	/**
	* Contains the `browser` export which you should use to access the extension
	* APIs in your project:
	*
	* ```ts
	* import { browser } from 'wxt/browser';
	*
	* browser.runtime.onInstalled.addListener(() => {
	*   // ...
	* });
	* ```
	*
	* @module wxt/browser
	*/
	var browser = globalThis.browser?.runtime?.id ? globalThis.browser : globalThis.chrome;
	//#endregion
	//#region src/lib/storage.ts
	var getSettings = async () => {
		try {
			return await browser.storage.local.get(DEFAULT_SETTINGS) ?? DEFAULT_SETTINGS;
		} catch (error) {
			console.error("Failed to load settings, using defaults:", error);
			return DEFAULT_SETTINGS;
		}
	};
	//#endregion
	//#region src/entrypoints/content/index.ts
	var content_default = defineContentScript({
		matches: [
			"*://*.google.com/*",
			"*://*.twitter.com/*",
			"*://*.x.com/*",
			"*://*.youtube.com/*",
			"*://*.yahoo.co.jp/*"
		],
		async main() {
			const siteKey = Object.keys(SITE_CONFIGS).find((key) => window.location.hostname.includes(key));
			if (!siteKey) return;
			const config = SITE_CONFIGS[siteKey];
			const settings = await getSettings();
			if (settings.force_english.enabled && settings.force_english.targets[siteKey] && config.forceEnglish) config.forceEnglish();
			const runFilters = () => {
				if (settings.element_filter.enabled && settings.element_filter.targets[siteKey]) applyElementFilter(document, config.elementSelectors);
				if (settings.keyword_filter.enabled && settings.keyword_filter.targets[siteKey]) applyKeywordFilter(document, config.keywordContainer, settings.noise_keywords);
			};
			runFilters();
			new MutationObserver(runFilters).observe(document.body, {
				childList: true,
				subtree: true
			});
		}
	});
	//#endregion
	//#region node_modules/.pnpm/wxt@0.20.27_@types+node@26.1.1_eslint@10.7.0_jiti@2.7.0__jiti@2.7.0_rolldown@1.1.5/node_modules/wxt/dist/utils/internal/logger.mjs
	function print$1(method, ...args) {
		if (typeof args[0] === "string") method(`[wxt] ${args.shift()}`, ...args);
		else method("[wxt]", ...args);
	}
	/** Wrapper around `console` with a "[wxt]" prefix */
	var logger$1 = {
		debug: (...args) => print$1(console.debug, ...args),
		log: (...args) => print$1(console.log, ...args),
		warn: (...args) => print$1(console.warn, ...args),
		error: (...args) => print$1(console.error, ...args)
	};
	//#endregion
	//#region node_modules/.pnpm/wxt@0.20.27_@types+node@26.1.1_eslint@10.7.0_jiti@2.7.0__jiti@2.7.0_rolldown@1.1.5/node_modules/wxt/dist/utils/internal/custom-events.mjs
	var WxtLocationChangeEvent = class WxtLocationChangeEvent extends Event {
		static EVENT_NAME = getUniqueEventName("wxt:locationchange");
		constructor(newUrl, oldUrl) {
			super(WxtLocationChangeEvent.EVENT_NAME, {});
			this.newUrl = newUrl;
			this.oldUrl = oldUrl;
		}
	};
	/**
	* Returns an event name unique to the extension and content script that's
	* running.
	*/
	function getUniqueEventName(eventName) {
		return `${browser?.runtime?.id}:content:${eventName}`;
	}
	//#endregion
	//#region node_modules/.pnpm/wxt@0.20.27_@types+node@26.1.1_eslint@10.7.0_jiti@2.7.0__jiti@2.7.0_rolldown@1.1.5/node_modules/wxt/dist/utils/internal/location-watcher.mjs
	var supportsNavigationApi = typeof globalThis.navigation?.addEventListener === "function";
	/**
	* Create a util that watches for URL changes, dispatching the custom event when
	* detected. Stops watching when content script is invalidated. Uses Navigation
	* API when available, otherwise falls back to polling.
	*/
	function createLocationWatcher(ctx) {
		let lastUrl;
		let watching = false;
		return { run() {
			if (watching) return;
			watching = true;
			lastUrl = new URL(location.href);
			if (supportsNavigationApi) globalThis.navigation.addEventListener("navigate", (event) => {
				const newUrl = new URL(event.destination.url);
				if (newUrl.href === lastUrl.href) return;
				window.dispatchEvent(new WxtLocationChangeEvent(newUrl, lastUrl));
				lastUrl = newUrl;
			}, { signal: ctx.signal });
			else ctx.setInterval(() => {
				const newUrl = new URL(location.href);
				if (newUrl.href !== lastUrl.href) {
					window.dispatchEvent(new WxtLocationChangeEvent(newUrl, lastUrl));
					lastUrl = newUrl;
				}
			}, 1e3);
		} };
	}
	//#endregion
	//#region node_modules/.pnpm/wxt@0.20.27_@types+node@26.1.1_eslint@10.7.0_jiti@2.7.0__jiti@2.7.0_rolldown@1.1.5/node_modules/wxt/dist/utils/content-script-context.mjs
	/**
	* Implements
	* [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
	* Used to detect and stop content script code when the script is invalidated.
	*
	* It also provides several utilities like `ctx.setTimeout` and
	* `ctx.setInterval` that should be used in content scripts instead of
	* `window.setTimeout` or `window.setInterval`.
	*
	* To create context for testing, you can use the class's constructor:
	*
	* ```ts
	* import { ContentScriptContext } from 'wxt/utils/content-scripts-context';
	*
	* test('storage listener should be removed when context is invalidated', () => {
	*   const ctx = new ContentScriptContext('test');
	*   const item = storage.defineItem('local:count', { defaultValue: 0 });
	*   const watcher = vi.fn();
	*
	*   const unwatch = item.watch(watcher);
	*   ctx.onInvalidated(unwatch); // Listen for invalidate here
	*
	*   await item.setValue(1);
	*   expect(watcher).toBeCalledTimes(1);
	*   expect(watcher).toBeCalledWith(1, 0);
	*
	*   ctx.notifyInvalidated(); // Use this function to invalidate the context
	*   await item.setValue(2);
	*   expect(watcher).toBeCalledTimes(1);
	* });
	* ```
	*/
	var ContentScriptContext = class ContentScriptContext {
		static SCRIPT_STARTED_MESSAGE_TYPE = getUniqueEventName("wxt:content-script-started");
		id;
		abortController;
		locationWatcher = createLocationWatcher(this);
		constructor(contentScriptName, options) {
			this.contentScriptName = contentScriptName;
			this.options = options;
			this.id = Math.random().toString(36).slice(2);
			this.abortController = new AbortController();
			this.stopOldScripts();
			this.listenForNewerScripts();
		}
		get signal() {
			return this.abortController.signal;
		}
		abort(reason) {
			return this.abortController.abort(reason);
		}
		get isInvalid() {
			if (browser.runtime?.id == null) this.notifyInvalidated();
			return this.signal.aborted;
		}
		get isValid() {
			return !this.isInvalid;
		}
		/**
		* Add a listener that is called when the content script's context is
		* invalidated.
		*
		* @example
		*   browser.runtime.onMessage.addListener(cb);
		*   const removeInvalidatedListener = ctx.onInvalidated(() => {
		*     browser.runtime.onMessage.removeListener(cb);
		*   });
		*   // ...
		*   removeInvalidatedListener();
		*
		* @returns A function to remove the listener.
		*/
		onInvalidated(cb) {
			this.signal.addEventListener("abort", cb);
			return () => this.signal.removeEventListener("abort", cb);
		}
		/**
		* Return a promise that never resolves. Useful if you have an async function
		* that shouldn't run after the context is expired.
		*
		* @example
		*   const getValueFromStorage = async () => {
		*     if (ctx.isInvalid) return ctx.block();
		*
		*     // ...
		*   };
		*/
		block() {
			return new Promise(() => {});
		}
		/**
		* Wrapper around `window.setInterval` that automatically clears the interval
		* when invalidated.
		*
		* Intervals can be cleared by calling the normal `clearInterval` function.
		*/
		setInterval(handler, timeout) {
			const id = setInterval(() => {
				if (this.isValid) handler();
			}, timeout);
			this.onInvalidated(() => clearInterval(id));
			return id;
		}
		/**
		* Wrapper around `window.setTimeout` that automatically clears the interval
		* when invalidated.
		*
		* Timeouts can be cleared by calling the normal `setTimeout` function.
		*/
		setTimeout(handler, timeout) {
			const id = setTimeout(() => {
				if (this.isValid) handler();
			}, timeout);
			this.onInvalidated(() => clearTimeout(id));
			return id;
		}
		/**
		* Wrapper around `window.requestAnimationFrame` that automatically cancels
		* the request when invalidated.
		*
		* Callbacks can be canceled by calling the normal `cancelAnimationFrame`
		* function.
		*/
		requestAnimationFrame(callback) {
			const id = requestAnimationFrame((...args) => {
				if (this.isValid) callback(...args);
			});
			this.onInvalidated(() => cancelAnimationFrame(id));
			return id;
		}
		/**
		* Wrapper around `window.requestIdleCallback` that automatically cancels the
		* request when invalidated.
		*
		* Callbacks can be canceled by calling the normal `cancelIdleCallback`
		* function.
		*/
		requestIdleCallback(callback, options) {
			const id = requestIdleCallback((...args) => {
				if (!this.signal.aborted) callback(...args);
			}, options);
			this.onInvalidated(() => cancelIdleCallback(id));
			return id;
		}
		addEventListener(target, type, handler, options) {
			if (type === "wxt:locationchange") {
				if (this.isValid) this.locationWatcher.run();
			}
			target.addEventListener?.(type.startsWith("wxt:") ? getUniqueEventName(type) : type, handler, {
				...options,
				signal: this.signal
			});
		}
		/**
		* @internal
		* Abort the abort controller and execute all `onInvalidated` listeners.
		*/
		notifyInvalidated() {
			this.abort("Content script context invalidated");
			logger$1.debug(`Content script "${this.contentScriptName}" context invalidated`);
		}
		stopOldScripts() {
			document.dispatchEvent(new CustomEvent(ContentScriptContext.SCRIPT_STARTED_MESSAGE_TYPE, { detail: {
				contentScriptName: this.contentScriptName,
				messageId: this.id
			} }));
			if (!this.options?.noScriptStartedPostMessage) window.postMessage({
				type: ContentScriptContext.SCRIPT_STARTED_MESSAGE_TYPE,
				contentScriptName: this.contentScriptName,
				messageId: this.id
			}, "*");
		}
		verifyScriptStartedEvent(event) {
			const isSameContentScript = event.detail?.contentScriptName === this.contentScriptName;
			const isFromSelf = event.detail?.messageId === this.id;
			return isSameContentScript && !isFromSelf;
		}
		listenForNewerScripts() {
			const cb = (event) => {
				if (!(event instanceof CustomEvent) || !this.verifyScriptStartedEvent(event)) return;
				this.notifyInvalidated();
			};
			document.addEventListener(ContentScriptContext.SCRIPT_STARTED_MESSAGE_TYPE, cb);
			this.onInvalidated(() => document.removeEventListener(ContentScriptContext.SCRIPT_STARTED_MESSAGE_TYPE, cb));
		}
	};
	//#endregion
	//#region \0virtual:wxt-content-script-isolated-world-entrypoint?/home/kouhei/Code/development/extenstion-1/wxt-dev-wxt/src/entrypoints/content/index.ts
	function print(method, ...args) {
		if (typeof args[0] === "string") method(`[wxt] ${args.shift()}`, ...args);
		else method("[wxt]", ...args);
	}
	/** Wrapper around `console` with a "[wxt]" prefix */
	var logger = {
		debug: (...args) => print(console.debug, ...args),
		log: (...args) => print(console.log, ...args),
		warn: (...args) => print(console.warn, ...args),
		error: (...args) => print(console.error, ...args)
	};
	//#endregion
	return (async () => {
		try {
			const { main, ...options } = content_default;
			return await main(new ContentScriptContext("content", options));
		} catch (err) {
			logger.error(`The content script "content" crashed on startup!`, err);
			throw err;
		}
	})();
})();

content;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGVudC5qcyIsIm5hbWVzIjpbImJyb3dzZXIiLCJwcmludCIsImxvZ2dlciJdLCJzb3VyY2VzIjpbIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS93eHRAMC4yMC4yN19AdHlwZXMrbm9kZUAyNi4xLjFfZXNsaW50QDEwLjcuMF9qaXRpQDIuNy4wX19qaXRpQDIuNy4wX3JvbGxkb3duQDEuMS41L25vZGVfbW9kdWxlcy93eHQvZGlzdC91dGlscy9kZWZpbmUtY29udGVudC1zY3JpcHQubWpzIiwiLi4vLi4vLi4vc3JjL2NvbnN0YW50cy50cyIsIi4uLy4uLy4uL3NyYy9saWIvZmlsdGVyLnRzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL0B3eHQtZGV2K2Jyb3dzZXJAMC4yLjIvbm9kZV9tb2R1bGVzL0B3eHQtZGV2L2Jyb3dzZXIvc3JjL2luZGV4Lm1qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS93eHRAMC4yMC4yN19AdHlwZXMrbm9kZUAyNi4xLjFfZXNsaW50QDEwLjcuMF9qaXRpQDIuNy4wX19qaXRpQDIuNy4wX3JvbGxkb3duQDEuMS41L25vZGVfbW9kdWxlcy93eHQvZGlzdC9icm93c2VyLm1qcyIsIi4uLy4uLy4uL3NyYy9saWIvc3RvcmFnZS50cyIsIi4uLy4uLy4uL3NyYy9lbnRyeXBvaW50cy9jb250ZW50L2luZGV4LnRzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3d4dEAwLjIwLjI3X0B0eXBlcytub2RlQDI2LjEuMV9lc2xpbnRAMTAuNy4wX2ppdGlAMi43LjBfX2ppdGlAMi43LjBfcm9sbGRvd25AMS4xLjUvbm9kZV9tb2R1bGVzL3d4dC9kaXN0L3V0aWxzL2ludGVybmFsL2xvZ2dlci5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vd3h0QDAuMjAuMjdfQHR5cGVzK25vZGVAMjYuMS4xX2VzbGludEAxMC43LjBfaml0aUAyLjcuMF9faml0aUAyLjcuMF9yb2xsZG93bkAxLjEuNS9ub2RlX21vZHVsZXMvd3h0L2Rpc3QvdXRpbHMvaW50ZXJuYWwvY3VzdG9tLWV2ZW50cy5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vd3h0QDAuMjAuMjdfQHR5cGVzK25vZGVAMjYuMS4xX2VzbGludEAxMC43LjBfaml0aUAyLjcuMF9faml0aUAyLjcuMF9yb2xsZG93bkAxLjEuNS9ub2RlX21vZHVsZXMvd3h0L2Rpc3QvdXRpbHMvaW50ZXJuYWwvbG9jYXRpb24td2F0Y2hlci5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vd3h0QDAuMjAuMjdfQHR5cGVzK25vZGVAMjYuMS4xX2VzbGludEAxMC43LjBfaml0aUAyLjcuMF9faml0aUAyLjcuMF9yb2xsZG93bkAxLjEuNS9ub2RlX21vZHVsZXMvd3h0L2Rpc3QvdXRpbHMvY29udGVudC1zY3JpcHQtY29udGV4dC5tanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8jcmVnaW9uIHNyYy91dGlscy9kZWZpbmUtY29udGVudC1zY3JpcHQudHNcbmZ1bmN0aW9uIGRlZmluZUNvbnRlbnRTY3JpcHQoZGVmaW5pdGlvbikge1xuXHRyZXR1cm4gZGVmaW5pdGlvbjtcbn1cbi8vI2VuZHJlZ2lvblxuZXhwb3J0IHsgZGVmaW5lQ29udGVudFNjcmlwdCB9O1xuIiwiaW1wb3J0IHsgU3RvcmFnZVNldHRpbmdzIH0gZnJvbSBcIi4vdHlwZXNcIjtcblxuaW50ZXJmYWNlIFNpdGVDb25maWcge1xuICBsYWJlbDogc3RyaW5nO1xuICBrZXl3b3JkQ29udGFpbmVyOiBzdHJpbmc7XG4gIGVsZW1lbnRTZWxlY3RvcnM6IHJlYWRvbmx5IHN0cmluZ1tdO1xuICBmb3JjZUVuZ2xpc2g/OiAoKSA9PiB2b2lkO1xufVxuXG5leHBvcnQgdHlwZSBTaXRlS2V5ID0gXCJnb29nbGVcIiB8IFwidHdpdHRlclwiIHwgXCJ5b3V0dWJlXCIgfCBcInlhaG9vXCI7XG5cbmV4cG9ydCBjb25zdCBTSVRFX0NPTkZJR1M6IFJlY29yZDxTaXRlS2V5LCBTaXRlQ29uZmlnPiA9IHtcbiAgZ29vZ2xlOiB7XG4gICAgbGFiZWw6IFwiR29vZ2xlXCIsXG4gICAgLy8gKuOCq+ODvOODieOBriBNampZdWQg44Go44GE44GG44Kv44Op44K55ZCN44Gv5piO5pel44Gr44KC5aSJ44KP44Gj44Gm44GE44KL5Y+v6IO95oCn44GM6auY44GE44CCXG4gICAgLy8g44Kr44O844OJ44GMc2VhcmNo44Gu77yS5YCL5LiL44GuZGl244Gn44GC44KL44GT44Go44Gv5aSJ44KP44KJ44Gq44GE44Gv44Ga44CCXG4gICAga2V5d29yZENvbnRhaW5lcjogXCIjc2VhcmNoIGRpdltjbGFzcyo9J01qall1ZCddLCAjc2VhcmNoID4gZGl2ID4gZGl2XCIsXG4gICAgZWxlbWVudFNlbGVjdG9yczogW10sXG4gICAgZm9yY2VFbmdsaXNoOiAoKSA9PiB7XG4gICAgICBjb25zdCB1cmwgPSBuZXcgVVJMKHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcbiAgICAgIC8vIDEuIEdvb2dsZeODieODoeOCpOODs+OBi+eiuuiqjSAo5b+144Gu44Gf44KBKVxuICAgICAgaWYgKCF1cmwuaG9zdG5hbWUuaW5jbHVkZXMoXCJnb29nbGUuXCIpKSByZXR1cm47XG4gICAgICAvLyAyLiDjgIzjg4jjg4Pjg5fjg5rjg7zjgrgoLynjgI3jgYvjgIzmpJzntKLjg5rjg7zjgrgoL3NlYXJjaCnjgI3ku6XlpJbjga/lh6bnkIbjgZfjgarjgYRcbiAgICAgIGNvbnN0IGlzSG9tZSA9IHVybC5wYXRobmFtZSA9PT0gXCIvXCI7XG4gICAgICBjb25zdCBpc1NlYXJjaCA9IHVybC5wYXRobmFtZSA9PT0gXCIvc2VhcmNoXCI7XG4gICAgICBpZiAoIWlzSG9tZSAmJiAhaXNTZWFyY2gpIHJldHVybjtcblxuICAgICAgLy8gMy4g44GZ44Gn44Gr6Iux6Kqe6Kit5a6a44Gq44KJ44Or44O844OX6Ziy5q2i44Gu44Gf44KB44Gr5L2V44KC44GX44Gq44GEXG4gICAgICBpZiAoXG4gICAgICAgIHVybC5zZWFyY2hQYXJhbXMuZ2V0KFwiaGxcIikgPT09IFwiZW5cIiAmJlxuICAgICAgICB1cmwuc2VhcmNoUGFyYW1zLmdldChcImdsXCIpID09PSBcIlVTXCJcbiAgICAgIClcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICAvLyA0LiDjg5Hjg6njg6Hjg7zjgr/jgpLku5jkuI5cbiAgICAgIHVybC5zZWFyY2hQYXJhbXMuc2V0KFwiaGxcIiwgXCJlblwiKTtcbiAgICAgIHVybC5zZWFyY2hQYXJhbXMuc2V0KFwiZ2xcIiwgXCJVU1wiKTtcblxuICAgICAgLy8gNS4gcmVwbGFjZeOCkuS9v+OBhuOBqOWxpeattOOBq+aui+OCieOBquOBhOOBn+OCgeOAgeODluODqeOCpuOCtuOBruOAjOaIu+OCi+OAjeOBjOato+W4uOOBq+WLleOBj1xuICAgICAgd2luZG93LmxvY2F0aW9uLnJlcGxhY2UodXJsLnRvU3RyaW5nKCkpO1xuICAgIH0sXG4gIH0sXG4gIHR3aXR0ZXI6IHtcbiAgICBsYWJlbDogXCJYIChUd2l0dGVyKVwiLFxuICAgIGtleXdvcmRDb250YWluZXI6IFwiYXJ0aWNsZVwiLFxuICAgIGVsZW1lbnRTZWxlY3RvcnM6IFtcbiAgICAgICdbYXJpYS1sYWJlbCo9XCLjg4jjg6zjg7Pjg4lcIl0nLFxuICAgICAgJ1thcmlhLWxhYmVsKj1cIlRyZW5kc1wiXScsXG4gICAgICAnW2FyaWEtbGFiZWwqPVwi44GK44GZ44GZ44KB44Om44O844K244O8XCJdJyxcbiAgICAgICdbYXJpYS1sYWJlbCo9XCJXaG8gdG8gZm9sbG93XCJdJyxcbiAgICBdLFxuICB9LFxuICB5b3V0dWJlOiB7XG4gICAgbGFiZWw6IFwiWW91VHViZVwiLFxuICAgIGtleXdvcmRDb250YWluZXI6XG4gICAgICBcInl0ZC1jb21wYWN0LXZpZGVvLXJlbmRlcmVyLCB5dGQtcmljaC1pdGVtLXJlbmRlcmVyLCB5dGQtdmlkZW8tcmVuZGVyZXIsIC55dGQtaXRlbS1zZWN0aW9uLXJlbmRlcmVyXCIsXG4gICAgZWxlbWVudFNlbGVjdG9yczogW1xuICAgICAgXCJ5dGQtcmljaC1zZWN0aW9uLXJlbmRlcmVyXCIsXG4gICAgICBcInl0ZC1hZC1zbG90LXJlbmRlcmVyXCIsXG4gICAgICBcInl0ZC1iYW5uZXItcHJvbW8tcmVuZGVyZXJcIixcbiAgICAgIFwiI3NlY29uZGFyeVwiLFxuICAgIF0sXG4gIH0sXG4gIHlhaG9vOiB7XG4gICAgbGFiZWw6IFwiWWFob28hIEpBUEFOXCIsXG4gICAga2V5d29yZENvbnRhaW5lcjpcbiAgICAgIFwiLnN3LUNhcmQsIC5uZXdzRmVlZC1lbnRyeSwgLlRvcGljTGlzdEl0ZW0sIC5Ud2VldExpc3RfaXRlbVwiLFxuICAgIGVsZW1lbnRTZWxlY3RvcnM6IFtdLFxuICB9LFxufTtcblxuLy8gVUnjgafkvb/jgYbjgrXjgqTjg4jkuIDopqdcbmV4cG9ydCBjb25zdCBTSVRFUyA9IE9iamVjdC5lbnRyaWVzKFNJVEVfQ09ORklHUykubWFwKChbaWQsIGNmZ10pID0+ICh7XG4gIGlkOiBpZCBhcyBTaXRlS2V5LFxuICBsYWJlbDogY2ZnLmxhYmVsLFxufSkpO1xuXG4vLyDjg4fjg5Xjgqnjg6vjg4jjga7jg47jgqTjgrrjgq3jg7zjg6/jg7zjg4lcbmV4cG9ydCBjb25zdCBOT0lTRV9LRVlXT1JEUyA9IFtcIua1t+WkluOBruWPjeW/nFwiLCBcIuaXpeacrOe1tuizm1wiLCBcIuaXpeacrOensOizm1wiXTtcblxuLy8gMi4g44K544OI44Os44O844K444Gu5Yid5pyf54q25oWL77yI5pei5a2Y44GuREVGQVVMVF9TRVRUSU5HU++8iVxuZXhwb3J0IGNvbnN0IERFRkFVTFRfU0VUVElOR1MgPSB7XG4gIGZvcmNlX2VuZ2xpc2g6IHtcbiAgICBlbmFibGVkOiB0cnVlLFxuICAgIHRhcmdldHM6IHsgZ29vZ2xlOiB0cnVlLCB0d2l0dGVyOiBmYWxzZSwgeW91dHViZTogZmFsc2UsIHlhaG9vOiBmYWxzZSB9LFxuICB9LFxuICBlbGVtZW50X2ZpbHRlcjoge1xuICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgdGFyZ2V0czogeyBnb29nbGU6IGZhbHNlLCB0d2l0dGVyOiB0cnVlLCB5b3V0dWJlOiB0cnVlLCB5YWhvbzogZmFsc2UgfSxcbiAgfSxcbiAga2V5d29yZF9maWx0ZXI6IHtcbiAgICBlbmFibGVkOiB0cnVlLFxuICAgIHRhcmdldHM6IHsgZ29vZ2xlOiB0cnVlLCB0d2l0dGVyOiB0cnVlLCB5b3V0dWJlOiB0cnVlLCB5YWhvbzogdHJ1ZSB9LFxuICB9LFxuICBub2lzZV9rZXl3b3JkczogTk9JU0VfS0VZV09SRFMsXG59IHNhdGlzZmllcyBTdG9yYWdlU2V0dGluZ3M7XG5cbi8vIFVSTOODnuODg+ODgeODkeOCv+ODvOODs1xuZXhwb3J0IGNvbnN0IE1BVENIX1VSTFMgPSBbXG4gIHsgbmFtZTogXCJnb29nbGVcIiwgdXJsOiBcIio6Ly8qLmdvb2dsZS5jb20vKlwiIH0sXG4gIHsgbmFtZTogXCJ0d2l0dGVyXCIsIHVybDogXCIqOi8vKi50d2l0dGVyLmNvbS8qXCIgfSxcbiAgeyBuYW1lOiBcInhcIiwgdXJsOiBcIio6Ly8qLnguY29tLypcIiB9LFxuICB7IG5hbWU6IFwieW91dHViZVwiLCB1cmw6IFwiKjovLyoueW91dHViZS5jb20vKlwiIH0sXG4gIHsgbmFtZTogXCJ5YWhvb1wiLCB1cmw6IFwiKjovLyoueWFob28uY28uanAvKlwiIH0sXG5dIGFzIGNvbnN0O1xuIiwiLy8g6KaB57Sg44KS6Zqg44GZ5rGO55So6Zai5pWwXG5leHBvcnQgY29uc3QgYXBwbHlFbGVtZW50RmlsdGVyID0gKFxuICByb290OiBIVE1MRWxlbWVudCB8IERvY3VtZW50LFxuICBzZWxlY3RvcnM6IHJlYWRvbmx5IHN0cmluZ1tdXG4pID0+IHtcbiAgaWYgKCFzZWxlY3RvcnMgfHwgc2VsZWN0b3JzLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuXG4gIHNlbGVjdG9ycy5mb3JFYWNoKChzZWxlY3RvcikgPT4ge1xuICAgIGNvbnN0IGVsZW1lbnRzID0gQXJyYXkuZnJvbShyb290LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpKTtcbiAgICBlbGVtZW50cy5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgY29uc3QgdGFyZ2V0ID0gZWwgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICBpZiAodGFyZ2V0LnN0eWxlLmRpc3BsYXkgIT09IFwibm9uZVwiKSB7XG4gICAgICAgIHRhcmdldC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufTtcblxuLy8g44Kt44O844Ov44O844OJ44Gn57We44KK6L6844KA5rGO55So6Zai5pWwXG5leHBvcnQgY29uc3QgYXBwbHlLZXl3b3JkRmlsdGVyID0gKFxuICByb290OiBIVE1MRWxlbWVudCB8IERvY3VtZW50LFxuICBjb250YWluZXJTZWxlY3Rvcjogc3RyaW5nLFxuICBrZXl3b3Jkczogc3RyaW5nW11cbikgPT4ge1xuICBpZiAoIWNvbnRhaW5lclNlbGVjdG9yKSByZXR1cm47XG5cbiAgY29uc3QgY29udGFpbmVycyA9IEFycmF5LmZyb20ocm9vdC5xdWVyeVNlbGVjdG9yQWxsKGNvbnRhaW5lclNlbGVjdG9yKSk7XG4gIGNvbnRhaW5lcnMuZm9yRWFjaCgoY29udGFpbmVyKSA9PiB7XG4gICAgY29uc3QgdGFyZ2V0ID0gY29udGFpbmVyIGFzIEhUTUxFbGVtZW50O1xuICAgIGlmICh0YXJnZXQuc3R5bGUuZGlzcGxheSA9PT0gXCJub25lXCIpIHJldHVybjtcblxuICAgIGNvbnN0IHRleHRDb250ZW50ID0gdGFyZ2V0LnRleHRDb250ZW50IHx8IFwiXCI7XG4gICAgLy8gYXJpYS1sYWJlbOOCguWQq+OCgeOBpuODhuOCreOCueODiOWIpOWumlxuICAgIGNvbnN0IGxhYmVscyA9IEFycmF5LmZyb20odGFyZ2V0LnF1ZXJ5U2VsZWN0b3JBbGwoXCJbYXJpYS1sYWJlbF1cIikpXG4gICAgICAubWFwKChlbCkgPT4gZWwuZ2V0QXR0cmlidXRlKFwiYXJpYS1sYWJlbFwiKSlcbiAgICAgIC5maWx0ZXIoQm9vbGVhbik7XG5cbiAgICBjb25zdCBjb21iaW5lZFRleHQgPSBgJHt0ZXh0Q29udGVudH0gJHtsYWJlbHMuam9pbihcIiBcIil9YDtcblxuICAgIGlmIChrZXl3b3Jkcy5zb21lKChrZXl3b3JkKSA9PiBjb21iaW5lZFRleHQuaW5jbHVkZXMoa2V5d29yZCkpKSB7XG4gICAgICB0YXJnZXQuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIH1cbiAgfSk7XG59O1xuIiwiLy8gI3JlZ2lvbiBzbmlwcGV0XG5leHBvcnQgY29uc3QgYnJvd3NlciA9IGdsb2JhbFRoaXMuYnJvd3Nlcj8ucnVudGltZT8uaWRcbiAgPyBnbG9iYWxUaGlzLmJyb3dzZXJcbiAgOiBnbG9iYWxUaGlzLmNocm9tZTtcbi8vICNlbmRyZWdpb24gc25pcHBldFxuIiwiaW1wb3J0IHsgYnJvd3NlciBhcyBicm93c2VyJDEgfSBmcm9tIFwiQHd4dC1kZXYvYnJvd3NlclwiO1xuLy8jcmVnaW9uIHNyYy9icm93c2VyLnRzXG4vKipcbiogQ29udGFpbnMgdGhlIGBicm93c2VyYCBleHBvcnQgd2hpY2ggeW91IHNob3VsZCB1c2UgdG8gYWNjZXNzIHRoZSBleHRlbnNpb25cbiogQVBJcyBpbiB5b3VyIHByb2plY3Q6XG4qXG4qIGBgYHRzXG4qIGltcG9ydCB7IGJyb3dzZXIgfSBmcm9tICd3eHQvYnJvd3Nlcic7XG4qXG4qIGJyb3dzZXIucnVudGltZS5vbkluc3RhbGxlZC5hZGRMaXN0ZW5lcigoKSA9PiB7XG4qICAgLy8gLi4uXG4qIH0pO1xuKiBgYGBcbipcbiogQG1vZHVsZSB3eHQvYnJvd3NlclxuKi9cbmNvbnN0IGJyb3dzZXIgPSBicm93c2VyJDE7XG4vLyNlbmRyZWdpb25cbmV4cG9ydCB7IGJyb3dzZXIgfTtcbiIsImltcG9ydCB7IERFRkFVTFRfU0VUVElOR1MgfSBmcm9tIFwiQC9jb25zdGFudHNcIjtcbmltcG9ydCB7IFN0b3JhZ2VTZXR0aW5ncyB9IGZyb20gXCJAL3R5cGVzXCI7XG5pbXBvcnQgeyBicm93c2VyIH0gZnJvbSBcInd4dC9icm93c2VyXCI7XG5cbmV4cG9ydCBjb25zdCBnZXRTZXR0aW5ncyA9IGFzeW5jICgpOiBQcm9taXNlPFN0b3JhZ2VTZXR0aW5ncz4gPT4ge1xuICB0cnkge1xuICAgIC8vIGxvY2FsU3RvcmFnZeOBqOeVsOOBquOCimtleeOBoOOBkea4oeOBleOBmuOCquODluOCuOOCp+OCr+ODiOOCkuS4uOOBlOOBqOa4oeOBl+OBpuOBhOOCi+OBjOOAgVxuICAgIC8vIOODluODqeOCpuOCtuOBq+S/neWtmOOBleOCjOOBpuOBhOOCi+WApOOBp+S4iuabuOOBjeOBleOCjOOCi+S7lee1hOOBv+OBq+OBquOBo+OBpuOBhOOCi+OAglxuICAgIGNvbnN0IHJlcyA9IGF3YWl0IGJyb3dzZXIuc3RvcmFnZS5sb2NhbC5nZXQoREVGQVVMVF9TRVRUSU5HUyk7XG5cbiAgICByZXR1cm4gKHJlcyBhcyB1bmtub3duIGFzIFN0b3JhZ2VTZXR0aW5ncykgPz8gREVGQVVMVF9TRVRUSU5HUztcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKFwiRmFpbGVkIHRvIGxvYWQgc2V0dGluZ3MsIHVzaW5nIGRlZmF1bHRzOlwiLCBlcnJvcik7XG4gICAgcmV0dXJuIERFRkFVTFRfU0VUVElOR1M7XG4gIH1cbn07XG4iLCJpbXBvcnQgeyBTSVRFX0NPTkZJR1MsIFNpdGVLZXkgfSBmcm9tIFwiQC9jb25zdGFudHNcIjtcbmltcG9ydCB7IGFwcGx5RWxlbWVudEZpbHRlciwgYXBwbHlLZXl3b3JkRmlsdGVyIH0gZnJvbSBcIkAvbGliL2ZpbHRlclwiO1xuaW1wb3J0IHsgZ2V0U2V0dGluZ3MgfSBmcm9tIFwiQC9saWIvc3RvcmFnZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb250ZW50U2NyaXB0KHtcbiAgbWF0Y2hlczogW1xuICAgIFwiKjovLyouZ29vZ2xlLmNvbS8qXCIsXG4gICAgXCIqOi8vKi50d2l0dGVyLmNvbS8qXCIsXG4gICAgXCIqOi8vKi54LmNvbS8qXCIsXG4gICAgXCIqOi8vKi55b3V0dWJlLmNvbS8qXCIsXG4gICAgXCIqOi8vKi55YWhvby5jby5qcC8qXCIsXG4gIF0sXG4gIGFzeW5jIG1haW4oKSB7XG4gICAgY29uc3Qgc2l0ZUtleSA9IE9iamVjdC5rZXlzKFNJVEVfQ09ORklHUykuZmluZCgoa2V5KSA9PlxuICAgICAgd2luZG93LmxvY2F0aW9uLmhvc3RuYW1lLmluY2x1ZGVzKGtleSlcbiAgICApIGFzIFNpdGVLZXk7XG4gICAgaWYgKCFzaXRlS2V5KSByZXR1cm47XG5cbiAgICBjb25zdCBjb25maWcgPSBTSVRFX0NPTkZJR1Nbc2l0ZUtleV07XG4gICAgY29uc3Qgc2V0dGluZ3MgPSBhd2FpdCBnZXRTZXR0aW5ncygpO1xuXG4gICAgaWYgKFxuICAgICAgc2V0dGluZ3MuZm9yY2VfZW5nbGlzaC5lbmFibGVkICYmXG4gICAgICBzZXR0aW5ncy5mb3JjZV9lbmdsaXNoLnRhcmdldHNbc2l0ZUtleV0gJiZcbiAgICAgIGNvbmZpZy5mb3JjZUVuZ2xpc2hcbiAgICApIHtcbiAgICAgIGNvbmZpZy5mb3JjZUVuZ2xpc2goKTtcbiAgICB9XG5cbiAgICAvLyAyLiDjg5XjgqPjg6vjgr/jg7zpgannlKjjg63jgrjjg4Pjgq9cbiAgICBjb25zdCBydW5GaWx0ZXJzID0gKCkgPT4ge1xuICAgICAgaWYgKFxuICAgICAgICBzZXR0aW5ncy5lbGVtZW50X2ZpbHRlci5lbmFibGVkICYmXG4gICAgICAgIHNldHRpbmdzLmVsZW1lbnRfZmlsdGVyLnRhcmdldHNbc2l0ZUtleV1cbiAgICAgICkge1xuICAgICAgICBhcHBseUVsZW1lbnRGaWx0ZXIoZG9jdW1lbnQsIGNvbmZpZy5lbGVtZW50U2VsZWN0b3JzKTtcbiAgICAgIH1cbiAgICAgIGlmIChcbiAgICAgICAgc2V0dGluZ3Mua2V5d29yZF9maWx0ZXIuZW5hYmxlZCAmJlxuICAgICAgICBzZXR0aW5ncy5rZXl3b3JkX2ZpbHRlci50YXJnZXRzW3NpdGVLZXldXG4gICAgICApIHtcbiAgICAgICAgYXBwbHlLZXl3b3JkRmlsdGVyKFxuICAgICAgICAgIGRvY3VtZW50LFxuICAgICAgICAgIGNvbmZpZy5rZXl3b3JkQ29udGFpbmVyLFxuICAgICAgICAgIHNldHRpbmdzLm5vaXNlX2tleXdvcmRzXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJ1bkZpbHRlcnMoKTtcbiAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKHJ1bkZpbHRlcnMpO1xuICAgIG9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQuYm9keSwgeyBjaGlsZExpc3Q6IHRydWUsIHN1YnRyZWU6IHRydWUgfSk7XG4gIH0sXG59KTtcbiIsIi8vI3JlZ2lvbiBzcmMvdXRpbHMvaW50ZXJuYWwvbG9nZ2VyLnRzXG5mdW5jdGlvbiBwcmludChtZXRob2QsIC4uLmFyZ3MpIHtcblx0aWYgKGltcG9ydC5tZXRhLmVudi5NT0RFID09PSBcInByb2R1Y3Rpb25cIikgcmV0dXJuO1xuXHRpZiAodHlwZW9mIGFyZ3NbMF0gPT09IFwic3RyaW5nXCIpIG1ldGhvZChgW3d4dF0gJHthcmdzLnNoaWZ0KCl9YCwgLi4uYXJncyk7XG5cdGVsc2UgbWV0aG9kKFwiW3d4dF1cIiwgLi4uYXJncyk7XG59XG4vKiogV3JhcHBlciBhcm91bmQgYGNvbnNvbGVgIHdpdGggYSBcIlt3eHRdXCIgcHJlZml4ICovXG5jb25zdCBsb2dnZXIgPSB7XG5cdGRlYnVnOiAoLi4uYXJncykgPT4gcHJpbnQoY29uc29sZS5kZWJ1ZywgLi4uYXJncyksXG5cdGxvZzogKC4uLmFyZ3MpID0+IHByaW50KGNvbnNvbGUubG9nLCAuLi5hcmdzKSxcblx0d2FybjogKC4uLmFyZ3MpID0+IHByaW50KGNvbnNvbGUud2FybiwgLi4uYXJncyksXG5cdGVycm9yOiAoLi4uYXJncykgPT4gcHJpbnQoY29uc29sZS5lcnJvciwgLi4uYXJncylcbn07XG4vLyNlbmRyZWdpb25cbmV4cG9ydCB7IGxvZ2dlciB9O1xuIiwiaW1wb3J0IHsgYnJvd3NlciB9IGZyb20gXCJ3eHQvYnJvd3NlclwiO1xuLy8jcmVnaW9uIHNyYy91dGlscy9pbnRlcm5hbC9jdXN0b20tZXZlbnRzLnRzXG52YXIgV3h0TG9jYXRpb25DaGFuZ2VFdmVudCA9IGNsYXNzIFd4dExvY2F0aW9uQ2hhbmdlRXZlbnQgZXh0ZW5kcyBFdmVudCB7XG5cdHN0YXRpYyBFVkVOVF9OQU1FID0gZ2V0VW5pcXVlRXZlbnROYW1lKFwid3h0OmxvY2F0aW9uY2hhbmdlXCIpO1xuXHRjb25zdHJ1Y3RvcihuZXdVcmwsIG9sZFVybCkge1xuXHRcdHN1cGVyKFd4dExvY2F0aW9uQ2hhbmdlRXZlbnQuRVZFTlRfTkFNRSwge30pO1xuXHRcdHRoaXMubmV3VXJsID0gbmV3VXJsO1xuXHRcdHRoaXMub2xkVXJsID0gb2xkVXJsO1xuXHR9XG59O1xuLyoqXG4qIFJldHVybnMgYW4gZXZlbnQgbmFtZSB1bmlxdWUgdG8gdGhlIGV4dGVuc2lvbiBhbmQgY29udGVudCBzY3JpcHQgdGhhdCdzXG4qIHJ1bm5pbmcuXG4qL1xuZnVuY3Rpb24gZ2V0VW5pcXVlRXZlbnROYW1lKGV2ZW50TmFtZSkge1xuXHRyZXR1cm4gYCR7YnJvd3Nlcj8ucnVudGltZT8uaWR9OiR7aW1wb3J0Lm1ldGEuZW52LkVOVFJZUE9JTlR9OiR7ZXZlbnROYW1lfWA7XG59XG4vLyNlbmRyZWdpb25cbmV4cG9ydCB7IFd4dExvY2F0aW9uQ2hhbmdlRXZlbnQsIGdldFVuaXF1ZUV2ZW50TmFtZSB9O1xuIiwiaW1wb3J0IHsgV3h0TG9jYXRpb25DaGFuZ2VFdmVudCB9IGZyb20gXCIuL2N1c3RvbS1ldmVudHMubWpzXCI7XG4vLyNyZWdpb24gc3JjL3V0aWxzL2ludGVybmFsL2xvY2F0aW9uLXdhdGNoZXIudHNcbmNvbnN0IHN1cHBvcnRzTmF2aWdhdGlvbkFwaSA9IHR5cGVvZiBnbG9iYWxUaGlzLm5hdmlnYXRpb24/LmFkZEV2ZW50TGlzdGVuZXIgPT09IFwiZnVuY3Rpb25cIjtcbi8qKlxuKiBDcmVhdGUgYSB1dGlsIHRoYXQgd2F0Y2hlcyBmb3IgVVJMIGNoYW5nZXMsIGRpc3BhdGNoaW5nIHRoZSBjdXN0b20gZXZlbnQgd2hlblxuKiBkZXRlY3RlZC4gU3RvcHMgd2F0Y2hpbmcgd2hlbiBjb250ZW50IHNjcmlwdCBpcyBpbnZhbGlkYXRlZC4gVXNlcyBOYXZpZ2F0aW9uXG4qIEFQSSB3aGVuIGF2YWlsYWJsZSwgb3RoZXJ3aXNlIGZhbGxzIGJhY2sgdG8gcG9sbGluZy5cbiovXG5mdW5jdGlvbiBjcmVhdGVMb2NhdGlvbldhdGNoZXIoY3R4KSB7XG5cdGxldCBsYXN0VXJsO1xuXHRsZXQgd2F0Y2hpbmcgPSBmYWxzZTtcblx0cmV0dXJuIHsgcnVuKCkge1xuXHRcdGlmICh3YXRjaGluZykgcmV0dXJuO1xuXHRcdHdhdGNoaW5nID0gdHJ1ZTtcblx0XHRsYXN0VXJsID0gbmV3IFVSTChsb2NhdGlvbi5ocmVmKTtcblx0XHRpZiAoc3VwcG9ydHNOYXZpZ2F0aW9uQXBpKSBnbG9iYWxUaGlzLm5hdmlnYXRpb24uYWRkRXZlbnRMaXN0ZW5lcihcIm5hdmlnYXRlXCIsIChldmVudCkgPT4ge1xuXHRcdFx0Y29uc3QgbmV3VXJsID0gbmV3IFVSTChldmVudC5kZXN0aW5hdGlvbi51cmwpO1xuXHRcdFx0aWYgKG5ld1VybC5ocmVmID09PSBsYXN0VXJsLmhyZWYpIHJldHVybjtcblx0XHRcdHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBXeHRMb2NhdGlvbkNoYW5nZUV2ZW50KG5ld1VybCwgbGFzdFVybCkpO1xuXHRcdFx0bGFzdFVybCA9IG5ld1VybDtcblx0XHR9LCB7IHNpZ25hbDogY3R4LnNpZ25hbCB9KTtcblx0XHRlbHNlIGN0eC5zZXRJbnRlcnZhbCgoKSA9PiB7XG5cdFx0XHRjb25zdCBuZXdVcmwgPSBuZXcgVVJMKGxvY2F0aW9uLmhyZWYpO1xuXHRcdFx0aWYgKG5ld1VybC5ocmVmICE9PSBsYXN0VXJsLmhyZWYpIHtcblx0XHRcdFx0d2luZG93LmRpc3BhdGNoRXZlbnQobmV3IFd4dExvY2F0aW9uQ2hhbmdlRXZlbnQobmV3VXJsLCBsYXN0VXJsKSk7XG5cdFx0XHRcdGxhc3RVcmwgPSBuZXdVcmw7XG5cdFx0XHR9XG5cdFx0fSwgMWUzKTtcblx0fSB9O1xufVxuLy8jZW5kcmVnaW9uXG5leHBvcnQgeyBjcmVhdGVMb2NhdGlvbldhdGNoZXIgfTtcbiIsImltcG9ydCB7IGxvZ2dlciB9IGZyb20gXCIuL2ludGVybmFsL2xvZ2dlci5tanNcIjtcbmltcG9ydCB7IGdldFVuaXF1ZUV2ZW50TmFtZSB9IGZyb20gXCIuL2ludGVybmFsL2N1c3RvbS1ldmVudHMubWpzXCI7XG5pbXBvcnQgeyBjcmVhdGVMb2NhdGlvbldhdGNoZXIgfSBmcm9tIFwiLi9pbnRlcm5hbC9sb2NhdGlvbi13YXRjaGVyLm1qc1wiO1xuaW1wb3J0IHsgYnJvd3NlciB9IGZyb20gXCJ3eHQvYnJvd3NlclwiO1xuLy8jcmVnaW9uIHNyYy91dGlscy9jb250ZW50LXNjcmlwdC1jb250ZXh0LnRzXG4vKipcbiogSW1wbGVtZW50c1xuKiBbYEFib3J0Q29udHJvbGxlcmBdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9BYm9ydENvbnRyb2xsZXIpLlxuKiBVc2VkIHRvIGRldGVjdCBhbmQgc3RvcCBjb250ZW50IHNjcmlwdCBjb2RlIHdoZW4gdGhlIHNjcmlwdCBpcyBpbnZhbGlkYXRlZC5cbipcbiogSXQgYWxzbyBwcm92aWRlcyBzZXZlcmFsIHV0aWxpdGllcyBsaWtlIGBjdHguc2V0VGltZW91dGAgYW5kXG4qIGBjdHguc2V0SW50ZXJ2YWxgIHRoYXQgc2hvdWxkIGJlIHVzZWQgaW4gY29udGVudCBzY3JpcHRzIGluc3RlYWQgb2ZcbiogYHdpbmRvdy5zZXRUaW1lb3V0YCBvciBgd2luZG93LnNldEludGVydmFsYC5cbipcbiogVG8gY3JlYXRlIGNvbnRleHQgZm9yIHRlc3RpbmcsIHlvdSBjYW4gdXNlIHRoZSBjbGFzcydzIGNvbnN0cnVjdG9yOlxuKlxuKiBgYGB0c1xuKiBpbXBvcnQgeyBDb250ZW50U2NyaXB0Q29udGV4dCB9IGZyb20gJ3d4dC91dGlscy9jb250ZW50LXNjcmlwdHMtY29udGV4dCc7XG4qXG4qIHRlc3QoJ3N0b3JhZ2UgbGlzdGVuZXIgc2hvdWxkIGJlIHJlbW92ZWQgd2hlbiBjb250ZXh0IGlzIGludmFsaWRhdGVkJywgKCkgPT4ge1xuKiAgIGNvbnN0IGN0eCA9IG5ldyBDb250ZW50U2NyaXB0Q29udGV4dCgndGVzdCcpO1xuKiAgIGNvbnN0IGl0ZW0gPSBzdG9yYWdlLmRlZmluZUl0ZW0oJ2xvY2FsOmNvdW50JywgeyBkZWZhdWx0VmFsdWU6IDAgfSk7XG4qICAgY29uc3Qgd2F0Y2hlciA9IHZpLmZuKCk7XG4qXG4qICAgY29uc3QgdW53YXRjaCA9IGl0ZW0ud2F0Y2god2F0Y2hlcik7XG4qICAgY3R4Lm9uSW52YWxpZGF0ZWQodW53YXRjaCk7IC8vIExpc3RlbiBmb3IgaW52YWxpZGF0ZSBoZXJlXG4qXG4qICAgYXdhaXQgaXRlbS5zZXRWYWx1ZSgxKTtcbiogICBleHBlY3Qod2F0Y2hlcikudG9CZUNhbGxlZFRpbWVzKDEpO1xuKiAgIGV4cGVjdCh3YXRjaGVyKS50b0JlQ2FsbGVkV2l0aCgxLCAwKTtcbipcbiogICBjdHgubm90aWZ5SW52YWxpZGF0ZWQoKTsgLy8gVXNlIHRoaXMgZnVuY3Rpb24gdG8gaW52YWxpZGF0ZSB0aGUgY29udGV4dFxuKiAgIGF3YWl0IGl0ZW0uc2V0VmFsdWUoMik7XG4qICAgZXhwZWN0KHdhdGNoZXIpLnRvQmVDYWxsZWRUaW1lcygxKTtcbiogfSk7XG4qIGBgYFxuKi9cbnZhciBDb250ZW50U2NyaXB0Q29udGV4dCA9IGNsYXNzIENvbnRlbnRTY3JpcHRDb250ZXh0IHtcblx0c3RhdGljIFNDUklQVF9TVEFSVEVEX01FU1NBR0VfVFlQRSA9IGdldFVuaXF1ZUV2ZW50TmFtZShcInd4dDpjb250ZW50LXNjcmlwdC1zdGFydGVkXCIpO1xuXHRpZDtcblx0YWJvcnRDb250cm9sbGVyO1xuXHRsb2NhdGlvbldhdGNoZXIgPSBjcmVhdGVMb2NhdGlvbldhdGNoZXIodGhpcyk7XG5cdGNvbnN0cnVjdG9yKGNvbnRlbnRTY3JpcHROYW1lLCBvcHRpb25zKSB7XG5cdFx0dGhpcy5jb250ZW50U2NyaXB0TmFtZSA9IGNvbnRlbnRTY3JpcHROYW1lO1xuXHRcdHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG5cdFx0dGhpcy5pZCA9IE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnNsaWNlKDIpO1xuXHRcdHRoaXMuYWJvcnRDb250cm9sbGVyID0gbmV3IEFib3J0Q29udHJvbGxlcigpO1xuXHRcdHRoaXMuc3RvcE9sZFNjcmlwdHMoKTtcblx0XHR0aGlzLmxpc3RlbkZvck5ld2VyU2NyaXB0cygpO1xuXHR9XG5cdGdldCBzaWduYWwoKSB7XG5cdFx0cmV0dXJuIHRoaXMuYWJvcnRDb250cm9sbGVyLnNpZ25hbDtcblx0fVxuXHRhYm9ydChyZWFzb24pIHtcblx0XHRyZXR1cm4gdGhpcy5hYm9ydENvbnRyb2xsZXIuYWJvcnQocmVhc29uKTtcblx0fVxuXHRnZXQgaXNJbnZhbGlkKCkge1xuXHRcdGlmIChicm93c2VyLnJ1bnRpbWU/LmlkID09IG51bGwpIHRoaXMubm90aWZ5SW52YWxpZGF0ZWQoKTtcblx0XHRyZXR1cm4gdGhpcy5zaWduYWwuYWJvcnRlZDtcblx0fVxuXHRnZXQgaXNWYWxpZCgpIHtcblx0XHRyZXR1cm4gIXRoaXMuaXNJbnZhbGlkO1xuXHR9XG5cdC8qKlxuXHQqIEFkZCBhIGxpc3RlbmVyIHRoYXQgaXMgY2FsbGVkIHdoZW4gdGhlIGNvbnRlbnQgc2NyaXB0J3MgY29udGV4dCBpc1xuXHQqIGludmFsaWRhdGVkLlxuXHQqXG5cdCogQGV4YW1wbGVcblx0KiAgIGJyb3dzZXIucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoY2IpO1xuXHQqICAgY29uc3QgcmVtb3ZlSW52YWxpZGF0ZWRMaXN0ZW5lciA9IGN0eC5vbkludmFsaWRhdGVkKCgpID0+IHtcblx0KiAgICAgYnJvd3Nlci5ydW50aW1lLm9uTWVzc2FnZS5yZW1vdmVMaXN0ZW5lcihjYik7XG5cdCogICB9KTtcblx0KiAgIC8vIC4uLlxuXHQqICAgcmVtb3ZlSW52YWxpZGF0ZWRMaXN0ZW5lcigpO1xuXHQqXG5cdCogQHJldHVybnMgQSBmdW5jdGlvbiB0byByZW1vdmUgdGhlIGxpc3RlbmVyLlxuXHQqL1xuXHRvbkludmFsaWRhdGVkKGNiKSB7XG5cdFx0dGhpcy5zaWduYWwuYWRkRXZlbnRMaXN0ZW5lcihcImFib3J0XCIsIGNiKTtcblx0XHRyZXR1cm4gKCkgPT4gdGhpcy5zaWduYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImFib3J0XCIsIGNiKTtcblx0fVxuXHQvKipcblx0KiBSZXR1cm4gYSBwcm9taXNlIHRoYXQgbmV2ZXIgcmVzb2x2ZXMuIFVzZWZ1bCBpZiB5b3UgaGF2ZSBhbiBhc3luYyBmdW5jdGlvblxuXHQqIHRoYXQgc2hvdWxkbid0IHJ1biBhZnRlciB0aGUgY29udGV4dCBpcyBleHBpcmVkLlxuXHQqXG5cdCogQGV4YW1wbGVcblx0KiAgIGNvbnN0IGdldFZhbHVlRnJvbVN0b3JhZ2UgPSBhc3luYyAoKSA9PiB7XG5cdCogICAgIGlmIChjdHguaXNJbnZhbGlkKSByZXR1cm4gY3R4LmJsb2NrKCk7XG5cdCpcblx0KiAgICAgLy8gLi4uXG5cdCogICB9O1xuXHQqL1xuXHRibG9jaygpIHtcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKCkgPT4ge30pO1xuXHR9XG5cdC8qKlxuXHQqIFdyYXBwZXIgYXJvdW5kIGB3aW5kb3cuc2V0SW50ZXJ2YWxgIHRoYXQgYXV0b21hdGljYWxseSBjbGVhcnMgdGhlIGludGVydmFsXG5cdCogd2hlbiBpbnZhbGlkYXRlZC5cblx0KlxuXHQqIEludGVydmFscyBjYW4gYmUgY2xlYXJlZCBieSBjYWxsaW5nIHRoZSBub3JtYWwgYGNsZWFySW50ZXJ2YWxgIGZ1bmN0aW9uLlxuXHQqL1xuXHRzZXRJbnRlcnZhbChoYW5kbGVyLCB0aW1lb3V0KSB7XG5cdFx0Y29uc3QgaWQgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG5cdFx0XHRpZiAodGhpcy5pc1ZhbGlkKSBoYW5kbGVyKCk7XG5cdFx0fSwgdGltZW91dCk7XG5cdFx0dGhpcy5vbkludmFsaWRhdGVkKCgpID0+IGNsZWFySW50ZXJ2YWwoaWQpKTtcblx0XHRyZXR1cm4gaWQ7XG5cdH1cblx0LyoqXG5cdCogV3JhcHBlciBhcm91bmQgYHdpbmRvdy5zZXRUaW1lb3V0YCB0aGF0IGF1dG9tYXRpY2FsbHkgY2xlYXJzIHRoZSBpbnRlcnZhbFxuXHQqIHdoZW4gaW52YWxpZGF0ZWQuXG5cdCpcblx0KiBUaW1lb3V0cyBjYW4gYmUgY2xlYXJlZCBieSBjYWxsaW5nIHRoZSBub3JtYWwgYHNldFRpbWVvdXRgIGZ1bmN0aW9uLlxuXHQqL1xuXHRzZXRUaW1lb3V0KGhhbmRsZXIsIHRpbWVvdXQpIHtcblx0XHRjb25zdCBpZCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0aWYgKHRoaXMuaXNWYWxpZCkgaGFuZGxlcigpO1xuXHRcdH0sIHRpbWVvdXQpO1xuXHRcdHRoaXMub25JbnZhbGlkYXRlZCgoKSA9PiBjbGVhclRpbWVvdXQoaWQpKTtcblx0XHRyZXR1cm4gaWQ7XG5cdH1cblx0LyoqXG5cdCogV3JhcHBlciBhcm91bmQgYHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWVgIHRoYXQgYXV0b21hdGljYWxseSBjYW5jZWxzXG5cdCogdGhlIHJlcXVlc3Qgd2hlbiBpbnZhbGlkYXRlZC5cblx0KlxuXHQqIENhbGxiYWNrcyBjYW4gYmUgY2FuY2VsZWQgYnkgY2FsbGluZyB0aGUgbm9ybWFsIGBjYW5jZWxBbmltYXRpb25GcmFtZWBcblx0KiBmdW5jdGlvbi5cblx0Ki9cblx0cmVxdWVzdEFuaW1hdGlvbkZyYW1lKGNhbGxiYWNrKSB7XG5cdFx0Y29uc3QgaWQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKC4uLmFyZ3MpID0+IHtcblx0XHRcdGlmICh0aGlzLmlzVmFsaWQpIGNhbGxiYWNrKC4uLmFyZ3MpO1xuXHRcdH0pO1xuXHRcdHRoaXMub25JbnZhbGlkYXRlZCgoKSA9PiBjYW5jZWxBbmltYXRpb25GcmFtZShpZCkpO1xuXHRcdHJldHVybiBpZDtcblx0fVxuXHQvKipcblx0KiBXcmFwcGVyIGFyb3VuZCBgd2luZG93LnJlcXVlc3RJZGxlQ2FsbGJhY2tgIHRoYXQgYXV0b21hdGljYWxseSBjYW5jZWxzIHRoZVxuXHQqIHJlcXVlc3Qgd2hlbiBpbnZhbGlkYXRlZC5cblx0KlxuXHQqIENhbGxiYWNrcyBjYW4gYmUgY2FuY2VsZWQgYnkgY2FsbGluZyB0aGUgbm9ybWFsIGBjYW5jZWxJZGxlQ2FsbGJhY2tgXG5cdCogZnVuY3Rpb24uXG5cdCovXG5cdHJlcXVlc3RJZGxlQ2FsbGJhY2soY2FsbGJhY2ssIG9wdGlvbnMpIHtcblx0XHRjb25zdCBpZCA9IHJlcXVlc3RJZGxlQ2FsbGJhY2soKC4uLmFyZ3MpID0+IHtcblx0XHRcdGlmICghdGhpcy5zaWduYWwuYWJvcnRlZCkgY2FsbGJhY2soLi4uYXJncyk7XG5cdFx0fSwgb3B0aW9ucyk7XG5cdFx0dGhpcy5vbkludmFsaWRhdGVkKCgpID0+IGNhbmNlbElkbGVDYWxsYmFjayhpZCkpO1xuXHRcdHJldHVybiBpZDtcblx0fVxuXHRhZGRFdmVudExpc3RlbmVyKHRhcmdldCwgdHlwZSwgaGFuZGxlciwgb3B0aW9ucykge1xuXHRcdGlmICh0eXBlID09PSBcInd4dDpsb2NhdGlvbmNoYW5nZVwiKSB7XG5cdFx0XHRpZiAodGhpcy5pc1ZhbGlkKSB0aGlzLmxvY2F0aW9uV2F0Y2hlci5ydW4oKTtcblx0XHR9XG5cdFx0dGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXI/Lih0eXBlLnN0YXJ0c1dpdGgoXCJ3eHQ6XCIpID8gZ2V0VW5pcXVlRXZlbnROYW1lKHR5cGUpIDogdHlwZSwgaGFuZGxlciwge1xuXHRcdFx0Li4ub3B0aW9ucyxcblx0XHRcdHNpZ25hbDogdGhpcy5zaWduYWxcblx0XHR9KTtcblx0fVxuXHQvKipcblx0KiBAaW50ZXJuYWxcblx0KiBBYm9ydCB0aGUgYWJvcnQgY29udHJvbGxlciBhbmQgZXhlY3V0ZSBhbGwgYG9uSW52YWxpZGF0ZWRgIGxpc3RlbmVycy5cblx0Ki9cblx0bm90aWZ5SW52YWxpZGF0ZWQoKSB7XG5cdFx0dGhpcy5hYm9ydChcIkNvbnRlbnQgc2NyaXB0IGNvbnRleHQgaW52YWxpZGF0ZWRcIik7XG5cdFx0bG9nZ2VyLmRlYnVnKGBDb250ZW50IHNjcmlwdCBcIiR7dGhpcy5jb250ZW50U2NyaXB0TmFtZX1cIiBjb250ZXh0IGludmFsaWRhdGVkYCk7XG5cdH1cblx0c3RvcE9sZFNjcmlwdHMoKSB7XG5cdFx0ZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoQ29udGVudFNjcmlwdENvbnRleHQuU0NSSVBUX1NUQVJURURfTUVTU0FHRV9UWVBFLCB7IGRldGFpbDoge1xuXHRcdFx0Y29udGVudFNjcmlwdE5hbWU6IHRoaXMuY29udGVudFNjcmlwdE5hbWUsXG5cdFx0XHRtZXNzYWdlSWQ6IHRoaXMuaWRcblx0XHR9IH0pKTtcblx0XHRpZiAoIXRoaXMub3B0aW9ucz8ubm9TY3JpcHRTdGFydGVkUG9zdE1lc3NhZ2UpIHdpbmRvdy5wb3N0TWVzc2FnZSh7XG5cdFx0XHR0eXBlOiBDb250ZW50U2NyaXB0Q29udGV4dC5TQ1JJUFRfU1RBUlRFRF9NRVNTQUdFX1RZUEUsXG5cdFx0XHRjb250ZW50U2NyaXB0TmFtZTogdGhpcy5jb250ZW50U2NyaXB0TmFtZSxcblx0XHRcdG1lc3NhZ2VJZDogdGhpcy5pZFxuXHRcdH0sIFwiKlwiKTtcblx0fVxuXHR2ZXJpZnlTY3JpcHRTdGFydGVkRXZlbnQoZXZlbnQpIHtcblx0XHRjb25zdCBpc1NhbWVDb250ZW50U2NyaXB0ID0gZXZlbnQuZGV0YWlsPy5jb250ZW50U2NyaXB0TmFtZSA9PT0gdGhpcy5jb250ZW50U2NyaXB0TmFtZTtcblx0XHRjb25zdCBpc0Zyb21TZWxmID0gZXZlbnQuZGV0YWlsPy5tZXNzYWdlSWQgPT09IHRoaXMuaWQ7XG5cdFx0cmV0dXJuIGlzU2FtZUNvbnRlbnRTY3JpcHQgJiYgIWlzRnJvbVNlbGY7XG5cdH1cblx0bGlzdGVuRm9yTmV3ZXJTY3JpcHRzKCkge1xuXHRcdGNvbnN0IGNiID0gKGV2ZW50KSA9PiB7XG5cdFx0XHRpZiAoIShldmVudCBpbnN0YW5jZW9mIEN1c3RvbUV2ZW50KSB8fCAhdGhpcy52ZXJpZnlTY3JpcHRTdGFydGVkRXZlbnQoZXZlbnQpKSByZXR1cm47XG5cdFx0XHR0aGlzLm5vdGlmeUludmFsaWRhdGVkKCk7XG5cdFx0fTtcblx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKENvbnRlbnRTY3JpcHRDb250ZXh0LlNDUklQVF9TVEFSVEVEX01FU1NBR0VfVFlQRSwgY2IpO1xuXHRcdHRoaXMub25JbnZhbGlkYXRlZCgoKSA9PiBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKENvbnRlbnRTY3JpcHRDb250ZXh0LlNDUklQVF9TVEFSVEVEX01FU1NBR0VfVFlQRSwgY2IpKTtcblx0fVxufTtcbi8vI2VuZHJlZ2lvblxuZXhwb3J0IHsgQ29udGVudFNjcmlwdENvbnRleHQgfTtcbiJdLCJ4X2dvb2dsZV9pZ25vcmVMaXN0IjpbMCwzLDQsNyw4LDksMTBdLCJtYXBwaW5ncyI6Ijs7Q0FDQSxTQUFTLG9CQUFvQixZQUFZO0VBQ3hDLE9BQU87Q0FDUjs7O0NDUUEsSUFBYSxlQUE0QztFQUN2RCxRQUFRO0dBQ04sT0FBTztHQUdQLGtCQUFrQjtHQUNsQixrQkFBa0IsQ0FBQztHQUNuQixvQkFBb0I7SUFDbEIsTUFBTSxNQUFNLElBQUksSUFBSSxPQUFPLFNBQVMsSUFBSTtJQUV4QyxJQUFJLENBQUMsSUFBSSxTQUFTLFNBQVMsU0FBUyxHQUFHO0lBRXZDLE1BQU0sU0FBUyxJQUFJLGFBQWE7SUFDaEMsTUFBTSxXQUFXLElBQUksYUFBYTtJQUNsQyxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVU7SUFHMUIsSUFDRSxJQUFJLGFBQWEsSUFBSSxJQUFJLE1BQU0sUUFDL0IsSUFBSSxhQUFhLElBQUksSUFBSSxNQUFNLE1BRS9CO0lBR0YsSUFBSSxhQUFhLElBQUksTUFBTSxJQUFJO0lBQy9CLElBQUksYUFBYSxJQUFJLE1BQU0sSUFBSTtJQUcvQixPQUFPLFNBQVMsUUFBUSxJQUFJLFNBQVMsQ0FBQztHQUN4QztFQUNGO0VBQ0EsU0FB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