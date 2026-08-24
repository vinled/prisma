const fs = require('fs');

function replaceInFile(filePath, replacements) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    for (const [search, replace] of replacements) {
        content = content.split(search).join(replace);
    }
    if (content !== original) {
        fs.writeFileSync(filePath, content);
        console.log(`Updated ${filePath}`);
    }
}

const appFiles = [
    'src/App.tsx',
    'src/components/Auth.tsx',
    'src/components/ResetPassword.tsx',
    'src/components/PaywallModal.tsx',
    'src/components/MyAccount.tsx',
    'src/components/MyProperties.tsx',
    'src/components/TemplateRenderer.tsx',
    'index.html'
];

appFiles.forEach(file => {
    if (fs.existsSync(file)) {
        replaceInFile(file, [
            ['Prisma Imóveis', 'PostNaMão'],
            ['Prisma Pro', 'PostNaMão Pro'],
            ['PrismaLogo', 'PostNaMaoLogo'],
            ['do Prisma?', 'do PostNaMão?'],
            ['do Prisma', 'do PostNaMão'],
            ['sobre o Prisma', 'sobre o PostNaMão'],
            ['prisma_imoveis', 'postnamao_imoveis'],
            ['Prisma - Posts Imobiliários', 'PostNaMão | Suas Artes Imobiliárias Prontas em Segundos'],
            ['Crie artes imobiliárias profissionais para o Instagram em poucos cliques. Agilidade e conversão para corretores de imóveis.', 'Não perca tempo editando. Com o PostNaMão, suas captações vão para o Instagram em poucos cliques.']
        ]);
        
        replaceInFile(file, [
            ['bg-purple-600', 'bg-orange-600'],
            ['hover:bg-purple-700', 'hover:bg-orange-700'],
            ['text-purple-600', 'text-orange-600'],
            ['text-purple-700', 'text-orange-700'],
            ['text-purple-400', 'text-orange-400'],
            ['border-purple-200', 'border-orange-200'],
            ['border-purple-800', 'border-orange-800'],
            ['bg-purple-100', 'bg-orange-100'],
            ['bg-purple-900/30', 'bg-orange-900/30'],
            ['from-purple-50', 'from-orange-50'],
            ['from-purple-900/20', 'from-orange-900/20'],
            ['shadow-purple-600/20', 'shadow-orange-600/20'],
            ['shadow-purple-600/25', 'shadow-orange-600/25'],
            ['ring-purple-500', 'ring-orange-500'],
            ['border-purple-500', 'border-orange-500'],
            ['hover:text-purple-800', 'hover:text-orange-800'],
            ['hover:text-purple-300', 'hover:text-orange-300'],
            ['bg-indigo-600', 'bg-slate-900 dark:bg-slate-700'],
            ['border-indigo-600', 'border-slate-900 dark:border-slate-700'],
            ['hover:text-indigo-600', 'hover:text-orange-600'],
            ['hover:bg-indigo-50', 'hover:bg-orange-50'],
            ['dark:hover:bg-indigo-900/30', 'dark:hover:bg-orange-900/30'],
            ['dark:hover:text-indigo-400', 'dark:hover:text-orange-400']
        ]);
    }
});
