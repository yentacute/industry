/**
 * File này định nghĩa accs hàm tái sử dụng dành cho các dữ liệu GIS
 * các hàm, Kiểm tra bbox, kiểm tra lat, lng, ...
 */

/**
 * [isValidWmsBbox description]
 * @param wmsbbox {"maxx": 101, "maxy": 20, "minx": 100, "miny": 19.7}
 * @return bool
 */
export function isValidWmsBbox(wmsbbox) {
  try {
    let maxx = wmsbbox["maxx"];
    let maxy = wmsbbox["maxy"];
    let minx = wmsbbox["minx"];
    let miny = wmsbbox["miny"];

    if (!(isValidLatitude(maxy) || isValidLatitude(miny))) return false;
    if (!(isValidLongtitude(maxx) || isValidLongtitude(minx))) return false;

    return true;
  } catch {
    return false;
  }
}

export function isValidLatitude(lat) {
  if (-90 <= lat && lat <= 90) return true;
  return false;
}

export function isValidLongtitude(lng) {
  if (-180 <= lng && lng <= 180) return true;
  return false;
}

/**
 * [getGeomBounds Lấy về danh sách tọa độ dùng cho fitBounds của map4d]
 * các kiểu dữ liệu geom khác nhau sẽ có cấu trúc geom khác nhau
 * Ví dụ:
 * point: [lng, lat]
 * polygon: [[[lng, lat], [lng, lat], [lng, lat], [lng, lat], ...]]
 * Nhưng dữ liệu đầu vào của hàm bounds bbox phải là: [[lng, lat], [lng, lat], [[lng, lat]]]
 * @return [[lng, lat], [lng, lat], [lng, lat]]
 */
export function getGeomBounds(geomType, geom) {
  let bounds = [];
  geomType = geomType.toLowerCase();

  if ("point" === geomType) {
    bounds = geom;
  } else if ("polygon" === geomType) {
    bounds = geom[0];
  } else if ("linestring" === geomType) {
    bounds = geom;
  }
  return bounds;
}

/**
 * [getMap4dDraw Từ thông tin geom và geomType trả về đối tượng draw của map4d]
 * @param geomType
 * @param geom
 * @return bool
 */
export function getMap4dDraw(geomType, geom, fillOpacity = 0.1) {
  geomType = geomType.toLowerCase();
  let map4dDraw;
  if ("point" === geomType) {
    map4dDraw = new map4d.Marker({
      position: geom,
    });
  } else if ("polygon" === geomType) {
    map4dDraw = new map4d.Polygon({
      fillOpacity: fillOpacity,
      userInteractionEnabled: true,
      paths: geom,
    });
  } else if ("linestring" === geomType) {
    map4dDraw = new map4d.Polyline({
      path: geom,
      strokeColor: "#ff0000",
      strokeOpacity: 1.0,
      strokeWidth: 10,
    });
  }
  return map4dDraw;
}

/**
 * [getGeomHighlight Trả về các geom đúng để tạo đối tượng tùy theo loại của geom đó]
 * Vì mỗi loại geom (Polygon, Point, MultiPolygon, ...) sẽ có cách lấy geom từ response để tạo đối tượng map4d
 * tương ứng khác nhau vì vậy cần có hàm này để lấy về thông tin đúng
 * @return None
 */
export function getGeomHighlight(geomType, geom) {
  geomType = geomType.toLowerCase();
  let rl;
  if (geomType === "point") {
    rl = {
      type: "point",
      geom: geom,
    };
  } else if (geomType === "polygon") {
    rl = {
      type: "polygon",
      geom: geom,
    };
  } else if (geomType === "multipolygon") {
    rl = {
      type: "polygon",
      geom: [geom],
    };
  } else if (geomType === "linestring") {
    rl = {
      type: "linestring",
      geom: geom,
    };
  }

  return rl;
}

export const getGeomFromCoordinates = function (
  coordinates,
  geomType = "polygon"
) {
  const firstCoordinate = [coordinates[0]["lng"], coordinates[0]["lat"]];
  console.log(firstCoordinate);
  let convertedCoordinates = [];
  coordinates.forEach((coordinate) => {
    const el = [coordinate["lng"], coordinate["lat"]];
    convertedCoordinates.push(el);
  });
  convertedCoordinates.push(firstCoordinate);
  return {
    coordinates: [convertedCoordinates],
    type: geomType,
  };
};

export const getfilterWmsFromGeom = function (geometry) {
  const geomType = geometry.type.toLowerCase();
  let coordinates = null;

  if (geomType == "polygon") {
    coordinates = geometry.coordinates[0];
  } else if (geomType == "multipolygon") {
    coordinates = geometry.coordinates[0];
  }

  const convertedGeometry = coordinates
    .map((coords) => coords.join(" "))
    .join(", ");
  return convertedGeometry;
};

export const getRectangleCoordinates = function (listPoint) {
  console.log(listPoint);
  if (listPoint.length !== 2) return [];

  const [lat1, lng1] = listPoint[0];
  const [lat2, lng2] = listPoint[1];

  // Tính toán tọa độ các đỉnh của hình chữ nhật
  const xMin = Math.min(lng1, lng2);
  const xMax = Math.max(lng1, lng2);
  const yMin = Math.min(lat1, lat2);
  const yMax = Math.max(lat1, lat2);

  // Xác định tọa độ các đỉnh của hình chữ nhật
  const vertices = [
    [xMin, yMin], // Đỉnh thứ nhất
    [xMax, yMin], // Đỉnh thứ hai
    [xMax, yMax], // Đỉnh thứ ba
    [xMin, yMax], // Đỉnh thứ tư
    [xMin, yMin],
  ];

  return vertices;
};
