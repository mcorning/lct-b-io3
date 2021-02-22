# Local Contact Tracing - Bravo (lct-b)

This version of LCT uses Socket.io V3 and RedisGraph to handle a new Covid-19 alert protocol. This new protocol has many advantages over the one used in 2020. Here are the main differences:

- No need for Rooms
- Public Spaces replace Rooms
- Visitors pass a Cypher query to RedisGraph to link a socket ID to a public space node
- The protocol  
  - does a search of the graph for any other Visitor nodes that shared space with Visitor sending the warning
  - search repeats for each exposed Visitor until the graph is completely searched
  
The next section lists the commands to get your fork of LCT running.

The section following describes the CD/CI workflow using Heroku.

## Project setup

```node
npm install
```

### Compiles and hot-reloads for development

```node
npm run serve
```

### Compiles and minifies for production

```node
npm run build
```

### Lints and fixes files

```node
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

## Replication Steps

To use LCT in your community, you need to fork two github repos. Then you will make changes necessary to handle your local public places. Also, you will configure the both projects with the appropriate servers (see below for details).

### LCT-B

Insert the appropriate data file with your public places in the src/assets/data folder. Then modify the javascript in LCT-B to ensure access to that data and proper handling of its contents by your fork of LCT-B.

After you have setup your fork of Socket.io.server and have deployed it to Heroku (or what other hosting site you choose), update the src/config.json with the url to your public socket.io.server.

```json
{
  "prodUrl": "https://lct-b-server.herokuapp.com",
  "devUrl": "http://localhost:3003/"
}
```

### Socket.io.server**

Socket.io.server uses socket.io server to communicate with Visitors who use LCT-B in your community. Be sure socket.io works in your fork of the server.

The second server to configure is Redisgraph.

here is the javascript you update for your Redis server:

```javacript
const RedisGraph = require('redisgraph.js').Graph;
const options = {
  host: 'redis-11939.c60.us-west-1-2.ec2.cloud.redislabs.com',
  port: 11939,
  password: '7B3DId42aDCtMjmSXg7VN0XZSMOItGAG',
};
const graph = new RedisGraph(nsp, null, null, options);
```

Push your socket.io.server to your forked github repo.

## Workflow

Once VS Code is setup and Heroku is configured for your fork of LCT, these are the routine steps to get a build deployed.

Here's how two communities would support LCT-B. One community is a small town, sisters, OR. The other community, supported by Imago, is the campus at Manchester University in the UK.

![CDCI Workflow](/assets/CDCI%20Workflow.png)

### Build

To summarize the steps:

- Build your lct-b project locally
  - this will produce a /dist folder
  - this will enable you to run LCT from node
- Push your lct-b project to your github repo (master branch, in our case).

To get this javascript to your socket.io.server host:

- Update your vue.config.js to ensure this line is uncommented:
- outputDir: path.resolve(__dirname, "../socket.io.server/dist"),
- build locally
- this will produce a /dist folder in  your socket.io.server folder
- Push your changes to your master branch
- Heroku will pick up these changes and redeploy your version of LCT-B

## Thanks a 0xF4240

Thank you for doing something to crush the coronavirus in you community.

Contact the lead dev for LCT-B if you have any issues or questions:

<mcorning@soteriaInstitute.org>
