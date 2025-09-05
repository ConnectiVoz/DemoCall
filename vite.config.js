export default {
  server: {
    proxy: {
      "/api": {
        target: "https://rivoz.in",
        changeOrigin: true,
        secure: false,
      },
    },
  },
};
