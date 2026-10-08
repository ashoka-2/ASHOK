export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function formatTimeIST() {
  const options = {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  };
  return new Intl.DateTimeFormat([], options).format(new Date());
}
