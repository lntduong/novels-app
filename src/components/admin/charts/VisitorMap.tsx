'use client';

import { ComposableMap, Geographies, Geography, Sphere, Graticule } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import { useMemo } from 'react';

// GeoJSON for the world map
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface VisitorMapProps {
    data: { code: string; count: number }[];
}

export default function VisitorMap({ data }: VisitorMapProps) {
    const colorScale = useMemo(() => {
        const max = Math.max(...data.map(d => d.count), 0);
        return scaleLinear<string>()
            .domain([0, max || 1]) // Avoid 0 domain
            .range(["#EAEAEC", "#3b82f6"]); // gray to blue
    }, [data]);

    return (
        <div className="w-full h-[300px] overflow-hidden rounded-lg border border-border bg-card">
            <ComposableMap
                projectionConfig={{
                    rotate: [-10, 0, 0],
                    scale: 147
                }}
            >
                <Sphere stroke="#E4E5E6" strokeWidth={0.5} id="1" fill="transparent" />
                <Graticule stroke="#E4E5E6" strokeWidth={0.5} />
                <Geographies geography={geoUrl}>
                    {({ geographies }: { geographies: any[] }) =>
                        geographies.map((geo: any) => {
                            // geo.properties.ISO_A2 matches our 2-letter country codes usually
                            // But 110m.json often uses ISO_A3 or NAME.
                            // Let's check typical usage. 110m usually has ISO_A2 but sometimes mapped differently.
                            // Standard react-simple-maps example uses ISO_A2 if available or ISO_A3.
                            // geoip-lite returns 2 letter codes (US, VN).
                            // Let's try to match logic.

                            const cur = data.find(s => s.code === geo.properties.ISO_A2);
                            return (
                                <Geography
                                    key={geo.rsmKey}
                                    geography={geo}
                                    fill={cur ? colorScale(cur.count) : "#F5F4F6"}
                                    stroke="#D6D6DA"
                                    style={{
                                        default: { outline: "none" },
                                        hover: { fill: "#F53", outline: "none" },
                                        pressed: { outline: "none" },
                                    }}
                                />
                            );
                        })
                    }
                </Geographies>
            </ComposableMap>
        </div>
    );
}
