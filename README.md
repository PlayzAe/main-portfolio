# Peak

My portfolio site. I'm George Moses Azuoru ([@playzae](https://github.com/playzae)), co-founder of [Emberfig](https://emberfig.com).

I built it with React 19, Vite and Tailwind CSS 4. There's no backend, so the build is plain static files.

Live at [playzae.dev](https://playzae.dev).

## Run it locally

```bash
npm install
npm run dev
```

On Windows you can double-click `start.bat` instead. It installs dependencies if needed and starts the dev server at http://localhost:5173.

## Test and build

```bash
npm test
npm run build
```

The build goes to `dist/`.

## Deploy

I host it on GitHub Pages. The workflow in `.github/workflows/pages.yml` builds and deploys on every push to `main`.

To set it up on a fork:

1. Open Settings > Pages and set Source to "GitHub Actions".
2. Push to `main`, or run "Deploy to GitHub Pages" from the Actions tab.

Asset paths are relative, so the same build works at `https://<user>.github.io/<repo>/` or on a custom domain.

## License

The code is mine. Project names and logos belong to their projects.
