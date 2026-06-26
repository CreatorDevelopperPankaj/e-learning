# TODO - Auth routing + public layout

- [x] Fix public layout shell visibility so header/sidebar NEVER show on auth routes.
  - Make it deterministic using ActivatedRoute snapshot (avoid router.url timing + setTimeout).
- [x] Add auth navigation links in `public-layout.component.html`.
- [x] Fix header buttons to navigate to `/login` and `/register`.

