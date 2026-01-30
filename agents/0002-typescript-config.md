# Step T2 — TypeScript Config Package

## Package
@studiovault/typescript-config

## Files Added
- base.json (portable strict baseline)
- react.json (DOM + JSX support)
- nextjs.json (Next.js overlay)

## Key Rules
- Shared packages extend base.json only
- UI and React apps extend react.json
- Next.js apps extend nextjs.json
- No DOM types leak into Workers or Node services
