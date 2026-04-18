import { describe, expect, it, beforeAll, afterAll, mock } from 'bun:test'
import { Elysia } from 'elysia'
import { metadataRoutes } from '../routes/metadata'

mock.module('../config/database', () => {
  return {
    default: {
      query: async () => {
        if ((globalThis as any).failQuery) throw new Error('DB Error');
        return { rows: [{ id: 1, name: 'test', description: 'test', initial_name: 'test', channel_type_name: 'test', channel_name: 'test', image_url: 'test' }] };
      },
      end: async () => {}
    }
  };
});

import pool from '../config/database'

describe('Metadata API Endpoints', () => {
  let app: Elysia

  beforeAll(() => {
    app = new Elysia().use(metadataRoutes)
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('GET /metadata/account-types', () => {
    it('should return list of account types', async () => {
      const response = await app.handle(
        new Request('http://localhost:3001/metadata/account-types')
      )
      const body = await response.json()

      expect(response.status).toBe(200)
      expect(body).toHaveProperty('data')
      expect(Array.isArray(body.data)).toBe(true)
      expect(body.data[0]).toHaveProperty('id')
      expect(body.data[0]).toHaveProperty('name')
      expect(body.data[0]).toHaveProperty('description')
    })
  })

  describe('GET /metadata/banks', () => {
    it('should return list of banks', async () => {
      const response = await app.handle(
        new Request('http://localhost:3001/metadata/banks')
      )
      const body = await response.json()

      expect(response.status).toBe(200)
      expect(body).toHaveProperty('data')
      expect(Array.isArray(body.data)).toBe(true)
      expect(body.data[0]).toHaveProperty('id')
      expect(body.data[0]).toHaveProperty('name')
      expect(body.data[0]).toHaveProperty('initial_name')
      expect(body.data[0]).toHaveProperty('description')
    })
  })

  describe('GET /metadata/banner-types', () => {
    it('should return list of banner types', async () => {
      const response = await app.handle(
        new Request('http://localhost:3001/metadata/banner-types')
      )
      const body = await response.json()

      expect(response.status).toBe(200)
      expect(body).toHaveProperty('data')
      expect(Array.isArray(body.data)).toBe(true)
    })
  })

  describe('GET /metadata/deleted-account-statuses', () => {
    it('should return list of deleted account statuses', async () => {
      const response = await app.handle(
        new Request('http://localhost:3001/metadata/deleted-account-statuses')
      )
      const body = await response.json()

      expect(response.status).toBe(200)
      expect(body).toHaveProperty('data')
      expect(Array.isArray(body.data)).toBe(true)
    })
  })

  describe('GET /metadata/discount-types', () => {
    it('should return list of discount types', async () => {
      const response = await app.handle(
        new Request('http://localhost:3001/metadata/discount-types')
      )
      const body = await response.json()

      expect(response.status).toBe(200)
      expect(body).toHaveProperty('data')
      expect(Array.isArray(body.data)).toBe(true)
    })
  })

  describe('GET /metadata/event-categories', () => {
    it('should return list of event categories', async () => {
      const response = await app.handle(
        new Request('http://localhost:3001/metadata/event-categories')
      )
      const body = await response.json()

      expect(response.status).toBe(200)
      expect(body).toHaveProperty('data')
      expect(Array.isArray(body.data)).toBe(true)
      expect(body.data[0]).toHaveProperty('image_url')
    })
  })

  describe('GET /metadata/event-image-types', () => {
    it('should return list of event image types', async () => {
      const response = await app.handle(
        new Request('http://localhost:3001/metadata/event-image-types')
      )
      const body = await response.json()

      expect(response.status).toBe(200)
      expect(body).toHaveProperty('data')
      expect(Array.isArray(body.data)).toBe(true)
    })
  })

  describe('GET /metadata/event-statuses', () => {
    it('should return list of event statuses', async () => {
      const response = await app.handle(
        new Request('http://localhost:3001/metadata/event-statuses')
      )
      const body = await response.json()

      expect(response.status).toBe(200)
      expect(body).toHaveProperty('data')
      expect(Array.isArray(body.data)).toBe(true)
    })
  })

  describe('GET /metadata/event-types', () => {
    it('should return list of event types', async () => {
      const response = await app.handle(
        new Request('http://localhost:3001/metadata/event-types')
      )
      const body = await response.json()

      expect(response.status).toBe(200)
      expect(body).toHaveProperty('data')
      expect(Array.isArray(body.data)).toBe(true)
    })
  })

  describe('GET /metadata/order-statuses', () => {
    it('should return list of order statuses', async () => {
      const response = await app.handle(
        new Request('http://localhost:3001/metadata/order-statuses')
      )
      const body = await response.json()

      expect(response.status).toBe(200)
      expect(body).toHaveProperty('data')
      expect(Array.isArray(body.data)).toBe(true)
    })
  })

  describe('GET /metadata/payment-channels', () => {
    it('should return list of payment channels', async () => {
      const response = await app.handle(
        new Request('http://localhost:3001/metadata/payment-channels')
      )
      const body = await response.json()

      expect(response.status).toBe(200)
      expect(body).toHaveProperty('data')
      expect(Array.isArray(body.data)).toBe(true)
      expect(body.data[0]).toHaveProperty('channel_type_name')
      expect(body.data[0]).toHaveProperty('channel_name')
    })
  })

  describe('GET /metadata/statuses', () => {
    it('should return list of statuses', async () => {
      const response = await app.handle(
        new Request('http://localhost:3001/metadata/statuses')
      )
      const body = await response.json()

      expect(response.status).toBe(200)
      expect(body).toHaveProperty('data')
      expect(Array.isArray(body.data)).toBe(true)
    })
  })

  describe('GET /metadata/ticket-paid-types', () => {
    it('should return list of ticket paid types', async () => {
      const response = await app.handle(
        new Request('http://localhost:3001/metadata/ticket-paid-types')
      )
      const body = await response.json()

      expect(response.status).toBe(200)
      expect(body).toHaveProperty('data')
      expect(Array.isArray(body.data)).toBe(true)
    })
  })

  describe('GET /metadata/ticket-types', () => {
    it('should return list of ticket types', async () => {
      const response = await app.handle(
        new Request('http://localhost:3001/metadata/ticket-types')
      )
      const body = await response.json()

      expect(response.status).toBe(200)
      expect(body).toHaveProperty('data')
      expect(Array.isArray(body.data)).toBe(true)
    })
  })

  // Test error cases
  describe('Error Handling', () => {
    it('should handle database errors gracefully', async () => {
      ;(globalThis as any).failQuery = true;
      const response = await app.handle(
          new Request('http://localhost:3001/metadata/account-types')
      );
      const body = await response.json();
      ;(globalThis as any).failQuery = false;
  
      expect(response.status).toBe(500);
  
      expect(body).toHaveProperty('error', expect.any(String));
      expect(body).toHaveProperty('error', expect.any(String));
    });
  });
}) 