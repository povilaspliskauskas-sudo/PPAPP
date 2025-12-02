npm install --save-dev @types/react@18 @types/node@20

# commit & push
git add -A
git commit -m "chore(ts): add @types/react and @types/node for Next.js"
git push
/** @type {import('next').NextConfig} */
const nextConfig = { reactStrictMode: true };
module.exports = nextConfig;
