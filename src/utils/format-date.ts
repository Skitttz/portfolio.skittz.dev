function formatDate(date: Date, lang?: string) {
  const locale = lang?.toLowerCase() === 'pt-br' ? 'pt-BR' : 'en-US';

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export { formatDate };
