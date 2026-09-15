import Image from "next/image";

export function MediaFrame({
  src,
  alt,
  label,
  index,
  portrait = false,
  priority = false,
}: {
  src: string;
  alt: string;
  label: string;
  index: string;
  portrait?: boolean;
  priority?: boolean;
}) {
  return (
    <figure className={`media-frame ${portrait ? "is-portrait" : ""}`}>
      <Image src={src} alt={alt} fill sizes="(max-width: 800px) 100vw, 60vw" priority={priority} />
      <span className="media-vignette" aria-hidden="true" />
      <figcaption>
        <span>{index}</span>
        <span>{label}</span>
        <span>PLACEHOLDER / REPLACEABLE</span>
      </figcaption>
    </figure>
  );
}
