# Contemporary software development project

## Set up Gitlab runner

1. Go to the [runners section in the CI/CD Settings page of the project](https://gitlab.inf.unibz.it/LinusAlbert.Scheibe/contemporary-software-development-project/-/settings/ci_cd#js-runners-settings)
2. Make sure `Docker` is running on your machine: `sudo systemctl start docker`
3. Register your computer as runner
   1. Run `sudo gitlab-runner register`
   2. Enter the instance URL and registration token from the Gitlab settings page
   3. As tag enter `build`
   4. As executor choose `shell`
   5. Start the runner using `sudo gitlab-runner run` (now it should show up on the Gitlab runners page)
