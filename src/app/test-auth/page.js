"use client";

import { useState } from 'react';

export default function TestAuthPage() {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [result, setResult] = useState('');

  const testLogin = async () => {
    try {
      const res = await fetch('/api/auth/debug-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      setResult(JSON.stringify(data, null, 2));
      
      if (data.success) {
        // Test token verification
        setTimeout(async () => {
          try {
            const tokenRes = await fetch('/api/auth/test');
            const tokenData = await tokenRes.json();
            setResult(prev => prev + '\n\nToken Test:\n' + JSON.stringify(tokenData, null, 2));
          } catch (error) {
            setResult(prev => prev + '\n\nToken Test Error:\n' + error.message);
          }
        }, 1000);
      }
    } catch (error) {
      setResult('Error: ' + error.message);
    }
  };

  const testUserAccess = async () => {
    try {
      const res = await fetch('/user');
      setResult('User page response: ' + res.status + ' ' + res.statusText);
    } catch (error) {
      setResult('Error accessing user page: ' + error.message);
    }
  };

  const testAdminAccess = async () => {
    try {
      const res = await fetch('/admin');
      setResult('Admin page response: ' + res.status + ' ' + res.statusText);
    } catch (error) {
      setResult('Error accessing admin page: ' + error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Authentication Test</h1>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Login Test</h2>
        <div className="flex gap-2 mb-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="border p-2 rounded"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="border p-2 rounded"
          />
          <button
            onClick={testLogin}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Test Login
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Access Tests</h2>
        <div className="flex gap-2">
          <button
            onClick={testUserAccess}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Test User Access
          </button>
          <button
            onClick={testAdminAccess}
            className="bg-purple-500 text-white px-4 py-2 rounded"
          >
            Test Admin Access
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Result</h2>
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
          {result || 'No result yet'}
        </pre>
      </div>
    </div>
  );
} 