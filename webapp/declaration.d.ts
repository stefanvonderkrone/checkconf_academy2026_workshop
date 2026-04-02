type WebkitMessageHandler<T> = { postMessage: (args: T) => void };

interface Window {
  webkit?: {
    messageHandlers: Partial<{
      toggleTabBarVisibility: WebkitMessageHandler<{ hideTabBar: boolean }>;
      replaceHeaderContent: WebkitMessageHandler<{
        type: "default" | "overlay";
        title: string;
      }>;
      showNavigationIcon: WebkitMessageHandler<{
        type: "arrow" | "cross";
      }>;
    }>;
  };
}
