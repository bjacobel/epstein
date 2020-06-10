// file is commonjs so webpack config can import it

module.exports = {
  getRoutesToPrerender() {
    const staticRoutes = ['/', 'search', 'passenger/bill-clinton'];
    return [...staticRoutes].map(r => {
      let slashed = r;
      if (!slashed.startsWith('/')) slashed = `/${slashed}`;
      if (!slashed.endsWith('/')) slashed = `${slashed}/`;
      return slashed;
    });
  },
};
