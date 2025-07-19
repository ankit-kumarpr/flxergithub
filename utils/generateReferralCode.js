module.exports = (username) => {
  return `flexr-${username.toLowerCase()}-${Math.floor(Math.random() * 10000)}`;
};
