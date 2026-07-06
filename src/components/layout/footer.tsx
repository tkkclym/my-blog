import Link from "next/link";
import { Github, Mail, Rss, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/40 backdrop-blur-xl bg-background/60">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>© {new Date().getFullYear()} TechBlog</span>
            <span className="text-primary">·</span>
            <span className="flex items-center gap-1">
              Built with <Heart className="w-3 h-3 fill-primary text-primary" /> &amp; Next.js
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="https://github.com"
              target="_blank"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Github className="w-5 h-5" />
            </Link>
            <Link
              href="mailto:hello@techblog.com"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Mail className="w-5 h-5" />
            </Link>
            <Link
              href="/rss.xml"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Rss className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
