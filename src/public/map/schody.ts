import type { Geometry, Position } from "geojson";

// Odstęp między liniami stopni. W skali 1:500 znak umowny przewiduje
// odstęp 1,0 mm, co odpowiada 0,5 m w terenie.
const STEP_SPACING = 0.5;
// Zabezpieczenie przed wygenerowaniem zbyt dużej liczby linii.
const MAX_STEPS = 30;
const EPS = 1e-9;

type Point2D = {
	x: number;
	y: number;
};

function getPolygons(geometry: Geometry | null): Position[][][] {
	if (!geometry) {
		return [];
	}
	if (geometry.type === "Polygon") {
		return [geometry.coordinates];
	}
	if (geometry.type === "MultiPolygon") {
		return geometry.coordinates;
	}
	return [];
}

function getDirectionLine(geometry: Geometry | null): Position[] | null {
	if (!geometry) {
		return null;
	}
	if (geometry.type === "LineString") {
		return geometry.coordinates;
	}
	if (geometry.type === "MultiLineString") {
		return geometry.coordinates[0] ?? null;
	}
	return null;
}

function toPoint([lon, lat]: Position, kx: number, ky: number): Point2D {
	return { x: lon * kx, y: lat * ky };
}

function toPosition({ x, y }: Point2D, kx: number, ky: number): Position {
	return [x / kx, y / ky];
}

function dot(a: Point2D, b: Point2D) {
	return a.x * b.x + a.y * b.y;
}

/**
 * Wyznacza linie stopni wewnątrz poligonu schodów.
 * Polilinia kierunkowa wyznacza kierunek biegu schodów, dlatego linie stopni
 * są do niej prostopadłe i rozmieszczone wzdłuż niej.
 */
function getStepsForPolygon(rings: Position[][], direction: Position[]): Position[][] {
	if (rings.length === 0 || rings[0].length < 3 || direction.length < 2) {
		return [];
	}

	const latSum = rings[0].reduce((sum, point) => sum + point[1], 0);
	const lat0 = latSum / rings[0].length;
	// Lokalne przeliczenie stopni na metry - wystarczające dla małych obiektów.
	const kx = 111320 * Math.cos((lat0 * Math.PI) / 180);
	const ky = 110540;

	const projectedRings = rings.map((ring) => ring.map((point) => toPoint(point, kx, ky)));
	const start = toPoint(direction[0], kx, ky);
	const end = toPoint(direction[direction.length - 1], kx, ky);

	const dirLength = Math.hypot(end.x - start.x, end.y - start.y);
	if (dirLength < EPS) {
		return [];
	}

	const dir = {
		x: (end.x - start.x) / dirLength,
		y: (end.y - start.y) / dirLength,
	};
	const normal = { x: -dir.y, y: dir.x };

	let minU = Infinity;
	let maxU = -Infinity;
	for (const ring of projectedRings) {
		for (const point of ring) {
			const u = dot(point, dir);
			if (u < minU) {
				minU = u;
			}
			if (u > maxU) {
				maxU = u;
			}
		}
	}

	const runLength = maxU - minU;
	if (runLength < EPS) {
		return [];
	}

	const stepCount = Math.max(1, Math.min(MAX_STEPS, Math.floor(runLength / STEP_SPACING)));
	const result: Position[][] = [];

	for (let i = 1; i <= stepCount; i++) {
		const u = minU + (runLength * i) / (stepCount + 1);
		const base = { x: dir.x * u, y: dir.y * u };
		const params: number[] = [];

		// Przecięcia prostej stopnia z krawędziami wszystkich pierścieni.
		for (const ring of projectedRings) {
			for (let j = 0, k = ring.length - 1; j < ring.length; k = j++) {
				const a = ring[k];
				const b = ring[j];
				const da = dot(a, dir) - u;
				const db = dot(b, dir) - u;

				if ((da > EPS && db > EPS) || (da < -EPS && db < -EPS)) {
					continue;
				}
				if (Math.abs(da - db) <= EPS) {
					continue;
				}

				const t = da / (da - db);
				if (t < -EPS || t > 1 + EPS) {
					continue;
				}

				const x = a.x + (b.x - a.x) * t;
				const y = a.y + (b.y - a.y) * t;
				params.push((x - base.x) * normal.x + (y - base.y) * normal.y);
			}
		}

		if (params.length < 2) {
			continue;
		}

		params.sort((a, b) => a - b);
		const unique: number[] = [];
		for (const param of params) {
			if (unique.length === 0 || Math.abs(param - unique[unique.length - 1]) > 1e-6) {
				unique.push(param);
			}
		}

		for (let j = 0; j + 1 < unique.length; j += 2) {
			const from: Point2D = {
				x: base.x + normal.x * unique[j],
				y: base.y + normal.y * unique[j],
			};
			const to: Point2D = {
				x: base.x + normal.x * unique[j + 1],
				y: base.y + normal.y * unique[j + 1],
			};
			if (Math.hypot(to.x - from.x, to.y - from.y) > 0.01) {
				result.push([toPosition(from, kx, ky), toPosition(to, kx, ky)]);
			}
		}
	}

	return result;
}

export function getSchodySteps(polygon: Geometry | null, direction: Geometry | null): Position[][] {
	const directionLine = getDirectionLine(direction);
	if (!directionLine) {
		return [];
	}

	const result: Position[][] = [];
	for (const rings of getPolygons(polygon)) {
		result.push(...getStepsForPolygon(rings, directionLine));
	}
	return result;
}
