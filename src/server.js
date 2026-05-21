import app from './app.js';
import env from './config/env.js';

const server = app.listen(env.port, () => {
  console.log(`Server running on port ${env.port} in ${env.env} mode`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

export default server;