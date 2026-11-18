// Teacher's address for Gapir. Every request goes to the main Worker unchanged
// except for one header naming the address the visitor used, so the app can
// tell the teacher's site from the learners' one (SITE_HOST_HEADER in src/server/site.ts).
const worker = {
  async fetch(request, env) {
    const forwarded = new Request(request);
    forwarded.headers.set("x-gapir-host", new URL(request.url).host);
    return env.APP.fetch(forwarded);
  },
};

export default worker;
