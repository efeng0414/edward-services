export function isLocal(): boolean {
  return process.env.RUNNING_ON !== "server";
}

export default isLocal;
