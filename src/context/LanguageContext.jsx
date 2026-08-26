import { createContext, useEffect, useMemo, useState } from "react";

const LanguageContext = createContext(undefined);

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState("vi");
  const [messages, setMessages] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    import(`../locales/${lang}.json`).then((mod) => {
      if (!cancelled) {
        setMessages(mod.default);
        setIsLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [lang]);
  const value = useMemo(
    () => ({ lang, setLang, messages, isLoading }),
    [lang, messages, isLoading],
  );
  if (isLoading) return null;
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
