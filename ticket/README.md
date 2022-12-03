# Ticket service for the "Contemporary Software Development" project

## Testing

Jest is used for unit tests. The test suites can be run by executing `npm run test`.

## Running the local build

1. Make sure, you have `Node.js` and `npm` installed on your computer.
2. Install dependencies by running `npm install`.
3. Transpile the software to executable javascript by running `npm run build`.
4. Launch development server by running `npm run start`.

## Build docker image

1. Create a current build by running `npm run build`.
2. Inside this folder (`ticket`) execute the following command to build the docker image (replace `<image tag>` with the desired value): 
```bash
docker build . -t <image tag>
```
3. Start the image by executing the following line (replace `<target localhost port>` with the desired port on your machine and `<image tag>` with the previously chosen image tag):
```bash
docker run -p <target localhost port>:3002 <image tag>
```

## Execute docker image

Execute the following to run the container in detached mode (replace `<target port>` with the desired port on your localhost machine and `<image tag>` with the tag of the image that was used when building andtagging the image):

**Important:** Please make sure that the desired storage directory on your local machine does not contain subdirectories.

```bash
docker run -p <target port>:3002 -v `pwd`/storage/ticket:/app/storage -d <image tag>
```