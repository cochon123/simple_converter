// Conversion rates for each supported unit pair.
const converters = {
  'miles-km': value => value * 1.60934,
  'km-miles': value => value / 1.60934,
  'celsius-fahrenheit': value => value * 9 / 5 + 32,
  'fahrenheit-celsius': value => (value - 32) * 5 / 9
};

const labels = {
  'miles-km': 'km',
  'km-miles': 'miles',
  'celsius-fahrenheit': '\u00B0F',
  'fahrenheit-celsius': '\u00B0C'
};

// Apply a converter to either a single number or a list of numbers.
function convert(conversionKey, input) {
  const fn = converters[conversionKey];
  if (Array.isArray(input)) return input.map(fn);
  return fn(input);
}

// Parse a comma-separated list of numbers, ignoring invalid entries.
function parseList(text) {
  return text
    .split(',')
    .map(v => Number(v.trim()))
    .filter(v => !Number.isNaN(v));
}

function getSelectedKey(panel) {
  const select = document.getElementById(panel + 'Type');
  return select.value;
}

function handleConvertSingle(panel) {
  const input = document.getElementById(panel + 'Single');
  const resultEl = document.getElementById(panel + 'Result');
  const value = Number(input.value);

  if (Number.isNaN(value)) {
    resultEl.textContent = 'Please enter a number.';
    return;
  }

  const key = getSelectedKey(panel);
  const converted = convert(key, value);
  resultEl.textContent = `${value} converts to ${converted.toFixed(2)} ${labels[key]}`;
}

function handleConvertList(panel) {
  const input = document.getElementById(panel + 'List');
  const resultEl = document.getElementById(panel + 'Result');
  const values = parseList(input.value);

  if (values.length === 0) {
    resultEl.textContent = 'Please enter a comma-separated list of numbers.';
    return;
  }

  const key = getSelectedKey(panel);
  const converted = convert(key, values);
  resultEl.textContent = `${converted.map(v => v.toFixed(2)).join(', ')} ${labels[key]}`;
}

// Wire up convert buttons.
document.querySelectorAll('[data-action]').forEach(btn => {
  btn.addEventListener('click', () => {
    const panel = btn.dataset.panel;
    if (btn.dataset.action === 'convert-single') handleConvertSingle(panel);
    if (btn.dataset.action === 'convert-list') handleConvertList(panel);
  });
});

// Wire up tab switching.
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.target;
    document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t === tab));
    document.querySelectorAll('.panel').forEach(p => p.classList.toggle('hidden', p.id !== target));
  });
});
