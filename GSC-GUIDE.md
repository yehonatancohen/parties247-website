# Google Search Console (GSC) — Connection & Usage Guide

## How Claude Connects to GSC

Claude connects to GSC via the **`gsc` MCP server** configured in your Claude Code settings.
The MCP server uses OAuth credentials to access your Google account's Search Console data.

### Tools Available

| Tool | What It Does |
|---|---|
| `mcp__gsc__list_sites` | Lists all verified sites in your GSC account |
| `mcp__gsc__search_analytics` | Pulls clicks, impressions, CTR, position by any dimension |
| `mcp__gsc__enhanced_search_analytics` | Same + up to 25k rows, regex filters, quick wins detection |
| `mcp__gsc__list_sitemaps` | Lists submitted sitemaps and their index status |
| `mcp__gsc__get_sitemap` | Gets details on a specific sitemap |
| `mcp__gsc__submit_sitemap` | Submits a new sitemap URL |
| `mcp__gsc__index_inspect` | Inspects indexing status of a specific URL |
| `mcp__gsc__detect_quick_wins` | Auto-detects SEO quick win opportunities |

### Your Site

- **GSC property:** `sc-domain:parties247.co.il`
- **Sitemap:** `https://www.parties247.co.il/sitemap.xml`

---

## Common Problems & Fixes

### Problem: GSC tools show as "deferred" (tools not available)

This means the MCP server hasn't loaded yet. Tell Claude:
> "can you connect to gsc?"

Claude will run `ToolSearch` to load the tools. This happens at the start of every new session.

### Problem: MCP server disconnected mid-session

The server sometimes disconnects. Signs:
- Tool calls return `InputValidationError`
- Tools disappear from the deferred list

**Fix:** Start a new Claude Code session, then ask Claude to connect to GSC again.

### Problem: Authentication / permission errors

If the GSC MCP server returns auth errors:
1. Check your MCP server config in Claude Code settings (`~/.claude/settings.json` or project `.claude/settings.local.json`)
2. Re-authenticate the Google OAuth token — usually means re-running the MCP server setup
3. Verify `parties247.co.il` is still verified in your actual GSC account at search.google.com/search-console

### Problem: Data looks stale or missing

GSC data has a **2–3 day lag** — data from the last 2-3 days may be incomplete or missing.
Always use `endDate` as yesterday or earlier for reliable data.

---

## How to Ask Claude to Analyze GSC

Quickest way — just run the custom command:
```
/seo-update
```

Or manually ask:
> "Check my GSC data for parties247.co.il and update the SEO roadmap"

---

## Useful Dimension Combinations

| Goal | Dimensions to Use |
|---|---|
| Traffic over time | `date` |
| Top search queries | `query` |
| Top performing pages | `page` |
| Traffic by country | `country` |
| Mobile vs desktop | `device` |
| Query + page combined | `query,page` |
