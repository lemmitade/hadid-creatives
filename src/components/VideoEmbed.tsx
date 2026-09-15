export function VideoEmbed({
  url,
  type,
  label,
}: {
  url: string;
  type: "mp4" | "youtube" | "vimeo";
  label: string;
}) {
  if (type === "mp4") {
    return (
      <div className="video-embed">
        <video controls preload="metadata" aria-label={label}>
          <source src={url} type="video/mp4" />
        </video>
        {label && <span className="video-label">{label}</span>}
      </div>
    );
  }

  let embedUrl = url;
  if (type === "youtube") {
    const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    if (match) embedUrl = `https://www.youtube.com/embed/${match[1]}`;
  } else if (type === "vimeo") {
    const match = url.match(/vimeo\.com\/(\d+)/);
    if (match) embedUrl = `https://player.vimeo.com/video/${match[1]}`;
  }

  return (
    <div className="video-embed">
      <iframe
        src={embedUrl}
        title={label}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
      {label && <span className="video-label">{label}</span>}
    </div>
  );
}
