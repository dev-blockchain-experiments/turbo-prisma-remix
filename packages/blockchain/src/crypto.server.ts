import { Buffer } from 'node:buffer';
import assert from 'node:assert';
import { createDiffieHellman, scryptSync, createDecipheriv, scrypt, randomFill, createCipheriv, generateKey } from 'node:crypto';
import type { DiffieHellman } from 'node:crypto';

interface ICryptoInstance {
    instance: DiffieHellman
    key?: Buffer
    secret?: Buffer
}
class Authenticator {
    server: ICryptoInstance
    client: ICryptoInstance 
    constructor() {
        // this.server = createDiffieHellman(2048);
        // this.client = createDiffieHellman(this.server.getPrime(), this.server.getGenerator());
        this.server = {
            instance: createDiffieHellman(2048),
        };
        this.client = {
            instance: createDiffieHellman(this.server.instance.getPrime(), this.server.instance.getGenerator())
        };
    };
    async generateServerKeys() {
        return await this.server.instance.generateKeys();
    };
    async generateClientKeys() {
        return await this.client.instance.generateKeys();
    };
    async generateKeys() {
        await Promise.all([
            await this.generateServerKeys(),
            await this.generateClientKeys()
        ]).then(([serverKeys, clientKeys]) => {
            this.server.key = serverKeys;
            this.client.key = clientKeys;
        });
        /**
         * .then((result) => {
            this.server.key = result[0]
            this.client.key = result[1]
        })
         */
    };
    async generateServerSecret() {
        let key = this.client.key;
        if (!key) await this.generateKeys();
        return this.server.instance.computeSecret(key as Buffer);
    };
    async generateClientSecret() {
        let key = this.server.key;
        if (!key) await this.generateKeys();
        return this.client.instance.computeSecret(key as Buffer);
    };
    async generateSecrets() {
        await Promise.all([
            await this.generateServerSecret(),
            await this.generateClientSecret()
        ]).then(([serverSecret, clientSecret]) => {
            this.server.secret = serverSecret;
            this.client.secret = clientSecret;
        });
    };
}
/**
 * DEMO
 */

async function main() {
    const authenticator = new Authenticator();
    await authenticator.generateKeys();
    await authenticator.generateSecrets();
    console.log(`Server Key: ${authenticator.server.key}\n Server Secret: ${authenticator.server.secret}\n Client Key: ${authenticator.client.key}\n Client Secret: ${authenticator.client.secret}\n`)
};

main();

// Generate server's keys...
// const server = createDiffieHellman(2048);
// const serverKey = server.generateKeys();

// Generate client's keys...
// const client = createDiffieHellman(server.getPrime(), server.getGenerator());
// const clientKey = client.generateKeys();

// Exchange and generate the secret...
// const serverSecret = server.computeSecret(clientKey);
// const clientSecret = client.computeSecret(serverKey);

// console.log("Starting test...");
// assert.strictEqual(serverSecret.toString('hex'), clientSecret.toString('hex')); // OK
// assert(serverSecret.toString('hex') === clientSecret.toString('hex')); // OK

// if (serverSecret.toString('hex') === clientSecret.toString('hex')) {
//     console.log("true");
// } else {
//     console.log("false");
// }

// console.log("Test Complete");