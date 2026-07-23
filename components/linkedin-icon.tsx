import Image from "next/image";

export function LinkedInIcon() {
  return (
    <a
      href="https://www.linkedin.com/in/jonathanfreire"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="LinkedIn"
      className="flex items-center justify-center p-3 hover:opacity-60 transition-opacity"
    >
      <Image
        src="/brands/linkedin.svg"
        alt="LinkedIn"
        width={25}
        height={25}
        className="dark:invert"
      />
    </a>
  );
}
