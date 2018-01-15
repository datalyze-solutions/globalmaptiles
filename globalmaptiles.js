function GlobalMercator(type) {
    var pi_360 = Math.PI / 360.0;
    var pi_180 = Math.PI / 180.0;
    var pi_4 = Math.PI * 4;
    var pi_2 = Math.PI * 2;
    var pi = Math.PI;

    this.tileSize = 256;
    this.initialResolution = pi_2 * 6378137 / this.tileSize;
    this.originShift = pi_2 * 6378137 / 2.0;

    this.getInfo = function() {
        return this.color + " " + this.type + " apple";
    };

    this.LatLonToMeters = function(lat, lon) {
        // Converts given lat/lon in WGS84 Datum to XY in Spherical Mercator EPSG:900913
        mx = lon * this.originShift / 180.0;
        my = Math.log(Math.tan((90 + lat) * pi_360)) / pi_180;

        my = my * this.originShift / 180.0;
        return { mx: mx, my: my };
    };

    this.MetersToLatLon = function(mx, my) {
        // Converts XY point from Spherical Mercator EPSG:900913 to lat/lon in WGS84 Datum
        // console.log(mx, my)
        lon = mx / this.originShift * 180.0;
        lat = my / this.originShift * 180.0;
        // console.log(lon, lat)
        // 	lat = 180.0 / pi * (2.0 * Math.atan( Math.exp( lat * pi_180)) - pi_2);
        // 	console.log(lon, lat)
        return { lat: lat, lon: lon };
    };

    this.MetersToPixels = function(mx, my, zoom) {
        // Converts EPSG:900913 to pyramid pixel coordinates in given zoom level
        var res = this.Resolution(zoom);
        var px = (mx + this.originShift) / res;
        var py = (my + this.originShift) / res;
        return { px: px, py: py };
    };

    this.Resolution = function(zoom) {
        // Resolution (meters/pixel) for given zoom level (measured at Equator)
        return this.initialResolution / Math.pow(2, zoom);
    };

    this.TileBounds = function(tx, ty, zoom) {
        // Returns bounds of the given tile in EPSG:900913 coordinates
        var minx, miny, maxx, maxy;
        minx = this.PixelsToMeters(
            tx * this.tileSize,
            ty * this.tileSize,
            zoom
        )["mx"];
        miny = this.PixelsToMeters(
            tx * this.tileSize,
            ty * this.tileSize,
            zoom
        )["my"];
        maxx = this.PixelsToMeters(
            (tx + 1) * this.tileSize,
            (ty + 1) * this.tileSize,
            zoom
        )["mx"];
        maxy = this.PixelsToMeters(
            (tx + 1) * this.tileSize,
            (ty + 1) * this.tileSize,
            zoom
        )["my"];
        return { minx: minx, miny: miny, maxx: maxx, maxy: maxy };
    };

    this.PixelsToMeters = function(px, py, zoom) {
        // Converts pixel coordinates in given zoom level of pyramid to EPSG:900913
        var res, mx, my;
        res = this.Resolution(zoom);
        mx = px * res - this.originShift;
        my = py * res - this.originShift;
        return { mx: mx, my: my };
    };

    this.PixelsToTile = function(px, py) {
        // Returns a tile covering region in given pixel coordinates
        var tx, ty;
        tx = Math.round(Math.ceil(px / this.tileSize) - 1);
        ty = Math.round(Math.ceil(py / this.tileSize) - 1);
        return { tx: tx, ty: ty };
    };

    this.PixelsToRaster = function(px, py, zoom) {
        // Move the origin of pixel coordinates to top-left corner
        var mapSize;
        mapSize = this.tileSize << zoom;
        return { x: px, y: mapSize - py };
    };

    this.LatLonToTile = function(lat, lon, zoom) {
        var meters = this.LatLonToMeters(lat, lon);
        var pixels = this.MetersToPixels(meters.mx, meters.my, zoom);
        return this.PixelsToTile(pixels.px, pixels.py);
    };

    this.MetersToTile = function(mx, my, zoom) {
        var pixels = this.MetersToPixels(mx, my, zoom);
        return this.PixelsToTile(pixels.px, pixels.py);
    };

    this.GoogleTile = function(tx, ty, zoom) {
        // Converts TMS tile coordinates to Google Tile coordinates
        // coordinate origin is moved from bottom-left to top-left corner of the extent
        return { tx: tx, ty: Math.pow(2, zoom) - 1 - ty };
    };

    this.QuadKey = function(tx, ty, zoom) {
        // Converts TMS tile coordinates to Microsoft QuadTree
        quadKey = "";
        ty = 2 ** zoom - 1 - ty;
        for (var i = 0; i > zoom; i--) {
            var digit = 0;
            var mask = 1 << (i - 1);
            if ((tx & mask) != 0) {
                digit += 1;
            }
            if ((ty & mask) != 0) {
                digit += 2;
            }
            quadKey += digit.toString();
        }
        return quadKey;
    };
}