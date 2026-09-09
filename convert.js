const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const INPUT_DIR = path.join(__dirname, 'input');
const OUTPUT_DIR = path.join(__dirname, 'output');

// ─── Helpers ──────────────────────────────────────────────────────────

function formatKB(bytes) {
  return (bytes / 1024).toFixed(1);
}

function padEnd(str, len) {
  str = String(str);
  return str + ' '.repeat(Math.max(0, len - str.length));
}

function padStart(str, len) {
  str = String(str);
  return ' '.repeat(Math.max(0, len - str.length)) + str;
}

// ─── Cleanup ──────────────────────────────────────────────────────────

function cleanOutput() {
  if (fs.existsSync(OUTPUT_DIR)) {
    const files = fs.readdirSync(OUTPUT_DIR);
    let removed = 0;
    for (const file of files) {
      const fp = path.join(OUTPUT_DIR, file);
      if (fs.statSync(fp).isFile()) {
        fs.unlinkSync(fp);
        removed++;
      }
    }
    if (removed > 0) {
      console.log(`Cleaned ${removed} old file(s) from output/`);
    }
  } else {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log('Created output/ directory.');
  }
}

// ─── Config ──────────────────────────────────────────────────────────

const TARGET_WIDTH_2X = 1600;
const TARGET_WIDTH_1X = 800;
const RESIZE_OPTS_2X = { width: TARGET_WIDTH_2X, withoutEnlargement: true };
const RESIZE_OPTS_1X = { width: TARGET_WIDTH_1X, withoutEnlargement: true };

// ─── Process a single image ──────────────────────────────────────────

async function processImage(filePath) {
  const basename = path.basename(filePath, path.extname(filePath));
  const originalSize = fs.statSync(filePath).size;
  const { width, height } = await sharp(filePath).metadata();

  console.log(`  Processing: ${basename} (${width}×${height}) ...`);

  const variants = [
    {
      suffix: '-2x.avif',
      pipeline: sharp(filePath).resize(RESIZE_OPTS_2X).avif({ quality: 65, effort: 8 }),
    },
    {
      suffix: '-2x.webp',
      pipeline: sharp(filePath).resize(RESIZE_OPTS_2X).webp({ quality: 85, effort: 6 }),
    },
    {
      suffix: '-1x.avif',
      pipeline: sharp(filePath).resize(RESIZE_OPTS_1X).avif({ quality: 65, effort: 8 }),
    },
    {
      suffix: '-1x.webp',
      pipeline: sharp(filePath).resize(RESIZE_OPTS_1X).webp({ quality: 85, effort: 6 }),
    },
    {
      suffix: '-1x.jpg',
      pipeline: sharp(filePath).resize(RESIZE_OPTS_1X).jpeg({ quality: 85, mozjpeg: true }),
    },
  ];

  const results = {};
  for (const v of variants) {
    const outPath = path.join(OUTPUT_DIR, `${basename}${v.suffix}`);
    const info = await v.pipeline.toFile(outPath);
    results[v.suffix] = info.size;
  }

  return {
    name: basename,
    dimensions: `${width}×${height}`,
    originalSize,
    ...results,
  };
}

// ─── Summary table ───────────────────────────────────────────────────

function printSummaryTable(rows) {
  const cols = [
    { key: 'name',          header: 'Source',      width: 14, align: 'left'  },
    { key: 'dimensions',    header: 'Dimensions',  width: 12, align: 'left'  },
    { key: 'originalSize',  header: 'Original',    width: 11, align: 'right' },
    { key: '-2x.avif',      header: '2x AVIF',     width: 11, align: 'right' },
    { key: '-2x.webp',      header: '2x WebP',     width: 11, align: 'right' },
    { key: '-1x.avif',      header: '1x AVIF',     width: 11, align: 'right' },
    { key: '-1x.webp',      header: '1x WebP',     width: 11, align: 'right' },
    { key: '-1x.jpg',       header: '1x JPG',      width: 11, align: 'right' },
  ];

  const sep = '+' + cols.map(c => '-'.repeat(c.width + 2)).join('+') + '+';
  const pad = (val, col) => col.align === 'right' ? padStart(val, col.width) : padEnd(val, col.width);

  console.log('\n' + sep);
  console.log('|' + cols.map(c => ' ' + pad(c.header, c) + ' ').join('|') + '|');
  console.log(sep);

  const totals = { originalSize: 0 };
  const suffixes = ['-2x.avif', '-2x.webp', '-1x.avif', '-1x.webp', '-1x.jpg'];
  suffixes.forEach(s => (totals[s] = 0));

  for (const row of rows) {
    const vals = cols.map(c => {
      if (c.key === 'name') return row.name;
      if (c.key === 'dimensions') return row.dimensions;
      if (c.key === 'originalSize') return formatKB(row.originalSize) + ' KB';
      return formatKB(row[c.key]) + ' KB';
    });
    console.log('|' + vals.map((v, i) => ' ' + pad(v, cols[i]) + ' ').join('|') + '|');

    totals.originalSize += row.originalSize;
    suffixes.forEach(s => (totals[s] += row[s]));
  }

  console.log(sep);

  // Totals row
  const totalVals = cols.map(c => {
    if (c.key === 'name') return 'TOTAL';
    if (c.key === 'dimensions') return '';
    if (c.key === 'originalSize') return formatKB(totals.originalSize) + ' KB';
    return formatKB(totals[c.key]) + ' KB';
  });
  console.log('|' + totalVals.map((v, i) => ' ' + pad(v, cols[i]) + ' ').join('|') + '|');
  console.log(sep);
}

// ─── Main ────────────────────────────────────────────────────────────

async function main() {
  console.log('');
  console.log('='.repeat(60));
  console.log('   IMAGE CONVERTER — Batch Optimization with Sharp');
  console.log('='.repeat(60));
  console.log('');

  // Validate input
  if (!fs.existsSync(INPUT_DIR)) {
    console.error('ERROR: input/ directory not found. Place your images there and try again.');
    process.exit(1);
  }

  const files = fs
    .readdirSync(INPUT_DIR)
    .filter((f) => /\.(jpe?g|png|webp|tiff?)$/i.test(f))
    .sort();

  if (files.length === 0) {
    console.error('ERROR: No supported images found in input/');
    process.exit(1);
  }

  console.log(`Found ${files.length} image(s) in input/`);

  // Cleanup
  cleanOutput();
  console.log('');

  // Process
  const start = Date.now();
  const results = [];

  for (const file of files) {
    const row = await processImage(path.join(INPUT_DIR, file));
    results.push(row);
  }

  const elapsed = ((Date.now() - start) / 1000).toFixed(2);

  // Summary
  printSummaryTable(results);

  console.log('');
  console.log(`  Generated ${results.length * 5} variants in ${elapsed}s`);
  console.log('');
  console.log('='.repeat(60));
  console.log('   ✅  ALL DONE — Check the output/ folder');
  console.log('='.repeat(60));
  console.log('');
}

main().catch((err) => {
  console.error('\nFatal error:', err);
  process.exit(1);
});
