//! Modified for minimal support of only AES encryption/decryption

;(function (root, factory, undef) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory(
			require("./core"),
			require("./enc-base64"),
			require("./md5"),
			require("./evpkdf"),
			require("./cipher-core"),
			require("./sha1"),
			require("./hmac"),
			require("./pbkdf2"),
			require("./aes")
		);
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define([
			"./core",
			"./enc-base64",
			"./md5",
			"./evpkdf",
			"./cipher-core",
			"./sha1",
			"./hmac",
			"./pbkdf2",
			"./aes"
		], factory);
	}
	else {
		// Global (browser)
		root.CryptoJS = factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	return CryptoJS;

}));
