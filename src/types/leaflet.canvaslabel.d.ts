import * as L from "leaflet";

declare module "leaflet" {
        class CanvasLabel extends L.Canvas {
        }
}

export {};