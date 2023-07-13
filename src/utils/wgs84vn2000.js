// Import thư viện Proj4js
import proj4 from "proj4";

var crs_4326 = "+proj=longlat +datum=WGS84 +no_defs ";
// Chuyển đổi tọa độ từ VN2000 sang WGS84
const fcChangeVN2000ToWGS84 = (lng, lat, dataHe200) => {
  if (isNaN(lng) || isNaN(lat)) throw new Error("Invalid input coordinates");
  console.log(vn2000HN(dataHe200.muiChieu, dataHe200.loaiMuiChieu));
  // Chuyển đổi từ tọa độ VN2000 sang tọa độ lat/lng với loại múi chiếu 3 và múi chiếu 106.5
  const result = proj4(
    vn2000HN(dataHe200.muiChieu, dataHe200.loaiMuiChieu),
    crs_4326,
    [parseFloat(lat), parseFloat(lng)]
  );
  return result;
};

function utm_axis(utm_ax) {
  return `+proj=utm +zone=${utm_ax} +datum=WGS84 +units=m +no_defs `;
}

function vn2000HN(kinhdo, reference_system_mui) {
  if (3 === parseInt(reference_system_mui)) {
    // Múi chiếu 3
    return (
      "+proj=tmerc +lat_0=0 +lon_0=" +
      kinhdo.toString() +
      " +k=0.9999 +x_0=500000 +y_0=0 +ellps=WGS84 +towgs84=-191.90441429,-39.30318279,-111.45032835,0.00928836,-0.01975479,0.00427372,0.252906278 +units=m +no_defs"
    );
  } else {
    // Múi chiếu 6
    if (kinhdo == 64) {
      // Múi chiếu 6 -> 48
      return `+proj=utm +zone=48 +ellps=WGS84 +towgs84=-191.90441429,-39.30318279,-111.45032835,0.00928836,-0.01975479,0.00427372,0.252906278 +units=m +no_defs `;
    } else if (kinhdo == 65) {
      // Múi chiếu 6 -> 49
      return `+proj=utm +zone=49 +ellps=WGS84 +towgs84=-191.90441429,-39.30318279,-111.45032835,0.00928836,-0.01975479,0.00427372,0.252906278 +units=m +no_defs `;
    }
  }
}

export { utm_axis, vn2000HN, crs_4326, fcChangeVN2000ToWGS84 };
