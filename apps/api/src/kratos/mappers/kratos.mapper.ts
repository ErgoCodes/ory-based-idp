/**
 * Mappers for transforming Kratos API responses to our DTOs
 */

import { Identity as KratosIdentity } from '@ory/client-fetch';
import { Identity } from '@repo/api';

export class KratosMapper {
  /**
   * Map Kratos identity response to Identity DTO
   */
  static toIdentity(response: KratosIdentity): Identity {
    const traits = response.traits as {
      email: string;
      name?: { first: string; last: string };
      role?: 'user' | 'superadmin';
    };

    return {
      id: response.id,
      schema_id: response.schema_id,
      traits: {
        email: traits.email,
        name: traits.name,
        role: traits.role || 'user', // Default to 'user' if not specified
      },
      created_at:
        response.created_at instanceof Date
          ? response.created_at.toISOString()
          : response.created_at,
      updated_at:
        response.updated_at instanceof Date
          ? response.updated_at.toISOString()
          : response.updated_at,
    };
  }
}
