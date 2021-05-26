(() => {
    const styleSetter = style => {
        return text => `<span style=${JSON.stringify(style)}>${text}</span>`
    };

    // const javaReservedWords = /\b(char|byte|short|int|long|abstract|catch|double|final|implements|native|public|switch|true|assert|char|do|finally|import|new|return|synchronized|try|boolean|class|else|float|instanceof|null|short|this|void|break|byte|continue|extends|goto|interface|private|static|strictfp|throws|while|case|default|false|if|long|protected|super|transient)\b/g
    const javaReservedWords = /\b(abstract|catch|final|implements|native|public|switch|true|assert|do|finally|import|new|return|synchronized|try|class|else|instanceof|null|this|void|break|continue|extends|goto|interface|private|static|strictfp|throws|while|case|default|false|if|protected|super|transient)\b/g

    const styleSetters = {
        red: styleSetter('color: #f55'),
        orange: styleSetter('color: #faa'),
        green: styleSetter('color: #afa'),
        yellow: styleSetter('color: #ff0'),
        lightGray: styleSetter('color: #ccc'),
        cyan: styleSetter('color: #0ff'),
        purple: styleSetter('color: #aaf'),
        pink: styleSetter('color: #faf'),
        lightPink: styleSetter('color: #fdf'),
        white: styleSetter('color: #fff'),
        blue: styleSetter('color: #66f')
    };

    const patterns = [
        // Javadoc comments
        {
            regex: /(\/\*\*[\s\S]*?\*\/)/g,
            replace: text => styleSetters.green(text.replace(/@\w[\w\d]*\b/g, styleSetters.yellow))
        },

        // Multiline comments
        {
            regex: /(\/\*[\s\S]*?\*\/)/g,
            replace: styleSetters.green
        },

        // Comments
        { regex: /(\/\/.*\n)/g, replace: styleSetters.green },

        // String literals
        {
            regex: /[rf]?".*?"/g,
            replace: text => styleSetters.orange(text.replace(/\\./g, styleSetters.red))
        },

        // Lambda arrow
        { regex: /-&gt;/g, replace: styleSetters.lightGray },

        // General syntax
        { regex: javaReservedWords, replace: styleSetters.purple },

        // Char literals
        {
            regex: /'(.|\\.)'/g,
            replace: text => styleSetters.orange(text.replace(/\\./g, styleSetters.red))
        },

        // Type (Object)
        {
            regex: /(?<Otype>\w[\w\d]*)(?:(?<Ows1>\s*)((?<Olt>&lt;)(?<Ogeneric>\w(\s|\w|\d|&lt;|&gt;|,|\[|\])*)(?<Ogt>&gt;))(?<Ows2>\s*))(?<Olist>(?:\[\])*)(?<Ows3>\s*)(?<Odots>\.{3})?/g,
            replace: text => styleSetters.blue(text.replace(/&lt;|&gt;|\[|\]|,/g, styleSetters.green))
            /*
                     `${styleSetters.blue('$<Otype>')}$<Ows1>`
                     + `${styleSetters.green('$<Olt>')}${styleSetters.blue('$<Ogeneric>')}${styleSetters.green('$<Ogt>')}$<Ows2>`
                     + `${styleSetters.green('$<Olist>')}$<Ows3>`
                     + `${styleSetters.cyan('$<Odots>')}$<Ows4>`
            */
        },

        // Type declaration (Object object)
        {
            regex: /(?<type>\w[\w\d]*)(?:(?<ws1>\s*)((?<lt>&lt;)(?<generic>\w(\s|\w|\d|&lt;|&gt;|,|\[|\])*)(?<gt>&gt;))?(?<ws2>\s*))(?<list>(?:\[\])*)(?<ws3>\s*)(?<dots>(\.{3})?)(?<ws4>\s+)(?<object>\w[\w\d]*)/g,
            replace: `${styleSetters.blue('$<type>')}$<ws1>`
                     + `${styleSetters.green('$<lt>')}${styleSetters.blue('$<generic>')}${styleSetters.green('$<gt>')}$<ws2>`
                     + `${styleSetters.green('$<list>')}$<ws3>`
                     + `${styleSetters.cyan('$<dots>')}$<ws4>`
                     + `${styleSetters.pink('$<object>')}`

        },

        // Floating point
        { regex: /((\d(_\d|\d)*\.\d(_\d|\d)*|\d(_\d|\d)*\.|\.\d(_\d|\d)*)([Ee][-+]?\d(_\d|\d)*)?[DFdf]?)|(\d(_\d|\d)*[Ee][-+]?\d(_\d|\d)*[DFdf]?)|(\d(_\d|\d)*[DFdf])/g, replace: styleSetters.orange },

        // Bin / hex / oct
        { regex: /\b(0[Bb][01](_[01]|[01])*|0[Xx][\dA-Fa-f](_[\dA-Fa-f]|[\dA-Fa-f])*|0[0-7](_[0-7]|[0-7])*)\b/g, replace: styleSetters.orange },

        // Integer
        { regex: /\d(_\d|\d)*[Ll]?/g, replace: styleSetters.orange },

        // Delimiters
        { regex: /[\(\[\]\)]|&lt;&gt;/g, replace: styleSetters.green },
        { regex: /[\{\}]/g, replace: styleSetters.lightGray },

        // Comparison operators
        { regex: /(&(?:gt|lt);=?|==|!=)/g, replace: styleSetters.cyan },

        // Arithmetic operators
        { regex: /(\+|-|\*|\/|%)/g, replace: styleSetters.cyan },

        // Other operators
        { regex: /=|!|&&|&|\|\||\||\^/g, replace: styleSetters.cyan },

        // Dot
        {
            regex: /(\.\s*\w[\w\d]*)/g,
            replace: text =>
                styleSetters.cyan(text[0])
                + styleSetters.lightPink(text.substr(1))
        },

        // Misc
        { regex: /[:,]/g, replace: styleSetters.cyan },
        { regex: /;/g, replace: styleSetters.green },

        // Variables
        { regex: /(\w[\w\d]*)/g, replace: styleSetters.pink },
    ];

    highlightSyntax('.java-code', patterns);
})();
