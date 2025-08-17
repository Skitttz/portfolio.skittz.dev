function isMobile(userAgent: string | null) {
  if (!userAgent) return false;
  return /Mobi|Android|iPhone|iPad|iPod|Mobile|webOS|BlackBerry|Windows Phone/i.test(
    userAgent
  );
}


export { isMobile }