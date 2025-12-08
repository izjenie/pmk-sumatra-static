(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/MapComponent.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MapComponent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/leaflet/dist/leaflet-src.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function MapComponent() {
    _s();
    const mapRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const mapContainerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [markers, setMarkers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MapComponent.useEffect": ()=>{
            fetchMarkers();
        }
    }["MapComponent.useEffect"], []);
    const fetchMarkers = async ()=>{
        try {
            const res = await fetch('/api/markers');
            if (res.ok) {
                const data = await res.json();
                setMarkers(data);
            }
        } catch (error) {
            console.error('Error fetching markers:', error);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MapComponent.useEffect": ()=>{
            if (!mapContainerRef.current || mapRef.current) return;
            const sumateraBounds = [
                [
                    -6.5,
                    94.5
                ],
                [
                    6.0,
                    107.5
                ]
            ];
            const satellite = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                maxZoom: 19,
                attribution: 'Tiles © Esri'
            });
            const map = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].map(mapContainerRef.current, {
                center: [
                    0.5,
                    102.0
                ],
                zoom: 7,
                minZoom: 6,
                maxZoom: 11,
                maxBounds: sumateraBounds,
                maxBoundsViscosity: 1.0,
                layers: [
                    satellite
                ]
            });
            mapRef.current = map;
            return ({
                "MapComponent.useEffect": ()=>{
                    if (mapRef.current) {
                        mapRef.current.remove();
                        mapRef.current = null;
                    }
                }
            })["MapComponent.useEffect"];
        }
    }["MapComponent.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MapComponent.useEffect": ()=>{
            if (!mapRef.current || markers.length === 0) return;
            const getIcon = {
                "MapComponent.useEffect.getIcon": (type)=>{
                    const iconClass = {
                        flood: 'text-blue-600 fa-solid fa-water',
                        truck: 'text-green-600 fa-solid fa-truck',
                        tent: 'text-orange-600 fa-solid fa-tent'
                    }[type] || 'text-red-600 fa-solid fa-location-dot';
                    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].divIcon({
                        className: iconClass + ' text-xl',
                        iconSize: [
                            24,
                            24
                        ],
                        iconAnchor: [
                            12,
                            12
                        ]
                    });
                }
            }["MapComponent.useEffect.getIcon"];
            markers.forEach({
                "MapComponent.useEffect": (marker)=>{
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].marker([
                        marker.latitude,
                        marker.longitude
                    ], {
                        icon: getIcon(marker.marker_type)
                    }).addTo(mapRef.current).bindPopup(marker.label || 'No label');
                }
            }["MapComponent.useEffect"]);
        }
    }["MapComponent.useEffect"], [
        markers
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: mapContainerRef,
        className: "h-[520px] sm:h-[650px] md:h-[768px] rounded-xl"
    }, void 0, false, {
        fileName: "[project]/src/components/MapComponent.tsx",
        lineNumber: 98,
        columnNumber: 5
    }, this);
}
_s(MapComponent, "k3zBtZVua3ALqVCqC6p1Emw0UWw=");
_c = MapComponent;
var _c;
__turbopack_context__.k.register(_c, "MapComponent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/MapComponent.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/components/MapComponent.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=src_components_MapComponent_tsx_bff32870._.js.map