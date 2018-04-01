module.exports = {
  validate: function(url) {
    const regex = RegExp(/^https?:\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g);

    return regex.test(url);
  }
}