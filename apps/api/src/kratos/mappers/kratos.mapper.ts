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
    return {
      id: response.id,
      schema_id: response.schema_id,
      traits: {
        email: (response.traits as { email: string }).email,
        name: (response.traits as { name?: { first: string; last: string } })
          .name,
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
