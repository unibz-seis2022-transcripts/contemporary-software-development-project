# Contemporary software development project

## Set up Gitlab runner

1. Make sure `Docker` is running on your machine: `sudo systemctl start docker`
2. Check if you have local runners registered: `sudo gitlab-runner list` (there should be exactly 2)
3. In case there are no runners registerd:
   1. Run `sudo gitlab-runner register`
   2. Enter the instance URL and registration token from the [Gitlab settings page](https://gitlab.inf.unibz.it/LinusAlbert.Scheibe/contemporary-software-development-project/-/settings/ci_cd#js-runners-settings)
   3. For the first runner: Enter the **tag** `build-and-test` and choose `docker` as executor
   4. For the second runner: Enter the **tag** `create-image` and choose `shell` as executor
4. Start the runners using `sudo gitlab-runner run` (now they should show up on the Gitlab runners page)
