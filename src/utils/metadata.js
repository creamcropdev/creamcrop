import { createRequire } from "module";
const require = createRequire(import.meta.url);
let pkg = require("../../package.json");

export var version = pkg.version
export var about =  `${pkg.name}\n${pkg.description}\n${pkg.author}\n${pkg.version}`