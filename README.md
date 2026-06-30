# MyStore

`MyStore` is the Angular Fundamentals capstone for Udacity's Full Stack JavaScript Developer Nanodegree. The application recreates a complete single-page shopping flow: product browsing, product detail views, a shared cart, validated checkout, and an order confirmation screen.

![MyStore shopping flow](shoppingflow.gif)

## Features

- Product catalog loaded with Angular `HttpClient` from `src/assets/data.json`
- Parent/child data flow with `@Input()` and `@Output()` between the product list and product card components
- Shared cart state managed through an Angular service
- Template-driven forms with `ngModel` and client-side validation on checkout
- Cart badge, order total, empty-cart state, and add-to-cart feedback
- GitHub Pages deployment workflow for the main branch

## Stack

- Angular 22
- TypeScript
- RxJS
- Angular router
- Template-driven forms

## Local development

Use an LTS Node release such as Node 22 for the smoothest local experience.

```bash
npm install
npm start
```

The development server runs at `http://localhost:4200/`.

## Scripts

```bash
npm run build
npm run test:ci
npm run build:pages
```

## Project structure

- `src/app/components/` contains the storefront, detail, cart, and confirmation views
- `src/app/services/` contains the product data service and shared cart state
- `src/app/models/` contains typed product, cart, and confirmation models
- `.github/workflows/manual.yml` builds, tests, and deploys the site to GitHub Pages on pushes to `main`

## GitHub Pages

The production site is configured for GitHub Pages at:

- `https://devin-thomas.github.io/udangular/`

## Verification

The current implementation is validated with:

```bash
npm run build
npm run test:ci
```
