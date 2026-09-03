import { expect, test } from "@playwright/test";

const expeditionResponse = (response: { url(): string; request(): { method(): string } }) =>
  response.url().includes("/api/expedition?locale=es") && response.request().method() === "GET";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(HTMLMediaElement.prototype, "play", {
      configurable: true,
      value: () => Promise.resolve(),
    });
    Object.defineProperty(HTMLMediaElement.prototype, "pause", {
      configurable: true,
      value: () => undefined,
    });
  });
});

test("complete Juan Alexander official bilingual safari journey and returning identity", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => { if (message.type() === "error" && !message.text().includes("WebGL")) errors.push(message.text()); });

  const initialExpedition = page.waitForResponse(expeditionResponse);
  await page.goto("/");
  await initialExpedition;
  await expect(page.getByRole("heading", { name: "MI PRIMER AÑO" })).toBeVisible();
  await expect(page.getByText("JUAN ALEXANDER", { exact: true }).first()).toBeVisible();
  await expect(page.getByText(/26 DE SEPTIEMBRE · 2026/)).toBeVisible();
  await expect(page.getByText("1:00 PM").first()).toBeVisible();

  await page.getByRole("button", { name: "ENTRAR A MI SAFARI" }).click();
  await expect(page.getByText("LA SELVA TE HA ELEGIDO")).toBeVisible();

  const before = await page.evaluate(async () => (await fetch("/api/expedition?locale=es")).json());
  const reloadExpedition = page.waitForResponse(expeditionResponse);
  await page.reload();
  await reloadExpedition;
  const after = await page.evaluate(async () => (await fetch("/api/expedition?locale=es")).json());
  expect(after.animalKey).toBe(before.animalKey);

  await page.getByRole("button", { name: "ENTRAR A MI SAFARI" }).click();
  await expect(page.getByRole("button", { name: "MAPA VIVO DEL SAFARI" })).toBeVisible();
  await page.getByRole("button", { name: "MAPA VIVO DEL SAFARI" }).click();
  await expect(page.getByRole("dialog", { name: "Mapa vivo del safari" })).toBeVisible();
  await page.getByRole("button", { name: "Cerrar mapa" }).click();

  await page.locator("[data-official-step='COORDINATES']").scrollIntoViewIfNeeded();
  await expect(page.getByText("Lotificación Castilla")).toBeVisible();
  await expect(page.getByText(/Lote #13/)).toBeVisible();
  await expect(page.getByText(/San Miguel · El Salvador/)).toBeVisible();

  await page.locator("[data-official-step='RSVP']").scrollIntoViewIfNeeded();
  await page.route("**/api/rsvp", (route) => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ saved: true }) }));
  await page.getByPlaceholder("Tu nombre").fill("Invitado QA");
  await page.getByRole("button", { name: "CONFIRMAR" }).click();
  await expect(page.locator(".official-pass")).toBeVisible();
  await expect(page.getByText("26 SEPTIEMBRE 2026 · 1:00 PM")).toBeVisible();

  await page.getByRole("button", { name: "CERRAR" }).click();
  await page.getByRole("button", { name: "EN", exact: true }).click();
  await expect(page.getByText("THE JUNGLE HAS CHOSEN YOU")).toBeVisible();
  expect(errors).toEqual([]);
});

test("essential official event data remains accessible with reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByText(/Lotificación Castilla/)).toBeAttached();
  await expect(page.getByText(/San Miguel/).first()).toBeAttached();
  await expect(page.getByRole("button", { name: "ENTRAR A MI SAFARI" })).toBeVisible();
});

test("WebGL unsupported keeps the illustrated official invitation usable", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string, options?: unknown) {
      if (type === "webgl" || type === "webgl2") return null;
      return original.call(this, type as never, options as never);
    } as typeof HTMLCanvasElement.prototype.getContext;
  });
  await page.goto("/");
  await expect(page.getByText("Modo ilustrado activo")).toBeVisible();
  await expect(page.getByRole("heading", { name: "MI PRIMER AÑO" })).toBeVisible();
  await expect(page.getByRole("button", { name: "ENTRAR A MI SAFARI" })).toBeVisible();
});
