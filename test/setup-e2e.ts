const testDatabaseUrl = process.env.TEST_DATABASE_URL;

if (!testDatabaseUrl) {
  throw new Error(
    'TEST_DATABASE_URL is required to run E2E tests. Refusing to use DATABASE_URL.',
  );
}

process.env.DATABASE_URL = testDatabaseUrl;
process.env.CRYPT_KEY ??= 'e2e-test-crypt-key-32-bytes!!!!!';
