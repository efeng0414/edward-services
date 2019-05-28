import urlExists from "url-exists-deep";

export const isExists = async (url: string) => {
  try {
    return await urlExists(url);
  } catch {
    return {
      href: null
    };
  }
};
