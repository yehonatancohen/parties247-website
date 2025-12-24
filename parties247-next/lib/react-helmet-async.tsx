import React, { createContext, useContext, useEffect, useMemo } from 'react';

type HelmetServerState = {
  title?: string;
  metas: string[];
  links: string[];
  scripts: string[];
  htmlAttributes: Record<string, string>;
};

export interface HelmetServerContext {
  helmet?: HelmetServerState;
}

interface HelmetContextValue {
  context?: HelmetServerContext;
}

const HelmetContext = createContext<HelmetContextValue>({});

interface HelmetProviderProps {
  children: React.ReactNode;
  context?: HelmetServerContext;
}

export const HelmetProvider: React.FC<HelmetProviderProps> = ({ children, context }) => {
  const value = useMemo(() => {
    if (context && !context.helmet) {
      context.helmet = {
        title: undefined,
        metas: [],
        links: [],
        scripts: [],
        htmlAttributes: {},
      };
    }
    return { context };
  }, [context]);

  return <HelmetContext.Provider value={value}>{children}</HelmetContext.Provider>;
};

interface HelmetProps {
  children?: React.ReactNode;
  htmlAttributes?: Record<string, string>;
}

export const Helmet: React.FC<HelmetProps> = ({ children, htmlAttributes }) => {
  const { context } = useContext(HelmetContext);

  const collectForServer = (childNodes: React.ReactNode) => {
    if (!context?.helmet) {
      return;
    }
    if (htmlAttributes) {
      Object.entries(htmlAttributes).forEach(([key, value]) => {
        if (value) {
          context.helmet!.htmlAttributes[key] = value;
        }
      });
    }

    const walk = (node: React.ReactNode) => {
      if (!React.isValidElement(node)) {
        return;
      }
      const { type, props } = node as React.ReactElement<any>;
      if (type === React.Fragment) {
        React.Children.forEach(props.children, walk);
        return;
      }
      if (type === 'title') {
        const titleText = typeof props.children === 'string' ? props.children : React.Children.toArray(props.children).join('');
        context.helmet!.title = titleText;
        return;
      }
      if (type === 'meta' || type === 'link' || type === 'script') {
        const attributes = Object.entries(props)
          .filter(([key]) => key !== 'children')
          .map(([key, value]) => `${key}="${String(value)}"`)
          .join(' ');
        if (type === 'meta') {
          context.helmet!.metas.push(`<meta ${attributes}>`);
        } else if (type === 'link') {
          context.helmet!.links.push(`<link ${attributes}>`);
        } else {
          const inner = typeof props.children === 'string' ? props.children : React.Children.toArray(props.children).join('');
          context.helmet!.scripts.push(`<script ${attributes}>${inner}</script>`);
        }
      }
    };

    React.Children.forEach(childNodes, walk);
  };

  useEffect(() => {
    const head = document.head;
    const rootEl = document.documentElement;
    const nodes: HTMLElement[] = [];
    const previousHtmlAttr = new Map<string, string | null>();
    const previousTitle = document.title;

    if (htmlAttributes) {
      Object.entries(htmlAttributes).forEach(([key, value]) => {
        previousHtmlAttr.set(key, rootEl.getAttribute(key));
        if (value) {
          rootEl.setAttribute(key, value);
        } else {
          rootEl.removeAttribute(key);
        }
        if (context?.helmet) {
          context.helmet.htmlAttributes[key] = value;
        }
      });
    }

    const processChild = (child: React.ReactNode) => {
      if (!React.isValidElement(child)) {
        return;
      }

      const { type, props } = child as React.ReactElement<any>;

      if (type === React.Fragment) {
        React.Children.forEach(props.children, processChild);
        return;
      }

      if (type === 'title') {
        const titleText = typeof props.children === 'string' ? props.children : React.Children.toArray(props.children).join('');
        document.title = titleText;
        if (context?.helmet) {
          context.helmet.title = titleText;
        }
        return;
      }

      if (type === 'meta' || type === 'link') {
        const el = document.createElement(type);
        Object.entries(props).forEach(([key, value]) => {
          if (key === 'children' || key === 'dangerouslySetInnerHTML') {
            return;
          }
          if (value != null) {
            el.setAttribute(key, String(value));
          }
        });
        head.appendChild(el);
        nodes.push(el);
        if (context?.helmet) {
          const markup = el.outerHTML;
          if (type === 'meta') {
            context.helmet.metas.push(markup);
          } else {
            context.helmet.links.push(markup);
          }
        }
        return;
      }

      if (type === 'script') {
        const el = document.createElement('script');
        Object.entries(props).forEach(([key, value]) => {
          if (key === 'children') {
            el.textContent = typeof value === 'string' ? value : React.Children.toArray(value).join('');
            return;
          }
          if (value != null) {
            el.setAttribute(key, String(value));
          }
        });
        head.appendChild(el);
        nodes.push(el);
        if (context?.helmet) {
          context.helmet.scripts.push(el.outerHTML);
        }
        return;
      }
    };

    React.Children.forEach(children, processChild);

    return () => {
      nodes.forEach((node) => {
        if (node.parentNode === head) {
          head.removeChild(node);
        }
      });
      if (htmlAttributes) {
        previousHtmlAttr.forEach((value, key) => {
          if (value === null) {
            rootEl.removeAttribute(key);
          } else {
            rootEl.setAttribute(key, value);
          }
        });
      }
      document.title = previousTitle;
    };
  }, [children, htmlAttributes, context]);

  if (typeof document === 'undefined') {
    collectForServer(children);
  }

  return null;
};

export default Helmet;
