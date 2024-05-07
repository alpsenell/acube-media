export function timeAgo(dateISOString: string): string {
  const now = new Date();
  const pastDate = new Date(dateISOString);
  const diff = now.getTime() - pastDate.getTime();

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (hours < 1) {
    return `${minutes} minutes ago`;
  } else if (hours < 24) {
    return `${hours} hours ago`;
  }

  return `${days} days ago`;
}
