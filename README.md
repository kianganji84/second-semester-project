# project-digikala-2

Vanilla JavaScript, Vite, and Tailwind CSS CLI migration of `final-project-digikala`.

Use Node.js 20.19+ or 22.12+:

```sh
npm install
npm run dev
```

`npm run dev` builds the CSS first, then runs the Tailwind CLI watcher and Vite together. Open the local URL printed by Vite. Stop both with Ctrl+C.

```sh
npm run build
npm run preview
```

The production site is written to `dist/`. All four HTML files are explicit Vite build entries.

## Files

- `index.html`: original landing page and content, styled with Tailwind utilities.
- `login.html`: original RTL login form, including native required-field validation.
- `super-market.html`: original grocery page.
- `digikala-food.html`: original empty placeholder page.
- `main.js`: shared Swiper and scroll-carousel initialization on both shopping pages, plus guarded grocery menu and footer controls.
- `src/input.css`: Yekan font registration and Tailwind utilities directive.
- `src/generated.css`: generated CLI output; do not edit manually.
- `tailwind.config.js`: scans root HTML, `main.js`, and JavaScript under `src/`; disables Preflight to retain the original browser defaults.
- `scripts/dev.mjs`: starts the CSS compiler/watcher and Vite.
- `public/images`, `public/fonts`, `public/font-awesome`: copied source assets.
- `public/vendor/swiper.css`: the existing Swiper 12.1.0 library styles, in a vendor layer. The same Swiper version is installed through npm for JavaScript.

Tailwind 3.4 uses its npm-provided `tailwindcss` CLI. `npm run css:build` generates minified CSS and `npm run css:watch` runs the compiler separately. There is no CDN, Tailwind Vite plugin, or Tailwind PostCSS integration. Authored page styles are utility classes, including arbitrary values, media queries, hover/focus states, state classes, and pseudo-elements. The old authored stylesheets are not included.

## Preserved behavior and source limitations

The supplied landing-page `js/main.js` was empty. Following the requested slider repair, all landing and grocery carousels now initialize. Each Swiper has local navigation controls, including both favorites sections. Controls nested inside moving wrappers are moved to the stationary slider container before initialization. Both category grids scroll through their outer viewport, and category/product tracks support mouse dragging as well as native touch scrolling. Arrows disable at the ends or when all items fit.

Both shopping pages now support tap and keyboard category-menu controls and footer expansion, so content remains accessible on small touch screens. The login and search forms retain their original actions; no authentication, search backend, or cart functionality has been added.

All page sections now use responsive Tailwind utilities. The compact header stays in document flow, navigation wraps, menus can be opened by tapping, grids reduce their column count, and advertisements and footer content reflow. Carousels show fewer cards on small screens, reaching one card/column at watch widths. Hero controls move beneath the image below 480px to avoid overlap. Login supports narrow and short viewports with normal vertical scrolling. Page-level horizontal clipping is not used to conceal overflow.

Layouts were checked from 160 to 2560 CSS pixels wide. Watch-sized viewports were simulated in Chrome; physical smartwatch browser support depends on the device. Content embedded in the original banner images scales with those images; browser zoom remains enabled.

Seven grocery CSS imports referred to absent files; those dead references were omitted, without inventing replacement styles. The unlinked source `tests/` fragments and unused/duplicate source CSS are not part of this runnable site.

Page names and internal navigation are unchanged. The malformed `.//index.html` links were normalized to `./index.html`; assets are served from Vite's `public/` directory, and Swiper no longer loads through a `node_modules` URL.

Four brand-image URLs were broken in the original landing page. Images 15 and 17 now point to the existing `.jpg` files. Images 18 and 19 do not exist in the supplied assets; their original slots and alt labels are retained with minimal labeled SVG placeholders. These two original logos cannot be reproduced without the missing files. An empty favicon prevents the browser's incidental favicon 404.

The source folder was only read. See `verification.md` for checks performed.
