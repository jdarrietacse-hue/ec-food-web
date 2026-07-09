// @ts-check
const { test, expect } = require("@playwright/test");

/** Junta errores de consola y respuestas fallidas de la página */
function vigilar(page) {
  const errores = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errores.push("console: " + msg.text());
  });
  page.on("pageerror", (err) => errores.push("pageerror: " + err.message));
  page.on("response", (res) => {
    if (res.status() >= 400) errores.push("HTTP " + res.status() + ": " + res.url());
  });
  return errores;
}

test("carga sin errores, sin 404 y sin scroll horizontal", async ({ page }) => {
  const errores = vigilar(page);
  await page.goto("/");
  await expect(page).toHaveTitle(/EC FOOD/i);
  await expect(page.locator(".hero__slide.is-active .hero__title")).toBeVisible();
  await page.waitForLoadState("networkidle");

  // sin scroll horizontal
  const anchoDoc = await page.evaluate(() => document.documentElement.scrollWidth);
  const anchoVista = await page.evaluate(() => window.innerWidth);
  expect(anchoDoc).toBeLessThanOrEqual(anchoVista + 1);

  expect(errores, "La página tuvo errores:\n" + errores.join("\n")).toEqual([]);
});

test("hero slider: flechas, contador y barras funcionan", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#heroNum")).toHaveText("01");
  await expect(page.locator(".hero__slide").nth(0)).toHaveClass(/is-active/);

  await page.click("#heroNext");
  await expect(page.locator("#heroNum")).toHaveText("02");
  await expect(page.locator(".hero__slide").nth(1)).toHaveClass(/is-active/);
  await expect(page.locator(".hero__slide").nth(1).locator(".hero__title")).toBeVisible();

  await page.click("#heroPrev");
  await expect(page.locator("#heroNum")).toHaveText("01");

  // clic directo en la barra 4
  await page.locator(".hero__bar").nth(3).click();
  await expect(page.locator("#heroNum")).toHaveText("04");
  await expect(page.locator(".hero__slide").nth(3)).toHaveClass(/is-active/);
});

test("hero slider: autoplay avanza solo", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#heroNum")).toHaveText("01");
  // autoplay es cada 6s — esperamos hasta 8s a que pase al 02
  await expect(page.locator("#heroNum")).toHaveText("02", { timeout: 8000 });
});

test("carrusel de favoritos: las flechas desplazan", async ({ page }) => {
  await page.goto("/");
  const track = page.locator("#favTrack");
  await track.scrollIntoViewIfNeeded();
  const antes = await track.evaluate((el) => el.scrollLeft);
  await page.click("#favNext");
  await expect
    .poll(async () => track.evaluate((el) => el.scrollLeft), { timeout: 4000 })
    .toBeGreaterThan(antes + 100);
  await page.click("#favPrev");
  await expect
    .poll(async () => track.evaluate((el) => el.scrollLeft), { timeout: 4000 })
    .toBeLessThan(antes + 100);
  // hay 9 tarjetas con foto y precio
  await expect(page.locator(".fav-card")).toHaveCount(9);
  await expect(page.locator(".fav-card__price").first()).toBeVisible();
});

test("testimonios: los puntos cambian la cita", async ({ page }) => {
  await page.goto("/");
  const dots = page.locator("#quoteDots button");
  await expect(dots).toHaveCount(3);
  await dots.nth(2).click();
  await expect(page.locator("#quoteSlides blockquote").nth(2)).toHaveClass(/is-active/);
});

test("secciones aparecen al bajar (reveal) y el menú bento está completo", async ({ page }) => {
  await page.goto("/");
  await page.locator("#menu").scrollIntoViewIfNeeded();
  await expect(page.locator(".menu-card")).toHaveCount(4);
  await expect(page.locator(".menu__grid .reveal").first()).toHaveClass(/is-visible/, { timeout: 5000 });
  // contadores llegan a su número
  await page.locator(".about__stats").scrollIntoViewIfNeeded();
  await expect(page.locator("[data-count='100']")).toHaveText("100", { timeout: 5000 });
});

test("móvil: menú hamburguesa abre, navega y SE PUEDE CERRAR", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const burger = page.locator("#navBurger");
  await expect(burger).toBeVisible();

  await burger.click();
  await expect(page.locator("#navLinks")).toHaveClass(/is-open/);
  await expect(page.locator("#navLinks a", { hasText: "Menú" })).toBeVisible();

  // Esc lo cierra (regla: ningún overlay puede atrapar al usuario)
  await page.keyboard.press("Escape");
  await expect(page.locator("#navLinks")).not.toHaveClass(/is-open/);

  // se abre de nuevo y un link navega y cierra
  await burger.click();
  await page.locator("#navLinks a", { hasText: "Visítanos" }).click();
  await expect(page.locator("#navLinks")).not.toHaveClass(/is-open/);
  await expect(page.locator("#visitanos")).toBeInViewport();

  // sin scroll horizontal en móvil
  const anchoDoc = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(anchoDoc).toBeLessThanOrEqual(391);
});

test("swipe táctil en el hero cambia de plato", async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
  });
  const page = await context.newPage();
  await page.goto("http://localhost:4180/");
  await expect(page.locator("#heroNum")).toHaveText("01");
  // swipe hacia la izquierda
  await page.touchscreen.tap(200, 400);
  const hero = page.locator(".hero");
  const box = await hero.boundingBox();
  if (!box) throw new Error("hero sin caja");
  await page.evaluate(() => {
    const hero = document.querySelector(".hero");
    const t = (x) => new Touch({ identifier: 1, target: hero, clientX: x, clientY: 400 });
    hero.dispatchEvent(new TouchEvent("touchstart", { touches: [t(300)], bubbles: true }));
    hero.dispatchEvent(new TouchEvent("touchend", { changedTouches: [t(120)], bubbles: true }));
  });
  await expect(page.locator("#heroNum")).toHaveText("02");
  await context.close();
});
