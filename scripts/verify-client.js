const path = require('path');
const fs = require('fs');

const prismaClientDir = path.dirname(require.resolve('@prisma/client'));
const files = ['index.d.ts', 'index.js'].map(f => path.join(prismaClientDir, f));

for (const f of files) {
  if (fs.existsSync(f)) {
    const content = fs.readFileSync(f, 'utf8');
    const hasCatId = content.includes('packageCategoryId');
    const hasTypeId = content.includes('packageTypeId');
    console.log(`${path.basename(f)}: packageCategoryId=${hasCatId} packageTypeId=${hasTypeId}`);
  } else {
    console.log(`${f}: NOT FOUND`);
  }
}