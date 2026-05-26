# Berlin Hack Night Static Guide

## Value Proposition
Provide a simple static hackathon guide page inside the Skybridge repo so attendees can open one public URL with setup steps, docs, prizes, support, and timeline details.

**Core action**: read the hacknight guide and follow resource links.

## Why LLM?
This page itself is not an LLM experience. It lives alongside the Skybridge app so the deployed app can also host a plain documentation page when that is the better format.

## UI Overview
**First view**: a branded hero and wiki-style guide for Berlin Hack Night.

**Key interactions**:
- open resource links
- review hacknight steps
- inspect support, prizes, and FAQ

**End state**: the user has a single static guide page available under the deployed app's public assets.

## Product Context
- **Existing product**: Skybridge / Alpic MCP app
- **Static hosting path**: `public/hacknight/`
- **Deployment goal**: serve the guide as static assets from the same deployed app domain
