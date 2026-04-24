const express = require('express');
const app = require('../server');

describe('Backend API Tests', () => {
  
  test('Health check endpoint returns OK', async () => {
    const response = await fetch('http://localhost:3000/health', {
      method: 'GET'
    });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.status).toBe('OK');
  });

  test('GET /api/messages returns array', async () => {
    const response = await fetch('http://localhost:3000/api/messages', {
      method: 'GET'
    });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });

  test('POST /api/messages creates a message', async () => {
    const response = await fetch('http://localhost:3000/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'Test message' })
    });
    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.text).toBe('Test message');
    expect(data.id).toBeDefined();
  });

  test('POST /api/messages without text returns 400', async () => {
    const response = await fetch('http://localhost:3000/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    expect(response.status).toBe(400);
  });
});
