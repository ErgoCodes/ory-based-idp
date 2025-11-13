local claims = {
  email_verified: false,
} + std.extVar('claims');

{
  identity: {
    traits: {
      email: claims.email,
      name: {
        first: claims.given_name,
        last: claims.family_name
      },
    },
    verified_addresses: std.prune([
      if 'email' in claims && claims.email_verified then { via: 'email', value: claims.email },
    ]),
    metadata_public: {
      debug_claims: claims
    }
  }
}