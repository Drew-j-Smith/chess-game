module.exports = {
  siteMetadata: {
    siteUrl: "https://drew-j-smith.github.io/chess-game/",
    title: "chess-game",
  },
  plugins: [
    {
      resolve: `gatsby-plugin-typescript`,
      options: {
        isTSX: true,
        allExtensions: true,
      },
    },
  ],
  pathPrefix: "/chess-game",
};
