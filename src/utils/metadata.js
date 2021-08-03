const package = require('../../package.json')

exports.version = package.version
exports.about = `${package.name}\n${package.description}\n${package.author}\n${package.version}`
