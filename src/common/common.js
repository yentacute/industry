const stringToObjectLatLng = function (location, split = ",") {
  let arr = location.split(split);
  return { lat: arr[0].trim(), lng: arr[1].trim() };
};

const arrayToObjectLatLng = function (arr) {
  return { lat: arr[1], lng: arr[0] };
};

const limitText = function (text, maxLength) {
  if (text.length > maxLength) {
    text = text.slice(0, maxLength) + "...";
  }
  return text;
};

const getDifferentArray = function (array1, array2) {
  const result = array1.filter((item) => !array2.some((x) => x.id === item.id));
  if (array2.length === array1.length) return [];
  return result;
};
export {
  stringToObjectLatLng,
  arrayToObjectLatLng,
  limitText,
  getDifferentArray,
};
