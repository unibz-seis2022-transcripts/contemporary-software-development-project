# Running the Contemporary Software Development project via docker compose

This is about running multiple Docker containers for the contemporary software development project. Please make sure to follow the guides in the `../(event|ticket)/README.md` files on how to create a Docker image first!

## Launch Docker container with `docker compose`

Execute the following to launch the container via docker compose in detached mode (put in another name for the `image` of the tickent-(event|ticket) services if necessary):

```bash
docker-compose up -d
```

After executing this command, it takes a few seconds until the core services are ready, this is due to the boot-up time of the message queue. Subsequently the API endpoints can be called using the port of the nginx reverse proxy (by default `8080` on your local machine).

Use the following to shut down the service:

```bash
docker-compose down
```

**Important:** Please make sure that the desired storage directories for the (event|ticket) services on your local machine do not contain subdirectories.