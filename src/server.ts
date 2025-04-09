import express, { Request, Response } from 'express';
import { join } from 'path';
import { existsSync } from 'fs';

const app = express();
const PORT = 8080;

// Path to Angular browser build output (replace with your actual app name)
const distFolder = join(process.cwd(), 'dist/your-project-name/browser');

// Serve static files
app.use(express.static(distFolder));

// Handle all routes with index.html (SPA fallback)
app.get('*', (req: Request, res: Response) => {
  const indexPath = join(distFolder, 'index.html');
  if (existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Angular app not built yet');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Angular app served at http://localhost:${PORT}`);
});
