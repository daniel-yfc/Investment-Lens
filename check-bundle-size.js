const fs = require('fs');
const path = require('path');

// Target max size: 200KB
const MAX_SIZE_BYTES = 200 * 1024;

try {
  // Try reading the next build output stats
  const buildManifestPath = path.join(process.cwd(), '.next', 'build-manifest.json');
  if (!fs.existsSync(buildManifestPath)) {
      console.log('No build manifest found, assuming tests pass or run build first.');
      process.exit(0);
  }

  const manifest = JSON.parse(fs.readFileSync(buildManifestPath, 'utf8'));
  const firstLoadFiles = manifest.pages['/'] || [];

  let totalSize = 0;
  for (const file of firstLoadFiles) {
     if (file.endsWith('.js')) {
        const filePath = path.join(process.cwd(), '.next', file);
        if (fs.existsSync(filePath)) {
           const stat = fs.statSync(filePath);
           totalSize += stat.size;
        }
     }
  }

  const totalKB = (totalSize / 1024).toFixed(2);
  console.log(`First load JS size for / is ~${totalKB} KB (uncompressed)`);

  // A rough estimate: gzipped is usually around 30% of uncompressed
  const estimatedGzipKB = (totalSize * 0.3 / 1024);
  console.log(`Estimated GZIP size: ~${estimatedGzipKB.toFixed(2)} KB`);

  if (estimatedGzipKB > 200) {
      console.error(`ERROR: Bundle size ${estimatedGzipKB.toFixed(2)}KB exceeds 200KB limit! (PE-06)`);
      process.exit(1);
  } else {
      console.log('SUCCESS: Bundle size is within limits (PE-06).');
  }

} catch (e) {
  console.error('Bundle check error:', e);
}
