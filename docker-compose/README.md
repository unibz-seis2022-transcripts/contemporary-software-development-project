# Running the Contemporary Software Development project via docker compose

This is about running multiple Docker containers for the contemporary software development project. Please make sure to follow the guides in the `../(event|ticket)/README.md` files on how to create a Docker image first!

## Launch Docker container with `docker compose`

Execute the following to launch the container via docker compose in detached mode (put in another name for the `image` of the tickent-(event|ticket) services if necessary):

```bash
docker-compose up -d
```

Use the following to shut down the service:

```bash
docker-compose down
```

**Important:** Please make sure that the desired storage directories for the (event|ticket) services on your local machine do not contain subdirectories.