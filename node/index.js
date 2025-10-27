// Stress Test: Bun vs Node.js Performance Comparison

const ITERATIONS = 1_000_000;
const FILE_SIZE = 10_000;

// Test 1: JSON Operations
function testJSONOperations() {
  const start = performance.now();
  const data = { name: "test", value: 123, nested: { array: [1, 2, 3, 4, 5] } };

  for (let i = 0; i < ITERATIONS; i++) {
    const str = JSON.stringify(data);
    JSON.parse(str);
  }

  return performance.now() - start;
}

// Test 2: String Manipulation
function testStringOperations() {
  const start = performance.now();
  let result = "";

  for (let i = 0; i < ITERATIONS / 10; i++) {
    result = "Hello".repeat(10) + " " + "World".repeat(10);
    result.split(" ").join("-").toUpperCase();
  }

  return performance.now() - start;
}

// Test 3: Array Operations
function testArrayOperations() {
  const start = performance.now();

  for (let i = 0; i < ITERATIONS / 100; i++) {
    const arr = Array.from({ length: 1000 }, (_, i) => i);
    arr
      .map((x) => x * 2)
      .filter((x) => x % 4 === 0)
      .reduce((a, b) => a + b, 0);
  }

  return performance.now() - start;
}

// Test 4: Object Creation and Property Access
function testObjectOperations() {
  const start = performance.now();

  for (let i = 0; i < ITERATIONS; i++) {
    const obj = { a: 1, b: 2, c: 3, d: 4, e: 5 };
    obj.a + obj.b + obj.c + obj.d + obj.e;
  }

  return performance.now() - start;
}

// Test 5: Mathematical Operations
function testMathOperations() {
  const start = performance.now();
  let result = 0;

  for (let i = 0; i < ITERATIONS; i++) {
    result += Math.sqrt(i) + Math.pow(i, 2) + Math.sin(i) + Math.cos(i);
  }

  return performance.now() - start;
}

// Test 6: Promise/Async Operations
async function testAsyncOperations() {
  const start = performance.now();

  const promises = Array.from({ length: 10000 }, async (_, i) => {
    return new Promise((resolve) => {
      resolve(i * 2);
    });
  });

  await Promise.all(promises);

  return performance.now() - start;
}

// Test 7: RegExp Operations
function testRegExpOperations() {
  const start = performance.now();
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const text = "test.email123@example.com";

  for (let i = 0; i < ITERATIONS / 10; i++) {
    pattern.test(text);
    text.match(/[0-9]+/g);
  }

  return performance.now() - start;
}

// Test 8: Function Call Overhead
function testFunctionCalls() {
  const start = performance.now();

  const add = (a, b) => a + b;
  let result = 0;

  for (let i = 0; i < ITERATIONS; i++) {
    result = add(result, i);
  }

  return performance.now() - start;
}

// Test 9: Buffer/TypedArray Operations
function testBufferOperations() {
  const start = performance.now();

  for (let i = 0; i < ITERATIONS / 100; i++) {
    const buffer = new Uint8Array(1000);
    for (let j = 0; j < buffer.length; j++) {
      buffer[j] = j % 256;
    }
  }

  return performance.now() - start;
}

// Test 10: Set and Map Operations
function testCollectionOperations() {
  const start = performance.now();

  for (let i = 0; i < ITERATIONS / 100; i++) {
    const set = new Set();
    const map = new Map();

    for (let j = 0; j < 100; j++) {
      set.add(j);
      map.set(j, j * 2);
    }

    set.has(50);
    map.get(50);
  }

  return performance.now() - start;
}

// Main benchmark runner
async function runBenchmarks() {
  const runtime = typeof Bun !== "undefined" ? "Bun" : "Node.js";
  const version = typeof Bun !== "undefined" ? Bun.version : process.version;

  console.log("═".repeat(60));
  console.log(`  Performance Stress Test - ${runtime} ${version}`);
  console.log("═".repeat(60));
  console.log();

  const tests = [
    {
      name: "JSON Stringify/Parse",
      fn: testJSONOperations,
      iterations: ITERATIONS,
    },
    {
      name: "String Manipulation",
      fn: testStringOperations,
      iterations: ITERATIONS / 10,
    },
    {
      name: "Array Operations",
      fn: testArrayOperations,
      iterations: ITERATIONS / 100,
    },
    {
      name: "Object Creation",
      fn: testObjectOperations,
      iterations: ITERATIONS,
    },
    { name: "Math Operations", fn: testMathOperations, iterations: ITERATIONS },
    {
      name: "RegExp Operations",
      fn: testRegExpOperations,
      iterations: ITERATIONS / 10,
    },
    { name: "Function Calls", fn: testFunctionCalls, iterations: ITERATIONS },
    {
      name: "Buffer/TypedArray",
      fn: testBufferOperations,
      iterations: ITERATIONS / 100,
    },
    {
      name: "Set/Map Operations",
      fn: testCollectionOperations,
      iterations: ITERATIONS / 100,
    },
  ];

  const results = [];

  for (const test of tests) {
    // Warm up
    test.fn();

    // Run test
    const time = test.fn();
    const opsPerSec = (test.iterations / (time / 1000)).toFixed(0);

    results.push({
      name: test.name,
      time: time.toFixed(2),
      opsPerSec: opsPerSec,
    });

    console.log(
      `${test.name.padEnd(25)} ${time.toFixed(2).padStart(10)} ms  ${opsPerSec.padStart(15)} ops/sec`,
    );
  }

  // Async test
  console.log();
  console.log("Running async operations test...");
  const asyncTime = await testAsyncOperations();
  console.log(
    `${"Async/Promise".padEnd(25)} ${asyncTime.toFixed(2).padStart(10)} ms  ${(10000 / (asyncTime / 1000)).toFixed(0).padStart(15)} ops/sec`,
  );

  console.log();
  console.log("═".repeat(60));
  console.log(
    `  Total Runtime: ${results.reduce((sum, r) => sum + parseFloat(r.time), 0).toFixed(2)} ms`,
  );
  console.log("═".repeat(60));
}

// Run the benchmarks
runBenchmarks().catch(console.error);
