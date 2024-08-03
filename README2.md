To get started, edit the .env file with the following variables:
- NEXT_PUBLIC_STRIPE_KEY
- STRIPE_SECRET_KEY

To be able to test automatic payment features like Gpay, Apple pay which require https install lcl.host and provide the following variables (generated after signing up and creating a servicee)
- ACME_CONTACT
- ACME_DIRECTORY_URL
- ACME_KID
- ACME_HMAC_KEY
- HTTPS_PORT
- SERVER_NAMES

Update the Next.config.mjs file to the following:
```/** @type {import('next').NextConfig} */
    import autoCert from "anchor-pki/auto-cert/integrations/next";

    const withAutoCert = autoCert({
    enabledEnv: "development",
    });

const nextConfig = {};

export default withAutoCert(nextConfig);