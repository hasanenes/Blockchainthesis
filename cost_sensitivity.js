const fs = require("fs");
const path = require("path");

const GAS_PRICES_GWEI = [5, 20, 80];
const ETH_EUR_PRICES = [1500, 2500, 4000];
const SCENARIOS = [
  { label: "A_1000_single_hash_total", gas: 47955560, certificates: 1000 },
  { label: "B_1000_merkle_batch_total", gas: 48385, certificates: 1000 },
  { label: "A_500_single_hash_total", gas: 23977828, certificates: 500 },
  { label: "B_500_merkle_batch_total", gas: 48373, certificates: 500 },
];

function eur(gas, gasPriceGwei, ethEur) {
  return gas * gasPriceGwei * 1e-9 * ethEur;
}

const rows = [];
for (const scenario of SCENARIOS) {
  for (const gasPriceGwei of GAS_PRICES_GWEI) {
    for (const ethEur of ETH_EUR_PRICES) {
      const totalEur = eur(scenario.gas, gasPriceGwei, ethEur);
      rows.push({
        scenario: scenario.label,
        certificates: scenario.certificates,
        gas: scenario.gas,
        gasPriceGwei,
        ethEur,
        totalEur,
        eurPerCertificate: totalEur / scenario.certificates,
      });
    }
  }
}

const outDir = path.join(__dirname, "..", "results");
fs.mkdirSync(outDir, { recursive: true });
const header = ["scenario", "certificates", "gas", "gasPriceGwei", "ethEur", "totalEur", "eurPerCertificate"];
const csv = [
  header.join(","),
  ...rows.map((row) =>
    header
      .map((key) => (typeof row[key] === "number" ? row[key].toFixed(key.includes("Eur") || key.includes("eur") ? 6 : 0) : row[key]))
      .join(",")
  ),
].join("\n");
fs.writeFileSync(path.join(outDir, "cost_sensitivity.csv"), csv);
fs.writeFileSync(path.join(outDir, "cost_sensitivity.json"), JSON.stringify(rows, null, 2));

for (const row of rows) {
  if (row.ethEur === 2500 && row.gasPriceGwei === 20) {
    console.log(
      `${row.scenario}: ${row.totalEur.toFixed(2)} EUR total, ${row.eurPerCertificate.toFixed(4)} EUR/certificate`
    );
  }
}
console.log("\nWrote results/cost_sensitivity.csv");
console.log("Wrote results/cost_sensitivity.json");
