import { renderToString } from "react-dom/server";
import { RemixServer } from "remix";
import type { EntryContext } from "remix";

import { createDiffieHellman, scryptSync, createDecipheriv, scrypt, randomFill, createCipheriv, generateKey } from 'node:crypto';

// Generate server's keys...
const server = createDiffieHellman(2048);
const serverKey = server.generateKeys();

// Generate client's keys...
const client = createDiffieHellman(server.getPrime(), server.getGenerator());
const clientKey = client.generateKeys();

// Exchange and generate the secret...
const serverSecret = server.computeSecret(clientKey);
const clientSecret = client.computeSecret(serverKey);

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const markup = renderToString(
    <RemixServer context={remixContext} url={request.url} />
  );

  responseHeaders.set("Content-Type", "text/html");
  responseHeaders.set("x-server-key", serverKey.toString('hex'));
  responseHeaders.set("x-client-key", clientKey.toString('hex'));

  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: responseHeaders
  });
}
