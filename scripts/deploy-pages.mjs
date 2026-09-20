/**
 * Testfassung auf GitHub Pages veröffentlichen.
 *
 * Hintergrund: Der eigentliche Weg wäre der Workflow in
 * .github/workflows/deploy.yml — dafür fehlt dem GitHub-Token aber die
 * Berechtigung "workflow". Solange die fehlt, baut dieses Skript die Seite
 * lokal und schiebt das Ergebnis in den Zweig gh-pages.
 *
 * Aufruf:  npm run deploy
 */
import { execSync } from "node:child_process";
import { existsSync, rmSync, writeFileSync } from "node:fs";

const REPO = "demo-takeaway";
const OWNER = "mauricestuder";
const run = (cmd, opts = {}) =>
  execSync(cmd, { stdio: "inherit", shell: true, ...opts });

console.log("→ Alte Ausgabe entfernen");
for (const dir of [".next", "out"]) {
  if (existsSync(dir)) rmSync(dir, { recursive: true, force: true });
}

console.log("→ Statisch exportieren");
run("npx next build", {
  env: {
    ...process.env,
    GITHUB_PAGES: "true",
    PAGES_BASE_PATH: `/${REPO}`,
  },
});

// Ohne .nojekyll verschluckt GitHub Pages den Ordner /_next — die Seite käme
// dann ohne CSS und JavaScript an.
writeFileSync("out/.nojekyll", "");

console.log("→ Nach gh-pages veröffentlichen");
const git = (cmd) => run(`git ${cmd}`, { cwd: "out" });
git("init -q");
git("checkout -q -B gh-pages");
git("add -A");
git('-c user.email=deploy@local -c user.name=Deploy commit -q -m "Testfassung der Website (statischer Export)"');
git(`remote add origin https://github.com/${OWNER}/${REPO}.git`);
git("push -q -f origin gh-pages");

console.log(`\n✓ Fertig: https://${OWNER.toLowerCase()}.github.io/${REPO}/`);
console.log("  (GitHub braucht meist 1–2 Minuten, bis die neue Fassung live ist.)");
