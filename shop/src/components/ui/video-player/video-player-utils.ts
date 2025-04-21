export function formatTime(time: number) {
  if (isNaN(time)) {
    return '00:00';
  }

  const date = new Date(time * 1000);
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const seconds = date.getUTCSeconds().toString().padStart(2, '0');
  if (hours !== '00') {
    //if video have hours
    return `${hours}:${minutes}:${seconds}`;
  } else return `${minutes}:${seconds}`;
}
