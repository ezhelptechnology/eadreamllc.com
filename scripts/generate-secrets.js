#!/usr/bin/env node
/**
 * Generate Secure Secrets for Production
 */

const crypto = require('crypto');

console.log('🔐 Generating Secure Secrets for Production\n');
console.log('═'.repeat(60));
console.log('\n');

// Generate NextAuth secret
const nextAuthSecret = crypto.randomBytes(32).toString('base64');
console.log('NEXTAUTH_SECRET:');
console.log(nextAuthSecret);
console.log('\n');

// Generate Auth secret (can be same as NextAuth)
const authSecret = crypto.randomBytes(32).toString('base64');
console.log('AUTH_SECRET:');
console.log(authSecret);
console.log('\n');

// Generate API key for internal services (optional)
const apiKey = crypto.randomBytes(32).toString('hex');
console.log('INTERNAL_API_KEY (optional):');
console.log(apiKey);
console.log('\n');

console.log('═'.repeat(60));
console.log('\n');
console.log('📋 Instructions:');
console.log('1. Copy the secrets above');
console.log('2. Update .env.production.local');
console.log('3. Set in Vercel:');
console.log('   vercel env add NEXTAUTH_SECRET production');
console.log('   vercel env add AUTH_SECRET production');
console.log('\n');
console.log('⚠️  NEVER commit these secrets to git!');
console.log('\n');
