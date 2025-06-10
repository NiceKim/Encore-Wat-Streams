const blacklist = new Set();

function addToBlacklist(token) {
  blacklist.add(token);
}

function isBlacklisted(token) {
  return blacklist.has(token);
}

module.exports = { addToBlacklist, isBlacklisted }; 