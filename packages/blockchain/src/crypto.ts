import { Buffer } from 'node:buffer';
import { createDiffieHellman, scryptSync, createDecipheriv, scrypt, randomFill, createCipheriv, generateKey } from 'node:crypto';

class Encryptor {
  // algorithm: string
  // password: string 
  // keyLength: number 
  constructor() {}
}
const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';
const KEY_LENGTH = 24;

// const GENERATED_KEY = generateKey("hmac", {length: KEY_LENGTH}, (err, key) => {
//    if (err) console.log(`[${Date.now()}] ${err.name}: ${err.message}`);
//    console.log(`[${Date.now()}] KeyObject: ${JSON.stringify(key)}`);
// })

// First, we'll generate the key. The key length is dependent on the algorithm.
// In this case for aes192, it is 24 bytes (192 bits).
const key = scryptSync(password, 'salt', 24);
// The IV is usually passed along with the ciphertext.
const iv = Buffer.alloc(16, 0); // Initialization vector.
/**
Provides an asynchronous scrypt implementation. 
Scrypt is a password-based key derivation function that is designed to be expensive computationally 
and memory-wise in order to make brute-force attacks unrewarding.
The salt should be as unique as possible. 
It is recommended that a salt is random and at least 16 bytes long. 
See NIST SP 800-132 for details.
When passing strings for password or salt, 
please consider caveats when using strings as inputs to cryptographic APIs.
The callback function is called with two arguments: err and derivedKey.
err is an exception object when key derivation fails, otherwise err is null. 
derivedKey is passed to the callback as a Buffer.
An exception is thrown when any of the input arguments specify invalid values or types.
 */
scrypt(password, 'salt', KEY_LENGTH, (err, key) => {
  if (err) throw err;
  // Then, we'll generate a random initialization vector
  randomFill(new Uint8Array(16), (err, iv) => {
    if (err) throw err;

    // Once we have the key and iv, we can create and use the cipher...
    const cipher = createCipheriv(algorithm, key, iv);

    let encrypted = '';
    cipher.setEncoding('hex');

    cipher.on('data', (chunk) => encrypted += chunk);
    cipher.on('end', () => console.log(encrypted));

    cipher.write('some clear text data');
    cipher.end();
  });
});

/**
 * 
 */




const decipher = createDecipheriv(algorithm, key, iv);

let decrypted = '';
decipher.on('readable', () => {
  let chunk;
  while (null !== (chunk = decipher.read())) {
    decrypted += chunk.toString('utf8');
  }
});
decipher.on('end', () => {
  console.log(decrypted);
  // Prints: some clear text data
});

// Encrypted with same algorithm, key and iv.
const encrypted =
  'e5f79c5915c02171eec6b212d5520d44480993d7d622a7c4c2da32f6efda0ffa';
decipher.write(encrypted, 'hex');
decipher.end();