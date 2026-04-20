export const PUBLIC_CONTACT_EMAIL = "contact@packaginghippo.com";

const LEGACY_CONTACT_EMAIL = "creative.om3r@gmail.com";

export function getPublicContactEmail(email?: string | null) {
    if (!email || email.toLowerCase() === LEGACY_CONTACT_EMAIL) {
        return PUBLIC_CONTACT_EMAIL;
    }

    return email;
}
