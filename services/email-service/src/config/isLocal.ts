const isLocal = (): boolean => process.env.RUNNING_ON !== "server";

export default isLocal;
