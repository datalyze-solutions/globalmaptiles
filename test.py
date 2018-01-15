#!/usr/bin/env python

from globalmaptiles import GlobalMercator

gm = GlobalMercator()

zoom = 7
geographic = {
    'lat': 52.31,
    'lon': 13.24
}
meters = {
    'mx': 1473870.058102942,
    'my': 6856372.69101939
}
pixels = {
    'px': 17589.134222222223,
    'py': 21990.22649522623
}
tile = {
    'tx': 68,
    'ty': 85
}
googleTile = {
    'tx': 68,
    'ty': 42
}
tileBounds = {
    'minx': 1252344.271424327,
    'miny': 6574807.42497772,
    'maxx': 1565430.3392804079,
    'maxy': 6887893.492833804
}
quadKey = "1202120"

result = gm.LatLonToMeters(geographic['lat'], geographic['lon'])
print(result)

result = gm.MetersToLatLon(meters['mx'], meters['my'])
print(result)

result = gm.MetersToPixels(meters['mx'], meters['my'], zoom)
print(result)

result = gm.PixelsToTile(pixels['px'], pixels['py'])
print(result)

result = gm.PixelsToMeters(pixels['px'], pixels['py'], zoom);
print(result)

result = gm.TileBounds(tile['tx'], tile['ty'], zoom);
print(result)

result = gm.LatLonToTile(geographic['lat'], geographic['lon'], zoom);
print(result)

result = gm.MetersToTile(meters['mx'], meters['my'], zoom);
print(result)

result = gm.GoogleTile(tile['tx'], tile['ty'], zoom);
print(result)

result = gm.QuadTree(tile['tx'], tile['ty'], zoom);
print(result)

tx, ty, zoom = gm.QuadKeyToTile(quadKey);
print(tx, ty, zoom)