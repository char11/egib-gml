import rbush from "rbush"; //https://www.5axxw.com/wiki/content/7wjc4t

export var CanvasLabel = (L.CanvasLabel = L.Canvas.extend({
	options: {
		defaultLabelStyle: {
			offsetX: 0,
			offsetY: 0,
			scale: 1,
			rotation: 0,
			text: null,
			minZoom: null,
			maxZoom: null,
			collisionFlg: true,
			center: null,
			zIndex: 0,
			defaultHeight: 20,

			font: "bold 14px 'OpenSans'",
			fillStyle: "rgba(0,0,0,1)",
			lineCap: "round",
			lineDash: [],
			lineDashOffset: 0,
			lineJoin: "round",
			strokeStyle: "rgba(255,255,255,1)",
			textAlign: "center",
			textBaseline: "middle",
			lineWidth: 1,
			pos: null,
		},
	},

	initialize: function (options) {
		options.defaultLabelStyle = options.defaultLabelStyle || {};
		options.defaultLabelStyle = L.extend({}, this.options.defaultLabelStyle, options.defaultLabelStyle);

		//options = L.Util.setOptions(this, options);
		////add
		//L.Util.stamp(this);
		//this._layers = this._layers || {};
		L.Canvas.prototype.initialize.call(this, options);
	},

	_handleMouseOut: function (e) {
		var layer = this._hoveredLayer;
		if (layer) {
			// if we're leaving the layer, fire mouseout
			//L.DomUtil.removeClass(this._container, 'leaflet-interactive');
			this._map._mapPane.style.cursor = "grab";
			this._fireEvent([layer], e, "mouseout");
			this._hoveredLayer = null;
			this._mouseHoverThrottled = false;
		}
	},

	_handleMouseHover: function (e, point) {
		if (this._mouseHoverThrottled) {
			return;
		}

		var layer, candidateHoveredLayer;

		for (var order = this._drawFirst; order; order = order.next) {
			layer = order.layer;
			if (layer.options.interactive && layer._containsPoint(point)) {
				candidateHoveredLayer = layer;
			}
		}

		if (candidateHoveredLayer !== this._hoveredLayer) {
			this._handleMouseOut(e);

			if (candidateHoveredLayer) {
				//L.DomUtil.addClass(this._map._mapPane, 'leaflet-interactive'); // change cursor
				this._map._mapPane.style.cursor = "pointer";
				this._fireEvent([candidateHoveredLayer], e, "mouseover");
				this._hoveredLayer = candidateHoveredLayer;
			}
		}

		if (this._hoveredLayer) {
			this._fireEvent([this._hoveredLayer], e);
		}

		this._mouseHoverThrottled = true;
		setTimeout(
			L.Util.bind(function () {
				this._mouseHoverThrottled = false;
			}, this),
			32,
		);
	},

	_fireEvent: function (layers, e, type) {
		this._map._fireDOMEvent(e, type || e.type, layers);
	},

	_updateTransform: function (center, zoom) {
		L.Canvas.prototype._updateTransform.call(this, center, zoom);

		var scale = this._map.getZoomScale(zoom, this._zoom),
			position = L.DomUtil.getPosition(this._container),
			viewHalf = this._map.getSize().multiplyBy(0.5 + this.options.padding),
			currentCenterPoint = this._map.project(this._center, zoom),
			destCenterPoint = this._map.project(center, zoom),
			centerOffset = destCenterPoint.subtract(currentCenterPoint),
			topLeftOffset = viewHalf.multiplyBy(-scale).add(position).add(viewHalf).subtract(centerOffset);

		if (L.Browser.any3d) {
			L.DomUtil.setTransform(this._containerText, topLeftOffset, scale);
		} else {
			L.DomUtil.setPosition(this._containerText, topLeftOffset);
		}
	},

	_initContainer: function (options) {
		L.Canvas.prototype._initContainer.call(this);

		this._containerText = document.createElement("canvas");

		L.DomEvent.on(this._containerText, "mousemove", L.Util.throttle(this._onMouseMove, 32, this), this)
			.on(this._containerText, "click dblclick mousedown mouseup contextmenu", this._onClick, this)
			.on(this._containerText, "mouseout", this._handleMouseOut, this);

		this._ctxLabel = this._containerText.getContext("2d");

		L.DomUtil.addClass(this._containerText, "leaflet-zoom-animated");
		this.getPane().appendChild(this._containerText);

		if (this._map) {
			var handleLayerChanges = function () {
				this._reset();
				this._redraw();
			}.bind(this);
			this._map.on("layerremove layeradd", L.Util.throttle(handleLayerChanges, 32, this));
		}
	},

	_update: function () {
		this._latlngBounds = this._map.getBounds().pad(this.options.padding);

		L.Renderer.prototype._update.call(this);
		var b = this._bounds,
			container = this._containerText,
			size = b.getSize(),
			m = L.Browser.retina ? 2 : 1;

		L.DomUtil.setPosition(container, b.min);

		// set canvas size (also clearing it); use double size on retina
		container.width = m * size.x;
		container.height = m * size.y;
		container.style.width = size.x + "px";
		container.style.height = size.y + "px";

		// display text on the whole surface
		container.style.zIndex = "4";
		this._container.style.zIndex = "3";

		if (L.Browser.retina) {
			this._ctxLabel.scale(2, 2);
		}

		// translate so we use the same path coordinates after canvas
		// element moves
		this._ctxLabel.translate(-b.min.x, -b.min.y);

		if (!this._textBounds) {
			this._textBounds = new rbush();
		} else {
			this._textBounds.clear();
		}

		L.Canvas.prototype._update.call(this);
	},

	_updateCircle: function (layer) {
		L.Canvas.prototype._updateCircle.call(this, layer);
		this._updateText(this._ctxLabel, layer);
	},

	_updateText: function (ctx, layer) {
		if (!layer.options.labelStyle || !layer.options.labelStyle.text) {
			return;
		}

		var latlng = L.latLng(layer.options.labelStyle.center);
		if (latlng) {
		} else if (layer.getLatLng) {
			latlng = layer.getLatLng();
		} else {
			if (layer._parts.length == 0 || layer._parts[0].length == 0) {
				return;
			}
			latlng = layer.getCenter();
		}

		if (!this._latlngBounds.contains(latlng)) {
			return;
		}

		let layerLabelStyle = layer.options.labelStyle;
		let defaultLabelStyle = L.extend({}, this.options.defaultLabelStyle);

		if (typeof layerLabelStyle == "function") {
			layerLabelStyle = layerLabelStyle(layer);
		}

		let labelStyle = L.extend(defaultLabelStyle, layer.options.labelStyle);

		if (labelStyle.minZoom) {
			if (this._map.getZoom() < labelStyle.minZoom) {
				return;
			}
		}

		if (labelStyle.maxZoom) {
			if (this._map.getZoom() > labelStyle.maxZoom) {
				return;
			}
		}

		ctx.save();
		if (labelStyle.pos) {
			switch (labelStyle.pos) {
				case "1":
					labelStyle.textAlign = "left";
					labelStyle.textBaseline = "bottom";
					break;
				case "2":
					labelStyle.textAlign = "center";
					labelStyle.textBaseline = "bottom";
					break;
				case "3":
					labelStyle.textAlign = "right";
					labelStyle.textBaseline = "bottom";
					break;
				case "4":
					labelStyle.textAlign = "left";
					labelStyle.textBaseline = "middle";
					break;
				case "5":
					labelStyle.textAlign = "center";
					labelStyle.textBaseline = "middle";
					break;
				case "6":
					labelStyle.textAlign = "right";
					labelStyle.textBaseline = "middle";
					break;
				case "7":
					labelStyle.textAlign = "left";
					labelStyle.textBaseline = "top";
					break;
				case "8":
					labelStyle.textAlign = "center";
					labelStyle.textBaseline = "top";
					break;
				case "9":
					labelStyle.textAlign = "right";
					labelStyle.textBaseline = "top";
					break;
				default:
					labelStyle.textAlign = "center";
					labelStyle.textBaseline = "middle";
			}
		}

		ctx.font = labelStyle.font;
		ctx.fillStyle = labelStyle.fillStyle;
		ctx.lineCap = labelStyle.lineCap;
		ctx.lineDash = labelStyle.lineDash;
		ctx.lineDashOffset = labelStyle.lineDashOffset;
		ctx.lineJoin = labelStyle.lineJoin;
		ctx.strokeStyle = labelStyle.strokeStyle;
		ctx.textAlign = labelStyle.textAlign;
		ctx.textBaseline = labelStyle.textBaseline;
		ctx.lineWidth = labelStyle.lineWidth;

		var offsetX = labelStyle.offsetX;
		var offsetY = labelStyle.offsetY;

		var p = this._map.latLngToLayerPoint(latlng);

		var x = p.x + offsetX;
		var y = p.y + offsetY;

		ctx.translate(x, y);

		if (labelStyle.scale != 1) {
			ctx.scale(labelStyle.scale, labelStyle.scale);
		}

		if (labelStyle.rotation != 0) {
			ctx.rotate(labelStyle.rotation);
		}

		var textWidth = ctx.measureText(labelStyle.text).width * labelStyle.scale;
		var textHeight = labelStyle.defaultHeight * labelStyle.scale;
		let minX, minY, maxX, maxY;

		//https://www.runoob.com/tags/canvas-textalign.html
		if (labelStyle.textAlign == "center") {
			minX = x - textWidth / 2;
			maxX = x + textWidth / 2;
		} else if (labelStyle.textAlign == "start" || labelStyle.textAlign == "left") {
			minX = x;
			maxX = x + textWidth;
		} else if (labelStyle.textAlign == "end" || labelStyle.textAlign == "right") {
			minX = x - textWidth;
			maxX = x;
		} else {
			console.error("textAlign: start，end，left，center，right");
		}

		//https://www.runoob.com/tags/canvas-textBaseline.html
		if (labelStyle.textBaseline == "middle") {
			minY = y - textHeight / 2;
			maxY = y + textHeight / 2;
		} else if (labelStyle.textBaseline == "top" || labelStyle.textBaseline == "hanging") {
			minY = y;
			maxY = y + textHeight;
		} else if (labelStyle.textBaseline == "bottom" || labelStyle.textBaseline == "alphabetic") {
			minY = y - textHeight;
			maxY = y;
		} else {
			console.error("textBaseline: middle，top，hanging，bottom，alphabetic");
		}

		//let textBounds = { minX, minY, maxX, maxY, layer };
		let textBounds = { minX, minY, maxX, maxY };
		if (!(labelStyle.collisionFlg == true && this._textBounds.collides(textBounds))) {
			//ctx.strokeText(labelStyle.text, x, y);
			//ctx.fillText(labelStyle.text, x, y);
			ctx.strokeText(labelStyle.text, 0, 0);
			ctx.fillText(labelStyle.text, 0, 0);
			this._textBounds.insert(textBounds);
			ctx.restore();
			//-------------------------------
			if (labelStyle.ref) {
				const p1 = this._map.latLngToLayerPoint(L.latLng(labelStyle.ref[1], labelStyle.ref[0]));
				ctx.beginPath();
				ctx.moveTo(p.x, p.y);
				ctx.lineTo(p1.x, p1.y);
				ctx.strokeStyle = "#333333";
				ctx.lineWidth = 1;
				ctx.stroke();
			}
			//---------------------------------
		} else {
			ctx.restore();
		}
	},
}));

export var canvasLabel = (L.canvasLabel = function (options) {
	return new L.CanvasLabel(options);
});
