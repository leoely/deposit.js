function formateString(str, type) {
  if (type === 'double') {
    return '"' + str + '"';
  } else {
    return "'" + str + "'";
  }
}

export default function formateVal(val, type) {
  if (typeof type !== 'string') {
    throw new Error('[Error] Parameter type should be of string type.');
  }
  if (typeof val === 'string') {
    return formateString(val, type);
  } else {
    return val;
  }
}
