## Image Chooser

The image chooser is used for grabbing images for orgs. It does a lot for us:

1. it scrapes images from the organization homepage
2. it shows the images on the image chooser
3. it uploads the images to airtable

### Scraping images

```
node bin/fetch-orgs.js
node bin/fetch-images.js
```

### Choosing images

```
npm run start
open localhost:3000
```

On the site:

- select images for each org
- click _show more_ to see more
- in the console, run `copy(json)` to copy the results to the clipboard
- paste the results in `out/images.json`

### uploading the images

```
node bin/update-images.js
```
