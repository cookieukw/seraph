// --- Helper Functions (Funções Auxiliares) ---
// Estas funções são necessárias para a interpolação de cores do orb.
function lerpColor(a, b, amount) {
  // a e b são números inteiros que representam cores hexadecimais (ex: 0x00BFFF)
  // amount é o valor de interpolação entre 0 e 1.

  const ar = (a >> 16) & 0xff;
  const ag = (a >> 8) & 0xff;
  const ab = a & 0xff;

  const br = (b >> 16) & 0xff;
  const bg = (b >> 8) & 0xff;
  const bb = b & 0xff;

  const rr = Math.round(ar + amount * (br - ar));
  const rg = Math.round(ag + amount * (bg - ag));
  const rb = Math.round(ab + amount * (bb - ab));

  return (rr << 16) + (rg << 8) + (rb | 0);
}

function hexToRgb(hex) {
  // Converte uma string hexadecimal (ex: "#00BFFF") para um objeto {r, g, b}.
  // Remove o '#' se presente.
  const cleanHex = hex.startsWith("#") ? hex.slice(1) : hex;
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return { r, g, b };
}

function rgbToHex(r, g, b) {
  // Converte componentes RGB para uma string hexadecimal (ex: "#00BFFF").
  return (
    "#" +
    ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
  );
}
