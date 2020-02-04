# Climatescape

**Discover the organizations solving climate change**

This is the source code behind [climatescape.org][climatescape], an open
database of organizations leading the fight against climate change.

## Developer Setup

**Note:** you need to be invited to our Airtable project to run this project
locally. The process is really simple and we accept anyone who's interested in
helping out. Simply fill out the [Climatescape Contributor Application][contributor-app].

1. Follow these steps to get the project installed on your local dev machine.
    ```bash
    $ git clone https://github.com/climatescape/climatescape.org.git
    $ cd climatescape.org
    $ npm install
    ```
2. Copy your Airtable API key from this page: [Airtable account][airtable-account]
3. Run the project like so, replacing `YOUR_KEY_HERE` the key you copied in the
    previous step:
    ```bash
    $ AIRTABLE_API_KEY=YOUR_KEY_HERE npm run develop
    ```

----

**Bonus**: <details><summary>Want to preview changes on other devices?</summary>
<p>
Use the <a href="https://www.gatsbyjs.org/docs/gatsby-cli/#preview-changes-on-other-devices">host option</a>

```bash
$ npm run develop -- -H 0.0.0.0
```
Then, at the end of the command Gatsby will show you:  
`On Your Network:  http://192.168.0.XX:8000/`  
You can now use this IP address / port to access your local environment from your phone. 👌
</p>
</details>

## Architecture

Our site is built with [Gatsby][gatsby], a static site generator that uses
[React][react] and [GraphQL][graphql] under the hood. Static site generators are
used to create static websites (i.e. plain HTML/CSS/JS) from dynamic data at
**build time**. Compare this to a traditional dynamic website that uses a
**runtime** (PHP, Ruby, Python, etc) to generate pages on-demand.

In place of a custom backend, we use [Airtable][airtable] as our content
management system and API layer. This allows us to iterate on our data schema
and admin workflows extremely quickly, without having to write any code. We use
a plugin called [gatsby-source-airtable][gatsby-source-airtable] to expose our
data to Gatsby's GraphQL layer.

We deploy to [Netlify][netlify], a simple low-cost static web host. Deploys
happen any time code is pushed to GitHub, whether to master or another branch.
Additionally, we use [Zapier][zapier] to deploy once per day in order to publish
new content even when code changes aren't happening.

[climatescape]: https://climatescape.org/
[contributor-app]: https://airtable.com/shr4WZDPBs7mk1doW
[airtable-account]: https://airtable.com/account
[gatsby]: https://www.gatsbyjs.org/
[react]: https://reactjs.org/
[graphql]: https://graphql.org/
[airtable]: https://airtable.com/
[zapier]: https://zapier.com/
[gatsby-source-airtable]: https://github.com/jbolda/gatsby-source-airtable
[netlify]: https://www.netlify.com/
