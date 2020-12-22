const getEnv = () => {
  return process.env.GATSBY_ENV || "dev";
};

export default getEnv;
