const callBridge = <T>(name: string, payload: T) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handler = (window as any).webkit?.messageHandlers?.[name];
  if (handler) {
    handler.postMessage(payload);
  } else {
    console.debug(`[Bridge] ${name}:`, payload);
  }
};

export const appBridge = {
  toggleTabBarVisibility: (show: boolean) =>
    callBridge("toggleTabBarVisibility", { hideTabBar: !show }),
  replaceHeaderContent: (type: "default" | "overlay", title: string) =>
    callBridge("replaceHeaderContent", { type, title }),
  showNavigationIcon: (icon: "arrow" | "cross") =>
    callBridge("showNavigationIcon", { type: icon }),
};
