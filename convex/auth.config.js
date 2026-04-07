const clerkDomain = process.env.CLERK_ISSUER || "https://moving-grub-33.clerk.accounts.dev";
const clerkAudience = process.env.CLERK_APPLICATION_ID || process.env.CLERK_AUDIENCE || "convex";

export default {
  providers: [
    {
      // OIDC issuer base URL for Clerk (no trailing spaces)
      domain: clerkDomain.trim(),
      // The expected audience (application ID) in incoming JWTs
      applicationID: clerkAudience,
    },
  ],
};