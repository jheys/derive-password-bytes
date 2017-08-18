const crypto = require('crypto');

/**
 * Derives Password bytes (Buffer) for encryption/decryption
 * This is a crude implementation of the C# PasswordDeriveBytes.GetBytes method - which is an extension of the
 * PBKDF1 algorithm.
 *
 * @param password {string} The password for which to derive the key
 * @param salt {string} The salt to use
 * @param hash {string} The name of the algorithm for the operation
 * @param iterations {int} The number of iterations for the operation
 * @param len {int} The desired key length (number of bytes)
 * @return {buffer}
 */
const derp = (password, salt, iterations, hash, len) => {
    let key = Buffer.concat([Buffer(password), Buffer(salt)]);
    for (let i = 0; i < iterations; i++) {
        key = crypto.createHash(hash).update(key).digest();
    }
    if (key.length < len) {
        const hx = derp(password, salt, 1, hash);
        let counter = 0;
        while (key.length < len) {
            counter++;
            let extendedHash = Buffer.concat([Buffer(counter.toString()),hx]);
            key = Buffer.concat([key, crypto.createHash(hash).update(extendedHash).digest()]);
        }
        return key.slice(0,len);
    }
    return key;
};

module.exports = derp;