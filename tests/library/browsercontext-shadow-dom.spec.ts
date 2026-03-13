/**
 * Copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { browserTest as it, expect } from '../config/browserTest';

it('should leave closed shadow roots closed by default', async ({ page }) => {
  await page.setContent(`<div id="host"></div>
  <script>
    const root = document.querySelector('#host').attachShadow({ mode: 'closed' });
    root.innerHTML = '<span>inside shadow</span>';
  </script>`);
  const shadowRoot = await page.evaluate(() => document.querySelector('#host').shadowRoot);
  expect(shadowRoot).toBeNull();
});

it.describe('forceShadowOpen', () => {
  it.use({ forceShadowOpen: true });

  it('should force closed shadow roots to be open', async ({ page }) => {
    await page.setContent(`<div id="host"></div>
    <script>
      const root = document.querySelector('#host').attachShadow({ mode: 'closed' });
      root.innerHTML = '<span>inside shadow</span>';
    </script>`);
    const shadowRoot = await page.evaluate(() => document.querySelector('#host').shadowRoot);
    expect(shadowRoot).not.toBeNull();
  });

  it('should allow querying elements inside forced-open shadow roots', async ({ page }) => {
    await page.setContent(`<div id="host"></div>
    <script>
      const root = document.querySelector('#host').attachShadow({ mode: 'closed' });
      root.innerHTML = '<span class="inner">inside shadow</span>';
    </script>`);
    const text = await page.locator('#host').locator('.inner').textContent();
    expect(text).toBe('inside shadow');
  });

  it('should keep open shadow roots open', async ({ page }) => {
    await page.setContent(`<div id="host"></div>
    <script>
      const root = document.querySelector('#host').attachShadow({ mode: 'open' });
      root.innerHTML = '<span>inside open shadow</span>';
    </script>`);
    const shadowRoot = await page.evaluate(() => document.querySelector('#host').shadowRoot);
    expect(shadowRoot).not.toBeNull();
  });
});
