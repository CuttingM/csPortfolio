const combineExpressions = (flags, ...expressions) => {
    let source = expressions.map(exp => exp.source).join('|');

    let i = 1;
    // Alter group definitions
    source = source.replace(/\(/g, match => {
        return `(?<_${i++}>`;
    });

    // Retroactively fix mistakes (could be improved)
    source = source.replace(/\(\?<_\d+>\?(:|<.+?>)/g, (_, fix) => {
        return `(?${fix}`;
    });

    i = 0;
    // Alter group references
    source = source.replace(/\\(\d)/g, match => {
        return `\\k<_${i++ + JSON.parse(match[1])}>`;
    });

    return new RegExp(source, flags);
}

const highlightSyntax = (cssIdentifier, patterns, tabWidth=4) => {
    const codeBlocks = document.querySelectorAll(cssIdentifier);
    combineExpressions('g', /a/g, /(g)\1/g);

    codeBlocks.forEach(block => {
        // Convert tabs to spaces
        block.innerHTML = block.innerHTML.replace(/\t/g, ' '.repeat(tabWidth));

        const tokens = [...block.innerHTML.matchAll(
            combineExpressions(
                'g',
                ...patterns.map(pattern => pattern.regex).concat(/([\s\S])/g)
            )
            /*new RegExp(
                [
                    ...patterns.map(pattern => pattern.regex.source),
                    /([\s\S])/g.source // Ensure that all characters are accounted for
                ].join('|'),
                'g'
            )*/
        )]
        .map(regMatch => regMatch[0]);


        let result = '';

        tokens.forEach(token => {
            let matched = false;

            patterns.forEach(pattern => {
                if(!matched && token.match(pattern.regex)) {
                    matched = true;
                    result += token.replace(pattern.regex, pattern.replace);
                }
            });

            if(!matched) {
                result += token;
            }
        });

        block.innerHTML = result;
    });
};
