function formateString(str, type) {
  if (type === 'double') {
    return '"' + str + '"';
  } else {
    return "'" + str + "'";
  }
}

export default function formateVal(val, type) {
  if (typeof val === 'string') {
    return formateString(val, type);
  } else {
    return val;
  }
}
