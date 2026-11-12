/* ALatex — convertidor de expresiones matemáticas a LaTeX.
   Funciona en el navegador (window.LatexConverter) y en Node (module.exports). */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.LatexConverter = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  var GREEK = {
    alpha: '\\alpha', beta: '\\beta', gamma: '\\gamma', delta: '\\delta',
    epsilon: '\\epsilon', varepsilon: '\\varepsilon', zeta: '\\zeta', eta: '\\eta',
    theta: '\\theta', vartheta: '\\vartheta', iota: '\\iota', kappa: '\\kappa',
    lambda: '\\lambda', mu: '\\mu', nu: '\\nu', xi: '\\xi', pi: '\\pi',
    varpi: '\\varpi', rho: '\\rho', varrho: '\\varrho', sigma: '\\sigma',
    varsigma: '\\varsigma', tau: '\\tau', upsilon: '\\upsilon', phi: '\\phi',
    varphi: '\\varphi', chi: '\\chi', psi: '\\psi', omega: '\\omega',
    Gamma: '\\Gamma', Delta: '\\Delta', Theta: '\\Theta', Lambda: '\\Lambda',
    Xi: '\\Xi', Pi: '\\Pi', Sigma: '\\Sigma', Upsilon: '\\Upsilon',
    Phi: '\\Phi', Psi: '\\Psi', Omega: '\\Omega'
  };

  var CONSTS = {
    infty: '\\infty', infinity: '\\infty', oo: '\\infty',
    partial: '\\partial', nabla: '\\nabla',
    emptyset: '\\emptyset', varnothing: '\\varnothing',
    in: '\\in', notin: '\\notin', ni: '\\ni',
    subset: '\\subset', supset: '\\supset', subseteq: '\\subseteq', supseteq: '\\supseteq',
    cup: '\\cup', cap: '\\cap', setminus: '\\setminus',
    forall: '\\forall', exists: '\\exists', neg: '\\neg', lnot: '\\neg',
    land: '\\land', wedge: '\\wedge', lor: '\\lor', vee: '\\vee',
    cdot: '\\cdot', times: '\\times', div: '\\div', pm: '\\pm', mp: '\\mp',
    ast: '\\ast', circ: '\\circ', oplus: '\\oplus', otimes: '\\otimes',
    approx: '\\approx', equiv: '\\equiv', ne: '\\ne', neq: '\\ne',
    le: '\\le', leq: '\\le', ge: '\\ge', geq: '\\ge',
    ll: '\\ll', gg: '\\gg', sim: '\\sim', simeq: '\\simeq', cong: '\\cong',
    propto: '\\propto', perp: '\\perp', parallel: '\\parallel', angle: '\\angle',
    therefore: '\\therefore', because: '\\because',
    dots: '\\dots', ldots: '\\dots', cdots: '\\cdots', vdots: '\\vdots',
    to: '\\to', rightarrow: '\\rightarrow', leftarrow: '\\leftarrow',
    Rightarrow: '\\Rightarrow', Leftarrow: '\\Leftarrow',
    Leftrightarrow: '\\Leftrightarrow', leftrightarrow: '\\leftrightarrow',
    implies: '\\Rightarrow', iff: '\\Leftrightarrow',
    degree: '^{\\circ}', prime: "'",
    sum: '\\sum', prod: '\\prod', int: '\\int', iint: '\\iint', oint: '\\oint'
  };

  var FUNCS = {
    sin: '\\sin', cos: '\\cos', tan: '\\tan', cot: '\\cot', sec: '\\sec', csc: '\\csc',
    arcsin: '\\arcsin', arccos: '\\arccos', arctan: '\\arctan',
    sinh: '\\sinh', cosh: '\\cosh', tanh: '\\tanh', coth: '\\coth',
    ln: '\\ln', log: '\\log', lg: '\\lg', exp: '\\exp',
    det: '\\det', max: '\\max', min: '\\min', gcd: '\\gcd',
    sup: '\\sup', inf: '\\inf', arg: '\\arg', deg: '\\deg', dim: '\\dim', ker: '\\ker'
  };

  /* Símbolos que se escriben como relación y necesitan espacios al convertir. */
  var RELATIONS = {
    '\\le': 1, '\\ge': 1, '\\ne': 1, '\\approx': 1, '\\equiv': 1, '\\sim': 1,
    '\\simeq': 1, '\\cong': 1, '\\propto': 1, '\\in': 1, '\\notin': 1, '\\ni': 1,
    '\\subset': 1, '\\supset': 1, '\\subseteq': 1, '\\supseteq': 1,
    '\\to': 1, '\\Rightarrow': 1, '\\Leftrightarrow': 1, '\\leftrightarrow': 1,
    '\\leftarrow': 1, '\\Leftarrow': 1, '\\perp': 1, '\\parallel': 1,
    '\\ll': 1, '\\gg': 1, '\\mid': 1
  };

  var UNICODE = {
    'π': '\\pi', 'α': '\\alpha', 'β': '\\beta', 'γ': '\\gamma', 'δ': '\\delta',
    'ε': '\\epsilon', 'ζ': '\\zeta', 'η': '\\eta', 'θ': '\\theta', 'ι': '\\iota',
    'κ': '\\kappa', 'λ': '\\lambda', 'μ': '\\mu', 'ν': '\\nu', 'ξ': '\\xi',
    'ρ': '\\rho', 'σ': '\\sigma', 'τ': '\\tau', 'υ': '\\upsilon', 'φ': '\\varphi',
    'χ': '\\chi', 'ψ': '\\psi', 'ω': '\\omega',
    'Γ': '\\Gamma', 'Δ': '\\Delta', 'Θ': '\\Theta', 'Λ': '\\Lambda', 'Ξ': '\\Xi',
    'Π': '\\Pi', 'Σ': '\\Sigma', 'Υ': '\\Upsilon', 'Φ': '\\Phi', 'Ψ': '\\Psi', 'Ω': '\\Omega',
    '×': '\\times', '·': '\\cdot', '⋅': '\\cdot', '÷': '\\div', '±': '\\pm', '∓': '\\mp',
    '∗': '\\ast', '∘': '\\circ', '⊕': '\\oplus', '⊗': '\\otimes',
    '≤': '\\le', '≥': '\\ge', '≠': '\\ne', '≈': '\\approx', '≡': '\\equiv',
    '∼': '\\sim', '≃': '\\simeq', '≅': '\\cong', '∝': '\\propto', '≪': '\\ll', '≫': '\\gg',
    '∞': '\\infty', '∂': '\\partial', '∇': '\\nabla',
    '∑': '\\sum', '∏': '\\prod', '∫': '\\int', '∬': '\\iint', '∮': '\\oint',
    '→': '\\to', '←': '\\leftarrow', '⇒': '\\Rightarrow', '⇐': '\\Leftarrow',
    '⇔': '\\Leftrightarrow', '↔': '\\leftrightarrow',
    '∈': '\\in', '∉': '\\notin', '∋': '\\ni', '⊂': '\\subset', '⊃': '\\supset',
    '⊆': '\\subseteq', '⊇': '\\supseteq', '∪': '\\cup', '∩': '\\cap', '∅': '\\emptyset',
    '∀': '\\forall', '∃': '\\exists', '¬': '\\neg', '∧': '\\land', '∨': '\\lor',
    '∴': '\\therefore', '∵': '\\because', '⊥': '\\perp', '∥': '\\parallel', '∠': '\\angle',
    '…': '\\dots', '°': '^{\\circ}', '′': "'", '²': '^{2}', '³': '^{3}', '¹': '^{1}'
  };

  var TWO_CHAR = {
    '<=': '\\le', '>=': '\\ge', '!=': '\\ne', '<>': '\\ne',
    '->': '\\to', '=>': '\\Rightarrow', '<-': '\\leftarrow', '<=>': '\\Leftrightarrow'
  };

  function rowsOf(args) {
    var rows = [[]];
    args.forEach(function (arg) {
      rows[rows.length - 1].push(arg.tex);
      if (arg.sep === ';') rows.push([]);
    });
    return rows;
  }

  function rowTex(row) {
    return row.join(' & ');
  }

  var STRUCT = {
    frac: function (a) { return '\\frac{' + (a[0] || '') + '}{' + (a[1] || '') + '}'; },
    dfrac: function (a) { return '\\dfrac{' + (a[0] || '') + '}{' + (a[1] || '') + '}'; },
    sqrt: function (a) { return a.length ? '\\sqrt{' + (a[0] || '') + '}' : '\\sqrt{}'; },
    cbrt: function (a) { return '\\sqrt[3]{' + (a[0] || '') + '}'; },
    root: function (a) { return '\\sqrt[' + (a[0] || '') + ']{' + (a[1] || '') + '}'; },
    abs: function (a) { return '\\left|' + (a[0] || '') + '\\right|'; },
    norm: function (a) { return '\\left\\|' + (a[0] || '') + '\\right\\|'; },
    floor: function (a) { return '\\left\\lfloor ' + (a[0] || '') + ' \\right\\rfloor'; },
    ceil: function (a) { return '\\left\\lceil ' + (a[0] || '') + ' \\right\\rceil'; },
    binom: function (a) { return '\\binom{' + (a[0] || '') + '}{' + (a[1] || '') + '}'; },
    vec: function (a) { return '\\vec{' + (a[0] || '') + '}'; },
    hat: function (a) { return '\\hat{' + (a[0] || '') + '}'; },
    bar: function (a) { return '\\overline{' + (a[0] || '') + '}'; },
    text: function (a) { return '\\text{' + (a[0] || '') + '}'; },
    sum: function (a) {
      if (!a.length) return '\\sum';
      return '\\sum_{' + (a[0] || '') + '=' + (a[1] || '') + '}^{' + (a[2] || '') + '} ' + (a[3] || '');
    },
    prod: function (a) {
      if (!a.length) return '\\prod';
      return '\\prod_{' + (a[0] || '') + '=' + (a[1] || '') + '}^{' + (a[2] || '') + '} ' + (a[3] || '');
    },
    int: function (a) {
      if (!a.length) return '\\int';
      return '\\int_{' + (a[0] || '') + '}^{' + (a[1] || '') + '} ' + (a[2] || '');
    },
    lim: function (a) {
      if (!a.length) return '\\lim';
      return '\\lim_{' + (a[0] || '') + ' \\to ' + (a[1] || '') + '} ' + (a[2] || '');
    },
    matrix: function (a, raw) {
      if (!raw.length) return '\\begin{pmatrix}\\end{pmatrix}';
      var rows = rowsOf(raw);
      return '\\begin{pmatrix} ' + rows.map(rowTex).join(' \\\\ ') + ' \\end{pmatrix}';
    },
    cases: function (a, raw) {
      if (!raw.length) return '\\begin{cases}\\end{cases}';
      var rows = rowsOf(raw);
      return '\\begin{cases} ' + rows.map(rowTex).join(' \\\\ ') + ' \\end{cases}';
    }
  };

  /* ---------- Tokenizador ---------- */
  function tokenize(src) {
    var tokens = [];
    var i = 0;
    var n = src.length;
    var OPS = '+-*/^_=<>(){}[],;!';

    while (i < n) {
      var ch = src.charAt(i);
      if (/\s/.test(ch)) { i++; continue; }

      if (/[0-9]/.test(ch)) {
        var j = i;
        while (j < n && /[0-9]/.test(src.charAt(j))) j++;
        if (src.charAt(j) === '.' && /[0-9]/.test(src.charAt(j + 1) || '')) {
          j++;
          while (j < n && /[0-9]/.test(src.charAt(j))) j++;
        }
        tokens.push({ type: 'num', value: src.slice(i, j) });
        i = j;
        continue;
      }

      if (/[A-Za-z]/.test(ch)) {
        var k = i;
        while (k < n && /[A-Za-z]/.test(src.charAt(k))) k++;
        tokens.push({ type: 'word', value: src.slice(i, k) });
        i = k;
        continue;
      }

      var three = src.substr(i, 3);
      if (three === '...') {
        tokens.push({ type: 'sym', tex: '\\dots' });
        i += 3;
        continue;
      }
      if (three === '<=>') {
        tokens.push({ type: 'sym', tex: TWO_CHAR[three] });
        i += 3;
        continue;
      }

      var two = src.substr(i, 2);
      if (TWO_CHAR[two] && two !== '<=>') {
        tokens.push({ type: 'sym', tex: TWO_CHAR[two] });
        i += 2;
        continue;
      }

      if (ch === '−' || ch === '–') { tokens.push({ type: 'op', value: '-' }); i++; continue; }
      if (ch === '×') { tokens.push({ type: 'op', value: '×' }); i++; continue; }
      if (ch === '·' || ch === '⋅') { tokens.push({ type: 'op', value: '·' }); i++; continue; }
      if (ch === '÷') { tokens.push({ type: 'op', value: '/' }); i++; continue; }
      if (ch === '√') { tokens.push({ type: 'word', value: 'sqrt' }); i++; continue; }

      if (OPS.indexOf(ch) !== -1) { tokens.push({ type: 'op', value: ch }); i++; continue; }

      if (UNICODE[ch]) { tokens.push({ type: 'sym', tex: UNICODE[ch] }); i++; continue; }

      tokens.push({ type: 'sym', tex: ch });
      i++;
    }

    return tokens;
  }

  /* ---------- Utilidades ---------- */
  function needsSpaceAfter(latex) {
    return /\\[A-Za-z]+$/.test(latex);
  }

  function joinProduct(left, right) {
    if (!left) return right;
    if (!right) return left;
    var sep = (needsSpaceAfter(left) || RELATIONS[right]) ? ' ' : '';
    return left + sep + right;
  }

  function startsAtom(t) {
    if (!t) return false;
    if (t.type === 'num' || t.type === 'word' || t.type === 'sym') return true;
    return t.type === 'op' && (t.value === '(' || t.value === '[' || t.value === '{');
  }

  /* ---------- Parser ---------- */
  function Parser(tokens) {
    this.tokens = tokens;
    this.i = 0;
  }

  Parser.prototype.peek = function () { return this.tokens[this.i]; };
  Parser.prototype.eat = function () { return this.tokens[this.i++]; };

  Parser.prototype.expect = function (value) {
    var t = this.peek();
    if (t && t.type === 'op' && t.value === value) { this.i++; return true; }
    return false;
  };

  Parser.prototype.parseExpr = function (stop) {
    var left = this.parseTerm();
    for (;;) {
      var t = this.peek();
      if (!t) break;
      if (stop && stop()) break;

      if (t.type === 'op' && (t.value === '+' || t.value === '-' || t.value === '=' ||
          t.value === '<' || t.value === '>')) {
        this.eat();
        var right = this.parseTerm();
        left = left + ' ' + t.value + ' ' + right;
      } else if (t.type === 'sym' && RELATIONS[t.tex]) {
        this.eat();
        var rel = this.parseTerm();
        left = left + ' ' + t.tex + ' ' + rel;
      } else {
        break;
      }
    }
    return left;
  };

  Parser.prototype.parseTerm = function () {
    var left = this.parseUnary();
    for (;;) {
      var t = this.peek();
      if (!t) break;

      if (t.type === 'op' && (t.value === '*' || t.value === '×' || t.value === '·')) {
        this.eat();
        var opTex = t.value === '×' ? '\\times' : '\\cdot';
        var factor = this.parseUnary();
        left = left + ' ' + opTex + ' ' + factor;
      } else if (t.type === 'op' && t.value === '/') {
        this.eat();
        var den = this.parseUnary();
        left = '\\frac{' + left + '}{' + den + '}';
      } else if (startsAtom(t)) {
        var prod = this.parseUnary();
        left = joinProduct(left, prod);
      } else {
        break;
      }
    }
    return left;
  };

  Parser.prototype.parseUnary = function () {
    var t = this.peek();
    if (t && t.type === 'op' && (t.value === '-' || t.value === '+')) {
      this.eat();
      var inner = this.parseUnary();
      return t.value === '-' ? '-' + inner : inner;
    }
    return this.parsePostfix();
  };

  Parser.prototype.parsePostfix = function () {
    var base = this.parseAtom();
    for (;;) {
      var t = this.peek();
      if (t && t.type === 'op' && (t.value === '^' || t.value === '_')) {
        this.eat();
        var arg = this.parseScriptArg();
        base += t.value === '^' ? '^{' + arg + '}' : '_{' + arg + '}';
      } else if (t && t.type === 'op' && t.value === '!') {
        this.eat();
        base += '!';
      } else {
        break;
      }
    }
    return base;
  };

  Parser.prototype.parseScriptArg = function () {
    var t = this.peek();
    if (!t) return '';
    if (t.type === 'op' && (t.value === '(' || t.value === '{')) {
      this.eat();
      var inner = this.parseExpr();
      this.expect(t.value === '(' ? ')' : '}');
      return inner;
    }
    if (t.type === 'op' && (t.value === '-' || t.value === '+')) {
      this.eat();
      return t.value + this.parseScriptArg();
    }
    return this.parseAtom();
  };

  Parser.prototype.parseAtom = function () {
    var t = this.peek();
    if (!t) return '';

    if (t.type === 'num') { this.eat(); return t.value; }
    if (t.type === 'sym') { this.eat(); return t.tex; }
    if (t.type === 'word') { this.eat(); return this.word(t.value); }

    if (t.type === 'op') {
      if (t.value === '(') {
        this.eat();
        var a = this.parseExpr();
        this.expect(')');
        return '\\left(' + a + '\\right)';
      }
      if (t.value === '[') {
        this.eat();
        var b = this.parseExpr();
        this.expect(']');
        return '\\left[' + b + '\\right]';
      }
      if (t.value === '{') {
        this.eat();
        var c = this.parseExpr();
        this.expect('}');
        return '\\left\\{' + c + '\\right\\}';
      }
    }

    this.eat();
    return '';
  };

  Parser.prototype.word = function (w) {
    var next = this.peek();
    if (next && next.type === 'op' && next.value === '(') {
      return this.buildCall(w, this.parseArgs());
    }

    var lw = w.toLowerCase();

    if (STRUCT[lw]) return STRUCT[lw]([]);
    if (FUNCS[lw]) return FUNCS[lw] + ' ';
    if (CONSTS[w]) return CONSTS[w];
    if (CONSTS[lw]) return CONSTS[lw];
    if (GREEK[w]) return GREEK[w];
    if (GREEK[lw]) return GREEK[lw];

    return w;
  };

  Parser.prototype.parseArgs = function () {
    var self = this;
    this.expect('(');

    var args = [];
    var current = null;

    for (;;) {
      var t = this.peek();
      if (!t) {
        if (current) args.push(current);
        break;
      }
      if (t.type === 'op' && t.value === ')') {
        this.eat();
        if (current) args.push(current);
        break;
      }
      if (t.type === 'op' && (t.value === ',' || t.value === ';')) {
        this.eat();
        var item = current || { tex: '' };
        item.sep = t.value;
        args.push(item);
        current = null;
        continue;
      }

      var tex = this.parseExpr(function () {
        var c = self.peek();
        return !!c && c.type === 'op' && (c.value === ',' || c.value === ';' || c.value === ')');
      });
      current = { tex: tex, sep: '' };
    }

    return args;
  };

  Parser.prototype.buildCall = function (name, args) {
    var lw = name.toLowerCase();
    var texArgs = args.map(function (a) { return a.tex; });

    if (STRUCT[lw]) return STRUCT[lw](texArgs, args);

    var fn = FUNCS[lw];
    if (fn) return fn + '\\left(' + texArgs.join(', ') + '\\right)';

    return name + '\\left(' + texArgs.join(', ') + '\\right)';
  };

  /* ---------- API ---------- */
  function convert(src) {
    var text = src || '';
    if (!text.trim()) return { latex: '', error: null };

    var tokens = tokenize(text);
    if (!tokens.length) return { latex: '', error: null };

    try {
      var p = new Parser(tokens);
      var latex = p.parseExpr();
      if (p.i < tokens.length) {
        var rest = tokens.slice(p.i).map(function (t) {
          return t.tex || t.value || '';
        }).join(' ');
        if (rest) latex += ' ' + rest;
      }
      return { latex: latex.trim(), error: null };
    } catch (err) {
      return { latex: '', error: err && err.message ? err.message : 'Error de sintaxis' };
    }
  }

  return { convert: convert, tokenize: tokenize, GREEK: GREEK, CONSTS: CONSTS };
});
