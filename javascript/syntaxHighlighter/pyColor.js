(() => {
    const styleSetter = style => {
        return text => `<span style=${JSON.stringify(style)}>${text}</span>`
    };

    const pythonReservedWords = /\b(and|as|assert|break|class|continue|def|del|elif|else|except|finally|False|for|from|global|if|import|in|is|lambda|nonlocal|None|not|or|pass|raise|return|True|try|with|while|yield)\b/g

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
    };

    const patterns = [
        // Multiline strings
        { regex: /(('''|""")[\s\S]*?\2)/g, replace: styleSetters.red },

        // Comments
        { regex: /(#.*\n)/g, replace: styleSetters.green },

        // Single line strings
        { regex: /[rf]?'.*?'/g, replace: styleSetters.red },
        { regex: /[rf]?".*?"/g, replace: styleSetters.red },

        // Decorators
        { regex: /(@\w[\w\d]*)/g, replace: styleSetters.yellow },

        // Return type arrow
        { regex: /-&gt;/g, replace: styleSetters.lightGray },

        // Comparison operators
        { regex: /(&(?:gt|lt);=?|==|!=)/g, replace: styleSetters.cyan },

        // General syntax
        { regex: pythonReservedWords, replace: styleSetters.purple },

        // Digits (FIX)
        { regex: /\b[-+]?(\d+\.?|\.\d+|\d+\.\d+)([Ee][-+]?\d+)?\b/g, replace: styleSetters.orange },

        // Delimiters
        { regex: /([\(\[\{\}\]\)])/g, replace: styleSetters.green },

        // Arithmetic operators
        { regex: /(\+|-|\*|\/|\/\/)/g, replace: styleSetters.cyan },

        // Other operators
        { regex: /=|~/g, replace: styleSetters.white },

        // Dot
        {
            regex: /(\.\s*\w[\w\d]*)/g,
            replace: text =>
                `<span style='color: #0ff'>${text[0]}</span>`
                + `<span style='color: #fdf'>${text.substr(1)}</span>`
        },

        // Colon
        { regex: /(:)/g, replace: styleSetters.cyan },

        // Comma
        { regex: /(,)/g, replace: styleSetters.cyan },

        // Variables
        { regex: /(\w[\w\d]*)/g, replace: styleSetters.pink },

        // Line continuation (\ symbol)
        { regex: /(\\)/g, replace: styleSetters.red },

        // Remaining
        { regex: /([\s\S])/g, replace: text => text },
    ];

    highlightSyntax('.py-code', patterns);
})();
