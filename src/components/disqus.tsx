"use client";

import { useEffect } from "react";

declare global {
  interface DisqusConfig {
    page: {
      identifier: string;
      url: string;
      title: string;
    };
  }

  interface Window {
    DISQUS: {
      reset: (config: {
        reload: boolean;
        config: (this: DisqusConfig) => void;
      }) => void;
    };
    disqus_config?: (this: DisqusConfig) => void;
  }
}

type DisqusProps = {
  shortname: string;
  identifier: string;
  title: string;
  url: string;
};

export default function Disqus({ shortname, identifier, title, url }: DisqusProps) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://${shortname}.disqus.com/embed.js`;
    script.setAttribute("data-timestamp", Date.now().toString());
    script.async = true;

    if (window.DISQUS) {
      window.DISQUS.reset({
        reload: true,
        config: function () {
          this.page.identifier = identifier;
          this.page.url = url;
          this.page.title = title;
        },
      });
    } else {
      window.disqus_config = function () {
        this.page.identifier = identifier;
        this.page.url = url;
        this.page.title = title;
      };
    }

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [shortname, identifier, title, url]);

  return <div id="disqus_thread" className="mt-10" />;
} 