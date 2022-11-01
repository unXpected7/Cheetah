const isProduction = true;

const Productions = {
  host: "https://cheetah-app001.herokuapp.com",
  ep: "/v1/",
};

const Devs = {
  host: "http://127.0.0.0:3333",
  ep: "/v1/",
};

const config: { host: string; ep: string } = isProduction ? Productions : Devs;

export default config;