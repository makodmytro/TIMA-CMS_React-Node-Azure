const _track = {
  urls: [],
  set(url, method) {
    const _urls = this.urls.concat([`[${method}] ${url}`]);

    this.urls = _urls.slice(Math.max(_urls.length - 20, 0));
  },
  get() {
    return this.urls;
  }
};

export default _track;
