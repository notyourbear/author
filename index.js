(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by rollup-plugin-commonjs');
}



function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var alea = createCommonjsModule(function (module) {
// A port of an algorithm by Johannes Baagøe <baagoe@baagoe.com>, 2010
// http://baagoe.com/en/RandomMusings/javascript/
// https://github.com/nquinlan/better-random-numbers-for-javascript-mirror
// Original work is under MIT license -

// Copyright (C) 2010 by Johannes Baagøe <baagoe@baagoe.org>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.



(function(global, module, define) {

function Alea(seed) {
  var me = this, mash = Mash();

  me.next = function() {
    var t = 2091639 * me.s0 + me.c * 2.3283064365386963e-10; // 2^-32
    me.s0 = me.s1;
    me.s1 = me.s2;
    return me.s2 = t - (me.c = t | 0);
  };

  // Apply the seeding algorithm from Baagoe.
  me.c = 1;
  me.s0 = mash(' ');
  me.s1 = mash(' ');
  me.s2 = mash(' ');
  me.s0 -= mash(seed);
  if (me.s0 < 0) { me.s0 += 1; }
  me.s1 -= mash(seed);
  if (me.s1 < 0) { me.s1 += 1; }
  me.s2 -= mash(seed);
  if (me.s2 < 0) { me.s2 += 1; }
  mash = null;
}

function copy(f, t) {
  t.c = f.c;
  t.s0 = f.s0;
  t.s1 = f.s1;
  t.s2 = f.s2;
  return t;
}

function impl(seed, opts) {
  var xg = new Alea(seed),
      state = opts && opts.state,
      prng = xg.next;
  prng.int32 = function() { return (xg.next() * 0x100000000) | 0; };
  prng.double = function() {
    return prng() + (prng() * 0x200000 | 0) * 1.1102230246251565e-16; // 2^-53
  };
  prng.quick = prng;
  if (state) {
    if (typeof(state) == 'object') copy(state, xg);
    prng.state = function() { return copy(xg, {}); };
  }
  return prng;
}

function Mash() {
  var n = 0xefc8249d;

  var mash = function(data) {
    data = data.toString();
    for (var i = 0; i < data.length; i++) {
      n += data.charCodeAt(i);
      var h = 0.02519603282416938 * n;
      n = h >>> 0;
      h -= n;
      h *= n;
      n = h >>> 0;
      h -= n;
      n += h * 0x100000000; // 2^32
    }
    return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
  };

  return mash;
}


if (module && module.exports) {
  module.exports = impl;
} else if (define && define.amd) {
  define(function() { return impl; });
} else {
  this.alea = impl;
}

})(
  commonjsGlobal,
  ('object') == 'object' && module,    // present in node.js
  (typeof undefined) == 'function' && undefined   // present with an AMD loader
);
});

var xor128 = createCommonjsModule(function (module) {
// A Javascript implementaion of the "xor128" prng algorithm by
// George Marsaglia.  See http://www.jstatsoft.org/v08/i14/paper

(function(global, module, define) {

function XorGen(seed) {
  var me = this, strseed = '';

  me.x = 0;
  me.y = 0;
  me.z = 0;
  me.w = 0;

  // Set up generator function.
  me.next = function() {
    var t = me.x ^ (me.x << 11);
    me.x = me.y;
    me.y = me.z;
    me.z = me.w;
    return me.w ^= (me.w >>> 19) ^ t ^ (t >>> 8);
  };

  if (seed === (seed | 0)) {
    // Integer seed.
    me.x = seed;
  } else {
    // String seed.
    strseed += seed;
  }

  // Mix in string seed, then discard an initial batch of 64 values.
  for (var k = 0; k < strseed.length + 64; k++) {
    me.x ^= strseed.charCodeAt(k) | 0;
    me.next();
  }
}

function copy(f, t) {
  t.x = f.x;
  t.y = f.y;
  t.z = f.z;
  t.w = f.w;
  return t;
}

function impl(seed, opts) {
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (typeof(state) == 'object') copy(state, xg);
    prng.state = function() { return copy(xg, {}); };
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (define && define.amd) {
  define(function() { return impl; });
} else {
  this.xor128 = impl;
}

})(
  commonjsGlobal,
  ('object') == 'object' && module,    // present in node.js
  (typeof undefined) == 'function' && undefined   // present with an AMD loader
);
});

var xorwow = createCommonjsModule(function (module) {
// A Javascript implementaion of the "xorwow" prng algorithm by
// George Marsaglia.  See http://www.jstatsoft.org/v08/i14/paper

(function(global, module, define) {

function XorGen(seed) {
  var me = this, strseed = '';

  // Set up generator function.
  me.next = function() {
    var t = (me.x ^ (me.x >>> 2));
    me.x = me.y; me.y = me.z; me.z = me.w; me.w = me.v;
    return (me.d = (me.d + 362437 | 0)) +
       (me.v = (me.v ^ (me.v << 4)) ^ (t ^ (t << 1))) | 0;
  };

  me.x = 0;
  me.y = 0;
  me.z = 0;
  me.w = 0;
  me.v = 0;

  if (seed === (seed | 0)) {
    // Integer seed.
    me.x = seed;
  } else {
    // String seed.
    strseed += seed;
  }

  // Mix in string seed, then discard an initial batch of 64 values.
  for (var k = 0; k < strseed.length + 64; k++) {
    me.x ^= strseed.charCodeAt(k) | 0;
    if (k == strseed.length) {
      me.d = me.x << 10 ^ me.x >>> 4;
    }
    me.next();
  }
}

function copy(f, t) {
  t.x = f.x;
  t.y = f.y;
  t.z = f.z;
  t.w = f.w;
  t.v = f.v;
  t.d = f.d;
  return t;
}

function impl(seed, opts) {
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (typeof(state) == 'object') copy(state, xg);
    prng.state = function() { return copy(xg, {}); };
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (define && define.amd) {
  define(function() { return impl; });
} else {
  this.xorwow = impl;
}

})(
  commonjsGlobal,
  ('object') == 'object' && module,    // present in node.js
  (typeof undefined) == 'function' && undefined   // present with an AMD loader
);
});

var xorshift7 = createCommonjsModule(function (module) {
// A Javascript implementaion of the "xorshift7" algorithm by
// François Panneton and Pierre L'ecuyer:
// "On the Xorgshift Random Number Generators"
// http://saluc.engr.uconn.edu/refs/crypto/rng/panneton05onthexorshift.pdf

(function(global, module, define) {

function XorGen(seed) {
  var me = this;

  // Set up generator function.
  me.next = function() {
    // Update xor generator.
    var X = me.x, i = me.i, t, v;
    t = X[i]; t ^= (t >>> 7); v = t ^ (t << 24);
    t = X[(i + 1) & 7]; v ^= t ^ (t >>> 10);
    t = X[(i + 3) & 7]; v ^= t ^ (t >>> 3);
    t = X[(i + 4) & 7]; v ^= t ^ (t << 7);
    t = X[(i + 7) & 7]; t = t ^ (t << 13); v ^= t ^ (t << 9);
    X[i] = v;
    me.i = (i + 1) & 7;
    return v;
  };

  function init(me, seed) {
    var j, w, X = [];

    if (seed === (seed | 0)) {
      // Seed state array using a 32-bit integer.
      w = X[0] = seed;
    } else {
      // Seed state using a string.
      seed = '' + seed;
      for (j = 0; j < seed.length; ++j) {
        X[j & 7] = (X[j & 7] << 15) ^
            (seed.charCodeAt(j) + X[(j + 1) & 7] << 13);
      }
    }
    // Enforce an array length of 8, not all zeroes.
    while (X.length < 8) X.push(0);
    for (j = 0; j < 8 && X[j] === 0; ++j);
    if (j == 8) w = X[7] = -1; else w = X[j];

    me.x = X;
    me.i = 0;

    // Discard an initial 256 values.
    for (j = 256; j > 0; --j) {
      me.next();
    }
  }

  init(me, seed);
}

function copy(f, t) {
  t.x = f.x.slice();
  t.i = f.i;
  return t;
}

function impl(seed, opts) {
  if (seed == null) seed = +(new Date);
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (state.x) copy(state, xg);
    prng.state = function() { return copy(xg, {}); };
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (define && define.amd) {
  define(function() { return impl; });
} else {
  this.xorshift7 = impl;
}

})(
  commonjsGlobal,
  ('object') == 'object' && module,    // present in node.js
  (typeof undefined) == 'function' && undefined   // present with an AMD loader
);
});

var xor4096 = createCommonjsModule(function (module) {
// A Javascript implementaion of Richard Brent's Xorgens xor4096 algorithm.
//
// This fast non-cryptographic random number generator is designed for
// use in Monte-Carlo algorithms. It combines a long-period xorshift
// generator with a Weyl generator, and it passes all common batteries
// of stasticial tests for randomness while consuming only a few nanoseconds
// for each prng generated.  For background on the generator, see Brent's
// paper: "Some long-period random number generators using shifts and xors."
// http://arxiv.org/pdf/1004.3115v1.pdf
//
// Usage:
//
// var xor4096 = require('xor4096');
// random = xor4096(1);                        // Seed with int32 or string.
// assert.equal(random(), 0.1520436450538547); // (0, 1) range, 53 bits.
// assert.equal(random.int32(), 1806534897);   // signed int32, 32 bits.
//
// For nonzero numeric keys, this impelementation provides a sequence
// identical to that by Brent's xorgens 3 implementaion in C.  This
// implementation also provides for initalizing the generator with
// string seeds, or for saving and restoring the state of the generator.
//
// On Chrome, this prng benchmarks about 2.1 times slower than
// Javascript's built-in Math.random().

(function(global, module, define) {

function XorGen(seed) {
  var me = this;

  // Set up generator function.
  me.next = function() {
    var w = me.w,
        X = me.X, i = me.i, t, v;
    // Update Weyl generator.
    me.w = w = (w + 0x61c88647) | 0;
    // Update xor generator.
    v = X[(i + 34) & 127];
    t = X[i = ((i + 1) & 127)];
    v ^= v << 13;
    t ^= t << 17;
    v ^= v >>> 15;
    t ^= t >>> 12;
    // Update Xor generator array state.
    v = X[i] = v ^ t;
    me.i = i;
    // Result is the combination.
    return (v + (w ^ (w >>> 16))) | 0;
  };

  function init(me, seed) {
    var t, v, i, j, w, X = [], limit = 128;
    if (seed === (seed | 0)) {
      // Numeric seeds initialize v, which is used to generates X.
      v = seed;
      seed = null;
    } else {
      // String seeds are mixed into v and X one character at a time.
      seed = seed + '\0';
      v = 0;
      limit = Math.max(limit, seed.length);
    }
    // Initialize circular array and weyl value.
    for (i = 0, j = -32; j < limit; ++j) {
      // Put the unicode characters into the array, and shuffle them.
      if (seed) v ^= seed.charCodeAt((j + 32) % seed.length);
      // After 32 shuffles, take v as the starting w value.
      if (j === 0) w = v;
      v ^= v << 10;
      v ^= v >>> 15;
      v ^= v << 4;
      v ^= v >>> 13;
      if (j >= 0) {
        w = (w + 0x61c88647) | 0;     // Weyl.
        t = (X[j & 127] ^= (v + w));  // Combine xor and weyl to init array.
        i = (0 == t) ? i + 1 : 0;     // Count zeroes.
      }
    }
    // We have detected all zeroes; make the key nonzero.
    if (i >= 128) {
      X[(seed && seed.length || 0) & 127] = -1;
    }
    // Run the generator 512 times to further mix the state before using it.
    // Factoring this as a function slows the main generator, so it is just
    // unrolled here.  The weyl generator is not advanced while warming up.
    i = 127;
    for (j = 4 * 128; j > 0; --j) {
      v = X[(i + 34) & 127];
      t = X[i = ((i + 1) & 127)];
      v ^= v << 13;
      t ^= t << 17;
      v ^= v >>> 15;
      t ^= t >>> 12;
      X[i] = v ^ t;
    }
    // Storing state as object members is faster than using closure variables.
    me.w = w;
    me.X = X;
    me.i = i;
  }

  init(me, seed);
}

function copy(f, t) {
  t.i = f.i;
  t.w = f.w;
  t.X = f.X.slice();
  return t;
}

function impl(seed, opts) {
  if (seed == null) seed = +(new Date);
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (state.X) copy(state, xg);
    prng.state = function() { return copy(xg, {}); };
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (define && define.amd) {
  define(function() { return impl; });
} else {
  this.xor4096 = impl;
}

})(
  commonjsGlobal,                                     // window object or global
  ('object') == 'object' && module,    // present in node.js
  (typeof undefined) == 'function' && undefined   // present with an AMD loader
);
});

var tychei = createCommonjsModule(function (module) {
// A Javascript implementaion of the "Tyche-i" prng algorithm by
// Samuel Neves and Filipe Araujo.
// See https://eden.dei.uc.pt/~sneves/pubs/2011-snfa2.pdf

(function(global, module, define) {

function XorGen(seed) {
  var me = this, strseed = '';

  // Set up generator function.
  me.next = function() {
    var b = me.b, c = me.c, d = me.d, a = me.a;
    b = (b << 25) ^ (b >>> 7) ^ c;
    c = (c - d) | 0;
    d = (d << 24) ^ (d >>> 8) ^ a;
    a = (a - b) | 0;
    me.b = b = (b << 20) ^ (b >>> 12) ^ c;
    me.c = c = (c - d) | 0;
    me.d = (d << 16) ^ (c >>> 16) ^ a;
    return me.a = (a - b) | 0;
  };

  /* The following is non-inverted tyche, which has better internal
   * bit diffusion, but which is about 25% slower than tyche-i in JS.
  me.next = function() {
    var a = me.a, b = me.b, c = me.c, d = me.d;
    a = (me.a + me.b | 0) >>> 0;
    d = me.d ^ a; d = d << 16 ^ d >>> 16;
    c = me.c + d | 0;
    b = me.b ^ c; b = b << 12 ^ d >>> 20;
    me.a = a = a + b | 0;
    d = d ^ a; me.d = d = d << 8 ^ d >>> 24;
    me.c = c = c + d | 0;
    b = b ^ c;
    return me.b = (b << 7 ^ b >>> 25);
  }
  */

  me.a = 0;
  me.b = 0;
  me.c = 2654435769 | 0;
  me.d = 1367130551;

  if (seed === Math.floor(seed)) {
    // Integer seed.
    me.a = (seed / 0x100000000) | 0;
    me.b = seed | 0;
  } else {
    // String seed.
    strseed += seed;
  }

  // Mix in string seed, then discard an initial batch of 64 values.
  for (var k = 0; k < strseed.length + 20; k++) {
    me.b ^= strseed.charCodeAt(k) | 0;
    me.next();
  }
}

function copy(f, t) {
  t.a = f.a;
  t.b = f.b;
  t.c = f.c;
  t.d = f.d;
  return t;
}

function impl(seed, opts) {
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (typeof(state) == 'object') copy(state, xg);
    prng.state = function() { return copy(xg, {}); };
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (define && define.amd) {
  define(function() { return impl; });
} else {
  this.tychei = impl;
}

})(
  commonjsGlobal,
  ('object') == 'object' && module,    // present in node.js
  (typeof undefined) == 'function' && undefined   // present with an AMD loader
);
});

var empty = {};


var empty$1 = Object.freeze({
	default: empty
});

var require$$0 = ( empty$1 && empty ) || empty$1;

var seedrandom = createCommonjsModule(function (module) {
/*
Copyright 2014 David Bau.

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

(function (pool, math) {
//
// The following constants are related to IEEE 754 limits.
//
var global = this,
    width = 256,        // each RC4 output is 0 <= x < 256
    chunks = 6,         // at least six RC4 outputs for each double
    digits = 52,        // there are 52 significant digits in a double
    rngname = 'random', // rngname: name for Math.random and Math.seedrandom
    startdenom = math.pow(width, chunks),
    significance = math.pow(2, digits),
    overflow = significance * 2,
    mask = width - 1,
    nodecrypto;         // node.js crypto module, initialized at the bottom.

//
// seedrandom()
// This is the seedrandom function described above.
//
function seedrandom(seed, options, callback) {
  var key = [];
  options = (options == true) ? { entropy: true } : (options || {});

  // Flatten the seed string or build one from local entropy if needed.
  var shortseed = mixkey(flatten(
    options.entropy ? [seed, tostring(pool)] :
    (seed == null) ? autoseed() : seed, 3), key);

  // Use the seed to initialize an ARC4 generator.
  var arc4 = new ARC4(key);

  // This function returns a random double in [0, 1) that contains
  // randomness in every bit of the mantissa of the IEEE 754 value.
  var prng = function() {
    var n = arc4.g(chunks),             // Start with a numerator n < 2 ^ 48
        d = startdenom,                 //   and denominator d = 2 ^ 48.
        x = 0;                          //   and no 'extra last byte'.
    while (n < significance) {          // Fill up all significant digits by
      n = (n + x) * width;              //   shifting numerator and
      d *= width;                       //   denominator and generating a
      x = arc4.g(1);                    //   new least-significant-byte.
    }
    while (n >= overflow) {             // To avoid rounding up, before adding
      n /= 2;                           //   last byte, shift everything
      d /= 2;                           //   right using integer math until
      x >>>= 1;                         //   we have exactly the desired bits.
    }
    return (n + x) / d;                 // Form the number within [0, 1).
  };

  prng.int32 = function() { return arc4.g(4) | 0; };
  prng.quick = function() { return arc4.g(4) / 0x100000000; };
  prng.double = prng;

  // Mix the randomness into accumulated entropy.
  mixkey(tostring(arc4.S), pool);

  // Calling convention: what to return as a function of prng, seed, is_math.
  return (options.pass || callback ||
      function(prng, seed, is_math_call, state) {
        if (state) {
          // Load the arc4 state from the given state if it has an S array.
          if (state.S) { copy(state, arc4); }
          // Only provide the .state method if requested via options.state.
          prng.state = function() { return copy(arc4, {}); };
        }

        // If called as a method of Math (Math.seedrandom()), mutate
        // Math.random because that is how seedrandom.js has worked since v1.0.
        if (is_math_call) { math[rngname] = prng; return seed; }

        // Otherwise, it is a newer calling convention, so return the
        // prng directly.
        else return prng;
      })(
  prng,
  shortseed,
  'global' in options ? options.global : (this == math),
  options.state);
}
math['seed' + rngname] = seedrandom;

//
// ARC4
//
// An ARC4 implementation.  The constructor takes a key in the form of
// an array of at most (width) integers that should be 0 <= x < (width).
//
// The g(count) method returns a pseudorandom integer that concatenates
// the next (count) outputs from ARC4.  Its return value is a number x
// that is in the range 0 <= x < (width ^ count).
//
function ARC4(key) {
  var t, keylen = key.length,
      me = this, i = 0, j = me.i = me.j = 0, s = me.S = [];

  // The empty key [] is treated as [0].
  if (!keylen) { key = [keylen++]; }

  // Set up S using the standard key scheduling algorithm.
  while (i < width) {
    s[i] = i++;
  }
  for (i = 0; i < width; i++) {
    s[i] = s[j = mask & (j + key[i % keylen] + (t = s[i]))];
    s[j] = t;
  }

  // The "g" method returns the next (count) outputs as one number.
  (me.g = function(count) {
    // Using instance members instead of closure state nearly doubles speed.
    var t, r = 0,
        i = me.i, j = me.j, s = me.S;
    while (count--) {
      t = s[i = mask & (i + 1)];
      r = r * width + s[mask & ((s[i] = s[j = mask & (j + t)]) + (s[j] = t))];
    }
    me.i = i; me.j = j;
    return r;
    // For robust unpredictability, the function call below automatically
    // discards an initial batch of values.  This is called RC4-drop[256].
    // See http://google.com/search?q=rsa+fluhrer+response&btnI
  })(width);
}

//
// copy()
// Copies internal state of ARC4 to or from a plain object.
//
function copy(f, t) {
  t.i = f.i;
  t.j = f.j;
  t.S = f.S.slice();
  return t;
}

//
// flatten()
// Converts an object tree to nested arrays of strings.
//
function flatten(obj, depth) {
  var result = [], typ = (typeof obj), prop;
  if (depth && typ == 'object') {
    for (prop in obj) {
      try { result.push(flatten(obj[prop], depth - 1)); } catch (e) {}
    }
  }
  return (result.length ? result : typ == 'string' ? obj : obj + '\0');
}

//
// mixkey()
// Mixes a string seed into a key that is an array of integers, and
// returns a shortened string seed that is equivalent to the result key.
//
function mixkey(seed, key) {
  var stringseed = seed + '', smear, j = 0;
  while (j < stringseed.length) {
    key[mask & j] =
      mask & ((smear ^= key[mask & j] * 19) + stringseed.charCodeAt(j++));
  }
  return tostring(key);
}

//
// autoseed()
// Returns an object for autoseeding, using window.crypto and Node crypto
// module if available.
//
function autoseed() {
  try {
    var out;
    if (nodecrypto && (out = nodecrypto.randomBytes)) {
      // The use of 'out' to remember randomBytes makes tight minified code.
      out = out(width);
    } else {
      out = new Uint8Array(width);
      (global.crypto || global.msCrypto).getRandomValues(out);
    }
    return tostring(out);
  } catch (e) {
    var browser = global.navigator,
        plugins = browser && browser.plugins;
    return [+new Date, global, plugins, global.screen, tostring(pool)];
  }
}

//
// tostring()
// Converts an array of charcodes to a string
//
function tostring(a) {
  return String.fromCharCode.apply(0, a);
}

//
// When seedrandom.js is loaded, we immediately mix a few bits
// from the built-in RNG into the entropy pool.  Because we do
// not want to interfere with deterministic PRNG state later,
// seedrandom will not call math.random on its own again after
// initialization.
//
mixkey(math.random(), pool);

//
// Nodejs and AMD support: export the implementation as a module using
// either convention.
//
if (('object') == 'object' && module.exports) {
  module.exports = seedrandom;
  // When in node.js, try using crypto package for autoseeding.
  try {
    nodecrypto = require$$0;
  } catch (ex) {}
} else if ((typeof undefined) == 'function' && undefined.amd) {
  undefined(function() { return seedrandom; });
}

// End anonymous scope, and pass initial values.
})(
  [],     // pool: entropy pool starts empty
  Math    // math: package containing random, pow, and seedrandom
);
});

// A library of seedable RNGs implemented in Javascript.
//
// Usage:
//
// var seedrandom = require('seedrandom');
// var random = seedrandom(1); // or any seed.
// var x = random();       // 0 <= x < 1.  Every bit is random.
// var x = random.quick(); // 0 <= x < 1.  32 bits of randomness.

// alea, a 53-bit multiply-with-carry generator by Johannes Baagøe.
// Period: ~2^116
// Reported to pass all BigCrush tests.


// xor128, a pure xor-shift generator by George Marsaglia.
// Period: 2^128-1.
// Reported to fail: MatrixRank and LinearComp.


// xorwow, George Marsaglia's 160-bit xor-shift combined plus weyl.
// Period: 2^192-2^32
// Reported to fail: CollisionOver, SimpPoker, and LinearComp.


// xorshift7, by François Panneton and Pierre L'ecuyer, takes
// a different approach: it adds robustness by allowing more shifts
// than Marsaglia's original three.  It is a 7-shift generator
// with 256 bits, that passes BigCrush with no systmatic failures.
// Period 2^256-1.
// No systematic BigCrush failures reported.


// xor4096, by Richard Brent, is a 4096-bit xor-shift with a
// very long period that also adds a Weyl generator. It also passes
// BigCrush with no systematic failures.  Its long period may
// be useful if you have many generators and need to avoid
// collisions.
// Period: 2^4128-2^32.
// No systematic BigCrush failures reported.


// Tyche-i, by Samuel Neves and Filipe Araujo, is a bit-shifting random
// number generator derived from ChaCha, a modern stream cipher.
// https://eden.dei.uc.pt/~sneves/pubs/2011-snfa2.pdf
// Period: ~2^127
// No systematic BigCrush failures reported.


// The original ARC4-based prng included in this library.
// Period: ~2^1600


seedrandom.alea = alea;
seedrandom.xor128 = xor128;
seedrandom.xorwow = xorwow;
seedrandom.xorshift7 = xorshift7;
seedrandom.xor4096 = xor4096;
seedrandom.tychei = tychei;

var seedrandom$2 = seedrandom;

var pluralize = createCommonjsModule(function (module, exports) {
/* global define */

(function (root, pluralize) {
  /* istanbul ignore else */
  if (typeof commonjsRequire === 'function' && 'object' === 'object' && 'object' === 'object') {
    // Node.
    module.exports = pluralize();
  } else if (typeof undefined === 'function' && undefined.amd) {
    // AMD, registers as an anonymous module.
    undefined(function () {
      return pluralize();
    });
  } else {
    // Browser global.
    root.pluralize = pluralize();
  }
})(commonjsGlobal, function () {
  // Rule storage - pluralize and singularize need to be run sequentially,
  // while other rules can be optimized using an object for instant lookups.
  var pluralRules = [];
  var singularRules = [];
  var uncountables = {};
  var irregularPlurals = {};
  var irregularSingles = {};

  /**
   * Sanitize a pluralization rule to a usable regular expression.
   *
   * @param  {(RegExp|string)} rule
   * @return {RegExp}
   */
  function sanitizeRule (rule) {
    if (typeof rule === 'string') {
      return new RegExp('^' + rule + '$', 'i');
    }

    return rule;
  }

  /**
   * Pass in a word token to produce a function that can replicate the case on
   * another word.
   *
   * @param  {string}   word
   * @param  {string}   token
   * @return {Function}
   */
  function restoreCase (word, token) {
    // Tokens are an exact match.
    if (word === token) return token;

    // Upper cased words. E.g. "HELLO".
    if (word === word.toUpperCase()) return token.toUpperCase();

    // Title cased words. E.g. "Title".
    if (word[0] === word[0].toUpperCase()) {
      return token.charAt(0).toUpperCase() + token.substr(1).toLowerCase();
    }

    // Lower cased words. E.g. "test".
    return token.toLowerCase();
  }

  /**
   * Interpolate a regexp string.
   *
   * @param  {string} str
   * @param  {Array}  args
   * @return {string}
   */
  function interpolate (str, args) {
    return str.replace(/\$(\d{1,2})/g, function (match, index) {
      return args[index] || '';
    });
  }

  /**
   * Replace a word using a rule.
   *
   * @param  {string} word
   * @param  {Array}  rule
   * @return {string}
   */
  function replace (word, rule) {
    return word.replace(rule[0], function (match, index) {
      var result = interpolate(rule[1], arguments);

      if (match === '') {
        return restoreCase(word[index - 1], result);
      }

      return restoreCase(match, result);
    });
  }

  /**
   * Sanitize a word by passing in the word and sanitization rules.
   *
   * @param  {string}   token
   * @param  {string}   word
   * @param  {Array}    rules
   * @return {string}
   */
  function sanitizeWord (token, word, rules) {
    // Empty string or doesn't need fixing.
    if (!token.length || uncountables.hasOwnProperty(token)) {
      return word;
    }

    var len = rules.length;

    // Iterate over the sanitization rules and use the first one to match.
    while (len--) {
      var rule = rules[len];

      if (rule[0].test(word)) return replace(word, rule);
    }

    return word;
  }

  /**
   * Replace a word with the updated word.
   *
   * @param  {Object}   replaceMap
   * @param  {Object}   keepMap
   * @param  {Array}    rules
   * @return {Function}
   */
  function replaceWord (replaceMap, keepMap, rules) {
    return function (word) {
      // Get the correct token and case restoration functions.
      var token = word.toLowerCase();

      // Check against the keep object map.
      if (keepMap.hasOwnProperty(token)) {
        return restoreCase(word, token);
      }

      // Check against the replacement map for a direct word replacement.
      if (replaceMap.hasOwnProperty(token)) {
        return restoreCase(word, replaceMap[token]);
      }

      // Run all the rules against the word.
      return sanitizeWord(token, word, rules);
    };
  }

  /**
   * Check if a word is part of the map.
   */
  function checkWord (replaceMap, keepMap, rules, bool) {
    return function (word) {
      var token = word.toLowerCase();

      if (keepMap.hasOwnProperty(token)) return true;
      if (replaceMap.hasOwnProperty(token)) return false;

      return sanitizeWord(token, token, rules) === token;
    };
  }

  /**
   * Pluralize or singularize a word based on the passed in count.
   *
   * @param  {string}  word
   * @param  {number}  count
   * @param  {boolean} inclusive
   * @return {string}
   */
  function pluralize (word, count, inclusive) {
    var pluralized = count === 1
      ? pluralize.singular(word) : pluralize.plural(word);

    return (inclusive ? count + ' ' : '') + pluralized;
  }

  /**
   * Pluralize a word.
   *
   * @type {Function}
   */
  pluralize.plural = replaceWord(
    irregularSingles, irregularPlurals, pluralRules
  );

  /**
   * Check if a word is plural.
   *
   * @type {Function}
   */
  pluralize.isPlural = checkWord(
    irregularSingles, irregularPlurals, pluralRules
  );

  /**
   * Singularize a word.
   *
   * @type {Function}
   */
  pluralize.singular = replaceWord(
    irregularPlurals, irregularSingles, singularRules
  );

  /**
   * Check if a word is singular.
   *
   * @type {Function}
   */
  pluralize.isSingular = checkWord(
    irregularPlurals, irregularSingles, singularRules
  );

  /**
   * Add a pluralization rule to the collection.
   *
   * @param {(string|RegExp)} rule
   * @param {string}          replacement
   */
  pluralize.addPluralRule = function (rule, replacement) {
    pluralRules.push([sanitizeRule(rule), replacement]);
  };

  /**
   * Add a singularization rule to the collection.
   *
   * @param {(string|RegExp)} rule
   * @param {string}          replacement
   */
  pluralize.addSingularRule = function (rule, replacement) {
    singularRules.push([sanitizeRule(rule), replacement]);
  };

  /**
   * Add an uncountable word rule.
   *
   * @param {(string|RegExp)} word
   */
  pluralize.addUncountableRule = function (word) {
    if (typeof word === 'string') {
      uncountables[word.toLowerCase()] = true;
      return;
    }

    // Set singular and plural references for the word.
    pluralize.addPluralRule(word, '$0');
    pluralize.addSingularRule(word, '$0');
  };

  /**
   * Add an irregular word definition.
   *
   * @param {string} single
   * @param {string} plural
   */
  pluralize.addIrregularRule = function (single, plural) {
    plural = plural.toLowerCase();
    single = single.toLowerCase();

    irregularSingles[single] = plural;
    irregularPlurals[plural] = single;
  };

  /**
   * Irregular rules.
   */
  [
    // Pronouns.
    ['I', 'we'],
    ['me', 'us'],
    ['he', 'they'],
    ['she', 'they'],
    ['them', 'them'],
    ['myself', 'ourselves'],
    ['yourself', 'yourselves'],
    ['itself', 'themselves'],
    ['herself', 'themselves'],
    ['himself', 'themselves'],
    ['themself', 'themselves'],
    ['is', 'are'],
    ['was', 'were'],
    ['has', 'have'],
    ['this', 'these'],
    ['that', 'those'],
    // Words ending in with a consonant and `o`.
    ['echo', 'echoes'],
    ['dingo', 'dingoes'],
    ['volcano', 'volcanoes'],
    ['tornado', 'tornadoes'],
    ['torpedo', 'torpedoes'],
    // Ends with `us`.
    ['genus', 'genera'],
    ['viscus', 'viscera'],
    // Ends with `ma`.
    ['stigma', 'stigmata'],
    ['stoma', 'stomata'],
    ['dogma', 'dogmata'],
    ['lemma', 'lemmata'],
    ['schema', 'schemata'],
    ['anathema', 'anathemata'],
    // Other irregular rules.
    ['ox', 'oxen'],
    ['axe', 'axes'],
    ['die', 'dice'],
    ['yes', 'yeses'],
    ['foot', 'feet'],
    ['eave', 'eaves'],
    ['goose', 'geese'],
    ['tooth', 'teeth'],
    ['quiz', 'quizzes'],
    ['human', 'humans'],
    ['proof', 'proofs'],
    ['carve', 'carves'],
    ['valve', 'valves'],
    ['looey', 'looies'],
    ['thief', 'thieves'],
    ['groove', 'grooves'],
    ['pickaxe', 'pickaxes'],
    ['whiskey', 'whiskies']
  ].forEach(function (rule) {
    return pluralize.addIrregularRule(rule[0], rule[1]);
  });

  /**
   * Pluralization rules.
   */
  [
    [/s?$/i, 's'],
    [/[^\u0000-\u007F]$/i, '$0'],
    [/([^aeiou]ese)$/i, '$1'],
    [/(ax|test)is$/i, '$1es'],
    [/(alias|[^aou]us|tlas|gas|ris)$/i, '$1es'],
    [/(e[mn]u)s?$/i, '$1s'],
    [/([^l]ias|[aeiou]las|[emjzr]as|[iu]am)$/i, '$1'],
    [/(alumn|syllab|octop|vir|radi|nucle|fung|cact|stimul|termin|bacill|foc|uter|loc|strat)(?:us|i)$/i, '$1i'],
    [/(alumn|alg|vertebr)(?:a|ae)$/i, '$1ae'],
    [/(seraph|cherub)(?:im)?$/i, '$1im'],
    [/(her|at|gr)o$/i, '$1oes'],
    [/(agend|addend|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi|curricul|automat|quor)(?:a|um)$/i, '$1a'],
    [/(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|hedr|automat)(?:a|on)$/i, '$1a'],
    [/sis$/i, 'ses'],
    [/(?:(kni|wi|li)fe|(ar|l|ea|eo|oa|hoo)f)$/i, '$1$2ves'],
    [/([^aeiouy]|qu)y$/i, '$1ies'],
    [/([^ch][ieo][ln])ey$/i, '$1ies'],
    [/(x|ch|ss|sh|zz)$/i, '$1es'],
    [/(matr|cod|mur|sil|vert|ind|append)(?:ix|ex)$/i, '$1ices'],
    [/(m|l)(?:ice|ouse)$/i, '$1ice'],
    [/(pe)(?:rson|ople)$/i, '$1ople'],
    [/(child)(?:ren)?$/i, '$1ren'],
    [/eaux$/i, '$0'],
    [/m[ae]n$/i, 'men'],
    ['thou', 'you']
  ].forEach(function (rule) {
    return pluralize.addPluralRule(rule[0], rule[1]);
  });

  /**
   * Singularization rules.
   */
  [
    [/s$/i, ''],
    [/(ss)$/i, '$1'],
    [/(wi|kni|(?:after|half|high|low|mid|non|night|[^\w]|^)li)ves$/i, '$1fe'],
    [/(ar|(?:wo|[ae])l|[eo][ao])ves$/i, '$1f'],
    [/ies$/i, 'y'],
    [/\b([pl]|zomb|(?:neck|cross)?t|coll|faer|food|gen|goon|group|lass|talk|goal|cut)ies$/i, '$1ie'],
    [/\b(mon|smil)ies$/i, '$1ey'],
    [/(m|l)ice$/i, '$1ouse'],
    [/(seraph|cherub)im$/i, '$1'],
    [/(x|ch|ss|sh|zz|tto|go|cho|alias|[^aou]us|tlas|gas|(?:her|at|gr)o|ris)(?:es)?$/i, '$1'],
    [/(analy|ba|diagno|parenthe|progno|synop|the|empha|cri)(?:sis|ses)$/i, '$1sis'],
    [/(movie|twelve|abuse|e[mn]u)s$/i, '$1'],
    [/(test)(?:is|es)$/i, '$1is'],
    [/(alumn|syllab|octop|vir|radi|nucle|fung|cact|stimul|termin|bacill|foc|uter|loc|strat)(?:us|i)$/i, '$1us'],
    [/(agend|addend|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi|curricul|quor)a$/i, '$1um'],
    [/(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|hedr|automat)a$/i, '$1on'],
    [/(alumn|alg|vertebr)ae$/i, '$1a'],
    [/(cod|mur|sil|vert|ind)ices$/i, '$1ex'],
    [/(matr|append)ices$/i, '$1ix'],
    [/(pe)(rson|ople)$/i, '$1rson'],
    [/(child)ren$/i, '$1'],
    [/(eau)x?$/i, '$1'],
    [/men$/i, 'man']
  ].forEach(function (rule) {
    return pluralize.addSingularRule(rule[0], rule[1]);
  });

  /**
   * Uncountable rules.
   */
  [
    // Singular words with no plurals.
    'adulthood',
    'advice',
    'agenda',
    'aid',
    'alcohol',
    'ammo',
    'anime',
    'athletics',
    'audio',
    'bison',
    'blood',
    'bream',
    'buffalo',
    'butter',
    'carp',
    'cash',
    'chassis',
    'chess',
    'clothing',
    'cod',
    'commerce',
    'cooperation',
    'corps',
    'debris',
    'diabetes',
    'digestion',
    'elk',
    'energy',
    'equipment',
    'excretion',
    'expertise',
    'flounder',
    'fun',
    'gallows',
    'garbage',
    'graffiti',
    'headquarters',
    'health',
    'herpes',
    'highjinks',
    'homework',
    'housework',
    'information',
    'jeans',
    'justice',
    'kudos',
    'labour',
    'literature',
    'machinery',
    'mackerel',
    'mail',
    'media',
    'mews',
    'moose',
    'music',
    'manga',
    'news',
    'pike',
    'plankton',
    'pliers',
    'pollution',
    'premises',
    'rain',
    'research',
    'rice',
    'salmon',
    'scissors',
    'series',
    'sewage',
    'shambles',
    'shrimp',
    'species',
    'staff',
    'swine',
    'tennis',
    'traffic',
    'transporation',
    'trout',
    'tuna',
    'wealth',
    'welfare',
    'whiting',
    'wildebeest',
    'wildlife',
    'you',
    // Regexes.
    /[^aeiou]ese$/i, // "chinese", "japanese"
    /deer$/i, // "deer", "reindeer"
    /fish$/i, // "fish", "blowfish", "angelfish"
    /measles$/i,
    /o[iu]s$/i, // "carnivorous"
    /pox$/i, // "chickpox", "smallpox"
    /sheep$/i
  ].forEach(pluralize.addUncountableRule);

  return pluralize;
});
});

var Articles = createCommonjsModule(function (module) {
// Generated by CoffeeScript 1.10.0
(function() {
  var a, articlize, arts, find, n,
    slice = [].slice;

  a = 'a';

  n = 'an';

  arts = {
    0: {
      8: {
        _: n
      },
      9: {
        _: n
      },
      "-": {
        1: {
          1: {
            _: n
          }
        },
        4: {
          " ": {
            _: a
          },
          _: n
        },
        6: {
          "-": {
            _: n
          }
        },
        8: {
          _: n
        }
      }
    },
    1: {
      1: {
        0: {
          _: a
        },
        1: {
          _: a
        },
        2: {
          _: a
        },
        3: {
          _: a
        },
        4: {
          _: a
        },
        5: {
          _: a
        },
        6: {
          _: a
        },
        7: {
          _: a
        },
        8: {
          _: a
        },
        9: {
          _: a
        },
        _: n,
        ".": {
          4: {
            _: a
          }
        }
      },
      8: {
        0: {
          0: {
            _: n
          },
          1: {
            _: n
          },
          2: {
            _: n
          },
          3: {
            _: n
          },
          4: {
            _: n
          },
          5: {
            _: n
          },
          6: {
            _: n
          },
          7: {
            _: n
          },
          8: {
            _: n
          },
          9: {
            _: n
          },
          _: a
        },
        1: {
          "-": {
            _: a
          },
          " ": {
            _: a
          }
        },
        2: {
          "-": {
            _: a
          },
          " ": {
            _: a
          }
        },
        3: {
          "-": {
            _: a
          },
          " ": {
            _: a
          }
        },
        4: {
          "-": {
            _: a
          },
          " ": {
            _: a
          }
        },
        5: {
          "-": {
            _: a
          },
          " ": {
            _: a
          }
        },
        6: {
          "-": {
            _: a
          },
          " ": {
            _: a
          }
        },
        7: {
          "-": {
            _: a
          },
          " ": {
            _: a
          }
        },
        8: {
          "-": {
            _: a
          },
          " ": {
            _: a
          }
        },
        9: {
          "-": {
            _: a
          },
          " ": {
            _: a
          }
        },
        _: n
      }
    },
    8: {
      0: {
        0: {
          x: {
            _: a
          }
        }
      },
      9: {
        0: {
          _: a
        }
      },
      _: n,
      ",": {
        1: {
          _: a
        }
      }
    },
    "`": {
      a: {
        _: n
      }
    },
    "£": {
      8: {
        _: n
      }
    },
    "∞": {
      _: n
    },
    a: {
      " ": {
        _: a
      },
      b: {
        o: {
          u: {
            t: {
              "-": {
                _: n
              }
            },
            _: a
          }
        }
      },
      g: {
        a: {
          i: {
            _: a
          }
        }
      },
      l: {
        "-": {
          I: {
            _: a
          }
        },
        g: {
          u: {
            _: a
          }
        },
        t: {
          h: {
            _: a
          }
        }
      },
      m: {
        o: {
          n: {
            _: a
          }
        }
      },
      n: {
        " ": {
          _: a
        },
        d: {
          a: {
            _: n
          },
          e: {
            _: n
          },
          r: {
            _: n
          },
          _: a
        },
        o: {
          t: {
            _: a
          }
        },
        y: {
          w: {
            _: a
          }
        }
      },
      p: {
        r: {
          e: {
            _: a
          }
        }
      },
      r: {
        e: {
          " ": {
            _: a
          },
          ":": {
            _: a
          }
        },
        t: {
          "í": {
            _: a
          }
        }
      },
      _: n
    },
    A: {
      $: {
        _: a
      },
      A: {
        A: {
          _: a
        }
      },
      n: {
        d: {
          a: {
            l: {
              u: {
                c: {
                  _: a
                }
              }
            }
          }
        }
      },
      r: {
        m: {
          a: {
            t: {
              _: a
            }
          }
        }
      },
      s: {
        t: {
          u: {
            r: {
              i: {
                a: {
                  s: {
                    _: a
                  }
                }
              }
            }
          }
        }
      },
      t: {
        h: {
          l: {
            e: {
              t: {
                i: {
                  _: n
                }
              }
            },
            o: {
              _: n
            },
            _: a
          }
        }
      },
      U: {
        $: {
          _: a
        },
        D: {
          _: a
        },
        S: {
          C: {
            _: a
          }
        }
      },
      _: n
    },
    "Á": {
      _: n
    },
    "á": {
      ";": {
        _: n
      }
    },
    "à": {
      _: n
    },
    "Ä": {
      _: n
    },
    "ā": {
      _: n
    },
    "Å": {
      _: n
    },
    "æ": {
      _: n
    },
    "Æ": {
      n: {
        _: a
      },
      _: n
    },
    D: {
      "ú": {
        n: {
          _: a
        }
      }
    },
    e: {
      ".": {
        g: {
          _: a
        }
      },
      a: {
        c: {
          h: {
            " ": {
              _: a
            }
          }
        }
      },
      i: {
        t: {
          h: {
            e: {
              r: {
                " ": {
                  _: a
                },
                ".": {
                  _: a
                }
              }
            }
          }
        }
      },
      l: {
        "-": {
          _: a
        },
        l: {
          a: {
            _: a
          }
        }
      },
      m: {
        p: {
          e: {
            z: {
              _: a
            }
          }
        }
      },
      n: {
        o: {
          u: {
            g: {
              _: a
            }
          }
        }
      },
      u: {
        p: {
          " ": {
            _: n
          }
        },
        _: a
      },
      w: {
        _: a
      },
      x: {
        i: {
          s: {
            t: {
              s: {
                _: a
              }
            }
          }
        }
      },
      _: n
    },
    E: {
      m: {
        p: {
          e: {
            z: {
              _: a
            }
          }
        }
      },
      n: {
        a: {
          m: {
            _: a
          }
        }
      },
      s: {
        p: {
          a: {
            d: {
              _: n
            }
          },
          e: {
            _: n
          },
          o: {
            _: n
          },
          _: a
        }
      },
      u: {
        l: {
          _: n
        },
        _: a
      },
      U: {
        R: {
          _: a
        }
      },
      _: n
    },
    "é": {
      g: {
        _: a
      },
      t: {
        a: {
          _: n
        },
        u: {
          _: n
        },
        _: a
      },
      _: n
    },
    "É": {
      _: n
    },
    f: {
      "-": {
        _: n
      },
      " ": {
        _: n
      },
      "/": {
        _: n
      },
      M: {
        _: n
      },
      p: {
        _: n
      },
      t: {
        _: n
      }
    },
    F: {
      0: {
        _: n
      },
      1: {
        _: n
      },
      2: {
        _: n
      },
      3: {
        _: n
      },
      4: {
        _: n
      },
      5: {
        _: n
      },
      6: {
        _: n
      },
      9: {
        _: n
      },
      "'": {
        _: n
      },
      "-": {
        _: n
      },
      " ": {
        _: n
      },
      "\"": {
        _: n
      },
      "#": {
        _: n
      },
      ",": {
        _: n
      },
      ".": {
        _: n
      },
      "/": {
        _: n
      },
      "”": {
        _: n
      },
      A: {
        C: {
          _: a
        },
        D: {
          _: a
        },
        I: {
          R: {
            _: a
          }
        },
        L: {
          _: a
        },
        M: {
          _: a
        },
        N: {
          _: a
        },
        P: {
          _: a
        },
        Q: {
          _: a
        },
        R: {
          _: a
        },
        S: {
          _: a
        },
        T: {
          _: a
        },
        _: n
      },
      B: {
        _: n
      },
      C: {
        _: n
      },
      c: {
        _: n
      },
      D: {
        _: n
      },
      E: {
        C: {
          _: n
        },
        I: {
          _: n
        }
      },
      F: {
        " ": {
          _: a
        },
        _: n
      },
      f: {
        _: n
      },
      h: {
        _: n
      },
      H: {
        _: n
      },
      I: {
        A: {
          T: {
            _: a
          },
          _: n
        },
        D: {
          " ": {
            _: n
          }
        },
        R: {
          " ": {
            _: n
          }
        },
        S: {
          " ": {
            _: n
          }
        }
      },
      K: {
        _: n
      },
      L: {
        C: {
          _: n
        },
        N: {
          _: n
        },
        P: {
          _: n
        }
      },
      M: {
        R: {
          _: a
        },
        _: n
      },
      O: {
        " ": {
          _: n
        },
        I: {
          " ": {
            _: n
          }
        }
      },
      P: {
        ".": {
          _: a
        },
        "?": {
          _: a
        },
        C: {
          "?": {
            _: a
          }
        },
        _: n
      },
      R: {
        C: {
          _: n
        },
        S: {
          _: n
        }
      },
      S: {
        _: n
      },
      T: {
        S: {
          _: a
        },
        T: {
          _: a
        },
        _: n
      },
      U: {
        " ": {
          _: n
        },
        ",": {
          _: n
        },
        ".": {
          _: n
        }
      },
      V: {
        _: n
      },
      W: {
        D: {
          _: a
        },
        _: n
      },
      X: {
        _: n
      },
      Y: {
        _: n
      },
      "σ": {
        _: n
      }
    },
    G: {
      h: {
        a: {
          e: {
            _: n
          },
          i: {
            _: n
          }
        }
      }
    },
    h: {
      "'": {
        _: n
      },
      "-": {
        U: {
          _: a
        },
        _: n
      },
      " ": {
        _: n
      },
      "\"": {
        _: n
      },
      ",": {
        _: n
      },
      C: {
        _: n
      },
      e: {
        i: {
          r: {
            a: {
              _: a
            },
            _: n
          }
        }
      },
      i: {
        m: {
          s: {
            _: n
          }
        },
        s: {
          t: {
            o: {
              r: {
                i: {
                  c: {
                    _: a
                  }
                }
              }
            }
          }
        }
      },
      o: {
        m: {
          a: {
            _: n
          },
          m: {
            _: n
          }
        },
        n: {
          e: {
            y: {
              _: a
            }
          },
          k: {
            _: a
          },
          v: {
            _: a
          },
          _: n
        },
        r: {
          s: {
            " ": {
              _: n
            }
          }
        },
        u: {
          r: {
            _: n
          }
        }
      },
      t: {
        t: {
          p: {
            " ": {
              _: n
            }
          },
          _: a
        },
        _: n
      }
    },
    H: {
      1: {
        _: n
      },
      2: {
        _: n
      },
      3: {
        _: n
      },
      4: {
        _: n
      },
      5: {
        _: n
      },
      "'": {
        _: n
      },
      "-": {
        _: n
      },
      " ": {
        _: n
      },
      "\"": {
        _: n
      },
      "&": {
        _: n
      },
      ",": {
        _: n
      },
      ".": {
        A: {
          _: a
        },
        _: n
      },
      "+": {
        _: n
      },
      a: {
        b: {
          i: {
            l: {
              i: {
                t: {
                  a: {
                    t: {
                      i: {
                        o: {
                          n: {
                            s: {
                              _: n
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      B: {
        _: n
      },
      C: {
        _: n
      },
      D: {
        B: {
          _: a
        },
        _: n
      },
      e: {
        i: {
          r: {
            _: n
          }
        }
      },
      F: {
        _: n
      },
      G: {
        _: n
      },
      H: {
        _: n
      },
      I: {
        D: {
          _: a
        },
        G: {
          _: a
        },
        M: {
          _: a
        },
        P: {
          _: a
        },
        _: n
      },
      L: {
        A: {
          "-": {
            D: {
              _: a
            }
          }
        },
        _: n
      },
      M: {
        _: n
      },
      N: {
        _: n
      },
      o: {
        n: {
          d: {
            _: a
          },
          e: {
            s: {
              _: n
            },
            _: a
          },
          g: {
            _: a
          },
          k: {
            _: a
          },
          o: {
            l: {
              _: a
            }
          },
          _: n
        },
        u: {
          r: {
            _: n
          }
        }
      },
      O: {
        " ": {
          _: n
        },
        V: {
          _: n
        }
      },
      P: {
        _: n
      },
      Q: {
        _: n
      },
      R: {
        T: {
          _: a
        },
        _: n
      },
      S: {
        " ": {
          _: a
        },
        R: {
          _: a
        },
        T: {
          _: a
        },
        _: n
      },
      T: {
        P: {
          _: a
        },
        _: n
      },
      V: {
        _: n
      },
      W: {
        T: {
          _: n
        }
      }
    },
    i: {
      ".": {
        e: {
          _: a
        }
      },
      b: {
        n: {
          _: a
        }
      },
      f: {
        " ": {
          _: a
        }
      },
      i: {
        _: a
      },
      n: {
        c: {
          l: {
            u: {
              d: {
                i: {
                  _: a
                }
              }
            }
          }
        },
        d: {
          i: {
            c: {
              a: {
                t: {
                  e: {
                    s: {
                      _: a
                    }
                  }
                }
              }
            }
          }
        },
        s: {
          t: {
            e: {
              a: {
                d: {
                  "?": {
                    _: n
                  }
                },
                _: a
              }
            }
          }
        }
      },
      s: {
        " ": {
          _: a
        },
        ".": {
          _: a
        }
      },
      t: {
        " ": {
          _: a
        }
      },
      u: {
        _: a
      },
      _: n
    },
    I: {
      "-": {
        A: {
          _: a
        },
        I: {
          _: a
        }
      },
      I: {
        I: {
          _: a
        }
      },
      l: {
        b: {
          _: a
        }
      },
      M: {
        H: {
          _: a
        }
      },
      m: {
        a: {
          m: {
            s: {
              _: a
            }
          }
        }
      },
      R: {
        "£": {
          _: a
        }
      },
      s: {
        l: {
          a: {
            m: {
              " ": {
                _: a
              },
              ",": {
                _: a
              },
              ".": {
                _: a
              }
            },
            n: {
              d: {
                s: {
                  _: a
                }
              }
            }
          }
        }
      },
      _: n
    },
    "İ": {
      _: n
    },
    J: {
      i: {
        a: {
          n: {
            _: a
          },
          _: n
        }
      }
    },
    k: {
      u: {
        " ": {
          _: n
        }
      }
    },
    l: {
      " ": {
        _: n
      },
      "\"": {
        _: n
      },
      p: {
        _: n
      }
    },
    L: {
      1: {
        _: n
      },
      2: {
        _: n
      },
      3: {
        _: n
      },
      5: {
        _: n
      },
      "'": {
        A: {
          _: a
        },
        _: n
      },
      "-": {
        a: {
          _: a
        },
        _: n
      },
      " ": {
        _: n
      },
      "\"": {
        _: n
      },
      "&": {
        _: n
      },
      ",": {
        _: n
      },
      ".": {
        _: n
      },
      "/": {
        _: n
      },
      a: {
        e: {
          _: n
        },
        o: {
          i: {
            g: {
              _: n
            }
          }
        }
      },
      A: {
        " ": {
          _: n
        },
        L: {
          _: n
        },
        P: {
          _: n
        }
      },
      B: {
        _: n
      },
      C: {
        _: n
      },
      D: {
        _: n
      },
      E: {
        A: {
          _: a
        },
        E: {
          _: a
        },
        G: {
          _: a
        },
        O: {
          _: a
        },
        P: {
          _: a
        },
        T: {
          _: a
        },
        _: n
      },
      F: {
        _: n
      },
      G: {
        _: n
      },
      H: {
        _: n
      },
      I: {
        R: {
          _: n
        }
      },
      L: {
        _: n
      },
      M: {
        X: {
          _: a
        },
        _: n
      },
      N: {
        _: n
      },
      o: {
        c: {
          h: {
            a: {
              _: n
            }
          }
        }
      },
      O: {
        E: {
          _: n
        }
      },
      P: {
        _: n
      },
      R: {
        _: n
      },
      S: {
        _: n
      },
      T: {
        _: n
      },
      U: {
        " ": {
          _: n
        }
      },
      V: {
        _: n
      },
      X: {
        _: n
      },
      Z: {
        _: n
      }
    },
    m: {
      "-": {
        _: n
      },
      " ": {
        _: n
      },
      "\"": {
        _: n
      },
      "&": {
        _: n
      },
      a: {
        k: {
          e: {
            s: {
              " ": {
                _: n
              }
            }
          }
        }
      },
      b: {
        _: n
      },
      e: {
        i: {
          n: {
            _: n
          }
        },
        n: {
          t: {
            i: {
              o: {
                n: {
                  s: {
                    _: n
                  }
                }
              }
            }
          }
        }
      },
      f: {
        _: n
      },
      p: {
        _: n
      },
      R: {
        _: n
      },
      t: {
        _: n
      }
    },
    M: {
      1: {
        9: {
          0: {
            _: n
          },
          _: a
        },
        _: n
      },
      2: {
        _: n
      },
      3: {
        _: n
      },
      4: {
        _: n
      },
      5: {
        _: n
      },
      6: {
        _: n
      },
      7: {
        _: n
      },
      8: {
        _: n
      },
      9: {
        _: n
      },
      "'": {
        _: n
      },
      "-": {
        t: {
          _: a
        },
        _: n
      },
      " ": {
        _: n
      },
      "\"": {
        _: n
      },
      "&": {
        _: n
      },
      ",": {
        _: n
      },
      ".": {
        A: {
          ".": {
            S: {
              _: a
            }
          }
        },
        _: n
      },
      "/": {
        _: n
      },
      A: {
        C: {
          _: a
        },
        D: {
          _: a
        },
        F: {
          _: a
        },
        G: {
          _: a
        },
        J: {
          _: a
        },
        L: {
          _: a
        },
        M: {
          _: a
        },
        N: {
          _: a
        },
        P: {
          _: a
        },
        R: {
          _: a
        },
        S: {
          _: a
        },
        T: {
          _: a
        },
        X: {
          _: a
        },
        Y: {
          _: a
        },
        _: n
      },
      B: {
        _: n
      },
      C: {
        _: n
      },
      D: {
        _: n
      },
      e: {
        "-": {
          _: n
        }
      },
      E: {
        d: {
          _: n
        },
        n: {
          _: n
        },
        P: {
          _: n
        }
      },
      F: {
        _: n
      },
      f: {
        _: n
      },
      G: {
        _: n
      },
      H: {
        _: n
      },
      h: {
        _: n
      },
      i: {
        e: {
          _: n
        }
      },
      I: {
        5: {
          _: n
        },
        6: {
          _: n
        },
        " ": {
          _: n
        },
        A: {
          _: n
        },
        T: {
          _: n
        }
      },
      K: {
        _: n
      },
      L: {
        _: n
      },
      M: {
        T: {
          _: a
        },
        _: n
      },
      N: {
        _: n
      },
      o: {
        U: {
          _: n
        }
      },
      O: {
        " ": {
          _: n
        },
        T: {
          " ": {
            _: n
          }
        },
        U: {
          _: n
        }
      },
      P: {
        _: n
      },
      R: {
        _: n
      },
      S: {
        _: n
      },
      s: {
        c: {
          _: n
        }
      },
      T: {
        R: {
          _: a
        },
        _: n
      },
      U: {
        V: {
          _: n
        }
      },
      V: {
        _: n
      },
      X: {
        _: n
      }
    },
    N: {
      4: {
        _: n
      },
      6: {
        _: n
      },
      "'": {
        _: n
      },
      "-": {
        a: {
          _: a
        },
        S: {
          _: a
        },
        _: n
      },
      " ": {
        _: n
      },
      "\"": {
        _: n
      },
      ",": {
        _: n
      },
      ".": {
        Y: {
          _: a
        },
        _: n
      },
      "=": {
        _: n
      },
      "²": {
        _: n
      },
      a: {
        o: {
          _: n
        }
      },
      A: {
        " ": {
          _: n
        },
        A: {
          F: {
            _: a
          },
          _: n
        },
        I: {
          _: n
        },
        S: {
          L: {
            _: n
          }
        }
      },
      B: {
        _: n
      },
      C: {
        _: n
      },
      D: {
        _: n
      },
      E: {
        A: {
          _: n
        },
        H: {
          _: n
        },
        S: {
          " ": {
            _: n
          }
        }
      },
      F: {
        _: n
      },
      G: {
        _: n
      },
      H: {
        _: n
      },
      I: {
        C: {
          _: a
        },
        L: {
          _: a
        },
        M: {
          H: {
            _: n
          },
          _: a
        },
        N: {
          _: a
        },
        S: {
          _: a
        },
        _: n
      },
      J: {
        C: {
          _: n
        }
      },
      K: {
        _: n
      },
      L: {
        S: {
          _: a
        },
        _: n
      },
      M: {
        _: n
      },
      N: {
        R: {
          _: n
        },
        T: {
          _: n
        }
      },
      P: {
        O: {
          V: {
            "-": {
              _: n
            }
          },
          _: a
        },
        _: n
      },
      R: {
        J: {
          _: a
        },
        T: {
          _: a
        },
        _: n
      },
      S: {
        W: {
          _: a
        },
        _: n
      },
      T: {
        $: {
          _: a
        },
        _: n
      },
      U: {
        S: {
          _: n
        }
      },
      V: {
        _: n
      },
      v: {
        _: n
      },
      W: {
        A: {
          _: n
        }
      },
      X: {
        _: n
      },
      Y: {
        P: {
          _: n
        },
        U: {
          _: n
        }
      }
    },
    n: {
      "-": {
        _: n
      },
      "−": {
        _: n
      },
      " ": {
        _: n
      },
      "\"": {
        _: n
      },
      "&": {
        _: n
      },
      ",": {
        _: n
      },
      "+": {
        _: n
      },
      "×": {
        _: n
      },
      d: {
        a: {
          _: n
        }
      },
      p: {
        a: {
          _: n
        }
      },
      t: {
        _: n
      },
      V: {
        _: n
      },
      W: {
        _: n
      }
    },
    o: {
      b: {
        r: {
          _: a
        }
      },
      c: {
        c: {
          u: {
            r: {
              s: {
                _: a
              }
            }
          }
        },
        h: {
          o: {
            _: a
          }
        }
      },
      f: {
        " ": {
          _: a
        }
      },
      n: {
        "-": {
          _: n
        },
        "/": {
          _: n
        },
        b: {
          _: n
        },
        c: {
          o: {
            _: n
          }
        },
        d: {
          _: n
        },
        e: {
          r: {
            _: n
          }
        },
        g: {
          _: n
        },
        i: {
          _: n
        },
        l: {
          _: n
        },
        m: {
          _: n
        },
        o: {
          _: n
        },
        r: {
          _: n
        },
        s: {
          _: n
        },
        t: {
          _: n
        },
        u: {
          _: n
        },
        w: {
          _: n
        },
        y: {
          _: n
        },
        _: a
      },
      r: {
        " ": {
          _: a
        },
        ",": {
          _: a
        }
      },
      u: {
        i: {
          _: a
        }
      },
      _: n
    },
    O: {
      b: {
        e: {
          r: {
            s: {
              t: {
                " ": {
                  _: n
                },
                l: {
                  _: n
                }
              },
              _: a
            }
          }
        }
      },
      l: {
        v: {
          _: a
        }
      },
      n: {
        e: {
          i: {
            _: n
          },
          _: a
        }
      },
      N: {
        E: {
          _: a
        }
      },
      o: {
        p: {
          _: a
        }
      },
      u: {
        i: {
          _: a
        }
      },
      _: n
    },
    "Ó": {
      _: n
    },
    "Ö": {
      _: n
    },
    "ö": {
      _: n
    },
    "Ō": {
      _: n
    },
    "ō": {
      _: n
    },
    P: {
      h: {
        o: {
          b: {
            _: n
          },
          i: {
            _: n
          }
        }
      }
    },
    r: {
      "'": {
        _: n
      },
      "-": {
        _: n
      },
      " ": {
        _: n
      },
      "\"": {
        _: n
      },
      "&": {
        _: n
      },
      ".": {
        _: n
      },
      e: {
        f: {
          e: {
            r: {
              s: {
                _: n
              }
            }
          }
        }
      },
      f: {
        _: n
      },
      m: {
        _: n
      },
      s: {
        _: n
      }
    },
    R: {
      1: {
        0: {
          _: a
        },
        _: n
      },
      2: {
        _: n
      },
      3: {
        _: n
      },
      4: {
        _: n
      },
      5: {
        _: n
      },
      6: {
        _: n
      },
      "'": {
        _: n
      },
      "-": {
        _: n
      },
      " ": {
        _: n
      },
      "\"": {
        _: n
      },
      "&": {
        _: n
      },
      ",": {
        _: n
      },
      ".": {
        C: {
          _: a
        },
        _: n
      },
      "/": {
        _: n
      },
      A: {
        " ": {
          _: n
        },
        F: {
          _: n
        }
      },
      B: {
        _: n
      },
      C: {
        _: n
      },
      D: {
        _: n
      },
      E: {
        " ": {
          _: n
        },
        R: {
          _: n
        }
      },
      F: {
        _: n
      },
      f: {
        _: n
      },
      G: {
        _: n
      },
      H: {
        S: {
          _: n
        }
      },
      I: {
        A: {
          _: n
        },
        C: {
          " ": {
            _: n
          }
        }
      },
      J: {
        _: n
      },
      K: {
        _: n
      },
      L: {
        " ": {
          _: a
        },
        _: n
      },
      M: {
        1: {
          _: a
        },
        _: n
      },
      N: {
        G: {
          _: a
        },
        _: n
      },
      O: {
        T: {
          _: n
        }
      },
      P: {
        _: n
      },
      Q: {
        _: n
      },
      R: {
        _: n
      },
      S: {
        " ": {
          _: a
        },
        ")": {
          _: a
        },
        ",": {
          _: a
        },
        ".": {
          _: a
        },
        "?": {
          _: a
        },
        T: {
          _: a
        },
        _: n
      },
      T: {
        _: n
      },
      U: {
        _: n
      },
      V: {
        _: n
      },
      X: {
        _: n
      }
    },
    s: {
      "-": {
        _: n
      },
      "\"": {
        _: n
      },
      ")": {
        _: n
      },
      ",": {
        _: n
      },
      ".": {
        _: n
      },
      a: {
        y: {
          s: {
            _: n
          }
        }
      },
      i: {
        c: {
          h: {
            _: n
          }
        }
      },
      p: {
        3: {
          _: n
        },
        r: {
          o: {
            t: {
              _: n
            }
          }
        }
      },
      s: {
        h: {
          _: n
        }
      },
      t: {
        a: {
          t: {
            e: {
              s: {
                " ": {
                  _: n
                },
                ":": {
                  _: n
                }
              }
            }
          }
        }
      },
      v: {
        a: {
          _: a
        },
        e: {
          _: a
        },
        _: n
      }
    },
    S: {
      1: {
        _: n
      },
      2: {
        _: n
      },
      3: {
        _: n
      },
      4: {
        _: n
      },
      5: {
        _: n
      },
      6: {
        _: n
      },
      "'": {
        _: n
      },
      "-": {
        _: n
      },
      " ": {
        _: n
      },
      "\"": {
        _: n
      },
      "&": {
        W: {
          _: a
        },
        _: n
      },
      ",": {
        _: n
      },
      ".": {
        B: {
          _: n
        },
        M: {
          _: n
        },
        O: {
          _: n
        }
      },
      "”": {
        _: n
      },
      A: {
        "-": {
          1: {
            _: a
          },
          _: n
        },
        " ": {
          _: n
        },
        C: {
          D: {
            _: n
          }
        },
        E: {
          _: n
        },
        S: {
          E: {
            _: a
          },
          _: n
        },
        T: {
          " ": {
            _: n
          },
          B: {
            _: n
          }
        }
      },
      B: {
        _: n
      },
      C: {
        A: {
          " ": {
            _: n
          }
        },
        C: {
          _: n
        },
        M: {
          _: n
        },
        O: {
          " ": {
            _: n
          }
        },
        R: {
          A: {
            _: a
          },
          _: n
        },
        T: {
          _: n
        }
      },
      D: {
        _: n
      },
      E: {
        " ": {
          _: n
        },
        C: {
          O: {
            _: a
          },
          R: {
            _: a
          },
          _: n
        },
        I: {
          _: n
        },
        O: {
          _: n
        }
      },
      F: {
        _: n
      },
      G: {
        _: n
      },
      H: {
        2: {
          _: n
        },
        3: {
          _: n
        },
        "-": {
          _: n
        }
      },
      I: {
        " ": {
          _: n
        }
      },
      J: {
        _: n
      },
      K: {
        _: n
      },
      L: {
        A: {
          _: a
        },
        I: {
          _: a
        },
        O: {
          _: a
        },
        _: n
      },
      M: {
        A: {
          _: a
        },
        E: {
          " ": {
            _: n
          },
          _: a
        },
        I: {
          _: a
        },
        _: n
      },
      N: {
        A: {
          _: a
        },
        E: {
          _: a
        },
        O: {
          _: a
        },
        _: n
      },
      O: {
        "(": {
          _: n
        },
        A: {
          " ": {
            _: n
          },
          I: {
            _: n
          }
        },
        E: {
          _: n
        },
        I: {
          _: n
        },
        S: {
          _: n
        },
        V: {
          _: n
        }
      },
      P: {
        A: {
          C: {
            _: a
          },
          D: {
            _: a
          },
          M: {
            _: a
          },
          N: {
            _: a
          },
          R: {
            _: a
          }
        },
        E: {
          " ": {
            _: n
          },
          _: a
        },
        I: {
          C: {
            _: a
          }
        },
        O: {
          _: a
        },
        U: {
          _: a
        },
        _: n
      },
      R: {
        _: n
      },
      S: {
        _: n
      },
      T: {
        "-": {
          _: n
        },
        A: {
          " ": {
            _: n
          }
        },
        B: {
          _: n
        },
        C: {
          _: n
        },
        D: {
          _: n
        },
        F: {
          _: n
        },
        L: {
          _: n
        },
        M: {
          _: n
        },
        S: {
          _: n
        },
        V: {
          _: n
        }
      },
      u: {
        r: {
          a: {
            " ": {
              _: n
            }
          }
        }
      },
      U: {
        B: {
          _: a
        },
        L: {
          _: a
        },
        N: {
          _: a
        },
        P: {
          _: a
        },
        S: {
          _: a
        },
        _: n
      },
      V: {
        _: n
      },
      W: {
        F: {
          _: n
        },
        P: {
          _: n
        },
        R: {
          _: n
        }
      },
      X: {
        S: {
          _: a
        },
        _: n
      }
    },
    t: {
      "-": {
        S: {
          _: n
        }
      },
      S: {
        _: n
      }
    },
    T: {
      a: {
        v: {
          e: {
            s: {
              _: n
            }
          }
        }
      },
      "à": {
        _: n
      }
    },
    u: {
      "-": {
        _: a
      },
      " ": {
        _: a
      },
      "\"": {
        _: a
      },
      ".": {
        _: a
      },
      b: {
        e: {
          _: n
        },
        _: a
      },
      f: {
        _: a
      },
      k: {
        a: {
          _: n
        },
        _: a
      },
      l: {
        u: {
          _: a
        }
      },
      m: {
        " ": {
          _: a
        }
      },
      n: {
        " ": {
          _: a
        },
        a: {
          " ": {
            _: a
          },
          n: {
            a: {
              _: n
            },
            n: {
              _: n
            },
            s: {
              _: n
            },
            t: {
              _: n
            },
            _: a
          },
          r: {
            y: {
              _: a
            }
          }
        },
        e: {
          " ": {
            _: a
          }
        },
        i: {
          c: {
            o: {
              r: {
                p: {
                  _: n
                }
              }
            }
          },
          d: {
            i: {
              _: a
            },
            _: n
          },
          m: {
            o: {
              _: a
            },
            _: n
          },
          n: {
            _: n
          },
          v: {
            o: {
              _: n
            }
          },
          _: a
        },
        l: {
          e: {
            s: {
              _: a
            }
          }
        }
      },
      p: {
        o: {
          _: a
        }
      },
      r: {
        a: {
          _: a
        },
        e: {
          _: a
        },
        i: {
          _: a
        },
        l: {
          _: a
        },
        o: {
          _: a
        }
      },
      s: {
        "-": {
          _: n
        },
        " ": {
          _: n
        },
        h: {
          _: n
        },
        _: a
      },
      t: {
        m: {
          _: n
        },
        t: {
          _: n
        },
        _: a
      },
      v: {
        _: a
      },
      w: {
        _: a
      },
      _: n
    },
    U: {
      1: {
        _: n
      },
      "-": {
        B: {
          o: {
            _: a
          },
          _: n
        }
      },
      a: {
        _: n
      },
      b: {
        i: {
          _: a
        },
        _: n
      },
      D: {
        P: {
          "-": {
            _: n
          }
        }
      },
      d: {
        _: n
      },
      g: {
        l: {
          _: n
        }
      },
      h: {
        _: n
      },
      i: {
        _: n
      },
      l: {
        i: {
          _: a
        },
        _: n
      },
      m: {
        _: n
      },
      M: {
        N: {
          _: n
        }
      },
      n: {
        "-": {
          _: n
        },
        a: {
          n: {
            _: a
          },
          _: n
        },
        b: {
          _: n
        },
        c: {
          _: n
        },
        d: {
          _: n
        },
        e: {
          s: {
            _: a
          },
          _: n
        },
        f: {
          _: n
        },
        g: {
          _: n
        },
        h: {
          _: n
        },
        i: {
          d: {
            _: n
          },
          n: {
            _: n
          }
        },
        k: {
          _: n
        },
        l: {
          _: n
        },
        m: {
          _: n
        },
        n: {
          _: n
        },
        o: {
          _: n
        },
        p: {
          _: n
        },
        r: {
          _: n
        },
        s: {
          _: n
        },
        t: {
          e: {
            r: {
              s: {
                _: a
              }
            }
          },
          _: n
        },
        u: {
          _: n
        },
        w: {
          _: n
        }
      },
      p: {
        _: n
      },
      r: {
        a: {
          _: a
        },
        i: {
          _: a
        },
        u: {
          g: {
            u: {
              a: {
                y: {
                  a: {
                    n: {
                      "-": {
                        _: n
                      }
                    }
                  }
                }
              }
            }
          },
          k: {
            _: n
          },
          _: a
        },
        _: n
      },
      s: {
        h: {
          _: n
        },
        t: {
          _: n
        }
      },
      t: {
        n: {
          _: n
        },
        o: {
          "-": {
            _: n
          }
        },
        r: {
          _: n
        },
        t: {
          _: n
        }
      },
      x: {
        _: n
      },
      z: {
        _: n
      }
    },
    "ü": {
      _: n
    },
    "Ü": {
      _: n
    },
    V: {
      I: {
        I: {
          _: n
        }
      }
    },
    x: {
      a: {
        _: a
      },
      e: {
        _: a
      },
      i: {
        _: a
      },
      o: {
        _: a
      },
      x: {
        _: a
      },
      y: {
        _: a
      },
      _: n
    },
    X: {
      a: {
        _: a
      },
      A: {
        _: a
      },
      e: {
        _: a
      },
      h: {
        _: a
      },
      i: {
        _: a
      },
      I: {
        V: {
          _: a
        },
        X: {
          _: a
        }
      },
      o: {
        _: a
      },
      u: {
        _: a
      },
      U: {
        _: a
      },
      V: {
        _: a
      },
      X: {
        " ": {
          _: n
        },
        _: a
      },
      y: {
        _: a
      },
      _: n
    },
    Y: {
      p: {
        _: n
      }
    },
    "α": {
      _: n
    },
    "ε": {
      _: n
    },
    "ω": {
      _: n
    }
  };

  find = function(word, obj, article) {
    var key;
    if (obj == null) {
      obj = arts;
    }
    if (article == null) {
      article = 'a';
    }
    if (word == null) {
      return article;
    }
    key = word.slice(0, 1);
    obj = obj[key];
    if ((key != null) && (obj != null)) {
      return find(word.slice(1), obj, obj._ || article);
    } else {
      return article;
    }
  };

  articlize = function() {
    var input, inputs, out;
    inputs = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    out = (function() {
      var i, len, results;
      results = [];
      for (i = 0, len = inputs.length; i < len; i++) {
        input = inputs[i];
        if (input != null) {
          results.push((find(input)) + " " + input);
        }
      }
      return results;
    })();
    if (inputs.length === 1) {
      return out[0];
    } else {
      return out;
    }
  };

  module.exports = {
    find: find,
    articlize: articlize
  };

}).call(commonjsGlobal);
});

var Articles_1 = Articles.find;
var Articles_2 = Articles.articlize;

var articlize = function articlize(string) {
  return Articles.articlize(string);
};

var between = function between(str, seed) {
  var options = str.split('-').map(Number);
  return getRandomInt(options[0], options[1], seed);
};

var capitalize = function capitalize(str) {
  return str[0].toUpperCase() + str.slice(1);
};

var checkIfAlreadyGenerated = function checkIfAlreadyGenerated(model1, model2) {
  var simsAllowed = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  var similarities = Object.keys(model1).reduce(function (sims, key) {
    if (key === 'type') return sims;
    return model1[key] === model2[key] ? sims += 1 : sims;
  }, 0);

  return similarities >= simsAllowed;
};

var getRandomInt = function getRandomInt(min, max, seed) {
  var rng = seed ? seedrandom$2.alea(seed) : seedrandom$2.alea(Math.random());
  return Math.floor(rng() * (max - min)) + min;
};

var modifier = function modifier(str) {
  var fnHash = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var fns = str.split('|');

  var pipe = function pipe(input, fnArray) {
    var modified = fnHash[fnArray[0]] ? fnHash[fnArray[0]].call(null, input) : input;
    return fnArray.length === 1 ? modified : pipe(modified, fnArray.slice(1));
  };

  return function () {
    var input = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    return pipe(input, fns);
  };
};

var pluralize$1 = function pluralize$$1(str) {
  return pluralize(str);
};

var possessive = function possessive(str) {
  return str + '\'s';
};

var sample = function sample(collection, seed) {
  if (typeof collection === 'string') return collection;
  var index = getRandomInt(0, collection.length, seed);
  return collection[index];
};

var uppercase = function uppercase(str) {
  return str.toUpperCase();
};

var modifiers = {
  articlize: articlize,
  between: between,
  capitalize: capitalize,
  checkIfAlreadyGenerated: checkIfAlreadyGenerated,
  modifier: modifier,
  pluralize: pluralize$1,
  possessive: possessive,
  sample: sample,
  uppercase: uppercase
};

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function validateData(data) {
  return data.name !== undefined && data.value !== undefined;
}

var Generator = function () {
  /*
    may be constructed with the following options:
      seed: a seed to use for randomisaztion. If not provided, it will be truly random.
      state: an existing state made up of models. All may be provided later as well.
      modifiers: additional functions that can be used to parse and modify the variables during construction.
      entry: the entry point of the generative text.
      schema: schemas used for the generative text.
  */
  function Generator() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Generator);

    this.modifier = Object.assign({}, modifiers);
    if (options.modifier) this.modifier = Object.assign(this.modifier, options.modifier);

    this.state = options.state || {};
    this.entry = options.entry;
    this.seed = options.seed;
    this.regex = options.regex || /\.|[^ ]*::/g;
    this.schema = options.schema || {
      grammar: {},
      model: {}
    };
  }

  /*
    requires two things: the type of thing being added, and the data being added
  */


  _createClass(Generator, [{
    key: 'add',
    value: function add() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var type = options.type,
          data = options.data;

      var acceptedTypes = ['entry', 'modifier', 'model', 'grammar'];

      switch (true) {
        case !type || !data:
          return new Error('Could not add because either the type or data was not present');
        case !acceptedTypes.includes(type):
          return new Error('Could not add because ' + type + ' is not one of the accepted types: ' + acceptedTypes);
        case type === 'modifier' && validateData(data):
          return this.modifier[data.name] = data.value;
        case validateData(data) && (type === 'model' || type === 'grammar'):
          return this.schema[type][data.name] = data.value;
        default:
          if (!data.value && !data.name) return new Error('Could not set or add entry, as no name or value was provided: ' + data);

          // entries can either be created or simply set from the available grammars.
          // if a value is provided, it is being added
          if (data.value) return this.entry = data.value;

          // if a name is provided, get the corresponding grammar
          if (data.name && this.schema.grammar[data.name]) return this.entry = this.schema.grammar[data.name];

          return new Error('Could not set entry, as ' + data.name + ' is not a set grammar.');
      }
    }

    /*
      wrapper for setting an entry.
    */

  }, {
    key: 'setEntry',
    value: function setEntry() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var name = options.name,
          value = options.value;

      return this.add({ type: 'entry', data: { name: name, value: value } });
    }

    /*
      May provide a sub-section of the state in property: type.
      I.E.: you only want to know about current models, getState({type: 'models'});
    */

  }, {
    key: 'getState',
    value: function getState() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var type = options.type;

      if (type && this.state[type]) return this.state[type];
      return this.state;
    }

    /* Compiles and returns text. If a state is provided, it will use that. Otherwise it will run with a given state. */

  }, {
    key: 'run',
    value: function run() {
      var _this = this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var entry = options.entry || this.entry;
      var regex = options.regex || this.regex;
      var model = options.model || this.schema.model;
      var state = options.state || this.state;
      var seed = options.seed || this.seed || seedrandom$2.alea(Math.random())();
      var schema = options.schema || this.schema.model;

      return entry.replace(regex, function (match) {
        var split = match.split('.');
        split[split.length - 1] = split[split.length - 1].slice(0, -2);
        // remove trailing ::... figure out how to not include those in regex...
        switch (true) {
          case match[0] === '|':
            var _match$slice$split = match.slice(1).split(':'),
                _match$slice$split2 = _slicedToArray(_match$slice$split, 2),
                modifier = _match$slice$split2[0],
                value = _match$slice$split2[1];

            return _this.modify({ modifier: modifier, value: value });
          case match[0] === '!':
            var grammar = options.grammar || _this.schema.grammar;
            var newEntry = grammar[match.slice(1, -2)];
            if (newEntry === undefined) return new Error('the grammar for ' + match.slice(1) + ' does not exist in the provided grammar schema: ' + grammar);
            return _this.run({ entry: newEntry, regex: regex, model: model, state: state, seed: seed, schema: schema });
          default:
            var schemaSeed = '' + seed + ':for schema-model';
            // model from schema needs to slightly change the seed for a little additonal variance.
            var valueFromModel = split.length === 3 ? _this.modelFromState({ state: state, schema: schema, split: split }) : _this.modelFromSchema({ schema: schema, seed: schemaSeed, split: split });
            var property = split[split.length - 1];
            if (!property.includes('|')) return valueFromModel;

            // can be many modifiers
            // we don't care about the first thing in array since its the property name and we already have the value stored.
            var _modifiers = property.split('|').slice(1);
            return _modifiers.reduce(function (value, modifier) {
              return _this.modify({ modifier: modifier, value: value });
            }, valueFromModel);
        }
      });
    }
  }, {
    key: 'modelFromSchema',
    value: function modelFromSchema() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var schema = options.schema || this.schema.model;

      var _options$split = _slicedToArray(options.split, 2),
          model = _options$split[0],
          property = _options$split[1];

      var seed = options.seed || this.seed;

      if (property.includes('|')) property = property.slice(0, property.indexOf('|')); // remove modifier if it exists

      if (schema[model] === undefined) return new Error('model ' + model + ' does not exist in provided schema: ' + schema);
      if (schema[model][property] === undefined) return new Error('model ' + model + ' does not include property ' + property + ' in provided schema: ' + schema);

      return this.sample({ collection: schema[model][property], seed: seed });
    }

    // gets and potentially sets model

  }, {
    key: 'modelFromState',
    value: function modelFromState() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var state = options.state || this.state;
      var schema = options.schema || this.schema.model;

      var _options$split2 = _slicedToArray(options.split, 3),
          model = _options$split2[0],
          name = _options$split2[1],
          property = _options$split2[2];

      var retrieved = state[model] && state[model][name] && state[model][name][property];
      if (retrieved !== undefined) return retrieved;

      //generate from schema
      if (state[model] === undefined) state[model] = {};
      if (state[model][name] === undefined) state[model][name] = {};
      if (state[model][name][property] === undefined) state[model][name][property] = this.modelFromSchema({ split: [model, property], schema: schema });
      return state[model][name][property];
    }

    // and then i guess i get to think about whehter modified models should simply be...changed in a different place. i think so? after the get...

  }, {
    key: 'modify',
    value: function modify(_ref) {
      var modifier = _ref.modifier,
          value = _ref.value;

      var fn = this.modifier[modifier];
      if (fn === undefined) return new Error('the modifier ' + modifier + ' does not exist in: ' + this.modifier);
      if (typeof fn !== 'function') return new Error('the modifier ' + modifier + ' does not appear to be a function: ' + fn);
      return Array.isArray(value) ? fn.apply(null, value.split('-')) : fn.call(null, value);
    }
  }, {
    key: 'sample',
    value: function sample() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var seed = options.seed || this.seed || seedrandom$2.alea(Math.random())();
      var collection = options.collection;

      if (collection === undefined) return new Error('no collection was provided from which to sample');
      if (typeof collection === 'string') return collection;

      var rng = seedrandom$2.alea(seed);
      var index = Math.floor(rng() * collection.length);
      if (index < 0 || index >= collection.length) return new Error('the calculated index of ' + index + ' went out of bounds for this collection ' + collection);
      return collection[index];
    }
  }]);

  return Generator;
}();

module.exports = Generator;

})));
