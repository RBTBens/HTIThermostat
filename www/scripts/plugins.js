! function(t) {
	! function() {
		"use strict";

		function t(e, s) {
			function n(t, e) {
				return function() {
					return t.apply(e, arguments)
				}
			}
			var o;
			if (s = s || {}, this.trackingClick = !1, this.trackingClickStart = 0, this.targetElement = null, this.touchStartX = 0, this.touchStartY = 0, this.lastTouchIdentifier = 0, this.touchBoundary = s.touchBoundary || 10, this.layer = e, this.tapDelay = s.tapDelay || 200, this.tapTimeout = s.tapTimeout || 700, !t.notNeeded(e)) {
				for (var r = ["onMouse", "onClick", "onTouchStart", "onTouchMove", "onTouchEnd", "onTouchCancel"], a = this, h = 0, l = r.length; l > h; h++) a[r[h]] = n(a[r[h]], a);
				i && (e.addEventListener("mouseover", this.onMouse, !0), e.addEventListener("mousedown", this.onMouse, !0), e.addEventListener("mouseup", this.onMouse, !0)), e.addEventListener("click", this.onClick, !0), e.addEventListener("touchstart", this.onTouchStart, !1), e.addEventListener("touchmove", this.onTouchMove, !1), e.addEventListener("touchend", this.onTouchEnd, !1), e.addEventListener("touchcancel", this.onTouchCancel, !1), Event.prototype.stopImmediatePropagation || (e.removeEventListener = function(t, i, s) {
					var n = Node.prototype.removeEventListener;
					"click" === t ? n.call(e, t, i.hijacked || i, s) : n.call(e, t, i, s)
				}, e.addEventListener = function(t, i, s) {
					var n = Node.prototype.addEventListener;
					"click" === t ? n.call(e, t, i.hijacked || (i.hijacked = function(t) {
						t.propagationStopped || i(t)
					}), s) : n.call(e, t, i, s)
				}), "function" == typeof e.onclick && (o = e.onclick, e.addEventListener("click", function(t) {
					o(t)
				}, !1), e.onclick = null)
			}
		}
		var e = navigator.userAgent.indexOf("Windows Phone") >= 0,
			i = navigator.userAgent.indexOf("Android") > 0 && !e,
			s = /iP(ad|hone|od)/.test(navigator.userAgent) && !e,
			n = s && /OS 4_\d(_\d)?/.test(navigator.userAgent),
			o = s && /OS [6-7]_\d/.test(navigator.userAgent),
			r = navigator.userAgent.indexOf("BB10") > 0;
		t.prototype.needsClick = function(t) {
			switch (t.nodeName.toLowerCase()) {
				case "button":
				case "select":
				case "textarea":
					if (t.disabled) return !0;
					break;
				case "input":
					if (s && "file" === t.type || t.disabled) return !0;
					break;
				case "label":
				case "iframe":
				case "video":
					return !0
			}
			return /\bneedsclick\b/.test(t.className)
		}, t.prototype.needsFocus = function(t) {
			switch (t.nodeName.toLowerCase()) {
				case "textarea":
					return !0;
				case "select":
					return !i;
				case "input":
					switch (t.type) {
						case "button":
						case "checkbox":
						case "file":
						case "image":
						case "radio":
						case "submit":
							return !1
					}
					return !t.disabled && !t.readOnly;
				default:
					return /\bneedsfocus\b/.test(t.className)
			}
		}, t.prototype.sendClick = function(t, e) {
			var i, s;
			document.activeElement && document.activeElement !== t && document.activeElement.blur(), s = e.changedTouches[0], i = document.createEvent("MouseEvents"), i.initMouseEvent(this.determineEventType(t), !0, !0, window, 1, s.screenX, s.screenY, s.clientX, s.clientY, !1, !1, !1, !1, 0, null), i.forwardedTouchEvent = !0, t.dispatchEvent(i)
		}, t.prototype.determineEventType = function(t) {
			return i && "select" === t.tagName.toLowerCase() ? "mousedown" : "click"
		}, t.prototype.focus = function(t) {
			var e;
			s && t.setSelectionRange && 0 !== t.type.indexOf("date") && "time" !== t.type && "month" !== t.type ? (e = t.value.length, t.setSelectionRange(e, e)) : t.focus()
		}, t.prototype.updateScrollParent = function(t) {
			var e, i;
			if (e = t.fastClickScrollParent, !e || !e.contains(t)) {
				i = t;
				do {
					if (i.scrollHeight > i.offsetHeight) {
						e = i, t.fastClickScrollParent = i;
						break
					}
					i = i.parentElement
				} while (i)
			}
			e && (e.fastClickLastScrollTop = e.scrollTop)
		}, t.prototype.getTargetElementFromEventTarget = function(t) {
			return t.nodeType === Node.TEXT_NODE ? t.parentNode : t
		}, t.prototype.onTouchStart = function(t) {
			var e, i, o;
			if (t.targetTouches.length > 1) return !0;
			if (e = this.getTargetElementFromEventTarget(t.target), i = t.targetTouches[0], s) {
				if (o = window.getSelection(), o.rangeCount && !o.isCollapsed) return !0;
				if (!n) {
					if (i.identifier && i.identifier === this.lastTouchIdentifier) return t.preventDefault(), !1;
					this.lastTouchIdentifier = i.identifier, this.updateScrollParent(e)
				}
			}
			return this.trackingClick = !0, this.trackingClickStart = t.timeStamp, this.targetElement = e, this.touchStartX = i.pageX, this.touchStartY = i.pageY, t.timeStamp - this.lastClickTime < this.tapDelay && t.preventDefault(), !0
		}, t.prototype.touchHasMoved = function(t) {
			var e = t.changedTouches[0],
				i = this.touchBoundary;
			return Math.abs(e.pageX - this.touchStartX) > i || Math.abs(e.pageY - this.touchStartY) > i ? !0 : !1
		}, t.prototype.onTouchMove = function(t) {
			return this.trackingClick ? ((this.targetElement !== this.getTargetElementFromEventTarget(t.target) || this.touchHasMoved(t)) && (this.trackingClick = !1, this.targetElement = null), !0) : !0
		}, t.prototype.findControl = function(t) {
			return void 0 !== t.control ? t.control : t.htmlFor ? document.getElementById(t.htmlFor) : t.querySelector("button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea")
		}, t.prototype.onTouchEnd = function(t) {
			var e, r, a, h, l, d = this.targetElement;
			if (!this.trackingClick) return !0;
			if (t.timeStamp - this.lastClickTime < this.tapDelay) return this.cancelNextClick = !0, !0;
			if (t.timeStamp - this.trackingClickStart > this.tapTimeout) return !0;
			if (this.cancelNextClick = !1, this.lastClickTime = t.timeStamp, r = this.trackingClickStart, this.trackingClick = !1, this.trackingClickStart = 0, o && (l = t.changedTouches[0], d = document.elementFromPoint(l.pageX - window.pageXOffset, l.pageY - window.pageYOffset) || d, d.fastClickScrollParent = this.targetElement.fastClickScrollParent), a = d.tagName.toLowerCase(), "label" === a) {
				if (e = this.findControl(d)) {
					if (this.focus(d), i) return !1;
					d = e
				}
			} else if (this.needsFocus(d)) return t.timeStamp - r > 100 || s && window.top !== window && "input" === a ? (this.targetElement = null, !1) : (this.focus(d), this.sendClick(d, t), s && "select" === a || (this.targetElement = null, t.preventDefault()), !1);
			return s && !n && (h = d.fastClickScrollParent, h && h.fastClickLastScrollTop !== h.scrollTop) ? !0 : (this.needsClick(d) || (t.preventDefault(), this.sendClick(d, t)), !1)
		}, t.prototype.onTouchCancel = function() {
			this.trackingClick = !1, this.targetElement = null
		}, t.prototype.onMouse = function(t) {
			return this.targetElement ? t.forwardedTouchEvent ? !0 : !t.cancelable || this.needsClick(this.targetElement) && !this.cancelNextClick ? !0 : (t.stopImmediatePropagation ? t.stopImmediatePropagation() : t.propagationStopped = !0, t.stopPropagation(), t.preventDefault(), !1) : !0
		}, t.prototype.onClick = function(t) {
			var e;
			return this.trackingClick ? (this.targetElement = null, this.trackingClick = !1, !0) : "submit" === t.target.type && 0 === t.detail ? !0 : (e = this.onMouse(t), e || (this.targetElement = null), e)
		}, t.prototype.destroy = function() {
			var t = this.layer;
			i && (t.removeEventListener("mouseover", this.onMouse, !0), t.removeEventListener("mousedown", this.onMouse, !0), t.removeEventListener("mouseup", this.onMouse, !0)), t.removeEventListener("click", this.onClick, !0), t.removeEventListener("touchstart", this.onTouchStart, !1), t.removeEventListener("touchmove", this.onTouchMove, !1), t.removeEventListener("touchend", this.onTouchEnd, !1), t.removeEventListener("touchcancel", this.onTouchCancel, !1)
		}, t.notNeeded = function(t) {
			var e, s, n, o;
			if ("undefined" == typeof window.ontouchstart) return !0;
			if (s = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1]) {
				if (!i) return !0;
				if (e = document.querySelector("meta[name=viewport]")) {
					if (-1 !== e.content.indexOf("user-scalable=no")) return !0;
					if (s > 31 && document.documentElement.scrollWidth <= window.outerWidth) return !0
				}
			}
			if (r && (n = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/), n[1] >= 10 && n[2] >= 3 && (e = document.querySelector("meta[name=viewport]")))) {
				if (-1 !== e.content.indexOf("user-scalable=no")) return !0;
				if (document.documentElement.scrollWidth <= window.outerWidth) return !0
			}
			return "none" === t.style.msTouchAction || "manipulation" === t.style.touchAction ? !0 : (o = +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1], o >= 27 && (e = document.querySelector("meta[name=viewport]"), e && (-1 !== e.content.indexOf("user-scalable=no") || document.documentElement.scrollWidth <= window.outerWidth)) ? !0 : "none" === t.style.touchAction || "manipulation" === t.style.touchAction ? !0 : !1)
		}, t.attach = function(e, i) {
			return new t(e, i)
		}, "function" == typeof define && "object" == typeof define.amd && define.amd ? define(function() {
			return t
		}) : "undefined" != typeof module && module.exports ? (module.exports = t.attach, module.exports.FastClick = t) : window.FastClick = t
	}()
}(jQuery),
function(t) {
	! function(t, e, i, s) {
		function n(e, i) {
			this.settings = null, this.options = t.extend({}, n.Defaults, i), this.$element = t(e), this.drag = t.extend({}, u), this.state = t.extend({}, p), this.e = t.extend({}, g), this._plugins = {}, this._supress = {}, this._current = null, this._speed = null, this._coordinates = [], this._breakpoint = null, this._width = null, this._items = [], this._clones = [], this._mergers = [], this._invalidated = {}, this._pipe = [], t.each(n.Plugins, t.proxy(function(t, e) {
				this._plugins[t[0].toLowerCase() + t.slice(1)] = new e(this)
			}, this)), t.each(n.Pipe, t.proxy(function(e, i) {
				this._pipe.push({
					filter: i.filter,
					run: t.proxy(i.run, this)
				})
			}, this)), this.setup(), this.initialize()
		}

		function o(t) {
			if (t.touches !== s) return {
				x: t.touches[0].pageX,
				y: t.touches[0].pageY
			};
			if (t.touches === s) {
				if (t.pageX !== s) return {
					x: t.pageX,
					y: t.pageY
				};
				if (t.pageX === s) return {
					x: t.clientX,
					y: t.clientY
				}
			}
		}

		function r(t) {
			var e, s, n = i.createElement("div"),
				o = t;
			for (e in o)
				if (s = o[e], "undefined" != typeof n.style[s]) return n = null, [s, e];
			return [!1]
		}

		function a() {
			return r(["transition", "WebkitTransition", "MozTransition", "OTransition"])[1]
		}

		function h() {
			return r(["transform", "WebkitTransform", "MozTransform", "OTransform", "msTransform"])[0]
		}

		function l() {
			return r(["perspective", "webkitPerspective", "MozPerspective", "OPerspective", "MsPerspective"])[0]
		}

		function d() {
			return "ontouchstart" in e || !!navigator.msMaxTouchPoints
		}

		function c() {
			return e.navigator.msPointerEnabled
		}
		var u, p, g;
		u = {
			start: 0,
			startX: 0,
			startY: 0,
			current: 0,
			currentX: 0,
			currentY: 0,
			offsetX: 0,
			offsetY: 0,
			distance: null,
			startTime: 0,
			endTime: 0,
			updatedX: 0,
			targetEl: null
		}, p = {
			isTouch: !1,
			isScrolling: !1,
			isSwiping: !1,
			direction: !1,
			inMotion: !1
		}, g = {
			_onDragStart: null,
			_onDragMove: null,
			_onDragEnd: null,
			_transitionEnd: null,
			_resizer: null,
			_responsiveCall: null,
			_goToLoop: null,
			_checkVisibile: null
		}, n.Defaults = {
			items: 3,
			loop: !1,
			center: !1,
			mouseDrag: !0,
			touchDrag: !0,
			pullDrag: !0,
			freeDrag: !1,
			margin: 0,
			stagePadding: 0,
			merge: !1,
			mergeFit: !0,
			autoWidth: !1,
			startPosition: 0,
			rtl: !1,
			smartSpeed: 250,
			fluidSpeed: !1,
			dragEndSpeed: !1,
			responsive: {},
			responsiveRefreshRate: 200,
			responsiveBaseElement: e,
			responsiveClass: !1,
			fallbackEasing: "swing",
			info: !1,
			nestedItemSelector: !1,
			itemElement: "div",
			stageElement: "div",
			themeClass: "owl-theme",
			baseClass: "owl-carousel",
			itemClass: "owl-item",
			centerClass: "center",
			activeClass: "active"
		}, n.Width = {
			Default: "default",
			Inner: "inner",
			Outer: "outer"
		}, n.Plugins = {}, n.Pipe = [{
			filter: ["width", "items", "settings"],
			run: function(t) {
				t.current = this._items && this._items[this.relative(this._current)]
			}
		}, {
			filter: ["items", "settings"],
			run: function() {
				var t = this._clones,
					e = this.$stage.children(".cloned");
				(e.length !== t.length || !this.settings.loop && t.length > 0) && (this.$stage.children(".cloned").remove(), this._clones = [])
			}
		}, {
			filter: ["items", "settings"],
			run: function() {
				var t, e, i = this._clones,
					s = this._items,
					n = this.settings.loop ? i.length - Math.max(2 * this.settings.items, 4) : 0;
				for (t = 0, e = Math.abs(n / 2); e > t; t++) n > 0 ? (this.$stage.children().eq(s.length + i.length - 1).remove(), i.pop(), this.$stage.children().eq(0).remove(), i.pop()) : (i.push(i.length / 2), this.$stage.append(s[i[i.length - 1]].clone().addClass("cloned")), i.push(s.length - 1 - (i.length - 1) / 2), this.$stage.prepend(s[i[i.length - 1]].clone().addClass("cloned")))
			}
		}, {
			filter: ["width", "items", "settings"],
			run: function() {
				var t, e, i, s = this.settings.rtl ? 1 : -1,
					n = (this.width() / this.settings.items).toFixed(3),
					o = 0;
				for (this._coordinates = [], e = 0, i = this._clones.length + this._items.length; i > e; e++) t = this._mergers[this.relative(e)], t = this.settings.mergeFit && Math.min(t, this.settings.items) || t, o += (this.settings.autoWidth ? this._items[this.relative(e)].width() + this.settings.margin : n * t) * s, this._coordinates.push(o)
			}
		}, {
			filter: ["width", "items", "settings"],
			run: function() {
				var e, i, s = (this.width() / this.settings.items).toFixed(3),
					n = {
						width: Math.abs(this._coordinates[this._coordinates.length - 1]) + 2 * this.settings.stagePadding,
						"padding-left": this.settings.stagePadding || "",
						"padding-right": this.settings.stagePadding || ""
					};
				if (this.$stage.css(n), n = {
						width: this.settings.autoWidth ? "auto" : s - this.settings.margin
					}, n[this.settings.rtl ? "margin-left" : "margin-right"] = this.settings.margin, !this.settings.autoWidth && t.grep(this._mergers, function(t) {
						return t > 1
					}).length > 0)
					for (e = 0, i = this._coordinates.length; i > e; e++) n.width = Math.abs(this._coordinates[e]) - Math.abs(this._coordinates[e - 1] || 0) - this.settings.margin, this.$stage.children().eq(e).css(n);
				else this.$stage.children().css(n)
			}
		}, {
			filter: ["width", "items", "settings"],
			run: function(t) {
				t.current && this.reset(this.$stage.children().index(t.current))
			}
		}, {
			filter: ["position"],
			run: function() {
				this.animate(this.coordinates(this._current))
			}
		}, {
			filter: ["width", "position", "items", "settings"],
			run: function() {
				var t, e, i, s, n = this.settings.rtl ? 1 : -1,
					o = 2 * this.settings.stagePadding,
					r = this.coordinates(this.current()) + o,
					a = r + this.width() * n,
					h = [];
				for (i = 0, s = this._coordinates.length; s > i; i++) t = this._coordinates[i - 1] || 0, e = Math.abs(this._coordinates[i]) + o * n, (this.op(t, "<=", r) && this.op(t, ">", a) || this.op(e, "<", r) && this.op(e, ">", a)) && h.push(i);
				this.$stage.children("." + this.settings.activeClass).removeClass(this.settings.activeClass), this.$stage.children(":eq(" + h.join("), :eq(") + ")").addClass(this.settings.activeClass), this.settings.center && (this.$stage.children("." + this.settings.centerClass).removeClass(this.settings.centerClass), this.$stage.children().eq(this.current()).addClass(this.settings.centerClass))
			}
		}], n.prototype.initialize = function() {
			if (this.trigger("initialize"), this.$element.addClass(this.settings.baseClass).addClass(this.settings.themeClass).toggleClass("owl-rtl", this.settings.rtl), this.browserSupport(), this.settings.autoWidth && this.state.imagesLoaded !== !0) {
				var e, i, n;
				if (e = this.$element.find("img"), i = this.settings.nestedItemSelector ? "." + this.settings.nestedItemSelector : s, n = this.$element.children(i).width(), e.length && 0 >= n) return this.preloadAutoWidthImages(e), !1
			}
			this.$element.addClass("owl-loading"), this.$stage = t("<" + this.settings.stageElement + ' class="owl-stage"/>').wrap('<div class="owl-stage-outer">'), this.$element.append(this.$stage.parent()), this.replace(this.$element.children().not(this.$stage.parent())), this._width = this.$element.width(), this.refresh(), this.$element.removeClass("owl-loading").addClass("owl-loaded"), this.eventsCall(), this.internalEvents(), this.addTriggerableEvents(), this.trigger("initialized")
		}, n.prototype.setup = function() {
			var e = this.viewport(),
				i = this.options.responsive,
				s = -1,
				n = null;
			i ? (t.each(i, function(t) {
				e >= t && t > s && (s = Number(t))
			}), n = t.extend({}, this.options, i[s]), delete n.responsive, n.responsiveClass && this.$element.attr("class", function(t, e) {
				return e.replace(/\b owl-responsive-\S+/g, "")
			}).addClass("owl-responsive-" + s)) : n = t.extend({}, this.options), (null === this.settings || this._breakpoint !== s) && (this.trigger("change", {
				property: {
					name: "settings",
					value: n
				}
			}), this._breakpoint = s, this.settings = n, this.invalidate("settings"), this.trigger("changed", {
				property: {
					name: "settings",
					value: this.settings
				}
			}))
		}, n.prototype.optionsLogic = function() {
			this.$element.toggleClass("owl-center", this.settings.center), this.settings.loop && this._items.length < this.settings.items && (this.settings.loop = !1), this.settings.autoWidth && (this.settings.stagePadding = !1, this.settings.merge = !1)
		}, n.prototype.prepare = function(e) {
			var i = this.trigger("prepare", {
				content: e
			});
			return i.data || (i.data = t("<" + this.settings.itemElement + "/>").addClass(this.settings.itemClass).append(e)), this.trigger("prepared", {
				content: i.data
			}), i.data
		}, n.prototype.update = function() {
			for (var e = 0, i = this._pipe.length, s = t.proxy(function(t) {
					return this[t]
				}, this._invalidated), n = {}; i > e;)(this._invalidated.all || t.grep(this._pipe[e].filter, s).length > 0) && this._pipe[e].run(n), e++;
			this._invalidated = {}
		}, n.prototype.width = function(t) {
			switch (t = t || n.Width.Default) {
				case n.Width.Inner:
				case n.Width.Outer:
					return this._width;
				default:
					return this._width - 2 * this.settings.stagePadding + this.settings.margin
			}
		}, n.prototype.refresh = function() {
			return 0 === this._items.length ? !1 : ((new Date).getTime(), this.trigger("refresh"), this.setup(), this.optionsLogic(), this.$stage.addClass("owl-refresh"), this.update(), this.$stage.removeClass("owl-refresh"), this.state.orientation = e.orientation, this.watchVisibility(), this.trigger("refreshed"), void 0)
		}, n.prototype.eventsCall = function() {
			this.e._onDragStart = t.proxy(function(t) {
				this.onDragStart(t)
			}, this), this.e._onDragMove = t.proxy(function(t) {
				this.onDragMove(t)
			}, this), this.e._onDragEnd = t.proxy(function(t) {
				this.onDragEnd(t)
			}, this), this.e._onResize = t.proxy(function(t) {
				this.onResize(t)
			}, this), this.e._transitionEnd = t.proxy(function(t) {
				this.transitionEnd(t)
			}, this), this.e._preventClick = t.proxy(function(t) {
				this.preventClick(t)
			}, this)
		}, n.prototype.onThrottledResize = function() {
			e.clearTimeout(this.resizeTimer), this.resizeTimer = e.setTimeout(this.e._onResize, this.settings.responsiveRefreshRate)
		}, n.prototype.onResize = function() {
			return this._items.length ? this._width === this.$element.width() ? !1 : this.trigger("resize").isDefaultPrevented() ? !1 : (this._width = this.$element.width(), this.invalidate("width"), this.refresh(), void this.trigger("resized")) : !1
		}, n.prototype.eventsRouter = function(t) {
			var e = t.type;
			"mousedown" === e || "touchstart" === e ? this.onDragStart(t) : "mousemove" === e || "touchmove" === e ? this.onDragMove(t) : "mouseup" === e || "touchend" === e ? this.onDragEnd(t) : "touchcancel" === e && this.onDragEnd(t)
		}, n.prototype.internalEvents = function() {
			var i = (d(), c());
			this.settings.mouseDrag ? (this.$stage.on("mousedown", t.proxy(function(t) {
				this.eventsRouter(t)
			}, this)), this.$stage.on("dragstart", function() {
				return !1
			}), this.$stage.get(0).onselectstart = function() {
				return !1
			}) : this.$element.addClass("owl-text-select-on"), this.settings.touchDrag && !i && this.$stage.on("touchstart touchcancel", t.proxy(function(t) {
				this.eventsRouter(t)
			}, this)), this.transitionEndVendor && this.on(this.$stage.get(0), this.transitionEndVendor, this.e._transitionEnd, !1), this.settings.responsive !== !1 && this.on(e, "resize", t.proxy(this.onThrottledResize, this))
		}, n.prototype.onDragStart = function(s) {
			var n, r, a, h;
			if (n = s.originalEvent || s || e.event, 3 === n.which || this.state.isTouch) return !1;
			if ("mousedown" === n.type && this.$stage.addClass("owl-grab"), this.trigger("drag"), this.drag.startTime = (new Date).getTime(), this.speed(0), this.state.isTouch = !0, this.state.isScrolling = !1, this.state.isSwiping = !1, this.drag.distance = 0, r = o(n).x, a = o(n).y, this.drag.offsetX = this.$stage.position().left, this.drag.offsetY = this.$stage.position().top, this.settings.rtl && (this.drag.offsetX = this.$stage.position().left + this.$stage.width() - this.width() + this.settings.margin), this.state.inMotion && this.support3d) h = this.getTransformProperty(), this.drag.offsetX = h, this.animate(h), this.state.inMotion = !0;
			else if (this.state.inMotion && !this.support3d) return this.state.inMotion = !1, !1;
			this.drag.startX = r - this.drag.offsetX, this.drag.startY = a - this.drag.offsetY, this.drag.start = r - this.drag.startX, this.drag.targetEl = n.target || n.srcElement, this.drag.updatedX = this.drag.start, ("IMG" === this.drag.targetEl.tagName || "A" === this.drag.targetEl.tagName) && (this.drag.targetEl.draggable = !1), t(i).on("mousemove.owl.dragEvents mouseup.owl.dragEvents touchmove.owl.dragEvents touchend.owl.dragEvents", t.proxy(function(t) {
				this.eventsRouter(t)
			}, this))
		}, n.prototype.onDragMove = function(t) {
			var i, n, r, a, h, l;
			this.state.isTouch && (this.state.isScrolling || (i = t.originalEvent || t || e.event, n = o(i).x, r = o(i).y, this.drag.currentX = n - this.drag.startX, this.drag.currentY = r - this.drag.startY, this.drag.distance = this.drag.currentX - this.drag.offsetX, this.drag.distance < 0 ? this.state.direction = this.settings.rtl ? "right" : "left" : this.drag.distance > 0 && (this.state.direction = this.settings.rtl ? "left" : "right"), this.settings.loop ? this.op(this.drag.currentX, ">", this.coordinates(this.minimum())) && "right" === this.state.direction ? this.drag.currentX -= (this.settings.center && this.coordinates(0)) - this.coordinates(this._items.length) : this.op(this.drag.currentX, "<", this.coordinates(this.maximum())) && "left" === this.state.direction && (this.drag.currentX += (this.settings.center && this.coordinates(0)) - this.coordinates(this._items.length)) : (a = this.coordinates(this.settings.rtl ? this.maximum() : this.minimum()), h = this.coordinates(this.settings.rtl ? this.minimum() : this.maximum()), l = this.settings.pullDrag ? this.drag.distance / 5 : 0, this.drag.currentX = Math.max(Math.min(this.drag.currentX, a + l), h + l)), (this.drag.distance > 8 || this.drag.distance < -8) && (i.preventDefault !== s ? i.preventDefault() : i.returnValue = !1, this.state.isSwiping = !0), this.drag.updatedX = this.drag.currentX, (this.drag.currentY > 16 || this.drag.currentY < -16) && this.state.isSwiping === !1 && (this.state.isScrolling = !0, this.drag.updatedX = this.drag.start), this.animate(this.drag.updatedX)))
		}, n.prototype.onDragEnd = function(e) {
			var s, n, o;
			if (this.state.isTouch) {
				if ("mouseup" === e.type && this.$stage.removeClass("owl-grab"), this.trigger("dragged"), this.drag.targetEl.removeAttribute("draggable"), this.state.isTouch = !1, this.state.isScrolling = !1, this.state.isSwiping = !1, 0 === this.drag.distance && this.state.inMotion !== !0) return this.state.inMotion = !1, !1;
				this.drag.endTime = (new Date).getTime(), s = this.drag.endTime - this.drag.startTime, n = Math.abs(this.drag.distance), (n > 3 || s > 300) && this.removeClick(this.drag.targetEl), o = this.closest(this.drag.updatedX), this.speed(this.settings.dragEndSpeed || this.settings.smartSpeed), this.current(o), this.invalidate("position"), this.update(), this.settings.pullDrag || this.drag.updatedX !== this.coordinates(o) || this.transitionEnd(), this.drag.distance = 0, t(i).off(".owl.dragEvents")
			}
		}, n.prototype.removeClick = function(i) {
			this.drag.targetEl = i, t(i).on("click.preventClick", this.e._preventClick), e.setTimeout(function() {
				t(i).off("click.preventClick")
			}, 300)
		}, n.prototype.preventClick = function(e) {
			e.preventDefault ? e.preventDefault() : e.returnValue = !1, e.stopPropagation && e.stopPropagation(), t(e.target).off("click.preventClick")
		}, n.prototype.getTransformProperty = function() {
			var t, i;
			return t = e.getComputedStyle(this.$stage.get(0), null).getPropertyValue(this.vendorName + "transform"), t = t.replace(/matrix(3d)?\(|\)/g, "").split(","), i = 16 === t.length, i !== !0 ? t[4] : t[12]
		}, n.prototype.closest = function(e) {
			var i = -1,
				s = 30,
				n = this.width(),
				o = this.coordinates();
			return this.settings.freeDrag || t.each(o, t.proxy(function(t, r) {
				return e > r - s && r + s > e ? i = t : this.op(e, "<", r) && this.op(e, ">", o[t + 1] || r - n) && (i = "left" === this.state.direction ? t + 1 : t), -1 === i
			}, this)), this.settings.loop || (this.op(e, ">", o[this.minimum()]) ? i = e = this.minimum() : this.op(e, "<", o[this.maximum()]) && (i = e = this.maximum())), i
		}, n.prototype.animate = function(e) {
			this.trigger("translate"), this.state.inMotion = this.speed() > 0, this.support3d ? this.$stage.css({
				transform: "translate3d(" + e + "px,0px, 0px)",
				transition: this.speed() / 1e3 + "s"
			}) : this.state.isTouch ? this.$stage.css({
				left: e + "px"
			}) : this.$stage.animate({
				left: e
			}, this.speed() / 1e3, this.settings.fallbackEasing, t.proxy(function() {
				this.state.inMotion && this.transitionEnd()
			}, this))
		}, n.prototype.current = function(t) {
			if (t === s) return this._current;
			if (0 === this._items.length) return s;
			if (t = this.normalize(t), this._current !== t) {
				var e = this.trigger("change", {
					property: {
						name: "position",
						value: t
					}
				});
				e.data !== s && (t = this.normalize(e.data)), this._current = t, this.invalidate("position"), this.trigger("changed", {
					property: {
						name: "position",
						value: this._current
					}
				})
			}
			return this._current
		}, n.prototype.invalidate = function(t) {
			this._invalidated[t] = !0
		}, n.prototype.reset = function(t) {
			t = this.normalize(t), t !== s && (this._speed = 0, this._current = t, this.suppress(["translate", "translated"]), this.animate(this.coordinates(t)), this.release(["translate", "translated"]))
		}, n.prototype.normalize = function(e, i) {
			var n = i ? this._items.length : this._items.length + this._clones.length;
			return !t.isNumeric(e) || 1 > n ? s : e = this._clones.length ? (e % n + n) % n : Math.max(this.minimum(i), Math.min(this.maximum(i), e))
		}, n.prototype.relative = function(t) {
			return t = this.normalize(t), t -= this._clones.length / 2, this.normalize(t, !0)
		}, n.prototype.maximum = function(t) {
			var e, i, s, n = 0,
				o = this.settings;
			if (t) return this._items.length - 1;
			if (!o.loop && o.center) e = this._items.length - 1;
			else if (o.loop || o.center)
				if (o.loop || o.center) e = this._items.length + o.items;
				else {
					if (!o.autoWidth && !o.merge) throw "Can not detect maximum absolute position.";
					for (revert = o.rtl ? 1 : -1, i = this.$stage.width() - this.$element.width();
						(s = this.coordinates(n)) && !(s * revert >= i);) e = ++n
				} else e = this._items.length - o.items;
			return e
		}, n.prototype.minimum = function(t) {
			return t ? 0 : this._clones.length / 2
		}, n.prototype.items = function(t) {
			return t === s ? this._items.slice() : (t = this.normalize(t, !0), this._items[t])
		}, n.prototype.mergers = function(t) {
			return t === s ? this._mergers.slice() : (t = this.normalize(t, !0), this._mergers[t])
		}, n.prototype.clones = function(e) {
			var i = this._clones.length / 2,
				n = i + this._items.length,
				o = function(t) {
					return t % 2 === 0 ? n + t / 2 : i - (t + 1) / 2
				};
			return e === s ? t.map(this._clones, function(t, e) {
				return o(e)
			}) : t.map(this._clones, function(t, i) {
				return t === e ? o(i) : null
			})
		}, n.prototype.speed = function(t) {
			return t !== s && (this._speed = t), this._speed
		}, n.prototype.coordinates = function(e) {
			var i = null;
			return e === s ? t.map(this._coordinates, t.proxy(function(t, e) {
				return this.coordinates(e)
			}, this)) : (this.settings.center ? (i = this._coordinates[e], i += (this.width() - i + (this._coordinates[e - 1] || 0)) / 2 * (this.settings.rtl ? -1 : 1)) : i = this._coordinates[e - 1] || 0, i)
		}, n.prototype.duration = function(t, e, i) {
			return Math.min(Math.max(Math.abs(e - t), 1), 6) * Math.abs(i || this.settings.smartSpeed)
		}, n.prototype.to = function(i, s) {
			if (this.settings.loop) {
				var n = i - this.relative(this.current()),
					o = this.current(),
					r = this.current(),
					a = this.current() + n,
					h = 0 > r - a ? !0 : !1,
					l = this._clones.length + this._items.length;
				a < this.settings.items && h === !1 ? (o = r + this._items.length, this.reset(o)) : a >= l - this.settings.items && h === !0 && (o = r - this._items.length, this.reset(o)), e.clearTimeout(this.e._goToLoop), this.e._goToLoop = e.setTimeout(t.proxy(function() {
					this.speed(this.duration(this.current(), o + n, s)), this.current(o + n), this.update()
				}, this), 30)
			} else this.speed(this.duration(this.current(), i, s)), this.current(i), this.update()
		}, n.prototype.next = function(t) {
			t = t || !1, this.to(this.relative(this.current()) + 1, t)
		}, n.prototype.prev = function(t) {
			t = t || !1, this.to(this.relative(this.current()) - 1, t)
		}, n.prototype.transitionEnd = function(t) {
			return t !== s && (t.stopPropagation(), (t.target || t.srcElement || t.originalTarget) !== this.$stage.get(0)) ? !1 : (this.state.inMotion = !1, void this.trigger("translated"))
		}, n.prototype.viewport = function() {
			var s;
			if (this.options.responsiveBaseElement !== e) s = t(this.options.responsiveBaseElement).width();
			else if (e.innerWidth) s = e.innerWidth;
			else {
				if (!i.documentElement || !i.documentElement.clientWidth) throw "Can not detect viewport width.";
				s = i.documentElement.clientWidth
			}
			return s
		}, n.prototype.replace = function(e) {
			this.$stage.empty(), this._items = [], e && (e = e instanceof jQuery ? e : t(e)), this.settings.nestedItemSelector && (e = e.find("." + this.settings.nestedItemSelector)), e.filter(function() {
				return 1 === this.nodeType
			}).each(t.proxy(function(t, e) {
				e = this.prepare(e), this.$stage.append(e), this._items.push(e), this._mergers.push(1 * e.find("[data-merge]").andSelf("[data-merge]").attr("data-merge") || 1)
			}, this)), this.reset(t.isNumeric(this.settings.startPosition) ? this.settings.startPosition : 0), this.invalidate("items")
		}, n.prototype.add = function(t, e) {
			e = e === s ? this._items.length : this.normalize(e, !0), this.trigger("add", {
				content: t,
				position: e
			}), 0 === this._items.length || e === this._items.length ? (this.$stage.append(t), this._items.push(t), this._mergers.push(1 * t.find("[data-merge]").andSelf("[data-merge]").attr("data-merge") || 1)) : (this._items[e].before(t), this._items.splice(e, 0, t), this._mergers.splice(e, 0, 1 * t.find("[data-merge]").andSelf("[data-merge]").attr("data-merge") || 1)), this.invalidate("items"), this.trigger("added", {
				content: t,
				position: e
			})
		}, n.prototype.remove = function(t) {
			t = this.normalize(t, !0), t !== s && (this.trigger("remove", {
				content: this._items[t],
				position: t
			}), this._items[t].remove(), this._items.splice(t, 1), this._mergers.splice(t, 1), this.invalidate("items"), this.trigger("removed", {
				content: null,
				position: t
			}))
		}, n.prototype.addTriggerableEvents = function() {
			var e = t.proxy(function(e, i) {
				return t.proxy(function(t) {
					t.relatedTarget !== this && (this.suppress([i]), e.apply(this, [].slice.call(arguments, 1)), this.release([i]))
				}, this)
			}, this);
			t.each({
				next: this.next,
				prev: this.prev,
				to: this.to,
				destroy: this.destroy,
				refresh: this.refresh,
				replace: this.replace,
				add: this.add,
				remove: this.remove
			}, t.proxy(function(t, i) {
				this.$element.on(t + ".owl.carousel", e(i, t + ".owl.carousel"))
			}, this))
		}, n.prototype.watchVisibility = function() {
			function i(t) {
				return t.offsetWidth > 0 && t.offsetHeight > 0
			}

			function s() {
				i(this.$element.get(0)) && (this.$element.removeClass("owl-hidden"), this.refresh(), e.clearInterval(this.e._checkVisibile))
			}
			i(this.$element.get(0)) || (this.$element.addClass("owl-hidden"), e.clearInterval(this.e._checkVisibile), this.e._checkVisibile = e.setInterval(t.proxy(s, this), 500))
		}, n.prototype.preloadAutoWidthImages = function(e) {
			var i, s, n, o;
			i = 0, s = this, e.each(function(r, a) {
				n = t(a), o = new Image, o.onload = function() {
					i++, n.attr("src", o.src), n.css("opacity", 1), i >= e.length && (s.state.imagesLoaded = !0, s.initialize())
				}, o.src = n.attr("src") || n.attr("data-src") || n.attr("data-src-retina")
			})
		}, n.prototype.destroy = function() {
			this.$element.hasClass(this.settings.themeClass) && this.$element.removeClass(this.settings.themeClass), this.settings.responsive !== !1 && t(e).off("resize.owl.carousel"), this.transitionEndVendor && this.off(this.$stage.get(0), this.transitionEndVendor, this.e._transitionEnd);
			for (var s in this._plugins) this._plugins[s].destroy();
			(this.settings.mouseDrag || this.settings.touchDrag) && (this.$stage.off("mousedown touchstart touchcancel"), t(i).off(".owl.dragEvents"), this.$stage.get(0).onselectstart = function() {}, this.$stage.off("dragstart", function() {
				return !1
			})), this.$element.off(".owl"), this.$stage.children(".cloned").remove(), this.e = null, this.$element.removeData("owlCarousel"), this.$stage.children().contents().unwrap(), this.$stage.children().unwrap(), this.$stage.unwrap()
		}, n.prototype.op = function(t, e, i) {
			var s = this.settings.rtl;
			switch (e) {
				case "<":
					return s ? t > i : i > t;
				case ">":
					return s ? i > t : t > i;
				case ">=":
					return s ? i >= t : t >= i;
				case "<=":
					return s ? t >= i : i >= t
			}
		}, n.prototype.on = function(t, e, i, s) {
			t.addEventListener ? t.addEventListener(e, i, s) : t.attachEvent && t.attachEvent("on" + e, i)
		}, n.prototype.off = function(t, e, i, s) {
			t.removeEventListener ? t.removeEventListener(e, i, s) : t.detachEvent && t.detachEvent("on" + e, i)
		}, n.prototype.trigger = function(e, i, s) {
			var n = {
					item: {
						count: this._items.length,
						index: this.current()
					}
				},
				o = t.camelCase(t.grep(["on", e, s], function(t) {
					return t
				}).join("-").toLowerCase()),
				r = t.Event([e, "owl", s || "carousel"].join(".").toLowerCase(), t.extend({
					relatedTarget: this
				}, n, i));
			return this._supress[e] || (t.each(this._plugins, function(t, e) {
				e.onTrigger && e.onTrigger(r)
			}), this.$element.trigger(r), this.settings && "function" == typeof this.settings[o] && this.settings[o].apply(this, r)), r
		}, n.prototype.suppress = function(e) {
			t.each(e, t.proxy(function(t, e) {
				this._supress[e] = !0
			}, this))
		}, n.prototype.release = function(e) {
			t.each(e, t.proxy(function(t, e) {
				delete this._supress[e]
			}, this))
		}, n.prototype.browserSupport = function() {
			if (this.support3d = l(), this.support3d) {
				this.transformVendor = h();
				var t = ["transitionend", "webkitTransitionEnd", "transitionend", "oTransitionEnd"];
				this.transitionEndVendor = t[a()], this.vendorName = this.transformVendor.replace(/Transform/i, ""), this.vendorName = "" !== this.vendorName ? "-" + this.vendorName.toLowerCase() + "-" : ""
			}
			this.state.orientation = e.orientation
		}, t.fn.owlCarousel = function(e) {
			return this.each(function() {
				t(this).data("owlCarousel") || t(this).data("owlCarousel", new n(this, e))
			})
		}, t.fn.owlCarousel.Constructor = n
	}(window.Zepto || window.jQuery, window, document),
	function(t, e) {
		var i = function(e) {
			this._core = e, this._loaded = [], this._handlers = {
				"initialized.owl.carousel change.owl.carousel": t.proxy(function(e) {
					if (e.namespace && this._core.settings && this._core.settings.lazyLoad && (e.property && "position" == e.property.name || "initialized" == e.type))
						for (var i = this._core.settings, s = i.center && Math.ceil(i.items / 2) || i.items, n = i.center && -1 * s || 0, o = (e.property && e.property.value || this._core.current()) + n, r = this._core.clones().length, a = t.proxy(function(t, e) {
								this.load(e)
							}, this); n++ < s;) this.load(r / 2 + this._core.relative(o)), r && t.each(this._core.clones(this._core.relative(o++)), a)
				}, this)
			}, this._core.options = t.extend({}, i.Defaults, this._core.options), this._core.$element.on(this._handlers)
		};
		i.Defaults = {
			lazyLoad: !1
		}, i.prototype.load = function(i) {
			var s = this._core.$stage.children().eq(i),
				n = s && s.find(".owl-lazy");
			!n || t.inArray(s.get(0), this._loaded) > -1 || (n.each(t.proxy(function(i, s) {
				var n, o = t(s),
					r = e.devicePixelRatio > 1 && o.attr("data-src-retina") || o.attr("data-src");
				this._core.trigger("load", {
					element: o,
					url: r
				}, "lazy"), o.is("img") ? o.one("load.owl.lazy", t.proxy(function() {
					o.css("opacity", 1), this._core.trigger("loaded", {
						element: o,
						url: r
					}, "lazy")
				}, this)).attr("src", r) : (n = new Image, n.onload = t.proxy(function() {
					o.css({
						"background-image": "url(" + r + ")",
						opacity: "1"
					}), this._core.trigger("loaded", {
						element: o,
						url: r
					}, "lazy")
				}, this), n.src = r)
			}, this)), this._loaded.push(s.get(0)))
		}, i.prototype.destroy = function() {
			var t, e;
			for (t in this.handlers) this._core.$element.off(t, this.handlers[t]);
			for (e in Object.getOwnPropertyNames(this)) "function" != typeof this[e] && (this[e] = null)
		}, t.fn.owlCarousel.Constructor.Plugins.Lazy = i
	}(window.Zepto || window.jQuery, window, document),
	function(t) {
		var e = function(i) {
			this._core = i, this._handlers = {
				"initialized.owl.carousel": t.proxy(function() {
					this._core.settings.autoHeight && this.update()
				}, this),
				"changed.owl.carousel": t.proxy(function(t) {
					this._core.settings.autoHeight && "position" == t.property.name && this.update()
				}, this),
				"loaded.owl.lazy": t.proxy(function(t) {
					this._core.settings.autoHeight && t.element.closest("." + this._core.settings.itemClass) === this._core.$stage.children().eq(this._core.current()) && this.update()
				}, this)
			}, this._core.options = t.extend({}, e.Defaults, this._core.options), this._core.$element.on(this._handlers)
		};
		e.Defaults = {
			autoHeight: !1,
			autoHeightClass: "owl-height"
		}, e.prototype.update = function() {
			this._core.$stage.parent().height(this._core.$stage.children().eq(this._core.current()).height()).addClass(this._core.settings.autoHeightClass)
		}, e.prototype.destroy = function() {
			var t, e;
			for (t in this._handlers) this._core.$element.off(t, this._handlers[t]);
			for (e in Object.getOwnPropertyNames(this)) "function" != typeof this[e] && (this[e] = null)
		}, t.fn.owlCarousel.Constructor.Plugins.AutoHeight = e
	}(window.Zepto || window.jQuery, window, document),
	function(t, e, i) {
		var s = function(e) {
			this._core = e, this._videos = {}, this._playing = null, this._fullscreen = !1, this._handlers = {
				"resize.owl.carousel": t.proxy(function(t) {
					this._core.settings.video && !this.isInFullScreen() && t.preventDefault()
				}, this),
				"refresh.owl.carousel changed.owl.carousel": t.proxy(function() {
					this._playing && this.stop()
				}, this),
				"prepared.owl.carousel": t.proxy(function(e) {
					var i = t(e.content).find(".owl-video");
					i.length && (i.css("display", "none"), this.fetch(i, t(e.content)))
				}, this)
			}, this._core.options = t.extend({}, s.Defaults, this._core.options), this._core.$element.on(this._handlers), this._core.$element.on("click.owl.video", ".owl-video-play-icon", t.proxy(function(t) {
				this.play(t)
			}, this))
		};
		s.Defaults = {
			video: !1,
			videoHeight: !1,
			videoWidth: !1
		}, s.prototype.fetch = function(t, e) {
			var i = t.attr("data-vimeo-id") ? "vimeo" : "youtube",
				s = t.attr("data-vimeo-id") || t.attr("data-youtube-id"),
				n = t.attr("data-width") || this._core.settings.videoWidth,
				o = t.attr("data-height") || this._core.settings.videoHeight,
				r = t.attr("href");
			if (!r) throw new Error("Missing video URL.");
			if (s = r.match(/(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/), s[3].indexOf("youtu") > -1) i = "youtube";
			else {
				if (!(s[3].indexOf("vimeo") > -1)) throw new Error("Video URL not supported.");
				i = "vimeo"
			}
			s = s[6], this._videos[r] = {
				type: i,
				id: s,
				width: n,
				height: o
			}, e.attr("data-video", r), this.thumbnail(t, this._videos[r])
		}, s.prototype.thumbnail = function(e, i) {
			var s, n, o, r = i.width && i.height ? 'style="width:' + i.width + "px;height:" + i.height + 'px;"' : "",
				a = e.find("img"),
				h = "src",
				l = "",
				d = this._core.settings,
				c = function(t) {
					n = '<div class="owl-video-play-icon"></div>', s = d.lazyLoad ? '<div class="owl-video-tn ' + l + '" ' + h + '="' + t + '"></div>' : '<div class="owl-video-tn" style="opacity:1;background-image:url(' + t + ')"></div>', e.after(s), e.after(n)
				};
			return e.wrap('<div class="owl-video-wrapper"' + r + "></div>"), this._core.settings.lazyLoad && (h = "data-src", l = "owl-lazy"), a.length ? (c(a.attr(h)), a.remove(), !1) : void("youtube" === i.type ? (o = "http://img.youtube.com/vi/" + i.id + "/hqdefault.jpg", c(o)) : "vimeo" === i.type && t.ajax({
				type: "GET",
				url: "http://vimeo.com/api/v2/video/" + i.id + ".json",
				jsonp: "callback",
				dataType: "jsonp",
				success: function(t) {
					o = t[0].thumbnail_large, c(o)
				}
			}))
		}, s.prototype.stop = function() {
			this._core.trigger("stop", null, "video"), this._playing.find(".owl-video-frame").remove(), this._playing.removeClass("owl-video-playing"), this._playing = null
		}, s.prototype.play = function(e) {
			this._core.trigger("play", null, "video"), this._playing && this.stop();
			var i, s, n = t(e.target || e.srcElement),
				o = n.closest("." + this._core.settings.itemClass),
				r = this._videos[o.attr("data-video")],
				a = r.width || "100%",
				h = r.height || this._core.$stage.height();
			"youtube" === r.type ? i = '<iframe width="' + a + '" height="' + h + '" src="http://www.youtube.com/embed/' + r.id + "?autoplay=1&v=" + r.id + '" frameborder="0" allowfullscreen></iframe>' : "vimeo" === r.type && (i = '<iframe src="http://player.vimeo.com/video/' + r.id + '?autoplay=1" width="' + a + '" height="' + h + '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'), o.addClass("owl-video-playing"), this._playing = o, s = t('<div style="height:' + h + "px; width:" + a + 'px" class="owl-video-frame">' + i + "</div>"), n.after(s)
		}, s.prototype.isInFullScreen = function() {
			var s = i.fullscreenElement || i.mozFullScreenElement || i.webkitFullscreenElement;
			return s && t(s).parent().hasClass("owl-video-frame") && (this._core.speed(0), this._fullscreen = !0), s && this._fullscreen && this._playing ? !1 : this._fullscreen ? (this._fullscreen = !1, !1) : this._playing && this._core.state.orientation !== e.orientation ? (this._core.state.orientation = e.orientation, !1) : !0
		}, s.prototype.destroy = function() {
			var t, e;
			this._core.$element.off("click.owl.video");
			for (t in this._handlers) this._core.$element.off(t, this._handlers[t]);
			for (e in Object.getOwnPropertyNames(this)) "function" != typeof this[e] && (this[e] = null)
		}, t.fn.owlCarousel.Constructor.Plugins.Video = s
	}(window.Zepto || window.jQuery, window, document),
	function(t, e, i, s) {
		var n = function(e) {
			this.core = e, this.core.options = t.extend({}, n.Defaults, this.core.options), this.swapping = !0, this.previous = s, this.next = s, this.handlers = {
				"change.owl.carousel": t.proxy(function(t) {
					"position" == t.property.name && (this.previous = this.core.current(), this.next = t.property.value)
				}, this),
				"drag.owl.carousel dragged.owl.carousel translated.owl.carousel": t.proxy(function(t) {
					this.swapping = "translated" == t.type
				}, this),
				"translate.owl.carousel": t.proxy(function() {
					this.swapping && (this.core.options.animateOut || this.core.options.animateIn) && this.swap()
				}, this)
			}, this.core.$element.on(this.handlers)
		};
		n.Defaults = {
			animateOut: !1,
			animateIn: !1
		}, n.prototype.swap = function() {
			if (1 === this.core.settings.items && this.core.support3d) {
				this.core.speed(0);
				var e, i = t.proxy(this.clear, this),
					s = this.core.$stage.children().eq(this.previous),
					n = this.core.$stage.children().eq(this.next),
					o = this.core.settings.animateIn,
					r = this.core.settings.animateOut;
				this.core.current() !== this.previous && (r && (e = this.core.coordinates(this.previous) - this.core.coordinates(this.next), s.css({
					left: e + "px"
				}).addClass("animated owl-animated-out").addClass(r).one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", i)), o && n.addClass("animated owl-animated-in").addClass(o).one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", i))
			}
		}, n.prototype.clear = function(e) {
			t(e.target).css({
				left: ""
			}).removeClass("animated owl-animated-out owl-animated-in").removeClass(this.core.settings.animateIn).removeClass(this.core.settings.animateOut), this.core.transitionEnd()
		}, n.prototype.destroy = function() {
			var t, e;
			for (t in this.handlers) this.core.$element.off(t, this.handlers[t]);
			for (e in Object.getOwnPropertyNames(this)) "function" != typeof this[e] && (this[e] = null)
		}, t.fn.owlCarousel.Constructor.Plugins.Animate = n
	}(window.Zepto || window.jQuery, window, document),
	function(t, e, i) {
		var s = function(e) {
			this.core = e, this.core.options = t.extend({}, s.Defaults, this.core.options), this.handlers = {
				"translated.owl.carousel refreshed.owl.carousel": t.proxy(function() {
					this.autoplay()
				}, this),
				"play.owl.autoplay": t.proxy(function(t, e, i) {
					this.play(e, i)
				}, this),
				"stop.owl.autoplay": t.proxy(function() {
					this.stop()
				}, this),
				"mouseover.owl.autoplay": t.proxy(function() {
					this.core.settings.autoplayHoverPause && this.pause()
				}, this),
				"mouseleave.owl.autoplay": t.proxy(function() {
					this.core.settings.autoplayHoverPause && this.autoplay()
				}, this)
			}, this.core.$element.on(this.handlers)
		};
		s.Defaults = {
			autoplay: !1,
			autoplayTimeout: 5e3,
			autoplayHoverPause: !1,
			autoplaySpeed: !1
		}, s.prototype.autoplay = function() {
			this.core.settings.autoplay && !this.core.state.videoPlay ? (e.clearInterval(this.interval), this.interval = e.setInterval(t.proxy(function() {
				this.play()
			}, this), this.core.settings.autoplayTimeout)) : e.clearInterval(this.interval)
		}, s.prototype.play = function() {
			return i.hidden === !0 || this.core.state.isTouch || this.core.state.isScrolling || this.core.state.isSwiping || this.core.state.inMotion ? void 0 : this.core.settings.autoplay === !1 ? void e.clearInterval(this.interval) : void this.core.next(this.core.settings.autoplaySpeed)
		}, s.prototype.stop = function() {
			e.clearInterval(this.interval)
		}, s.prototype.pause = function() {
			e.clearInterval(this.interval)
		}, s.prototype.destroy = function() {
			var t, i;
			e.clearInterval(this.interval);
			for (t in this.handlers) this.core.$element.off(t, this.handlers[t]);
			for (i in Object.getOwnPropertyNames(this)) "function" != typeof this[i] && (this[i] = null)
		}, t.fn.owlCarousel.Constructor.Plugins.autoplay = s
	}(window.Zepto || window.jQuery, window, document),
	function(t) {
		"use strict";
		var e = function(i) {
			this._core = i, this._initialized = !1, this._pages = [], this._controls = {}, this._templates = [], this.$element = this._core.$element, this._overrides = {
				next: this._core.next,
				prev: this._core.prev,
				to: this._core.to
			}, this._handlers = {
				"prepared.owl.carousel": t.proxy(function(e) {
					this._core.settings.dotsData && this._templates.push(t(e.content).find("[data-dot]").andSelf("[data-dot]").attr("data-dot"))
				}, this),
				"add.owl.carousel": t.proxy(function(e) {
					this._core.settings.dotsData && this._templates.splice(e.position, 0, t(e.content).find("[data-dot]").andSelf("[data-dot]").attr("data-dot"))
				}, this),
				"remove.owl.carousel prepared.owl.carousel": t.proxy(function(t) {
					this._core.settings.dotsData && this._templates.splice(t.position, 1)
				}, this),
				"change.owl.carousel": t.proxy(function(t) {
					if ("position" == t.property.name && !this._core.state.revert && !this._core.settings.loop && this._core.settings.navRewind) {
						var e = this._core.current(),
							i = this._core.maximum(),
							s = this._core.minimum();
						t.data = t.property.value > i ? e >= i ? s : i : t.property.value < s ? i : t.property.value
					}
				}, this),
				"changed.owl.carousel": t.proxy(function(t) {
					"position" == t.property.name && this.draw()
				}, this),
				"refreshed.owl.carousel": t.proxy(function() {
					this._initialized || (this.initialize(), this._initialized = !0), this._core.trigger("refresh", null, "navigation"), this.update(), this.draw(), this._core.trigger("refreshed", null, "navigation")
				}, this)
			}, this._core.options = t.extend({}, e.Defaults, this._core.options), this.$element.on(this._handlers)
		};
		e.Defaults = {
			nav: !1,
			navRewind: !0,
			navText: ["prev", "next"],
			navSpeed: !1,
			navElement: "div",
			navContainer: !1,
			navContainerClass: "owl-nav",
			navClass: ["owl-prev", "owl-next"],
			slideBy: 1,
			dotClass: "owl-dot",
			dotsClass: "owl-dots",
			dots: !0,
			dotsEach: !1,
			dotData: !1,
			dotsSpeed: !1,
			dotsContainer: !1,
			controlsClass: "owl-controls"
		}, e.prototype.initialize = function() {
			var e, i, s = this._core.settings;
			s.dotsData || (this._templates = [t("<div>").addClass(s.dotClass).append(t("<span>")).prop("outerHTML")]), s.navContainer && s.dotsContainer || (this._controls.$container = t("<div>").addClass(s.controlsClass).appendTo(this.$element)), this._controls.$indicators = s.dotsContainer ? t(s.dotsContainer) : t("<div>").hide().addClass(s.dotsClass).appendTo(this._controls.$container), this._controls.$indicators.on("click", "div", t.proxy(function(e) {
				var i = t(e.target).parent().is(this._controls.$indicators) ? t(e.target).index() : t(e.target).parent().index();
				e.preventDefault(), this.to(i, s.dotsSpeed)
			}, this)), e = s.navContainer ? t(s.navContainer) : t("<div>").addClass(s.navContainerClass).prependTo(this._controls.$container), this._controls.$next = t("<" + s.navElement + ">"), this._controls.$previous = this._controls.$next.clone(), this._controls.$previous.addClass(s.navClass[0]).html(s.navText[0]).hide().prependTo(e).on("click", t.proxy(function() {
				this.prev(s.navSpeed)
			}, this)), this._controls.$next.addClass(s.navClass[1]).html(s.navText[1]).hide().appendTo(e).on("click", t.proxy(function() {
				this.next(s.navSpeed)
			}, this));
			for (i in this._overrides) this._core[i] = t.proxy(this[i], this)
		}, e.prototype.destroy = function() {
			var t, e, i, s;
			for (t in this._handlers) this.$element.off(t, this._handlers[t]);
			for (e in this._controls) this._controls[e].remove();
			for (s in this.overides) this._core[s] = this._overrides[s];
			for (i in Object.getOwnPropertyNames(this)) "function" != typeof this[i] && (this[i] = null)
		}, e.prototype.update = function() {
			var t, e, i, s = this._core.settings,
				n = this._core.clones().length / 2,
				o = n + this._core.items().length,
				r = s.center || s.autoWidth || s.dotData ? 1 : s.dotsEach || s.items;
			if ("page" !== s.slideBy && (s.slideBy = Math.min(s.slideBy, s.items)), s.dots || "page" == s.slideBy)
				for (this._pages = [], t = n, e = 0, i = 0; o > t; t++)(e >= r || 0 === e) && (this._pages.push({
					start: t - n,
					end: t - n + r - 1
				}), e = 0, ++i), e += this._core.mergers(this._core.relative(t))
		}, e.prototype.draw = function() {
			var e, i, s = "",
				n = this._core.settings,
				o = (this._core.$stage.children(), this._core.relative(this._core.current()));
			if (!n.nav || n.loop || n.navRewind || (this._controls.$previous.toggleClass("disabled", 0 >= o), this._controls.$next.toggleClass("disabled", o >= this._core.maximum())), this._controls.$previous.toggle(n.nav), this._controls.$next.toggle(n.nav), n.dots) {
				if (e = this._pages.length - this._controls.$indicators.children().length, n.dotData && 0 !== e) {
					for (i = 0; i < this._controls.$indicators.children().length; i++) s += this._templates[this._core.relative(i)];
					this._controls.$indicators.html(s)
				} else e > 0 ? (s = new Array(e + 1).join(this._templates[0]), this._controls.$indicators.append(s)) : 0 > e && this._controls.$indicators.children().slice(e).remove();
				this._controls.$indicators.find(".active").removeClass("active"), this._controls.$indicators.children().eq(t.inArray(this.current(), this._pages)).addClass("active")
			}
			this._controls.$indicators.toggle(n.dots)
		}, e.prototype.onTrigger = function(e) {
			var i = this._core.settings;
			e.page = {
				index: t.inArray(this.current(), this._pages),
				count: this._pages.length,
				size: i && (i.center || i.autoWidth || i.dotData ? 1 : i.dotsEach || i.items)
			}
		}, e.prototype.current = function() {
			var e = this._core.relative(this._core.current());
			return t.grep(this._pages, function(t) {
				return t.start <= e && t.end >= e
			}).pop()
		}, e.prototype.getPosition = function(e) {
			var i, s, n = this._core.settings;
			return "page" == n.slideBy ? (i = t.inArray(this.current(), this._pages), s = this._pages.length, e ? ++i : --i, i = this._pages[(i % s + s) % s].start) : (i = this._core.relative(this._core.current()), s = this._core.items().length, e ? i += n.slideBy : i -= n.slideBy), i
		}, e.prototype.next = function(e) {
			t.proxy(this._overrides.to, this._core)(this.getPosition(!0), e)
		}, e.prototype.prev = function(e) {
			t.proxy(this._overrides.to, this._core)(this.getPosition(!1), e)
		}, e.prototype.to = function(e, i, s) {
			var n;
			s ? t.proxy(this._overrides.to, this._core)(e, i) : (n = this._pages.length, t.proxy(this._overrides.to, this._core)(this._pages[(e % n + n) % n].start, i))
		}, t.fn.owlCarousel.Constructor.Plugins.Navigation = e
	}(window.Zepto || window.jQuery, window, document),
	function(t, e) {
		"use strict";
		var i = function(s) {
			this._core = s, this._hashes = {}, this.$element = this._core.$element, this._handlers = {
				"initialized.owl.carousel": t.proxy(function() {
					"URLHash" == this._core.settings.startPosition && t(e).trigger("hashchange.owl.navigation")
				}, this),
				"prepared.owl.carousel": t.proxy(function(e) {
					var i = t(e.content).find("[data-hash]").andSelf("[data-hash]").attr("data-hash");
					this._hashes[i] = e.content
				}, this)
			}, this._core.options = t.extend({}, i.Defaults, this._core.options), this.$element.on(this._handlers), t(e).on("hashchange.owl.navigation", t.proxy(function() {
				var t = e.location.hash.substring(1),
					i = this._core.$stage.children(),
					s = this._hashes[t] && i.index(this._hashes[t]) || 0;
				return t ? void this._core.to(s, !1, !0) : !1
			}, this))
		};
		i.Defaults = {
			URLhashListener: !1
		}, i.prototype.destroy = function() {
			var i, s;
			t(e).off("hashchange.owl.navigation");
			for (i in this._handlers) this._core.$element.off(i, this._handlers[i]);
			for (s in Object.getOwnPropertyNames(this)) "function" != typeof this[s] && (this[s] = null)
		}, t.fn.owlCarousel.Constructor.Plugins.Hash = i
	}(window.Zepto || window.jQuery, window, document)
}(jQuery),
function(t) {
	! function(e, i, s, n) {
		s.swipebox = function(o, r) {
			var a = {
					useCSS: !0,
					hideBarsDelay: 3e3
				},
				h = this,
				l = s(o),
				o = o,
				d = o.selector,
				c = s(d),
				u = i.createTouch !== n || "ontouchstart" in e || "onmsgesturechange" in e || navigator.msMaxTouchPoints,
				p = !!e.SVGSVGElement,
				g = '<div id="swipebox-overlay">					<div id="swipebox-slider"></div>					<div id="swipebox-caption"></div>					<div id="swipebox-action">						<a id="swipebox-close"></a>						<a id="swipebox-prev"></a>						<a id="swipebox-next"></a>					</div>			</div>';
			h.settings = {}, h.init = function() {
				h.settings = s.extend({}, a, r), c.click(function(t) {
					t.preventDefault(), t.stopPropagation(), index = l.index(s(this)), f.target = s(t.target), f.init(index)
				})
			};
			var f = {
				init: function(t) {
					this.target.trigger("swipebox-start"), this.build(), this.openSlide(t), this.openImg(t), this.preloadImg(t + 1), this.preloadImg(t - 1)
				},
				build: function() {
					var t = this;
					if (s("body").append(g), t.doCssTrans() && (s("#swipebox-slider").css({
							"-webkit-transition": "left 0.4s ease",
							"-moz-transition": "left 0.4s ease",
							"-o-transition": "left 0.4s ease",
							"-khtml-transition": "left 0.4s ease",
							transition: "left 0.4s ease"
						}), s("#swipebox-overlay").css({
							"-webkit-transition": "opacity 1s ease",
							"-moz-transition": "opacity 1s ease",
							"-o-transition": "opacity 1s ease",
							"-khtml-transition": "opacity 1s ease",
							transition: "opacity 1s ease"
						}), s("#swipebox-action, #swipebox-caption").css({
							"-webkit-transition": "0.5s",
							"-moz-transition": "0.5s",
							"-o-transition": "0.5s",
							"-khtml-transition": "0.5s",
							transition: "0.5s"
						})), p) {
						var i = s("#swipebox-action #swipebox-close").css("background-image");
						i = i.replace("png", "svg"), s("#swipebox-action #swipebox-prev,#swipebox-action #swipebox-next,#swipebox-action #swipebox-close").css({
							"background-image": i
						})
					}
					l.each(function() {
						s("#swipebox-slider").append('<div class="slide"></div>')
					}), t.setDim(), t.actions(), t.keyboard(), t.gesture(), t.animBars(), s(e).resize(function() {
						t.setDim()
					}).resize()
				},
				setDim: function() {
					var t = {
						width: s(e).width(),
						height: e.innerHeight ? e.innerHeight : s(e).height()
					};
					s("#swipebox-overlay").css(t)
				},
				supportTransition: function() {
					for (var t = "transition WebkitTransition MozTransition OTransition msTransition KhtmlTransition".split(" "), e = 0; e < t.length; e++)
						if (i.createElement("div").style[t[e]] !== n) return t[e];
					return !1
				},
				doCssTrans: function() {
					return h.settings.useCSS && this.supportTransition() ? !0 : void 0
				},
				gesture: function() {
					if (u) {
						var t = this,
							e = null,
							i = 10,
							n = {},
							o = {},
							r = s("#swipebox-caption, #swipebox-action");
						r.addClass("visible-bars"), t.setTimeout(), s("body").bind("touchstart", function(t) {
							return s(this).addClass("touching"), o = t.originalEvent.targetTouches[0], n.pageX = t.originalEvent.targetTouches[0].pageX, s(".touching").bind("touchmove", function(t) {
								t.preventDefault(), t.stopPropagation(), o = t.originalEvent.targetTouches[0]
							}), !1
						}).bind("touchend", function(a) {
							a.preventDefault(), a.stopPropagation(), e = o.pageX - n.pageX, e >= i ? t.getPrev() : -i >= e ? t.getNext() : r.hasClass("visible-bars") ? (t.clearTimeout(), t.hideBars()) : (t.showBars(), t.setTimeout()), s(".touching").off("touchmove").removeClass("touching")
						})
					}
				},
				setTimeout: function() {
					if (h.settings.hideBarsDelay > 0) {
						var t = this;
						t.clearTimeout(), t.timeout = e.setTimeout(function() {
							t.hideBars()
						}, h.settings.hideBarsDelay)
					}
				},
				clearTimeout: function() {
					e.clearTimeout(this.timeout), this.timeout = null
				},
				showBars: function() {
					var t = s("#swipebox-caption, #swipebox-action");
					this.doCssTrans() ? t.addClass("visible-bars") : (s("#swipebox-caption").animate({
						top: 0
					}, 500), s("#swipebox-action").animate({
						bottom: 0
					}, 500), setTimeout(function() {
						t.addClass("visible-bars")
					}, 1e3))
				},
				hideBars: function() {
					var t = s("#swipebox-caption, #swipebox-action");
					this.doCssTrans() ? t.removeClass("visible-bars") : (s("#swipebox-caption").animate({
						top: "-50px"
					}, 500), s("#swipebox-action").animate({
						bottom: "-50px"
					}, 500), setTimeout(function() {
						t.removeClass("visible-bars")
					}, 1e3))
				},
				animBars: function() {
					var t = this,
						e = s("#swipebox-caption, #swipebox-action");
					e.addClass("visible-bars"), t.setTimeout(), s("#swipebox-slider").click(function(i) {
						e.hasClass("visible-bars") || (t.showBars(), t.setTimeout())
					}), s("#swipebox-action").hover(function() {
						t.showBars(), e.addClass("force-visible-bars"), t.clearTimeout()
					}, function() {
						e.removeClass("force-visible-bars"), t.setTimeout()
					})
				},
				keyboard: function() {
					var t = this;
					s(e).bind("keyup", function(e) {
						e.preventDefault(), e.stopPropagation(), 37 == e.keyCode ? t.getPrev() : 39 == e.keyCode ? t.getNext() : 27 == e.keyCode && t.closeSlide()
					})
				},
				actions: function() {
					var e = this;
					l.length < 2 ? s("#swipebox-prev, #swipebox-next").hide() : (s("#swipebox-prev").bind("click touchend", function(t) {
						t.preventDefault(), t.stopPropagation(), e.getPrev(), e.setTimeout()
					}), s("#swipebox-next").bind("click touchend", function(t) {
						t.preventDefault(), t.stopPropagation(), e.getNext(), e.setTimeout()
					})), s("#swipebox-close").bind("click touchend", function(i) {
						e.closeSlide(), t(".gallery-fix").delay(1).fadeOut(0)
					})
				},
				setSlide: function(t, e) {
					e = e || !1;
					var i = s("#swipebox-slider");
					this.doCssTrans() ? i.css({
						left: 100 * -t + "%"
					}) : i.animate({
						left: 100 * -t + "%"
					}), s("#swipebox-slider .slide").removeClass("current"), s("#swipebox-slider .slide").eq(t).addClass("current"), this.setTitle(t), e && i.fadeIn(), s("#swipebox-prev, #swipebox-next").removeClass("disabled"), 0 == t ? s("#swipebox-prev").addClass("disabled") : t == l.length - 1 && s("#swipebox-next").addClass("disabled")
				},
				openSlide: function(t) {
					s("html").addClass("swipebox"), s(e).trigger("resize"), this.setSlide(t, !0)
				},
				preloadImg: function(t) {
					var e = this;
					setTimeout(function() {
						e.openImg(t)
					}, 1e3)
				},
				openImg: function(t) {
					var e = this;
					return 0 > t || t >= l.length ? !1 : void e.loadImg(l.eq(t).attr("href"), function() {
						s("#swipebox-slider .slide").eq(t).html(this)
					})
				},
				setTitle: function(t, e) {
					s("#swipebox-caption").empty(), l.eq(t).attr("title") && s("#swipebox-caption").append(l.eq(t).attr("title"))
				},
				loadImg: function(t, e) {
					var i = s("<img>").on("load", function() {
						e.call(i)
					});
					i.attr("src", t)
				},
				getNext: function() {
					var t = this;
					index = s("#swipebox-slider .slide").index(s("#swipebox-slider .slide.current")), index + 1 < l.length ? (index++, t.setSlide(index), t.preloadImg(index + 1)) : (s("#swipebox-slider").addClass("rightSpring"), setTimeout(function() {
						s("#swipebox-slider").removeClass("rightSpring")
					}, 500))
				},
				getPrev: function() {
					var t = this;
					index = s("#swipebox-slider .slide").index(s("#swipebox-slider .slide.current")), index > 0 ? (index--, t.setSlide(index), t.preloadImg(index - 1)) : (s("#swipebox-slider").addClass("leftSpring"), setTimeout(function() {
						s("#swipebox-slider").removeClass("leftSpring")
					}, 500))
				},
				closeSlide: function() {
					var t = this;
					s(e).trigger("resize"), s("html").removeClass("swipebox"), t.destroy()
				},
				destroy: function() {
					var t = this;
					s(e).unbind("keyup"), s("body").unbind("touchstart"), s("body").unbind("touchmove"), s("body").unbind("touchend"), s("#swipebox-slider").unbind(), s("#swipebox-overlay").remove(), l.removeData("_swipebox"), t.target.trigger("swipebox-destroy")
				}
			};
			h.init()
		}, s.fn.swipebox = function(t) {
			if (!s.data(this, "_swipebox")) {
				var e = new s.swipebox(this, t);
				this.data("_swipebox", e)
			}
		}
	}(window, document, jQuery)
}(jQuery),
function(t) {
	! function(t, e, i, s) {
		var n = t(e);
		t.fn.lazyload = function(o) {
			function r() {
				var e = 0;
				h.each(function() {
					var i = t(this);
					if (!l.skip_invisible || i.is(":visible"))
						if (t.abovethetop(this, l) || t.leftofbegin(this, l));
						else if (t.belowthefold(this, l) || t.rightoffold(this, l)) {
						if (++e > l.failure_limit) return !1
					} else i.trigger("appear"), e = 0
				})
			}
			var a, h = this,
				l = {
					threshold: 0,
					failure_limit: 0,
					event: "scroll",
					effect: "show",
					container: e,
					data_attribute: "original",
					skip_invisible: !1,
					appear: null,
					load: null,
					placeholder: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC"
				};
			return o && (s !== o.failurelimit && (o.failure_limit = o.failurelimit, delete o.failurelimit), s !== o.effectspeed && (o.effect_speed = o.effectspeed, delete o.effectspeed), t.extend(l, o)), a = l.container === s || l.container === e ? n : t(l.container), 0 === l.event.indexOf("scroll") && a.bind(l.event, function() {
				return r()
			}), this.each(function() {
				var e = this,
					i = t(e);
				e.loaded = !1, (i.attr("src") === s || i.attr("src") === !1) && i.is("img") && i.attr("src", l.placeholder), i.one("appear", function() {
					if (!this.loaded) {
						if (l.appear) {
							var s = h.length;
							l.appear.call(e, s, l)
						}
						t("<img />").bind("load", function() {
							var s = i.attr("data-" + l.data_attribute);
							i.hide(), i.is("img") ? i.attr("src", s) : i.css("background-image", "url('" + s + "')"), i[l.effect](l.effect_speed), e.loaded = !0;
							var n = t.grep(h, function(t) {
								return !t.loaded
							});
							if (h = t(n), l.load) {
								var o = h.length;
								l.load.call(e, o, l)
							}
						}).attr("src", i.attr("data-" + l.data_attribute))
					}
				}), 0 !== l.event.indexOf("scroll") && i.bind(l.event, function() {
					e.loaded || i.trigger("appear")
				})
			}), n.bind("resize", function() {
				r()
			}), /(?:iphone|ipod|ipad).*os 5/gi.test(navigator.appVersion) && n.bind("pageshow", function(e) {
				e.originalEvent && e.originalEvent.persisted && h.each(function() {
					t(this).trigger("appear")
				})
			}), t(i).ready(function() {
				r()
			}), this
		}, t.belowthefold = function(i, o) {
			var r;
			return r = o.container === s || o.container === e ? (e.innerHeight ? e.innerHeight : n.height()) + n.scrollTop() : t(o.container).offset().top + t(o.container).height(), r <= t(i).offset().top - o.threshold
		}, t.rightoffold = function(i, o) {
			var r;
			return r = o.container === s || o.container === e ? n.width() + n.scrollLeft() : t(o.container).offset().left + t(o.container).width(), r <= t(i).offset().left - o.threshold
		}, t.abovethetop = function(i, o) {
			var r;
			return r = o.container === s || o.container === e ? n.scrollTop() : t(o.container).offset().top, r >= t(i).offset().top + o.threshold + t(i).height()
		}, t.leftofbegin = function(i, o) {
			var r;
			return r = o.container === s || o.container === e ? n.scrollLeft() : t(o.container).offset().left, r >= t(i).offset().left + o.threshold + t(i).width()
		}, t.inviewport = function(e, i) {
			return !(t.rightoffold(e, i) || t.leftofbegin(e, i) || t.belowthefold(e, i) || t.abovethetop(e, i))
		}, t.extend(t.expr[":"], {
			"below-the-fold": function(e) {
				return t.belowthefold(e, {
					threshold: 0
				})
			},
			"above-the-top": function(e) {
				return !t.belowthefold(e, {
					threshold: 0
				})
			},
			"right-of-screen": function(e) {
				return t.rightoffold(e, {
					threshold: 0
				})
			},
			"left-of-screen": function(e) {
				return !t.rightoffold(e, {
					threshold: 0
				})
			},
			"in-viewport": function(e) {
				return t.inviewport(e, {
					threshold: 0
				})
			},
			"above-the-fold": function(e) {
				return !t.belowthefold(e, {
					threshold: 0
				})
			},
			"right-of-fold": function(e) {
				return t.rightoffold(e, {
					threshold: 0
				})
			},
			"left-of-fold": function(e) {
				return !t.rightoffold(e, {
					threshold: 0
				})
			}
		})
	}(jQuery, window, document)
}(jQuery),
function(t) {
	! function(t, e) {
		"object" == typeof exports ? e(exports) : "function" == typeof define && define.amd ? define(["exports"], e) : e(t)
	}(this, function(t) {
		return t.Nanobar = function() {
			"use strict";
			var t, e, i, s, n, o, r = {
					width: "100%",
					height: "3px",
					zIndex: 9999,
					top: "60px"
				},
				a = {
					width: 0,
					height: "100%",
					clear: "both",
					transition: "height 250ms"
				};
			return t = function(t, e) {
				var i;
				for (i in e) t.style[i] = e[i];
				t.style["float"] = "left"
			}, s = function() {
				var t = this,
					e = this.width - this.here;.1 > e && e > -.1 ? (n.call(this, this.here), this.moving = !1, 100 == this.width && (this.el.style.height = 0, setTimeout(function() {
					t.cont.el.removeChild(t.el)
				}, 300))) : (n.call(this, this.width - e / 4), setTimeout(function() {
					t.go()
				}, 16))
			}, n = function(t) {
				this.width = t, this.el.style.width = this.width + "%"
			}, o = function() {
				var t = new e(this);
				this.bars.unshift(t)
			}, e = function(e) {
				this.el = document.createElement("div"), this.el.style.backgroundColor = e.opts.bg, this.width = 0, this.here = 0, this.moving = !1, this.cont = e, t(this.el, a), e.el.appendChild(this.el)
			}, e.prototype.go = function(t) {
				t ? (this.here = t, this.moving || (this.moving = !0, s.call(this))) : this.moving && s.call(this)
			}, i = function(e) {
				var i, s = this.opts = e || {};
				s.bg = s.bg || "#000", this.bars = [], i = this.el = document.createElement("div"), t(this.el, r), s.id && (i.id = s.id), i.style.position = s.target ? "relative" : "fixed", s.target ? s.target.insertBefore(i, s.target.firstChild) : document.getElementsByTagName("body")[0].appendChild(i), o.call(this)
			}, i.prototype.go = function(t) {
				this.bars[0].go(t), 100 == t && o.call(this)
			}, i
		}(), t.Nanobar
	})
}(jQuery),
function(t) {
	! function(t) {
		if ("object" == typeof exports && "undefined" != typeof module) module.exports = t();
		else if ("function" == typeof define && define.amd) define([], t);
		else {
			var e;
			"undefined" != typeof window ? e = window : "undefined" != typeof global ? e = global : "undefined" != typeof self && (e = self), e.Countdown = t()
		}
	}(function() {
		return function e(t, i, s) {
			function n(r, a) {
				if (!i[r]) {
					if (!t[r]) {
						var h = "function" == typeof require && require;
						if (!a && h) return h(r, !0);
						if (o) return o(r, !0);
						var l = new Error("Cannot find module '" + r + "'");
						throw l.code = "MODULE_NOT_FOUND", l
					}
					var d = i[r] = {
						exports: {}
					};
					t[r][0].call(d.exports, function(e) {
						var i = t[r][1][e];
						return n(i ? i : e)
					}, d, d.exports, e, t, i, s)
				}
				return i[r].exports
			}
			for (var o = "function" == typeof require && require, r = 0; r < s.length; r++) n(s[r]);
			return n
		}({
			1: [function(t, e) {
				var i = {
						date: "June 7, 2087 15:03:25",
						refresh: 1e3,
						offset: 0,
						onEnd: function() {},
						render: function(t) {
							this.el.innerHTML = "<div class='date-years'>" + t.years + "<em>years</em> </div><div class='date-days'>" + t.days + "<em>days</em> </div><div class='date-hours'>" + this.leadingZeros(t.hours) + "<em>hours</em> </div><div class='date-minutes'>" + this.leadingZeros(t.min) + "<em>minutes</em> </div><div class='date-seconds'>" + this.leadingZeros(t.sec) + "<em>seconds</em> </div>"
						}
					},
					s = function(t, e) {
						this.el = t, this.options = {}, this.interval = !1;
						for (var s in i) i.hasOwnProperty(s) && (this.options[s] = "undefined" != typeof e[s] ? e[s] : i[s], "date" === s && "object" != typeof this.options.date && (this.options.date = new Date(this.options.date)), "function" == typeof this.options[s] && (this.options[s] = this.options[s].bind(this)));
						this.getDiffDate = function() {
							var t = (this.options.date.getTime() - Date.now() + this.options.offset) / 1e3,
								e = {
									years: 0,
									days: 0,
									hours: 0,
									min: 0,
									sec: 0,
									millisec: 0
								};
							return 0 >= t ? (this.interval && (this.stop(), this.options.onEnd()), e) : (t >= 31557600 && (e.years = Math.floor(t / 31557600), t -= 365.25 * e.years * 86400), t >= 86400 && (e.days = Math.floor(t / 86400), t -= 86400 * e.days), t >= 3600 && (e.hours = Math.floor(t / 3600), t -= 3600 * e.hours), t >= 60 && (e.min = Math.floor(t / 60), t -= 60 * e.min), e.sec = Math.round(t), e.millisec = t % 1 * 1e3, e)
						}.bind(this), this.leadingZeros = function(t, e) {
							return e = e || 2, t = String(t), t.length > e ? t : (Array(e + 1).join("0") + t).substr(-e)
						}, this.update = function(t) {
							return "object" != typeof t && (t = new Date(t)), this.options.date = t, this.render(), this
						}.bind(this), this.stop = function() {
							return this.interval && (clearInterval(this.interval), this.interval = !1), this
						}.bind(this), this.render = function() {
							return this.options.render(this.getDiffDate()), this
						}.bind(this), this.start = function() {
							return this.interval ? void 0 : (this.render(), this.options.refresh && (this.interval = setInterval(this.render, this.options.refresh)), this)
						}.bind(this), this.updateOffset = function(t) {
							return this.options.offset = t, this
						}.bind(this), this.start()
					};
				e.exports = s
			}, {}],
			2: [function(e, i) {
				var s = e("./countdown.js"),
					n = "countdown",
					o = "date";
				jQuery.fn.countdown = function(e) {
					return t.each(this, function(i, r) {
						var a = t(r);
						a.data(n) || (a.data(o) && (e.date = a.data(o)), a.data(n, new s(r, e)))
					})
				}, i.exports = s
			}, {
				"./countdown.js": 1
			}]
		}, {}, [2])(2)
	})
}(jQuery),
function(t) {
	! function(t) {
		var e = function(e, i) {
			this.settings = i, this.checkSettings(), this.imgAnalyzerTimeout = null, this.entries = null, this.buildingRow = {
				entriesBuff: [],
				width: 0,
				height: 0,
				aspectRatio: 0
			}, this.lastAnalyzedIndex = -1, this["yield"] = {
				every: 2,
				flushed: 0
			}, this.border = i.border >= 0 ? i.border : i.margins, this.maxRowHeight = this.retrieveMaxRowHeight(), this.suffixRanges = this.retrieveSuffixRanges(), this.offY = this.border, this.spinner = {
				phase: 0,
				timeSlot: 150,
				$el: t('<div class="spinner"><span></span><span></span><span></span></div>'),
				intervalId: null
			}, this.checkWidthIntervalId = null, this.galleryWidth = e.width(), this.$gallery = e
		};
		e.prototype.getSuffix = function(t, e) {
			var i, s;
			for (i = t > e ? t : e, s = 0; s < this.suffixRanges.length; s++)
				if (i <= this.suffixRanges[s]) return this.settings.sizeRangeSuffixes[this.suffixRanges[s]];
			return this.settings.sizeRangeSuffixes[this.suffixRanges[s - 1]]
		}, e.prototype.removeSuffix = function(t, e) {
			return t.substring(0, t.length - e.length)
		}, e.prototype.endsWith = function(t, e) {
			return -1 !== t.indexOf(e, t.length - e.length)
		}, e.prototype.getUsedSuffix = function(t) {
			for (var e in this.settings.sizeRangeSuffixes)
				if (this.settings.sizeRangeSuffixes.hasOwnProperty(e)) {
					if (0 === this.settings.sizeRangeSuffixes[e].length) continue;
					if (this.endsWith(t, this.settings.sizeRangeSuffixes[e])) return this.settings.sizeRangeSuffixes[e]
				}
			return ""
		}, e.prototype.newSrc = function(t, e, i) {
			var s;
			if (this.settings.thumbnailPath) s = this.settings.thumbnailPath(t, e, i);
			else {
				var n = t.match(this.settings.extension),
					o = null !== n ? n[0] : "";
				s = t.replace(this.settings.extension, ""), s = this.removeSuffix(s, this.getUsedSuffix(s)), s += this.getSuffix(e, i) + o
			}
			return s
		}, e.prototype.showImg = function(t, e) {
			this.settings.cssAnimation ? (t.addClass("entry-visible"), e && e()) : t.stop().fadeTo(this.settings.imagesAnimationDuration, 1, e)
		}, e.prototype.extractImgSrcFromImage = function(t) {
			var e = "undefined" != typeof t.data("safe-src") ? t.data("safe-src") : t.attr("src");
			return t.data("jg.originalSrc", e), e
		}, e.prototype.imgFromEntry = function(t) {
			var e = t.find("> img");
			return 0 === e.length && (e = t.find("> a > img")), 0 === e.length ? null : e
		}, e.prototype.captionFromEntry = function(t) {
			var e = t.find("> .caption");
			return 0 === e.length ? null : e
		}, e.prototype.displayEntry = function(e, i, s, n, o, r) {
			e.width(n), e.height(r), e.css("top", s), e.css("left", i);
			var a = this.imgFromEntry(e);
			if (null !== a) {
				a.css("width", n), a.css("height", o), a.css("margin-left", -n / 2), a.css("margin-top", -o / 2);
				var h = a.attr("src"),
					l = this.newSrc(h, n, o);
				a.one("error", function() {
					a.attr("src", a.data("jg.originalSrc"))
				});
				var d = function() {
					h !== l && a.attr("src", l)
				};
				"skipped" === e.data("jg.loaded") ? this.onImageEvent(h, t.proxy(function() {
					this.showImg(e, d), e.data("jg.loaded", !0)
				}, this)) : this.showImg(e, d)
			} else this.showImg(e);
			this.displayEntryCaption(e)
		}, e.prototype.displayEntryCaption = function(e) {
			var i = this.imgFromEntry(e);
			if (null !== i && this.settings.captions) {
				var s = this.captionFromEntry(e);
				if (null === s) {
					var n = i.attr("alt");
					this.isValidCaption(n) || (n = e.attr("title")), this.isValidCaption(n) && (s = t('<div class="caption">' + n + "</div>"), e.append(s), e.data("jg.createdCaption", !0))
				}
				null !== s && (this.settings.cssAnimation || s.stop().fadeTo(0, this.settings.captionSettings.nonVisibleOpacity), this.addCaptionEventsHandlers(e))
			} else this.removeCaptionEventsHandlers(e)
		}, e.prototype.isValidCaption = function(t) {
			return "undefined" != typeof t && t.length > 0
		}, e.prototype.onEntryMouseEnterForCaption = function(e) {
			var i = this.captionFromEntry(t(e.currentTarget));
			this.settings.cssAnimation ? i.addClass("caption-visible").removeClass("caption-hidden") : i.stop().fadeTo(this.settings.captionSettings.animationDuration, this.settings.captionSettings.visibleOpacity)
		}, e.prototype.onEntryMouseLeaveForCaption = function(e) {
			var i = this.captionFromEntry(t(e.currentTarget));
			this.settings.cssAnimation ? i.removeClass("caption-visible").removeClass("caption-hidden") : i.stop().fadeTo(this.settings.captionSettings.animationDuration, this.settings.captionSettings.nonVisibleOpacity)
		}, e.prototype.addCaptionEventsHandlers = function(e) {
			var i = e.data("jg.captionMouseEvents");
			"undefined" == typeof i && (i = {
				mouseenter: t.proxy(this.onEntryMouseEnterForCaption, this),
				mouseleave: t.proxy(this.onEntryMouseLeaveForCaption, this)
			}, e.on("mouseenter", void 0, void 0, i.mouseenter), e.on("mouseleave", void 0, void 0, i.mouseleave), e.data("jg.captionMouseEvents", i))
		}, e.prototype.removeCaptionEventsHandlers = function(t) {
			var e = t.data("jg.captionMouseEvents");
			"undefined" != typeof e && (t.off("mouseenter", void 0, e.mouseenter), t.off("mouseleave", void 0, e.mouseleave), t.removeData("jg.captionMouseEvents"))
		}, e.prototype.prepareBuildingRow = function(t) {
			var e, i, s, n, o, r = !0,
				a = 0,
				h = this.galleryWidth - 2 * this.border - (this.buildingRow.entriesBuff.length - 1) * this.settings.margins,
				l = h / this.buildingRow.aspectRatio,
				d = this.buildingRow.width / h > this.settings.justifyThreshold;
			if (t && "hide" === this.settings.lastRow && !d) {
				for (e = 0; e < this.buildingRow.entriesBuff.length; e++) i = this.buildingRow.entriesBuff[e], this.settings.cssAnimation ? i.removeClass("entry-visible") : i.stop().fadeTo(0, 0);
				return -1
			}
			for (t && !d && "justify" !== this.settings.lastRow && "hide" !== this.settings.lastRow && (r = !1), e = 0; e < this.buildingRow.entriesBuff.length; e++) i = this.buildingRow.entriesBuff[e], s = i.data("jg.width") / i.data("jg.height"), r ? (n = e === this.buildingRow.entriesBuff.length - 1 ? h : l * s, o = l) : (n = this.settings.rowHeight * s, o = this.settings.rowHeight), h -= Math.round(n), i.data("jg.jwidth", Math.round(n)), i.data("jg.jheight", Math.ceil(o)), (0 === e || a > o) && (a = o);
			return this.settings.fixedHeight && a > this.settings.rowHeight && (a = this.settings.rowHeight), this.buildingRow.height = a, r
		}, e.prototype.clearBuildingRow = function() {
			this.buildingRow.entriesBuff = [], this.buildingRow.aspectRatio = 0, this.buildingRow.width = 0
		}, e.prototype.flushRow = function(t) {
			var e, i, s, n = this.settings,
				o = this.border;
			if (i = this.prepareBuildingRow(t), t && "hide" === n.lastRow && -1 === this.buildingRow.height) return void this.clearBuildingRow();
			if (this.maxRowHeight.isPercentage ? this.maxRowHeight.value * n.rowHeight < this.buildingRow.height && (this.buildingRow.height = this.maxRowHeight.value * n.rowHeight) : this.maxRowHeight.value > 0 && this.maxRowHeight.value < this.buildingRow.height && (this.buildingRow.height = this.maxRowHeight.value), "center" === n.lastRow || "right" === n.lastRow) {
				var r = this.galleryWidth - 2 * this.border - (this.buildingRow.entriesBuff.length - 1) * n.margins;
				for (s = 0; s < this.buildingRow.entriesBuff.length; s++) e = this.buildingRow.entriesBuff[s], r -= e.data("jg.jwidth");
				"center" === n.lastRow ? o += r / 2 : "right" === n.lastRow && (o += r)
			}
			for (s = 0; s < this.buildingRow.entriesBuff.length; s++) e = this.buildingRow.entriesBuff[s], this.displayEntry(e, o, this.offY, e.data("jg.jwidth"), e.data("jg.jheight"), this.buildingRow.height), o += e.data("jg.jwidth") + n.margins;
			this.$gallery.height(this.offY + this.buildingRow.height + this.border + (this.isSpinnerActive() ? this.getSpinnerHeight() : 0)), (!t || this.buildingRow.height <= n.rowHeight && i) && (this.offY += this.buildingRow.height + n.margins, this.clearBuildingRow(), this.$gallery.trigger("jg.rowflush"))
		}, e.prototype.checkWidth = function() {
			this.checkWidthIntervalId = setInterval(t.proxy(function() {
				var t = parseFloat(this.$gallery.width());
				Math.abs(t - this.galleryWidth) > this.settings.refreshSensitivity && (this.galleryWidth = t, this.rewind(), this.startImgAnalyzer(!0))
			}, this), this.settings.refreshTime)
		}, e.prototype.isSpinnerActive = function() {
			return null !== this.spinner.intervalId
		}, e.prototype.getSpinnerHeight = function() {
			return this.spinner.$el.innerHeight()
		}, e.prototype.stopLoadingSpinnerAnimation = function() {
			clearInterval(this.spinner.intervalId), this.spinner.intervalId = null, this.$gallery.height(this.$gallery.height() - this.getSpinnerHeight()), this.spinner.$el.detach()
		}, e.prototype.startLoadingSpinnerAnimation = function() {
			var t = this.spinner,
				e = t.$el.find("span");
			clearInterval(t.intervalId), this.$gallery.append(t.$el), this.$gallery.height(this.offY + this.buildingRow.height + this.getSpinnerHeight()), t.intervalId = setInterval(function() {
				t.phase < e.length ? e.eq(t.phase).fadeTo(t.timeSlot, 1) : e.eq(t.phase - e.length).fadeTo(t.timeSlot, 0), t.phase = (t.phase + 1) % (2 * e.length)
			}, t.timeSlot)
		}, e.prototype.rewind = function() {
			this.lastAnalyzedIndex = -1, this.offY = this.border, this.clearBuildingRow()
		}, e.prototype.updateEntries = function(e) {
			return this.entries = this.$gallery.find(this.settings.selector).toArray(), 0 === this.entries.length ? !1 : (this.settings.filter ? this.modifyEntries(this.filterArray, e) : this.modifyEntries(this.resetFilters, e), t.isFunction(this.settings.sort) ? this.modifyEntries(this.sortArray, e) : this.settings.randomize && this.modifyEntries(this.shuffleArray, e), !0)
		}, e.prototype.insertToGallery = function(e) {
			var i = this;
			t.each(e, function() {
				t(this).appendTo(i.$gallery)
			})
		}, e.prototype.shuffleArray = function(t) {
			var e, i, s;
			for (e = t.length - 1; e > 0; e--) i = Math.floor(Math.random() * (e + 1)), s = t[e], t[e] = t[i], t[i] = s;
			return this.insertToGallery(t), t
		}, e.prototype.sortArray = function(t) {
			return t.sort(this.settings.sort), this.insertToGallery(t), t
		}, e.prototype.resetFilters = function(e) {
			for (var i = 0; i < e.length; i++) t(e[i]).removeClass("jg-filtered");
			return e
		}, e.prototype.filterArray = function(e) {
			var i = this.settings;
			return "string" === t.type(i.filter) ? e.filter(function(e) {
				var s = t(e);
				return s.is(i.filter) ? (s.removeClass("jg-filtered"), !0) : (s.addClass("jg-filtered"), !1)
			}) : t.isFunction(i.filter) ? e.filter(i.filter) : void 0
		}, e.prototype.modifyEntries = function(t, e) {
			var i = e ? this.entries.splice(this.lastAnalyzedIndex + 1, this.entries.length - this.lastAnalyzedIndex - 1) : this.entries;
			i = t.call(this, i), this.entries = e ? this.entries.concat(i) : i
		}, e.prototype.destroy = function() {
			clearInterval(this.checkWidthIntervalId), t.each(this.entries, t.proxy(function(e, i) {
				var s = t(i);
				s.css("width", ""), s.css("height", ""), s.css("top", ""), s.css("left", ""), s.data("jg.loaded", void 0), s.removeClass("jg-entry");
				var n = this.imgFromEntry(s);
				n.css("width", ""), n.css("height", ""), n.css("margin-left", ""), n.css("margin-top", ""), n.attr("src", n.data("jg.originalSrc")), n.data("jg.originalSrc", void 0), this.removeCaptionEventsHandlers(s);
				var o = this.captionFromEntry(s);
				s.data("jg.createdCaption") ? (s.data("jg.createdCaption", void 0), null !== o && o.remove()) : null !== o && o.fadeTo(0, 1)
			}, this)), this.$gallery.css("height", ""), this.$gallery.removeClass("justified-gallery"), this.$gallery.data("jg.controller", void 0)
		}, e.prototype.analyzeImages = function(e) {
			for (var i = this.lastAnalyzedIndex + 1; i < this.entries.length; i++) {
				var s = t(this.entries[i]);
				if (s.data("jg.loaded") === !0 || "skipped" === s.data("jg.loaded")) {
					var n = this.galleryWidth - 2 * this.border - (this.buildingRow.entriesBuff.length - 1) * this.settings.margins,
						o = s.data("jg.width") / s.data("jg.height");
					if (n / (this.buildingRow.aspectRatio + o) < this.settings.rowHeight && (this.flushRow(!1), ++this["yield"].flushed >= this["yield"].every)) return void this.startImgAnalyzer(e);
					this.buildingRow.entriesBuff.push(s), this.buildingRow.aspectRatio += o, this.buildingRow.width += o * this.settings.rowHeight, this.lastAnalyzedIndex = i
				} else if ("error" !== s.data("jg.loaded")) return
			}
			this.buildingRow.entriesBuff.length > 0 && this.flushRow(!0), this.isSpinnerActive() && this.stopLoadingSpinnerAnimation(), this.stopImgAnalyzerStarter(), this.$gallery.trigger(e ? "jg.resize" : "jg.complete")
		}, e.prototype.stopImgAnalyzerStarter = function() {
			this["yield"].flushed = 0, null !== this.imgAnalyzerTimeout && clearTimeout(this.imgAnalyzerTimeout)
		}, e.prototype.startImgAnalyzer = function(t) {
			var e = this;
			this.stopImgAnalyzerStarter(), this.imgAnalyzerTimeout = setTimeout(function() {
				e.analyzeImages(t)
			}, .001)
		}, e.prototype.onImageEvent = function(e, i, s) {
			if (i || s) {
				var n = new Image,
					o = t(n);
				i && o.one("load", function() {
					o.off("load error"), i(n)
				}), s && o.one("error", function() {
					o.off("load error"), s(n)
				}), n.src = e
			}
		}, e.prototype.init = function() {
			var e = !1,
				i = !1,
				s = this;
			t.each(this.entries, function(n, o) {
				var r = t(o),
					a = s.imgFromEntry(r);
				if (r.addClass("jg-entry"), r.data("jg.loaded") !== !0 && "skipped" !== r.data("jg.loaded"))
					if (null !== s.settings.rel && r.attr("rel", s.settings.rel), null !== s.settings.target && r.attr("target", s.settings.target), null !== a) {
						var h = s.extractImgSrcFromImage(a);
						if (a.attr("src", h), s.settings.waitThumbnailsLoad === !1) {
							var l = parseFloat(a.attr("width")),
								d = parseFloat(a.attr("height"));
							if (!isNaN(l) && !isNaN(d)) return r.data("jg.width", l), r.data("jg.height", d), r.data("jg.loaded", "skipped"), i = !0, s.startImgAnalyzer(!1), !0
						}
						r.data("jg.loaded", !1), e = !0, s.isSpinnerActive() || s.startLoadingSpinnerAnimation(), s.onImageEvent(h, function(t) {
							r.data("jg.width", t.width), r.data("jg.height", t.height), r.data("jg.loaded", !0), s.startImgAnalyzer(!1)
						}, function() {
							r.data("jg.loaded", "error"), s.startImgAnalyzer(!1)
						})
					} else r.data("jg.loaded", !0), r.data("jg.width", r.width() | parseFloat(r.css("width")) | 1), r.data("jg.height", r.height() | parseFloat(r.css("height")) | 1)
			}), e || i || this.startImgAnalyzer(!1), this.checkWidth()
		}, e.prototype.checkOrConvertNumber = function(e, i) {
			if ("string" === t.type(e[i]) && (e[i] = parseFloat(e[i])), "number" !== t.type(e[i])) throw i + " must be a number";
			if (isNaN(e[i])) throw "invalid number for " + i
		}, e.prototype.checkSizeRangesSuffixes = function() {
			if ("object" !== t.type(this.settings.sizeRangeSuffixes)) throw "sizeRangeSuffixes must be defined and must be an object";
			var e = [];
			for (var i in this.settings.sizeRangeSuffixes) this.settings.sizeRangeSuffixes.hasOwnProperty(i) && e.push(i);
			for (var s = {
					0: ""
				}, n = 0; n < e.length; n++)
				if ("string" === t.type(e[n])) try {
					var o = parseInt(e[n].replace(/^[a-z]+/, ""), 10);
					s[o] = this.settings.sizeRangeSuffixes[e[n]]
				} catch (r) {
					throw "sizeRangeSuffixes keys must contains correct numbers (" + r + ")"
				} else s[e[n]] = this.settings.sizeRangeSuffixes[e[n]];
			this.settings.sizeRangeSuffixes = s
		}, e.prototype.retrieveMaxRowHeight = function() {
			var e = {};
			if ("string" === t.type(this.settings.maxRowHeight)) this.settings.maxRowHeight.match(/^[0-9]+%$/) ? (e.value = parseFloat(this.settings.maxRowHeight.match(/^([0-9]+)%$/)[1]) / 100, e.isPercentage = !1) : (e.value = parseFloat(this.settings.maxRowHeight), e.isPercentage = !0);
			else {
				if ("number" !== t.type(this.settings.maxRowHeight)) throw "maxRowHeight must be a number or a percentage";
				e.value = this.settings.maxRowHeight, e.isPercentage = !1
			}
			if (isNaN(e.value)) throw "invalid number for maxRowHeight";
			return e.isPercentage ? e.value < 100 && (e.value = 100) : e.value > 0 && e.value < this.settings.rowHeight && (e.value = this.settings.rowHeight), e
		}, e.prototype.checkSettings = function() {
			if (this.checkSizeRangesSuffixes(), this.checkOrConvertNumber(this.settings, "rowHeight"), this.checkOrConvertNumber(this.settings, "margins"), this.checkOrConvertNumber(this.settings, "border"), "justify" !== this.settings.lastRow && "nojustify" !== this.settings.lastRow && "left" !== this.settings.lastRow && "center" !== this.settings.lastRow && "right" !== this.settings.lastRow && "hide" !== this.settings.lastRow) throw 'lastRow must be "justify", "nojustify", "left", "center", "right" or "hide"';
			if (this.checkOrConvertNumber(this.settings, "justifyThreshold"), this.settings.justifyThreshold < 0 || this.settings.justifyThreshold > 1) throw "justifyThreshold must be in the interval [0,1]";
			if ("boolean" !== t.type(this.settings.cssAnimation)) throw "cssAnimation must be a boolean";
			if ("boolean" !== t.type(this.settings.captions)) throw "captions must be a boolean";
			if (this.checkOrConvertNumber(this.settings.captionSettings, "animationDuration"), this.checkOrConvertNumber(this.settings.captionSettings, "visibleOpacity"), this.settings.captionSettings.visibleOpacity < 0 || this.settings.captionSettings.visibleOpacity > 1) throw "captionSettings.visibleOpacity must be in the interval [0, 1]";
			if (this.checkOrConvertNumber(this.settings.captionSettings, "nonVisibleOpacity"), this.settings.captionSettings.nonVisibleOpacity < 0 || this.settings.captionSettings.nonVisibleOpacity > 1) throw "captionSettings.nonVisibleOpacity must be in the interval [0, 1]";
			if ("boolean" !== t.type(this.settings.fixedHeight)) throw "fixedHeight must be a boolean";
			if (this.checkOrConvertNumber(this.settings, "imagesAnimationDuration"), this.checkOrConvertNumber(this.settings, "refreshTime"), this.checkOrConvertNumber(this.settings, "refreshSensitivity"), "boolean" !== t.type(this.settings.randomize)) throw "randomize must be a boolean";
			if ("string" !== t.type(this.settings.selector)) throw "selector must be a string";
			if (this.settings.sort !== !1 && !t.isFunction(this.settings.sort)) throw "sort must be false or a comparison function";
			if (this.settings.filter !== !1 && !t.isFunction(this.settings.filter) && "string" !== t.type(this.settings.filter)) throw "filter must be false, a string or a filter function"
		}, e.prototype.retrieveSuffixRanges = function() {
			var t = [];
			for (var e in this.settings.sizeRangeSuffixes) this.settings.sizeRangeSuffixes.hasOwnProperty(e) && t.push(parseInt(e, 10));
			return t.sort(function(t, e) {
				return t > e ? 1 : e > t ? -1 : 0
			}), t
		}, e.prototype.updateSettings = function(e) {
			this.settings = t.extend({}, this.settings, e), this.checkSettings(), this.border = this.settings.border >= 0 ? this.settings.border : this.settings.margins, this.maxRowHeight = this.retrieveMaxRowHeight(), this.suffixRanges = this.retrieveSuffixRanges()
		}, t.fn.justifiedGallery = function(i) {
			return this.each(function(s, n) {
				var o = t(n);
				o.addClass("justified-gallery");
				var r = o.data("jg.controller");
				if ("undefined" == typeof r) {
					if ("undefined" != typeof i && null !== i && "object" !== t.type(i)) {
						if ("destroy" === i) return;
						throw "The argument must be an object"
					}
					r = new e(o, t.extend({}, t.fn.justifiedGallery.defaults, i)), o.data("jg.controller", r)
				} else if ("norewind" === i);
				else {
					if ("destroy" === i) return void r.destroy();
					r.updateSettings(i), r.rewind()
				}
				r.updateEntries("norewind" === i) && r.init()
			})
		}, t.fn.justifiedGallery.defaults = {
			sizeRangeSuffixes: {},
			thumbnailPath: void 0,
			rowHeight: 120,
			maxRowHeight: -1,
			margins: 1,
			border: -1,
			lastRow: "nojustify",
			justifyThreshold: .75,
			fixedHeight: !1,
			waitThumbnailsLoad: !0,
			captions: !0,
			cssAnimation: !1,
			imagesAnimationDuration: 500,
			captionSettings: {
				animationDuration: 500,
				visibleOpacity: .7,
				nonVisibleOpacity: 0
			},
			rel: null,
			target: null,
			extension: /\.[^.\\/]+$/,
			refreshTime: 200,
			refreshSensitivity: 0,
			randomize: !1,
			sort: !1,
			filter: !1,
			selector: "> a, > div:not(.spinner)"
		}
	}(jQuery)
}(jQuery),
function(t) {
	t.fn.toggle2classes = function(e, i) {
		return e && i ? this.each(function() {
			var s = t(this);
			s.hasClass(e) || s.hasClass(i) ? s.toggleClass(e + " " + i) : s.addClass(e)
		}) : this
	}
}(jQuery),
function(t) {
	var e = "false";
	jQuery(document).ready(function(t) {
		function i(i, s) {
			e = "true";
			var n = t("#" + i).serialize();
			t.post(t("#" + i).attr("action"), n, function(e) {
				t("#" + i).hide(), t("#formSuccessMessageWrap").fadeIn(500)
			})
		}

		function s(s, n) {
			t(".formValidationError").hide(), t(".fieldHasError").removeClass("fieldHasError"), t("#" + s + " .requiredField").each(function(o) {
				if ("" == t(this).val() || t(this).val() == t(this).attr("data-dummy")) return t(this).val(t(this).attr("data-dummy")), t(this).focus(), t(this).addClass("fieldHasError"), t("#" + t(this).attr("id") + "Error").fadeIn(300), !1;
				if (t(this).hasClass("requiredEmailField")) {
					var r = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
						a = "#" + t(this).attr("id");
					if (!r.test(t(a).val())) return t(a).focus(), t(a).addClass("fieldHasError"), t(a + "Error2").fadeIn(300), !1
				}
				"false" == e && o == t("#" + s + " .requiredField").length - 1 && i(s, n)
			})
		}
		t("#formSuccessMessageWrap").hide(0), t(".formValidationError").fadeOut(0), t('input[type="text"], input[type="password"], textarea').focus(function() {
			t(this).val() == t(this).attr("data-dummy") && t(this).val("")
		}), t("input, textarea").blur(function() {
			"" == t(this).val() && t(this).val(t(this).attr("data-dummy"))
		}), t("#contactSubmitButton").click(function() {
			return s(t(this).attr("data-formId")), !1
		})
	})
}(jQuery);