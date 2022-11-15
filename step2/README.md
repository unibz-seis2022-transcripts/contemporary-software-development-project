# Step 2 of the Contemporary software development project

This is about running a Docker container for the contemporary software development project. Please make sure to follow the guide in `../step1/README.md` on how to create a Docker image first!

## Launch Docker container with `docker run`

Execute the following to run the container in detached mode (replace `<target port>` with the desired port on your localhost machine and `<image tag>` with the tag of the image that was used when building and tagging the image):

```bash
docker run -p <target port>:3000 -v `pwd`/storage:/app/storage -d <image tag>
```

## Launch Docker container with `docker compose`

Execute the following to launch the container via docker compose in detached mode (put in another name for the `image` if necessary):

```bash
docker-compose up -d
```

Use the following to shut down the service:

```bash
docker-compose down
```