# Step 1 of the Contemporary software development project

## Running the local build

1. Make sure, you have `Node.js` and `npm` installed on your computer.
2. Install dependencies by running `npm install`.
3. Transpile the software to executable javascript by running `npm run build`.
4. Launch development server by running `npm run start`.

## Build docker image

1. Create a current build by running `npm run build`.
2. Inside this folder (`step1`) execute the following command to build the docker image (replace `<target tag>` with the desired value): 
```bash
docker build -f ../step2/Dockerfile . -t <target tag>
```
3. Start the image by executing the following line (replace `<target localhost port>` with the desired port on your machine):
```bash
docker run -p <target localhost port>:3000
```

## Testing

Jest is used for unit tests. The test suites can be run by executing `npm run test`.
