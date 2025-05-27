import proj4 from "proj4";
import * as geojson from "geojson";
//import * as util from "node:util";

type Pos = string;
type PosList = string;

interface Attributes {
	id: string;
	srsName?: string;
}

interface Point {
	_attributes: Attributes;
	pos: Pos;
}

interface LineString {
	_attributes: Attributes;
	pos?: Pos[];
	posList?: PosList;
	Point?: Point[];
}

interface LinearRing {
	pos?: Pos[];
	posList?: PosList;
	Point?: Point[];
}

interface Exterior {
	LinearRing?: LinearRing;
	Ring?: Ring;
}
interface Interior {
	LinearRing?: LinearRing;
	Ring?: Ring;
}

interface Polygon {
	_attributes: Attributes;
	exterior?: Exterior;
	interior?: Interior | Interior[];
}

interface PolygonPatch {
	exterior?: Exterior;
	interior?: Interior;
}

interface Rectangle {
	exterior?: Exterior;
}

interface Surface {
	_attributes: Attributes;
	patches: Patches;
}

interface Patches {
	PolygonPatch?: PolygonPatch | PolygonPatch[];
	Rectangle?: Rectangle | Rectangle[];
}

interface CompositeSurface {
	_attributes: Attributes;
	surfaceMember?: SurfaceMember | SurfaceMember[];
}

interface SurfaceMember {
	Polygon?: Polygon;
	Surface?: Surface;
	CompositeSurface?: CompositeSurface;
}

interface MultiSurface {
	_attributes: Attributes;
	surfaceMember?: SurfaceMember | SurfaceMember[];
	surfaceMembers?: Polygon | Polygon[] | Surface | Surface[];
}

interface LineStringSegment {
	pos?: Pos[];
	posList?: PosList;
	Point?: Point[];
}

interface Segments {
	LineStringSegment?: LineStringSegment | LineStringSegment[];
}

interface Curve {
	_attributes: Attributes;
	segments: Segments;
}

interface CurveMember {
	LineString?: LineString;
	Curve?: Curve;
}

interface Ring {
	curveMember: CurveMember | CurveMember[];
}

//--------------------------------------------------------------

//proj4.defs([
//	["EPSG:2176", "+proj=tmerc +lat_0=0 +lon_0=15 +k=0.999923 +x_0=5500000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs +axis=neu"],
//	["EPSG:2177", "+proj=tmerc +lat_0=0 +lon_0=18 +k=0.999923 +x_0=6500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs +axis=neu"],
//	["EPSG:2178", "+proj=tmerc +lat_0=0 +lon_0=21 +k=0.999923 +x_0=7500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs +axis=neu"],
//	["EPSG:2179", "+proj=tmerc +lat_0=0 +lon_0=24 +k=0.999923 +x_0=8500000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs +axis=neu"],
//	["EPSG:2180", "+proj=tmerc +lat_0=0 +lon_0=19 +k=0.9993 +x_0=500000 +y_0=-5300000 +ellps=GRS80 +units=m +no_defs +type=crs +axis=neu"],
//]);
//
//proj4.defs("urn:ogc:def:crs:EPSG::2176", proj4.defs("EPSG:2176"));
//proj4.defs("urn:ogc:def:crs:EPSG::2177", proj4.defs("EPSG:2177"));
//proj4.defs("urn:ogc:def:crs:EPSG::2178", proj4.defs("EPSG:2178"));
//proj4.defs("urn:ogc:def:crs:EPSG::2179", proj4.defs("EPSG:2179"));
//proj4.defs("urn:ogc:def:crs:EPSG::2180", proj4.defs("EPSG:2180"));
//proj4.defs("urn:x-ogc:def:crs:EPSG:4326", proj4.defs("EPSG:4326"));

function parseCoords(s: string, crs: string) {
	const stride = 2;

	const coords = s.replace(/\s+/g, " ").trim().split(" ");

	if (coords.length === 0 || coords.length % stride !== 0) {
		throw new Error(`invalid coordinates list (stride ${stride})`);
	}

	const points: number[][] = [];
	for (let i = 0; i < coords.length - 1; i += stride) {
		const point = coords.slice(i, i + stride).map(parseFloat);
		if (crs) {
			points.push(proj4(crs, "WGS84").forward(point, true));
		} else {
			points.push(point);
		}
	}

	return points;
}

function parsePosList(coords: PosList, crs: string) {
	if (!coords) throw new Error("invalid gml:posList element");

	return parseCoords(coords, crs);
}

function parsePos(coords: Pos, crs: string) {
	if (!coords) throw new Error("invalid gml:pos element");

	const points = parseCoords(coords, crs);
	if (points.length !== 1) throw new Error("gml:pos must have 1 point");
	return points[0];
}

function parsePoint(obj: Point, crs: string) {
	// TODO AV: Parse other gml:Point options
	const pos = obj.pos;
	if (!pos) throw new Error("invalid gml:Point element, expected a gml:pos subelement");
	return parsePos(pos, crs);
}

function parseLinearRingOrLineString(obj: LineString | LinearRing, crs: string) {
	// or a LineStringSegment

	let points: number[][] = [];

	const posList = obj.posList;
	const pos = obj.pos;
	if (posList) points = parsePosList(posList, crs);
	else if (pos) {
		if (Array.isArray(pos)) {
			pos.forEach((key) => {
				points.push(parsePos(key, crs));
			});
		} else {
			throw new Error(" must have > 1 points");
		}
	}

	// for (let c of _.children) {
	// 	if (c.name === "gml:Point") {
	// 		points.push(parsePoint(c, opts, childCtx));
	// }

	if (points.length === 0) throw new Error(" must have > 0 points");
	return points;
}

function parseCurve(obj: Curve, crs: string) {
	const segments = obj.segments;
	if (!segments) throw new Error("invalid " + " element");

	let points: number[][] = [];

	let lineStringSegment = segments.LineStringSegment;
	if (lineStringSegment) {
		if (Array.isArray(lineStringSegment)) {
			lineStringSegment.forEach((key) => {
				points.push(...parseLinearRingOrLineString(key, crs));
			});
		} else {
			points.push(...parseLinearRingOrLineString(lineStringSegment, crs));
		}
	}

	// remove overlapping
	//const end = points[points.length - 1];
	//const start = points2[0];
	//if (end && start && util.isDeepStrictEqual(end, start)) points2.shift();

	if (points.length === 0) {
		throw new Error("gml:Curve > gml:segments must have > 0 points");
	}
	return points;
}

function parseRing(obj: Ring, crs: string) {
	let mCrs = crs;
	const curveMember = obj.curveMember;
	if (!curveMember) throw new Error("invalid " + " element");

	let points: number[][] = [];

	if (Array.isArray(curveMember)) {
		curveMember.forEach((key) => {
			if (key.LineString) {
				if (key.LineString._attributes.srsName) mCrs = key.LineString._attributes.srsName;
				points.push(...parseLinearRingOrLineString(key.LineString, mCrs));
			} else if (key.Curve) {
				if (key.Curve._attributes.srsName) mCrs = key.Curve._attributes.srsName;
				points.push(...parseCurve(key.Curve, mCrs));
			}
		});
	} else {
		if (curveMember.LineString) {
			if (curveMember.LineString._attributes.srsName) mCrs = curveMember.LineString._attributes.srsName;
			points.push(...parseLinearRingOrLineString(curveMember.LineString, mCrs));
		} else if (curveMember.Curve) {
			if (curveMember.Curve._attributes.srsName) mCrs = curveMember.Curve._attributes.srsName;
			points.push(...parseCurve(curveMember.Curve, mCrs));
		}
	}

	// remove overlapping
	//const end = points[points.length - 1];
	//const start = points2[0];
	//if (end && start && util.isDeepStrictEqual(end, start)) points2.shift();

	if (points.length < 4) throw new Error("Ring must have >= 4 points");
	return points;
}

function parseExteriorOrInterior(obj: Exterior | Interior, crs: string) {
	const linearRing = obj.LinearRing;
	if (linearRing) {
		return parseLinearRingOrLineString(linearRing, crs);
	}

	const ring = obj.Ring;
	if (ring) return parseRing(ring, crs);

	throw new Error("invalid " + " element");
}

function parsePolygonOrRectangle(obj: Polygon | Rectangle | PolygonPatch, crs: string) {
	// or PolygonPatch
	const exterior = obj.exterior;
	if (!exterior) throw new Error("invalid Polygon element");
	const pointLists = [parseExteriorOrInterior(exterior, crs)];
	if ("interior" in obj && obj.interior) {
		const interior = obj.interior;
		if (Array.isArray(interior)) {
			interior.forEach((key) => {
				pointLists.push(parseExteriorOrInterior(key, crs));
			});
		} else {
			pointLists.push(parseExteriorOrInterior(interior, crs));
		}
	}
	return pointLists;
}

function parseSurface(obj: Surface, crs: string) {
	const patches = obj.patches;
	if (!patches) throw new Error("invalid " + " element");

	const polygons: number[][][][] = [];

	let polygonPatch = patches.PolygonPatch;
	let rectangle = patches.Rectangle;
	if (polygonPatch) {
		if (Array.isArray(polygonPatch)) {
			polygonPatch.forEach((key) => {
				polygons.push(parsePolygonOrRectangle(key, crs));
			});
		} else {
			polygons.push(parsePolygonOrRectangle(polygonPatch, crs));
		}
	} else if (rectangle) {
		if (Array.isArray(rectangle)) {
			rectangle.forEach((key) => {
				polygons.push(parsePolygonOrRectangle(key, crs));
			});
		} else {
			polygons.push(parsePolygonOrRectangle(rectangle, crs));
		}
	}

	if (polygons.length === 0) throw new Error("surface must have > 0 polygons");
	return polygons;
}

function parseCompositeSurface(obj: CompositeSurface, crs: string) {
	let mCrs = crs;
	const polygons: number[][][][] = [];
	let surfaceMember = obj.surfaceMember;
	if (surfaceMember) {
		if (Array.isArray(surfaceMember)) {
			mCrs = crs;
			surfaceMember.forEach((key) => {
				if (key.Polygon) {
					if (key.Polygon._attributes.srsName) mCrs = key.Polygon._attributes.srsName;
					polygons.push(parsePolygonOrRectangle(key.Polygon, mCrs));
				} else if (key.CompositeSurface) {
					if (key.CompositeSurface._attributes.srsName) mCrs = key.CompositeSurface._attributes.srsName;
					polygons.push(...parseCompositeSurface(key.CompositeSurface, mCrs));
				} else if (key.Surface) {
					if (key.Surface._attributes.srsName) mCrs = key.Surface._attributes.srsName;
					polygons.push(...parseSurface(key.Surface, mCrs));
				}
			});
		} else {
			if (surfaceMember.Polygon) {
				if (surfaceMember.Polygon._attributes.srsName) mCrs = surfaceMember.Polygon._attributes.srsName;
				polygons.push(parsePolygonOrRectangle(surfaceMember.Polygon, mCrs));
			} else if (surfaceMember.CompositeSurface) {
				if (surfaceMember.CompositeSurface._attributes.srsName) mCrs = surfaceMember.CompositeSurface._attributes.srsName;
				polygons.push(...parseCompositeSurface(surfaceMember.CompositeSurface, mCrs));
			} else if (surfaceMember.Surface) {
				if (surfaceMember.Surface._attributes.srsName) mCrs = surfaceMember.Surface._attributes.srsName;
				polygons.push(...parseSurface(surfaceMember.Surface, mCrs));
			}
		}
	}

	if (polygons.length === 0) throw new Error("compositesurface must have > 0 polygons");
	return polygons;
}

function parseMultiSurface(obj: MultiSurface, crs: string) {
	let mCrs = crs;
	const polygons: number[][][][] = [];
	let surfaceMember = obj.surfaceMember;
	if (surfaceMember) {
		if (Array.isArray(surfaceMember)) {
			mCrs = crs;
			surfaceMember.forEach((key) => {
				if (key.Polygon) {
					if (key.Polygon._attributes.srsName) mCrs = key.Polygon._attributes.srsName;
					polygons.push(parsePolygonOrRectangle(key.Polygon, mCrs));
				} else if (key.CompositeSurface) {
					if (key.CompositeSurface._attributes.srsName) mCrs = key.CompositeSurface._attributes.srsName;
					polygons.push(...parseCompositeSurface(key.CompositeSurface, mCrs));
				} else if (key.Surface) {
					if (key.Surface._attributes.srsName) mCrs = key.Surface._attributes.srsName;
					polygons.push(...parseSurface(key.Surface, mCrs));
				}
			});
		} else {
			if (surfaceMember.Polygon) {
				if (surfaceMember.Polygon._attributes.srsName) mCrs = surfaceMember.Polygon._attributes.srsName;
				polygons.push(parsePolygonOrRectangle(surfaceMember.Polygon, mCrs));
			} else if (surfaceMember.CompositeSurface) {
				if (surfaceMember.CompositeSurface._attributes.srsName) mCrs = surfaceMember.CompositeSurface._attributes.srsName;
				polygons.push(...parseCompositeSurface(surfaceMember.CompositeSurface, mCrs));
			} else if (surfaceMember.Surface) {
				if (surfaceMember.Surface._attributes.srsName) mCrs = surfaceMember.Surface._attributes.srsName;
				polygons.push(...parseSurface(surfaceMember.Surface, mCrs));
			}
		}
	}

	if (polygons.length === 0) throw new Error("multisurface" + " must have > 0 polygons");
	return polygons;
}

function parseGml(obj: any): geojson.Geometry | null {
	try {
		if (obj.Point) {
			return {
				type: "Point",
				coordinates: parsePoint(obj.Point, obj.Point._attributes.srsName),
			};
		} else if (obj.Polygon || obj.Rectangle) {
			return {
				type: "Polygon",
				coordinates: parsePolygonOrRectangle(obj.Polygon, obj.Polygon._attributes.srsName),
			};
		} else if (obj.Surface) {
			return {
				type: "MultiPolygon",
				coordinates: parseSurface(obj.Surface, obj.Surface._attributes.srsName),
			};
		} else if (obj.MultiSurface) {
			return {
				type: "MultiPolygon",
				coordinates: parseMultiSurface(obj.MultiSurface, obj.MultiSurface._attributes.srsName),
			};
		} else if (obj.LineString) {
			return {
				type: "LineString",
				coordinates: parseLinearRingOrLineString(obj.LineString, obj.LineString._attributes.srsName),
			};
		} else if (obj.Curve) {
			return {
				type: "LineString",
				coordinates: parseCurve(obj.Curve, obj.Curve._attributes.srsName),
			};
		}
		return null;
	} catch (err) {
		console.error("ParseGml error: " + err);
		return null;
	}
}

Object.assign(parseGml, {
	parsePosList,
	parsePos,
	parseLinearRingOrLineString,
	parseRing,
	parseExteriorOrInterior,
	parsePolygonOrRectangle,
	parseSurface,
	parseCompositeSurface,
	parseMultiSurface,
});
export { parseGml };
