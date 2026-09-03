import { expect, test } from "@playwright/test";

test("complete bilingual safari journey and returning identity", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => { if (message.type() === "error" && !message.text().includes("WebGL")) errors.push(message.text()); });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "WILD ONE" })).toBeVisible();
  await expect(page.getByText("SEPTEMBER 20 · 2026")).toBeVisible();
  await page.getByRole("button", { name: /ENTER THE SAFARI/ }).click();
  await expect(page.getByText("THE JUNGLE HAS CHOSEN YOU")).toBeVisible();
  await page.getByLabel("Cambiar a español").click();
  await expect(page.getByText("LA SELVA TE HA ELEGIDO")).toBeVisible();
  await page.getByRole("button", { name: /ABRIR EL MAPA VIVO/ }).click();
  await expect(page.getByRole("dialog", { name: "Mapa vivo del safari" })).toBeVisible();
  await page.getByRole("button", { name: "Cerrar mapa" }).click();
  await page.locator("[data-journey-step='RSVP']").scrollIntoViewIfNeeded();
  await page.route("**/api/rsvp", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ saved: true }),
    }),
  );
  await page.getByLabel("NOMBRE DEL INVITADO").fill("Invitado QA");
  await page.getByRole("button", { name: "TRANSMITIR RSVP" }).click();
  await expect(page.getByText(/TRANSMISIÓN RECIBIDA|WhatsApp sigue disponible/)).toBeVisible();
  const animal = await page.evaluate(() => JSON.parse(localStorage.getItem("wild-one-expedition-v5") ?? "{}").animalKey);
  await page.reload();
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem("wild-one-expedition-v5") ?? "{}").animalKey)).toBe(animal);
  expect(errors).toEqual([]);
});

test("reduced motion keeps essential event data accessible", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByText("581 Kathy Lane")).toBeAttached();
  await expect(page.getByRole("button", { name: /ENTER THE SAFARI/ })).toBeVisible();
});

test("WebGL unsupported uses the premium illustrated experience", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string, options?: unknown) {
      if (type === "webgl" || type === "webgl2") return null;
      return original.call(this, type as never, options as never);
    } as typeof HTMLCanvasElement.prototype.getContext;
  });
  await page.goto("/");
  await expect(page.getByText("Illustrated journey active")).toBeVisible();
  await expect(page.getByRole("heading", { name: "WILD ONE" })).toBeVisible();
});
