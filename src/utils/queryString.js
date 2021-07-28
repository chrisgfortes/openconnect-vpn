export const objectToQuery = (objs) =>
  Object.keys(objs)
    .map((key) => key + "=" + objs[key])
    .join("&");
