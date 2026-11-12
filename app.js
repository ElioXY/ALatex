/* ALatex — interfaz: teclado matemático + conversión en vivo */
(function () {
  'use strict';

  var $ = function (sel) { return document.querySelector(sel); };

  /* Cada botón es [etiqueta, plantilla de lenguaje, plantilla LaTeX].
     El símbolo @ marca dónde queda el cursor. Si no hay @, el cursor va al final. */
  var PADS = [
    {
      name: 'Básico',
      items: [
        ['7', '7'], ['8', '8'], ['9', '9'], ['×', '×', '\\times'], ['('],
        ['4', '4'], ['5', '5'], ['6', '6'], ['−', '-'], [')'],
        ['1', '1'], ['2', '2'], ['3', '3'], ['+', '+'], ['^'],
        ['0', '0'], ['.', '.'], [',', ','], ['=', '='], ['_']
      ]
    },
    {
      name: 'Griegas',
      items: [
        ['α', 'alpha', '\\alpha'], ['β', 'beta', '\\beta'], ['γ', 'gamma', '\\gamma'],
        ['δ', 'delta', '\\delta'], ['ε', 'epsilon', '\\epsilon'], ['ζ', 'zeta', '\\zeta'],
        ['η', 'eta', '\\eta'], ['θ', 'theta', '\\theta'], ['ι', 'iota', '\\iota'],
        ['κ', 'kappa', '\\kappa'], ['λ', 'lambda', '\\lambda'], ['μ', 'mu', '\\mu'],
        ['ν', 'nu', '\\nu'], ['ξ', 'xi', '\\xi'], ['π', 'pi', '\\pi'],
        ['ρ', 'rho', '\\rho'], ['σ', 'sigma', '\\sigma'], ['τ', 'tau', '\\tau'],
        ['υ', 'upsilon', '\\upsilon'], ['φ', 'varphi', '\\varphi'], ['χ', 'chi', '\\chi'],
        ['ψ', 'psi', '\\psi'], ['ω', 'omega', '\\omega'],
        ['Γ', 'Gamma', '\\Gamma'], ['Δ', 'Delta', '\\Delta'], ['Θ', 'Theta', '\\Theta'],
        ['Λ', 'Lambda', '\\Lambda'], ['Ξ', 'Xi', '\\Xi'], ['Π', 'Pi', '\\Pi'],
        ['Σ', 'Sigma', '\\Sigma'], ['Υ', 'Upsilon', '\\Upsilon'], ['Φ', 'Phi', '\\Phi'],
        ['Ψ', 'Psi', '\\Psi'], ['Ω', 'Omega', '\\Omega']
      ]
    },
    {
      name: 'Operadores',
      items: [
        ['±', 'pm', '\\pm'], ['∓', 'mp', '\\mp'], ['·', 'cdot', '\\cdot'],
        ['∗', 'ast', '\\ast'], ['∘', 'circ', '\\circ'], ['⊕', 'oplus', '\\oplus'],
        ['⊗', 'otimes', '\\otimes'], ['≤', 'le', '\\le'], ['≥', 'ge', '\\ge'],
        ['≠', 'ne', '\\ne'], ['≈', 'approx', '\\approx'], ['≡', 'equiv', '\\equiv'],
        ['∼', 'sim', '\\sim'], ['∝', 'propto', '\\propto'], ['≪', 'll', '\\ll'],
        ['≫', 'gg', '\\gg'], ['∞', 'infty', '\\infty'], ['∂', 'partial', '\\partial'],
        ['∇', 'nabla', '\\nabla'], ['∑', 'sum', '\\sum'], ['∏', 'prod', '\\prod'],
        ['∫', 'int', '\\int'], ['∬', 'iint', '\\iint'], ['∮', 'oint', '\\oint'],
        ['°', 'degree', '^{\\circ}'], ['′', 'prime', "'"], ['…', 'dots', '\\dots'],
        ['⌊x⌋', 'floor(x)', '\\left\\lfloor x\\right\\rfloor'],
        ['⌈x⌉', 'ceil(x)', '\\left\\lceil x\\right\\rceil']
      ]
    },
    {
      name: 'Relaciones',
      items: [
        ['→', 'to', '\\to'], ['←', 'leftarrow', '\\leftarrow'],
        ['⇒', 'Rightarrow', '\\Rightarrow'], ['⇐', 'Leftarrow', '\\Leftarrow'],
        ['⇔', 'Leftrightarrow', '\\Leftrightarrow'], ['↔', 'leftrightarrow', '\\leftrightarrow'],
        ['∈', 'in', '\\in'], ['∉', 'notin', '\\notin'], ['⊂', 'subset', '\\subset'],
        ['⊃', 'supset', '\\supset'], ['⊆', 'subseteq', '\\subseteq'],
        ['⊇', 'supseteq', '\\supseteq'], ['∪', 'cup', '\\cup'], ['∩', 'cap', '\\cap'],
        ['∅', 'emptyset', '\\emptyset'], ['∀', 'forall', '\\forall'],
        ['∃', 'exists', '\\exists'], ['¬', 'neg', '\\neg'], ['∧', 'land', '\\land'],
        ['∨', 'lor', '\\lor'], ['∴', 'therefore', '\\therefore'],
        ['∵', 'because', '\\because'], ['⊥', 'perp', '\\perp'],
        ['∥', 'parallel', '\\parallel'], ['∠', 'angle', '\\angle']
      ]
    },
    {
      name: 'Estructuras',
      items: [
        ['a/b', 'frac(@, )', '\\frac{@}{}'],
        ['√x', 'sqrt(@)', '\\sqrt{@}'],
        ['ⁿ√x', 'root(3, @)', '\\sqrt[3]{@}'],
        ['xⁿ', '^(@)', '^{@}'],
        ['xₙ', '_(@)', '_{@}'],
        ['|x|', 'abs(@)', '\\left|@\\right|'],
        ['‖x‖', 'norm(@)', '\\left\\|@\\right\\|'],
        ['n sobre k', 'binom(@, k)', '\\binom{@}{k}'],
        ['∑', 'sum(k, 1, n, @)', '\\sum_{k=1}^{n} @'],
        ['∏', 'prod(k, 1, n, @)', '\\prod_{k=1}^{n} @'],
        ['∫', 'int(a, b, @)', '\\int_{a}^{b} @'],
        ['lim', 'lim(x, 0, @)', '\\lim_{x \\to 0} @'],
        ['d/dx', 'frac(d, d x)', '\\frac{d}{dx}'],
        ['matriz', 'matrix(@, b; c, d)', '\\begin{pmatrix} @ & b \\\\ c & d \\end{pmatrix}'],
        ['casos', 'cases(@, x>0; -x, x<0)', '\\begin{cases} @ & x>0 \\\\ -x & x<0 \\end{cases}'],
        ['vector', 'vec(@)', '\\vec{@}'],
        ['hat', 'hat(@)', '\\hat{@}'],
        ['barra', 'bar(@)', '\\overline{@}'],
        ['texto', 'text(@)', '\\text{@}']
      ]
    },
    {
      name: 'Funciones',
      items: [
        ['sin', 'sin(@)', '\\sin\\left(@\\right)'],
        ['cos', 'cos(@)', '\\cos\\left(@\\right)'],
        ['tan', 'tan(@)', '\\tan\\left(@\\right)'],
        ['cot', 'cot(@)', '\\cot\\left(@\\right)'],
        ['sec', 'sec(@)', '\\sec\\left(@\\right)'],
        ['csc', 'csc(@)', '\\csc\\left(@\\right)'],
        ['arcsin', 'arcsin(@)', '\\arcsin\\left(@\\right)'],
        ['arccos', 'arccos(@)', '\\arccos\\left(@\\right)'],
        ['arctan', 'arctan(@)', '\\arctan\\left(@\\right)'],
        ['sinh', 'sinh(@)', '\\sinh\\left(@\\right)'],
        ['cosh', 'cosh(@)', '\\cosh\\left(@\\right)'],
        ['tanh', 'tanh(@)', '\\tanh\\left(@\\right)'],
        ['ln', 'ln(@)', '\\ln\\left(@\\right)'],
        ['log', 'log(@)', '\\log\\left(@\\right)'],
        ['exp', 'exp(@)', '\\exp\\left(@\\right)'],
        ['det', 'det(@)', '\\det\\left(@\\right)'],
        ['máx', 'max(@)', '\\max\\left(@\\right)'],
        ['mín', 'min(@)', '\\min\\left(@\\right)'],
        ['gcd', 'gcd(@)', '\\gcd\\left(@\\right)']
      ]
    }
  ];

  var EXAMPLES = [
    ['Cuadrática', 'x = frac(-b + sqrt(b^2 - 4*a*c), 2*a)'],
    ['Suma', 'sum(k, 1, n, k^2) = frac(n*(n + 1)*(2*n + 1), 6)'],
    ['Integral', 'int(0, pi, sin(x)) = 2'],
    ['Límite', 'lim(x, 0, sin(x)/x) = 1'],
    ['Matriz', 'matrix(a, b; c, d)'],
    ['Física', 'E = frac(1, 2)*m*v^2']
  ];

  var PLACEHOLDERS = {
    expr: 'Ej: 1/2 + sqrt(3)/2  ·  sum(k, 1, n, k^2)  ·  frac(-b + sqrt(b^2 - 4*a*c), 2*a)',
    tex: 'Ej: \\frac{1}{2} + \\sqrt{3}  ·  \\sum_{k=1}^{n} k^{2}  ·  \\lim_{x \\to 0} \\frac{\\sin x}{x}'
  };

  var input = $('#input');
  var latexEl = $('#latex');
  var renderEl = $('#render');
  var statusEl = $('#status');
  var tabsEl = $('#tabs');
  var keysEl = $('#keys');
  var examplesEl = $('#examples');
  var copyBtn = $('#copy');
  var clearBtn = $('#clear');
  var backBtn = $('#backspace');
  var modeBtns = document.querySelectorAll('.mode');

  var state = { mode: 'expr', bufs: { expr: '', tex: '' }, pad: 0 };

  /* El texto que liga cada botón según el modo. */
  function templateOf(item, mode) {
    return mode === 'tex' ? item[2] : item[1];
  }

  function buildTabs() {
    tabsEl.innerHTML = '';
    PADS.forEach(function (pad, idx) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tab' + (idx === state.pad ? ' is-active' : '');
      btn.textContent = pad.name;
      btn.setAttribute('role', 'tab');
      btn.addEventListener('click', function () {
        state.pad = idx;
        Array.prototype.forEach.call(tabsEl.children, function (el, i) {
          el.classList.toggle('is-active', i === idx);
        });
        buildKeys();
      });
      tabsEl.appendChild(btn);
    });
  }

  function buildKeys() {
    keysEl.innerHTML = '';
    PADS[state.pad].items.forEach(function (item) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'key';
      btn.innerHTML = item[0];
      var tpl = templateOf(item, state.mode);
      btn.title = tpl.replace('@', '');
      btn.addEventListener('click', function () { insert(tpl); });
      keysEl.appendChild(btn);
    });
  }

  function insert(template) {
    if (!template) return;
    var at = template.indexOf('@');
    var text = template.replace('@', '');
    var caret = at < 0 ? text.length : at;

    var start = input.selectionStart;
    var end = input.selectionEnd;
    if (typeof start !== 'number' || typeof end !== 'number') {
      start = end = input.value.length;
    }

    input.value = input.value.slice(0, start) + text + input.value.slice(end);
    input.focus();
    var pos = start + caret;
    input.setSelectionRange(pos, pos);
    update();
  }

  function render(tex) {
    renderEl.innerHTML = '';
    statusEl.classList.remove('err');

    if (!tex) {
      statusEl.textContent = '';
      var hint = document.createElement('p');
      hint.className = 'placeholder';
      hint.textContent = 'La vista previa aparecerá aquí.';
      renderEl.appendChild(hint);
      return;
    }

    if (!window.katex) {
      statusEl.textContent = 'KaTeX no disponible';
      statusEl.classList.add('err');
      var pre = document.createElement('pre');
      pre.textContent = tex;
      renderEl.appendChild(pre);
      return;
    }

    try {
      window.katex.render(tex, renderEl, {
        displayMode: true,
        throwOnError: true,
        strict: 'ignore'
      });
      statusEl.textContent = '';
    } catch (err) {
      statusEl.textContent = 'LaTeX no válido';
      statusEl.classList.add('err');
      var out = document.createElement('pre');
      out.textContent = tex;
      renderEl.appendChild(out);
    }
  }

  function update() {
    var src = input.value;
    state.bufs[state.mode] = src;

    var latex = '';
    if (state.mode === 'tex') {
      latex = src.trim();
      statusEl.textContent = '';
    } else {
      var result = window.LatexConverter
        ? window.LatexConverter.convert(src)
        : { latex: src, error: null };
      latex = result.latex;
      if (result.error) {
        statusEl.textContent = result.error;
        statusEl.classList.add('err');
      } else {
        statusEl.textContent = '';
        statusEl.classList.remove('err');
      }
    }

    latexEl.textContent = latex || '—';
    render(latex);
  }

  function setMode(mode) {
    if (mode === state.mode) return;
    state.bufs[state.mode] = input.value;
    state.mode = mode;

    Array.prototype.forEach.call(modeBtns, function (b) {
      b.classList.toggle('is-active', b.dataset.mode === mode);
    });

    input.value = state.bufs[mode];
    input.placeholder = PLACEHOLDERS[mode];
    buildKeys();
    update();
    input.focus();
  }

  function buildExamples() {
    examplesEl.innerHTML = '';
    EXAMPLES.forEach(function (ex) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'chip';
      btn.textContent = ex[0];
      btn.title = ex[1];
      btn.addEventListener('click', function () {
        if (state.mode !== 'expr') {
          state.bufs[state.mode] = input.value;
          state.mode = 'expr';
          Array.prototype.forEach.call(modeBtns, function (b) {
            b.classList.toggle('is-active', b.dataset.mode === 'expr');
          });
          input.placeholder = PLACEHOLDERS.expr;
          buildKeys();
        }
        input.value = ex[1];
        input.focus();
        input.setSelectionRange(ex[1].length, ex[1].length);
        update();
      });
      examplesEl.appendChild(btn);
    });
  }

  function copyLatex() {
    var text = latexEl.textContent;
    if (!text || text === '—') return;

    var done = function () {
      copyBtn.textContent = '¡Copiado!';
      setTimeout(function () { copyBtn.textContent = 'Copiar'; }, 1400);
    };

    var fallback = function () {
      var area = document.createElement('textarea');
      area.value = text;
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      try { document.execCommand('copy'); done(); } catch (e) { /* sin portapapeles */ }
      document.body.removeChild(area);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, fallback);
    } else {
      fallback();
    }
  }

  backBtn.addEventListener('click', function () {
    var start = input.selectionStart;
    var end = input.selectionEnd;
    if (typeof start !== 'number') return;

    if (start === end) {
      if (start === 0) return;
      input.value = input.value.slice(0, start - 1) + input.value.slice(start);
      start -= 1;
    } else {
      input.value = input.value.slice(0, start) + input.value.slice(end);
    }

    input.focus();
    input.setSelectionRange(start, start);
    update();
  });

  clearBtn.addEventListener('click', function () {
    input.value = '';
    input.focus();
    update();
  });

  copyBtn.addEventListener('click', copyLatex);

  Array.prototype.forEach.call(modeBtns, function (btn) {
    btn.addEventListener('click', function () { setMode(btn.dataset.mode); });
  });

  input.addEventListener('input', update);

  buildTabs();
  buildKeys();
  buildExamples();
  input.placeholder = PLACEHOLDERS.expr;
  update();
})();
