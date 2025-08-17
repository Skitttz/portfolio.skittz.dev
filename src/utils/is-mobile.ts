function isMobile() {
  return /Mobi|Android|iPhone|iPad|iPod|Mobile|webOS|BlackBerry|Windows Phone/i.test(navigator.userAgent) ||
    (navigator.maxTouchPoints && navigator.maxTouchPoints > 1);
}

export { isMobile }