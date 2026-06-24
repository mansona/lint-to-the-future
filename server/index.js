import data from './mocks/data.json' with { type: 'json'};

export function mockDataMiddleware(app) {
  return {
    name: 'local-data-server',
    configureServer(server) {
      server.middlewares.use('/data.json', (req, res) => {
        res.end(JSON.stringify(data));
      });
    }
  }
};

