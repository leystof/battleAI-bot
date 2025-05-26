import fs from 'fs';
import path from 'path';

const schemaBase = path.join(__dirname, '../../prisma/schema.template.prisma');
const modelsDir = path.join(__dirname, '../../prisma/models');
const outPath = path.join(__dirname, '../../prisma/schema.prisma');

const main = () => {
    const base = fs.readFileSync(schemaBase, 'utf-8');
    const models = fs
        .readdirSync(modelsDir)
        .filter(f => f.endsWith('.prisma'))
        .map(f => fs.readFileSync(path.join(modelsDir, f), 'utf-8'))
        .join('\n\n');

    const full = `${base}\n\n${models}`;
    fs.writeFileSync(outPath, full);
    console.log('✅ schema.generated.prisma created');
};

main();
