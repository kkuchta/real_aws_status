// TODO: write a readme

To test locally, `node runner.js`, then open /tmp/status.html

To deploy:

1. `apex deploy`
2. In AWS, edit the latest version of this tool to remove the env vars apex adds, then save
  - The one in US east, because I keep forgetting and editing the wrong one
3. Create a new lambda version (since cloudfront won't accept $LATEST)
3. In the cloudfront distribution, edit the behavior by bumping the version to the latest lambda version
4. Invalidate * (or at least /) in the cloudfront distribution
4. Wait a few eons while cloudfront updates and you're good to go
