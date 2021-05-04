module.exports = (key) => {
  const Hypixel = require('hypixel-api-reborn');
  const hypixel = new Hypixel.Client(key, { cache: true });
  return hypixel;
};
