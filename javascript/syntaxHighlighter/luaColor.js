(() => {
    const styleSetter = style => {
        return text => `<span style=${JSON.stringify(style)}>${text}</span>`
    };

    const luaReservedWords = /\b(and|break|do|else|elseif|end|false|for|function|if|in|local|nil|not|or|repeat|return|then|true|until|while)\b/g;

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
        blue: styleSetter('color: #66f'),
    };

    const luaColors = {
        number: styleSetters.white,
        string: styleSetters.orange,
        stringEscape: styleSetters.red,
        comment: styleSetters.green,
        reservedWord: styleSetters.purple,
        delimiter: styleSetters.blue,
        tableDelimiter: styleSetters.blue,
        operator: styleSetters.green,
        sequence: styleSetters.cyan,
        afterDot: styleSetters.lightPink,
        variable: styleSetters.pink,
    }

    const patterns = [
        // Multiline comments
        {
            regex: /(--\[\[[\s\S]*?\]\])/g,
            replace: luaColors.comment
        },

        // Multiline strings
        { regex: /(\[\[[\s\S]*?\]\])/g, replace: luaColors.string },

        // Comments
        { regex: /(--.*\n)/g, replace: luaColors.comment },

        // Single line strings
        {
            regex: /('.*?')/g,
            replace: text => luaColors.string(text.replace(/\\.|\d+/g, luaColors.stringEscape))
        },

        {
            regex: /(".*?")/g,
            replace: text => luaColors.string(text.replace(/\\.|\d+/g, luaColors.stringEscape))
        },

        // Reserved keywords
        { regex: luaReservedWords, replace: luaColors.reservedWord },

        // Floating point
        { regex: /((\d(_\d|\d)*\.\d(_\d|\d)*|\d(_\d|\d)*\.|\.\d(_\d|\d)*)([Ee][-+]?\d(_\d|\d)*)?[DFdf]?)|(\d(_\d|\d)*[Ee][-+]?\d(_\d|\d)*[DFdf]?)|(\d(_\d|\d)*[DFdf])/g, replace: luaColors.number },

        // Hex
        { regex: /0[Xx][\dA-Fa-f](_[\dA-Fa-f]|[\dA-Fa-f])*\b/g, replace: luaColors.number },

        // Integer
        { regex: /\d(_\d|\d)*[Ll]?/g, replace: luaColors.number },

        // Delimiters
        { regex: /[\(\[\]\)]/g, replace: luaColors.delimiter },
        { regex: /[\{\}]/g, replace: luaColors.tableDelimiter },

        // Comparison operators
        { regex: /(&(?:gt|lt);=?|==|~=)/g, replace: luaColors.operator },

        // Arithmetic operators
        { regex: /(\+|-|\*|\/|%|\^)/g, replace: luaColors.operator },

        // Other operators
        { regex: /=|\.\.|\.\.\.|#/g, replace: luaColors.operator },

        // Dot or colon operator
        {
            regex: /([.:]\s*\w[\w\d]*)/g,
            replace: text =>
                luaColors.operator(text[0])
                + luaColors.afterDot(text.substr(1))
        },

        // Sequences
        { regex: /[;,]/g, replace: luaColors.sequence },

        // Variables
        { regex: /(\w[\w\d]*)/g, replace: luaColors.variable },
    ];

    highlightSyntax('.lua-code', patterns);
})();
