import fs from "node:fs";
import path from "node:path";
import { sendMarketing, type SendResult } from "./providers";

/**
 * Template registry. Subject is set here so we have exactly one source of truth
 * per template; the HTML is loaded from the pre-compiled MJML output.
 */
export type TemplateName = "welcome" | "nurture-1" | "nurture-2" | "newsletter";

export const TEMPLATE_SUBJECTS: Record<TemplateName, string> = {
  welcome: "Got your note — quick prep before we talk",
  "nurture-1": "One thing worth reading before our call",
  "nurture-2": "Easier ask — 15 minutes?",
  newsletter: "What PolyCloud shipped this month",
};

/**
 * Topic-specific prep questions for the welcome email.
 * Keep in sync with digital/templates/email-marketing/config.yaml.
 */
const TOPIC_PREP: Record<string, [string, string]> = {
  digital: [
    "Which channel is bleeding — paid, SEO, email, or a gap somewhere else?",
    "What would change this quarter if the biggest 2-3 ops on your list automated?",
  ],
  consulting: [
    "What's the workflow you'd pull out of your team's week first if AI could run it?",
    "Is there a pilot scope you've already sketched, or do you want us to propose one?",
  ],
  general: [
    "Where does your team spend the most avoidable hours right now?",
    "Is there a single outcome that would make the next 90 days count?",
  ],
};

const TOPIC_FRIENDLY: Record<string, string> = {
  digital: "marketing and growth operations",
  consulting: "AI integration for internal workflows",
  general: "what your team is working on",
};

// Cache compiled HTMLs in module scope so we only read them from disk once.
const _htmlCache = new Map<TemplateName, string>();

function loadTemplateHtml(name: TemplateName): string {
  const cached = _htmlCache.get(name);
  if (cached) return cached;
  const p = path.join(process.cwd(), "app", "lib", "email", "templates", `${name}.html`);
  const html = fs.readFileSync(p, "utf-8");
  _htmlCache.set(name, html);
  return html;
}

/**
 * Substitute {{var}} placeholders. Missing keys render as an empty string
 * (not an error) so a partially-supplied vars map degrades gracefully.
 */
function substitute(html: string, vars: Record<string, string | number | undefined | null>): string {
  return html.replace(/\{\{\s*([a-zA-Z_][\w]*)\s*\}\}/g, (_, k: string) => {
    const v = vars[k];
    if (v === undefined || v === null) return "";
    return String(v);
  });
}

/**
 * Build the full vars map for a template given a lead + extras.
 */
export function buildVars(opts: {
  template: TemplateName;
  lead: {
    name: string;
    email: string;
    topic: string | null;
    company?: string | null;
  };
  unsubscribeUrl: string;
  // nurture-1 extras
  blogPost?: { title: string; description: string; url: string; readTime: string };
  // newsletter extras
  posts?: Array<{
    title: string;
    description: string;
    url: string;
    readTime: string;
    category: string;
  }>;
  monthName?: string;
  shippedTitle?: string;
  shippedBody?: string;
}): Record<string, string> {
  const topic = opts.lead.topic ?? "general";
  const prep = TOPIC_PREP[topic] ?? TOPIC_PREP.general;
  const vars: Record<string, string> = {
    name: opts.lead.name.split(" ")[0] || opts.lead.name,
    unsubscribe_url: opts.unsubscribeUrl,
  };

  if (opts.template === "welcome") {
    vars.prep_question_1 = prep[0];
    vars.prep_question_2 = prep[1];
  }

  if (opts.template === "nurture-1" && opts.blogPost) {
    vars.topic_friendly = TOPIC_FRIENDLY[topic] ?? TOPIC_FRIENDLY.general;
    vars.blog_post_title = opts.blogPost.title;
    vars.blog_post_description = opts.blogPost.description;
    vars.blog_post_url = opts.blogPost.url;
    vars.blog_post_read_time = opts.blogPost.readTime;
  }

  if (opts.template === "newsletter") {
    vars.month_name = opts.monthName ?? new Date().toLocaleString("en-US", { month: "long" });
    vars.shipped_title = opts.shippedTitle ?? "";
    vars.shipped_body = opts.shippedBody ?? "";
    const posts = opts.posts ?? [];
    for (let i = 0; i < 3; i++) {
      const p = posts[i];
      const n = i + 1;
      vars[`post_${n}_title`] = p?.title ?? "";
      vars[`post_${n}_description`] = p?.description ?? "";
      vars[`post_${n}_url`] = p?.url ?? "";
      vars[`post_${n}_read_time`] = p?.readTime ?? "";
      vars[`post_${n}_category`] = p?.category ?? "";
    }
  }

  return vars;
}

/**
 * Render a template to final HTML.
 */
export function renderHtml(template: TemplateName, vars: Record<string, string>): string {
  return substitute(loadTemplateHtml(template), vars);
}

/**
 * End-to-end: render + send via Resend. Returns the delivery result.
 * Safe to call on every request — never throws.
 */
export async function composeAndSend(opts: {
  template: TemplateName;
  to: string;
  vars: Record<string, string>;
}): Promise<SendResult> {
  const html = renderHtml(opts.template, opts.vars);
  const subject = TEMPLATE_SUBJECTS[opts.template];
  return sendMarketing({ to: opts.to, subject, html });
}
