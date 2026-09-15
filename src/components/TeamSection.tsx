import Image from "next/image";
import { readData } from "@/lib/db";
import type { TeamMember } from "@/lib/types";

export async function TeamSection() {
  const members = await readData<TeamMember[]>("team", []);
  const sorted = members.sort((a, b) => a.order - b.order);

  if (sorted.length === 0) return null;

  return (
    <section className="section team-section" id="team">
      <div className="section-kicker">
        <span>●</span>
        <span>THE COLLECTIVE</span>
      </div>
      <h2 className="team-headline">The people behind the brand.</h2>
      <div className="team-grid">
        {sorted.map((member) => (
          <article className="team-card" key={member.id}>
            <div className="team-photo">
              {member.photoUrl ? (
                <Image src={member.photoUrl} alt={member.name} width={280} height={320} style={{ objectFit: "cover" }} />
              ) : (
                <div className="team-photo-placeholder">
                  {member.name.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            <div className="team-info">
              <h3>{member.name}</h3>
              <span className="team-role">{member.role}</span>
              {member.bio && <p>{member.bio}</p>}
              {member.socials.length > 0 && (
                <div className="team-socials">
                  {member.socials.map((s) => (
                    <a key={s.platform} href={s.url} target="_blank" rel="noreferrer">
                      {s.platform}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
