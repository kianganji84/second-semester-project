# Migration verification

Verified locally in headless Chrome on 2026-09-19.

The initial migration checks below predate the requested slider repair. Their layout-match result describes that earlier state; the repaired landing sliders now intentionally display and move their cards, and product sliders fit mobile viewports. The original handler-only category test did not establish that content actually moved; it has been replaced by real drag and button tests for this repair.

- `npm install`, `npm run dev`, `npm run build`, and `npm run preview` completed successfully.
- The development script invokes Tailwind CLI for an initial build and a persistent watcher; the production script invokes the CLI before Vite.
- Compared landing, login, and grocery pages at widths **1440, 768, and 390 px**, with a 900 px viewport height. Compared element bounding rectangles, 29 computed layout/typography/color properties, and generated `::before`/`::after` content and styling. All nine final comparisons had **zero differences** in those measurements. Animated GIF frames were not used for a pixel-identical assertion.
- Inspected screenshots of all three pages. Repaired brand-image references and two explicitly documented missing-image placeholders are intentional asset differences.
- Tested landing → login → landing, landing → grocery, and grocery → landing links.
- Tested empty-field validation and filled native login form submission.
- Tested menu opening, grocery menu pane switching, hero slider navigation, product slider movement in both directions, and category drag handlers. The source's nested carousel scroll behavior is retained.
- Tested footer expansion/collapse and the fade pseudo-element.
- Repeated the interaction checks against the production build served by Vite preview.
- All four pages loaded with **zero broken images or browser console errors**.
- Checked **456 local resource/navigation references** against files in the new project.
- Verified no inline application scripts, inline event handlers, inline style attributes, or style blocks remain in the new HTML.
- Normalized body text matches the source on all four pages; Persian wording and order are unchanged.
- SHA-256 checks confirmed **325 source files unchanged**, with no source files added or removed (excluding installed dependency files from the manifest). No commands wrote into the source folder.
- **279 copied assets** match the source byte-for-byte.

Absent source styles, missing brand assets, and backend-free forms are detailed in `README.md`.

## Slider repair verification

Root causes: a grocery-only initialization guard left all six landing Swipers inactive; grocery category handlers targeted an outer viewport while an inner track owned the scrolling; the final grocery favorites controls were nested inside the translated wrapper. Shared selector-based controls and fixed mobile product widths were also replaced with per-container controls and viewport-constrained widths.

- Tested all **10 Swipers and 6 native scroll carousels** across the landing and grocery pages at **1440, 768, and 390 px**.
- Real next/previous clicks moved the intended Swiper without changing any other instance; a favorites carousel with all cards visible correctly locked its navigation.
- Tested real mouse dragging on every native carousel, visible arrow clicks, and disabled end states. Category arrows remain hidden at the original mobile breakpoint, where dragging/touch scrolling is used.
- Verified both hero banners autoplay and navigate to the clicked pagination bullet at all three widths.
- Used browser touch input to verify mobile offer Swipers and category carousels on both pages, plus grocery product scrolling.
- Repeated the full desktop/tablet/mobile carousel suite against the production build served by Vite preview. All checks passed, with no uncaught JavaScript errors. Login and the empty food page also loaded without script errors.
- `npm run build` passed after the final fixes, generating CSS through Tailwind CLI before Vite.
- Only `project-digikala-2` was changed; the source project remains untouched.

## Full responsive layout update

This subsequent update replaces the source's fixed small-screen layouts. Earlier pixel/layout comparison results above are historical and do not describe these intentionally responsive layouts.

- All four pages checked at **160, 200, 280, 390, 768, 1024, 1440, and 2560 CSS pixels** wide: **32 page/viewport checks**, with no page-level horizontal overflow, broken images, or uncaught JavaScript errors. Document overflow is visible rather than hidden; intentional carousel scrolling is confined to its own viewport.
- Header/navigation, category menus, service shortcuts, hero banners, offer/brand/favorites carousels, category grids, product cards, advertising sections, recommendation grids, article cards, footer sections, and login now use responsive Tailwind utilities. The empty food page remains empty and fluid.
- Inspected screenshots of header, offers, product grids, footer, and login at phone/watch widths.
- Tested every Swiper's arrows, native track touch scrolling, tap menu open/close and category selection, and footer expansion at **160, 200, 390, 768, and 1440 px**, in development and production preview.
- Tested login validation and submission at **160, 200, 390, and 1440 px**, including **160px-tall** watch-sized viewports.
- After the final compact-banner correction, retested production banner arrows, visible/clickable pagination, and document width at **160, 200, 390, 768, 1440, and 2560 px**. Verified Space/Escape menu controls on watch-sized viewports.
- Normalized body text is unchanged on every page. Persian content, RTL direction, images, and fonts are retained.
- Final `npm run build` passed using the existing Tailwind CLI workflow. No framework, CDN, or Tailwind Vite plugin was introduced.

Watch-sized screens were emulated in Chrome; this is viewport testing, not testing on physical smartwatch hardware. Original text embedded in banner images scales with the image, and browser zoom is unrestricted.

## Desktop four-ad alignment correction

- Removed the full-viewport max-width override from both four-ad rows.
- At desktop widths, each row is centered and capped at the original **1330px**, keeping four 322px ads separated by roughly 14px rather than distributing them across an ultrawide viewport.
- The responsive two-column and one-column layouts below 1280px are unchanged.
