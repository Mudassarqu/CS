// Binary Math & Representation Utilities according to IBDP Computer Science A1.2.2

export function to8BitBinary(num: number): string {
  const clamped = Math.max(0, Math.min(255, Math.floor(num)));
  return clamped.toString(2).padStart(8, '0');
}

export function from8BitBinary(bin: string): number {
  return parseInt(bin, 2) || 0;
}

// ASCII string to binary array
export function stringToAsciiBinary(str: string): { char: string; code: number; binary: string; isLetter: boolean; isUpper: boolean; isLower: boolean; alphaPos: number | null }[] {
  return str.split('').map((char) => {
    const code = char.charCodeAt(0);
    const binary = to8BitBinary(code);
    const isUpper = code >= 65 && code <= 90;
    const isLower = code >= 97 && code <= 122;
    const isLetter = isUpper || isLower;
    const alphaPos = isUpper ? code - 64 : isLower ? code - 96 : null;
    return { char, code, binary, isLetter, isUpper, isLower, alphaPos };
  });
}

// Convert UTF-8 character to its byte representations
export function charToUtf8Bytes(char: string): { bytes: string[]; hex: string[]; codePoint: number } {
  const encoder = new TextEncoder();
  const encoded = encoder.encode(char);
  const bytes = Array.from(encoded).map(b => b.toString(2).padStart(8, '0'));
  const hex = Array.from(encoded).map(b => '0x' + b.toString(16).toUpperCase().padStart(2, '0'));
  const codePoint = char.codePointAt(0) || 0;
  return { bytes, hex, codePoint };
}

// Sign-magnitude (8-bit)
export function toSignMagnitude(val: number): { binary: string; signBit: number; magnitudeBits: string; valid: boolean } {
  if (val > 127 || val < -127) {
    return { binary: '00000000', signBit: 0, magnitudeBits: '0000000', valid: false };
  }
  const sign = val < 0 ? 1 : 0;
  const mag = Math.abs(val);
  const magBits = mag.toString(2).padStart(7, '0');
  return { binary: `${sign}${magBits}`, signBit: sign, magnitudeBits: magBits, valid: true };
}

// One's complement (8-bit)
export function toOnesComplement(val: number): { binary: string; valid: boolean; invertedFrom?: string } {
  if (val > 127 || val < -127) {
    return { binary: '00000000', valid: false };
  }
  if (val >= 0) {
    return { binary: val.toString(2).padStart(8, '0'), valid: true };
  }
  const posBin = Math.abs(val).toString(2).padStart(8, '0');
  const inverted = posBin.split('').map(b => (b === '0' ? '1' : '0')).join('');
  return { binary: inverted, valid: true, invertedFrom: posBin };
}

// Two's complement (8-bit, range -128 to +127)
export function toTwosComplement(val: number): { 
  binary: string; 
  positiveBinary: string; 
  invertedBits: string; 
  addedOneBinary: string; 
  valid: boolean 
} {
  if (val > 127 || val < -128) {
    return { binary: '00000000', positiveBinary: '00000000', invertedBits: '00000000', addedOneBinary: '00000000', valid: false };
  }
  if (val >= 0) {
    const bin = val.toString(2).padStart(8, '0');
    return { binary: bin, positiveBinary: bin, invertedBits: bin, addedOneBinary: bin, valid: true };
  }

  // Negative number
  if (val === -128) {
    return {
      binary: '10000000',
      positiveBinary: '10000000 (special min bound)',
      invertedBits: '01111111',
      addedOneBinary: '10000000',
      valid: true
    };
  }

  const absVal = Math.abs(val);
  const posBin = absVal.toString(2).padStart(8, '0');
  const inverted = posBin.split('').map(b => (b === '0' ? '1' : '0')).join('');
  
  // Add 1 to inverted
  let carry = 1;
  const result: string[] = [];
  for (let i = 7; i >= 0; i--) {
    const bit = parseInt(inverted[i]);
    const sum = bit + carry;
    result.unshift((sum % 2).toString());
    carry = Math.floor(sum / 2);
  }
  const twos = result.join('');

  return {
    binary: twos,
    positiveBinary: posBin,
    invertedBits: inverted,
    addedOneBinary: twos,
    valid: true
  };
}

// Binary Coded Decimal (BCD)
export function toBCD(val: number): { bcdParts: { digit: number; bcd: string }[]; fullBcd: string; valid: boolean } {
  if (val < 0) return { bcdParts: [], fullBcd: '', valid: false };
  const str = Math.abs(Math.floor(val)).toString();
  const bcdParts = str.split('').map(d => {
    const num = parseInt(d);
    return { digit: num, bcd: num.toString(2).padStart(4, '0') };
  });
  return { bcdParts, fullBcd: bcdParts.map(p => p.bcd).join(' '), valid: true };
}

// Gray Code (Reflected Binary Code)
export function toGrayCode(val: number): { standardBinary: string; grayBinary: string } {
  const n = Math.max(0, Math.min(255, Math.floor(val)));
  const std = n.toString(2).padStart(8, '0');
  const grayInt = n ^ (n >> 1);
  const gray = grayInt.toString(2).padStart(8, '0');
  return { standardBinary: std, grayBinary: gray };
}

// Fixed-point (4-bit integer, 4-bit fraction)
export function toFixedPoint4_4(val: number): {
  integerPart: number;
  fractionPart: number;
  integerBits: string;
  fractionBits: string;
  combined: string;
  evaluatedValue: number;
  valid: boolean;
} {
  if (val < 0 || val > 15.9375) {
    return { integerPart: 0, fractionPart: 0, integerBits: '0000', fractionBits: '0000', combined: '0000.0000', evaluatedValue: 0, valid: false };
  }
  const intPart = Math.floor(val);
  const fracPart = val - intPart;

  const intBits = intPart.toString(2).padStart(4, '0');
  
  // 4 fractional bits: 0.5, 0.25, 0.125, 0.0625
  const fracUnits = [0.5, 0.25, 0.125, 0.0625];
  let remainingFrac = fracPart;
  const fBits: string[] = [];
  let evaluatedFrac = 0;

  for (const unit of fracUnits) {
    if (remainingFrac >= unit - 0.00001) {
      fBits.push('1');
      remainingFrac -= unit;
      evaluatedFrac += unit;
    } else {
      fBits.push('0');
    }
  }

  const fractionBits = fBits.join('');
  return {
    integerPart: intPart,
    fractionPart: fracPart,
    integerBits: intBits,
    fractionBits: fractionBits,
    combined: `${intBits}.${fractionBits}`,
    evaluatedValue: intPart + evaluatedFrac,
    valid: true
  };
}

// IEEE-754 Single Precision 32-bit Floating Point breakdown
export function toIEEE754(val: number): {
  signBit: string;
  exponentBits: string;
  mantissaBits: string;
  unbiasedExponent: number;
  biasedExponent: number;
  scientificForm: string;
  binaryString: string;
  hex: string;
} {
  const buffer = new ArrayBuffer(4);
  const view = new DataView(buffer);
  view.setFloat32(0, val, false); // big-endian
  const uint32 = view.getUint32(0, false);
  const bin32 = uint32.toString(2).padStart(32, '0');

  const signBit = bin32.charAt(0);
  const exponentBits = bin32.substring(1, 9);
  const mantissaBits = bin32.substring(9);
  const biasedExponent = parseInt(exponentBits, 2);
  const unbiasedExponent = biasedExponent - 127;
  const hex = '0x' + uint32.toString(16).toUpperCase().padStart(8, '0');

  return {
    signBit,
    exponentBits,
    mantissaBits,
    unbiasedExponent,
    biasedExponent,
    scientificForm: `1.${mantissaBits.slice(0, 6)}... × 2^(${unbiasedExponent})`,
    binaryString: `${signBit} ${exponentBits} ${mantissaBits}`,
    hex
  };
}
