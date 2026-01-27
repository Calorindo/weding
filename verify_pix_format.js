const normalizeStr = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const sanitizeTxId = (rawId) => {
    return normalizeStr(rawId)
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')
        .substring(0, 25) || "PRESENTEPX";
};

const testCases = [
    { input: "0520-Ojzx-MJrrWI6Ig", expected: "0520OJZXMJRRWI6IG" },
    { input: "café-com-leite", expected: "CAFECOMLEITE" },
    { input: "a".repeat(30), expected: "A".repeat(25) },
    { input: "", expected: "PRESENTEPX" }
];

console.log("Running TxID Sanitization Tests...");
let allPassed = true;

testCases.forEach((test, index) => {
    const result = sanitizeTxId(test.input);
    const passed = result === test.expected;
    console.log(`Test ${index + 1}: Input="${test.input}" -> Output="${result}" ... ${passed ? "PASS" : "FAIL"}`);
    if (!passed) allPassed = false;
});

if (allPassed) {
    console.log("\nAll tests passed! The sanitization logic is correct.");
} else {
    console.error("\nSome tests failed.");
    process.exit(1);
}
