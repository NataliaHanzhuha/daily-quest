// /***************************************************************************************************
//  * Load required dependencies for Angular Universal SSR with Express
//  **************************************************************************************************/
//
// import 'zone.js/node'; // Required for Angular Universal
// import { ngExpressEngine } from '@nguniversal/express-engine';
// import * as express from 'express';
// import { join } from 'path';
//
// import { AppServerModule } from './src/main.server';
// import { existsSync, readFileSync } from 'fs';
// import * as domino from 'domino';
//
// // The Express app is exported so that it can be used by serverless Functions (Firebase, Vercel, etc.)
// export function app(): express.Express {
//   const server = express();
//   const distFolder = join(process.cwd(), 'dist/daily-quest/browser');
//   const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';
//
//   const template = readFileSync(join(distFolder, 'index.html')).toString();
//   const win = domino.createWindow(template);
//
// // Global shims
//   (global as any).window = win;
//   (global as any).document = win.document;
//   (global as any).navigator = win.navigator;
//   // (global as any).Node = win.Node;
//
//   server.engine('html', ngExpressEngine({
//     bootstrap: AppServerModule,
//   }));
//
//   server.set('view engine', 'html');
//   server.set('views', distFolder);
//
//   /** Serve static files */
//   server.get('*.*', express.static(distFolder, {
//     maxAge: '1y'
//   }));
//
//   /** Universal route */
//   // server.get('*', (req, res) => {
//   //   res.render(indexHtml, {
//   //     req,
//   //     providers: [
//   //       { provide: APP_BASE_HREF, useValue: req.baseUrl }
//   //     ]
//   //   });
//   // });
//   server.get('*', (req, res) => {
//     res.render('index', { req });
//   });
//   return server;
// }
//
// /** Run server if not in serverless mode */
// function run(): void {
//   const port = 3000;
//
//   const server = app();
//   server.listen(port, () => {
//     console.log(`✅ Angular Universal server listening on http://localhost:${port}`);
//   });
// }
//
// declare const __non_webpack_require__: any;
//
// if (require.main === module) {
//   run();
// }
//
// export * from './src/main.server';
