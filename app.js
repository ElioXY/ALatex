/* ALatex — editor visual: cada botón inserta una estructura matemática real. */
(function () {
  'use strict';

  var $ = function (sel) { return document.querySelector(sel); };
  var PH = '\\placeholder{}';

  /* Pestañas de más usada a menos usada; dentro de cada una, los botones
     también van de lo más común a lo más específico. */

  /* Cada botón es [etiqueta, LaTeX que se inserta]. */
  var PADS = [
    {
      name: 'Básico',
      cols: 5,
      items: [
        ['7', '7'], ['8', '8'], ['9', '9'], ['÷', '\\frac{' + PH + '}{' + PH + '}'], ['×', '\\times'],
        ['4', '4'], ['5', '5'], ['6', '6'], ['−', '-'], ['+', '+'],
        ['1', '1'], ['2', '2'], ['3', '3'], ['(', '('], [')', ')'],
        ['0', '0'], ['.', '.'], [',', ','], ['=', '='], ['^', '^{' + PH + '}']
      ]
    },
    {
      name: 'Estructuras',
      items: [
        ['a/b', '\\frac{' + PH + '}{' + PH + '}'],
        ['xⁿ', '^{' + PH + '}'],
        ['√x', '\\sqrt{' + PH + '}'],
        ['xₙ', '_{' + PH + '}'],
        ['|x|', '\\left|' + PH + '\\right|'],
        ['ⁿ√x', '\\sqrt[' + PH + ']{' + PH + '}'],
        ['∑', '\\sum_{' + PH + '}^{' + PH + '}' + PH],
        ['∫', '\\int_{' + PH + '}^{' + PH + '}' + PH],
        ['lim', '\\lim_{' + PH + '\\to ' + PH + '}' + PH],
        ['∏', '\\prod_{' + PH + '}^{' + PH + '}' + PH],
        ['n sobre k', '\\binom{' + PH + '}{' + PH + '}'],
        ['d/dx', '\\frac{d}{dx}' + PH],
        ['matriz', '\\begin{pmatrix}' + PH + ' & ' + PH + ' \\\\ ' + PH + ' & ' + PH + '\\end{pmatrix}'],
        ['casos', '\\begin{cases}' + PH + ' & ' + PH + ' \\\\ ' + PH + ' & ' + PH + '\\end{cases}'],
        ['vector', '\\vec{' + PH + '}'],
        ['barra', '\\overline{' + PH + '}'],
        ['hat', '\\hat{' + PH + '}'],
        ['‖x‖', '\\left\\|' + PH + '\\right\\|'],
        ['texto', '\\text{' + PH + '}']
      ]
    },
    {
      name: 'Operadores',
      items: [
        ['≤', '\\le'], ['≥', '\\ge'], ['≠', '\\ne'],
        ['≈', '\\approx'], ['±', '\\pm'], ['∞', '\\infty'],
        ['∂', '\\partial'], ['∑', '\\sum'], ['∫', '\\int'],
        ['∏', '\\prod'], ['·', '\\cdot'], ['×', '\\times'],
        ['≡', '\\equiv'], ['∼', '\\sim'], ['∝', '\\propto'],
        ['∓', '\\mp'], ['∗', '\\ast'], ['∘', '\\circ'],
        ['⊕', '\\oplus'], ['⊗', '\\otimes'], ['≪', '\\ll'],
        ['≫', '\\gg'], ['∇', '\\nabla'], ['∬', '\\iint'],
        ['∮', '\\oint'], ['°', '^{\\circ}'], ['′', "'"],
        ['…', '\\dots'],
        ['⌊x⌋', '\\left\\lfloor ' + PH + '\\right\\rfloor'],
        ['⌈x⌉', '\\left\\lceil ' + PH + '\\right\\rceil']
      ]
    },
    {
      name: 'Funciones',
      items: [
        ['sin', '\\sin\\left(' + PH + '\\right)'],
        ['cos', '\\cos\\left(' + PH + '\\right)'],
        ['tan', '\\tan\\left(' + PH + '\\right)'],
        ['ln', '\\ln\\left(' + PH + '\\right)'],
        ['log', '\\log\\left(' + PH + '\\right)'],
        ['arcsin', '\\arcsin\\left(' + PH + '\\right)'],
        ['arccos', '\\arccos\\left(' + PH + '\\right)'],
        ['arctan', '\\arctan\\left(' + PH + '\\right)'],
        ['exp', '\\exp\\left(' + PH + '\\right)'],
        ['sinh', '\\sinh\\left(' + PH + '\\right)'],
        ['cosh', '\\cosh\\left(' + PH + '\\right)'],
        ['tanh', '\\tanh\\left(' + PH + '\\right)'],
        ['sec', '\\sec\\left(' + PH + '\\right)'],
        ['csc', '\\csc\\left(' + PH + '\\right)'],
        ['cot', '\\cot\\left(' + PH + '\\right)'],
        ['det', '\\det\\left(' + PH + '\\right)'],
        ['máx', '\\max\\left(' + PH + '\\right)'],
        ['mín', '\\min\\left(' + PH + '\\right)'],
        ['gcd', '\\gcd\\left(' + PH + '\\right)']
      ]
    },
    {
      name: 'Griegas',
      items: [
        ['π', '\\pi'], ['α', '\\alpha'], ['β', '\\beta'],
        ['θ', '\\theta'], ['γ', '\\gamma'], ['δ', '\\delta'],
        ['λ', '\\lambda'], ['μ', '\\mu'], ['σ', '\\sigma'],
        ['φ', '\\varphi'], ['ω', '\\omega'], ['ε', '\\epsilon'],
        ['ρ', '\\rho'], ['τ', '\\tau'], ['ν', '\\nu'],
        ['κ', '\\kappa'], ['η', '\\eta'], ['ζ', '\\zeta'],
        ['ι', '\\iota'], ['ξ', '\\xi'], ['χ', '\\chi'],
        ['ψ', '\\psi'], ['υ', '\\upsilon'],
        ['Γ', '\\Gamma'], ['Δ', '\\Delta'], ['Θ', '\\Theta'],
        ['Λ', '\\Lambda'], ['Ξ', '\\Xi'], ['Π', '\\Pi'],
        ['Σ', '\\Sigma'], ['Υ', '\\Upsilon'], ['Φ', '\\Phi'],
        ['Ψ', '\\Psi'], ['Ω', '\\Omega']
      ]
    },
    {
      name: 'Relaciones',
      items: [
        ['→', '\\to'], ['⇒', '\\Rightarrow'], ['∈', '\\in'],
        ['⊆', '\\subseteq'], ['∪', '\\cup'], ['∩', '\\cap'],
        ['⊂', '\\subset'], ['⇔', '\\Leftrightarrow'], ['∅', '\\emptyset'],
        ['∀', '\\forall'], ['∃', '\\exists'], ['↔', '\\leftrightarrow'],
        ['∧', '\\land'], ['∨', '\\lor'], ['¬', '\\neg'],
        ['⊇', '\\supseteq'], ['⊃', '\\supset'], ['∉', '\\notin'],
        ['⊥', '\\perp'], ['∥', '\\parallel'], ['∠', '\\angle'],
        ['∴', '\\therefore'], ['∵', '\\because'], ['←', '\\leftarrow'],
        ['⇐', '\\Leftarrow']
      ]
    }
  ];

  var EXAMPLES = [
    ['Cuadrática', 'x=\\frac{-b\\pm\\sqrt{b^{2}-4ac}}{2a}'],
    ['Suma', '\\sum_{k=1}^{n}k^{2}=\\frac{n(n+1)(2n+1)}{6}'],
    ['Integral', '\\int_{0}^{\\pi}\\sin(x)\\,dx=2'],
    ['Límite', '\\lim_{x\\to 0}\\frac{\\sin x}{x}=1'],
    ['Matriz', '\\begin{pmatrix}a & b \\\\ c & d\\end{pmatrix}'],
    ['Física', 'E=\\frac{1}{2}mv^{2}']
  ];

  var editor = $('#editor');
  var latexEl = $('#latex');
  var tabsEl = $('#tabs');
  var keysEl = $('#keys');
  var examplesEl = $('#examples');
  var copyBtn = $('#copy');
  var clearBtn = $('#clear');
  var undoBtn = $('#undo');

  var state = { pad: 0 };
  var ready = false;

  /* LaTeX limpio: sin los huecos internos (\placeholder) que usa el editor. */
  function currentLatex() {
    if (!ready || !editor) return '';
    try {
      if (typeof editor.getValue === 'function') {
        return (editor.getValue('latex-without-placeholders') || '').trim();
      }
      return (editor.value || '').trim();
    } catch (e) {
      return (editor.value || '').trim();
    }
  }

  function refresh() {
    latexEl.textContent = currentLatex() || '—';
  }

  function buildTabs() {
    tabsEl.innerHTML = '';
    PADS.forEach(function (pad, idx) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tab' + (idx === 0 ? ' is-active' : '');
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
    var pad = PADS[state.pad];
    keysEl.innerHTML = '';
    keysEl.style.gridTemplateColumns = pad.cols ? 'repeat(' + pad.cols + ', minmax(0, 1fr))' : '';
    keysEl.classList.toggle('fixed', !!pad.cols);
    pad.items.forEach(function (item) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'key';
      btn.innerHTML = item[0];
      btn.addEventListener('click', function () { insert(item[1]); });
      keysEl.appendChild(btn);
    });
  }

  function insert(latex) {
    if (!ready || !editor || typeof editor.insert !== 'function') return;
    try { editor.focus(); } catch (e) { /* sin foco */ }
    editor.insert(latex, { format: 'latex', selectionMode: 'placeholder' });
    refresh();
  }

  function buildExamples() {
    examplesEl.innerHTML = '';
    EXAMPLES.forEach(function (ex) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'chip';
      btn.textContent = ex[0];
      btn.addEventListener('click', function () {
        if (!ready) return;
        editor.value = ex[1];
        refresh();
        try { editor.focus(); } catch (e) { /* sin foco */ }
      });
      examplesEl.appendChild(btn);
    });
  }

  function copyLatex() {
    var text = currentLatex();
    latexEl.textContent = text || '—';
    if (!text) return;

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

  editor.addEventListener('input', refresh);

  copyBtn.addEventListener('click', copyLatex);

  clearBtn.addEventListener('click', function () {
    if (!ready) return;
    editor.value = '';
    refresh();
    try { editor.focus(); } catch (e) { /* sin foco */ }
  });

  undoBtn.addEventListener('click', function () {
    if (!ready || typeof editor.executeCommand !== 'function') return;
    try {
      editor.focus();
      editor.executeCommand('undo');
    } catch (e) { /* nada que deshacer */ }
    refresh();
  });

  buildTabs();
  buildKeys();
  buildExamples();
  refresh();

  if (window.customElements && window.customElements.whenDefined) {
    window.customElements.whenDefined('math-field').then(function () {
      ready = true;
      refresh();
      try { editor.focus(); } catch (e) { /* sin foco */ }
    }).catch(function () { ready = false; });
  }
})();
