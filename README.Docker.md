### Building and running the frontend

The image serves the built Vue app with nginx. It does not include the Jobs
Listing API; run that separately.

`VITE_API_URL` (the API's public base URL) is required at build time:

```bash
docker compose up --build                                          # uses VITE_API_URL from your shell or local .env
VITE_API_URL=https://api.example.com docker compose up --build     # production URL
```

The app is then available at http://localhost:8080.

### Deploying to the cloud

Build the image with the production API URL, e.g.
`docker build --build-arg VITE_API_URL=https://api.example.com -t myapp .`.
If your cloud uses a different CPU architecture than your machine, add
`--platform=linux/amd64`. Then push it to your registry, e.g.
`docker push myregistry.com/myapp`.

### References
* [Docker's Node.js guide](https://docs.docker.com/language/nodejs/)
