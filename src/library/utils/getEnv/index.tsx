export const getEnv = (): string => {
  return process.env.GATSBY_ENV || "dev";
};
