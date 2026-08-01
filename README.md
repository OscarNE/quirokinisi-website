# Quirokinisi website

Static website for GitHub Pages.

## Expected image files

Place these files in `images/`:

- `logo.webp`
- `hero.webp`
- `biomagnetismo.webp`
- `masaje-ayurveda.webp`
- `moxibustion.webp`
- `quiromasaje.webp`
- `ventosas.webp`
- `electroacupuntura.webp`

## Local preview

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Publish

```bash
git add .
git commit -m "Build initial Quirokinisi website"
git push
```

In GitHub, open **Settings → Pages**, choose **Deploy from a branch**, then
select `main` and `/ (root)`.
