export default {
   testEnvironment: 'node',
   setupFilesAfterEnv: [],
   testMatch: ['**/tests/**/*.test.js'],
   collectCoverageFrom: [
     'src/**/*.js',
     '!src/server.js',
     '!src/app.js'
   ],
   coverageDirectory: 'coverage',
   verbose: true
 };