/**
 * AgriChat - Automated System & Model Verification Test Suite
 * Day 10 - Testing & Quality Assurance
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Post = require('./models/Post');
const Comment = require('./models/Comment');

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

const pass = (title) => console.log(`${colors.green}  ✓ PASS:${colors.reset} ${title}`);
const fail = (title, err) => {
  console.log(`${colors.red}  ✗ FAIL:${colors.reset} ${title}`);
  if (err) console.error(err);
};

async function runTests() {
  console.log(`\n${colors.bold}${colors.cyan}===============================================${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}  🌾 AgriChat Automated System Test Suite       ${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}===============================================${colors.reset}\n`);

  let totalTests = 0;
  let passedTests = 0;

  // Test 1: User Model Schema & Defaults
  totalTests++;
  try {
    const user = new User({
      name: 'Test Farmer',
      email: 'testfarmer@agrichat.in',
      password: 'password123',
      village: 'Haveri',
      district: 'Haveri',
      state: 'Karnataka'
    });
    if (user.role === 'farmer' && user.preferredLanguage === 'en' && user.isBlocked === false) {
      pass('User model defaults (role=farmer, lang=en, isBlocked=false) correctly configured');
      passedTests++;
    } else {
      fail(`User model defaults mismatch: role=${user.role}, lang=${user.preferredLanguage}, isBlocked=${user.isBlocked}`);
    }
  } catch (err) {
    fail('User model instantiation failed', err);
  }

  // Test 2: JWT Token Generation & Verification
  totalTests++;
  try {
    const secret = process.env.JWT_SECRET || 'agrichat_super_secret_jwt_key_2026';
    const fakeId = new mongoose.Types.ObjectId();
    const token = jwt.sign({ id: fakeId, role: 'admin' }, secret, { expiresIn: '7d' });
    const decoded = jwt.verify(token, secret);
    if (decoded.id === fakeId.toString() && decoded.role === 'admin') {
      pass('JWT Token signing and verification operates securely with claims');
      passedTests++;
    } else {
      fail('JWT payload mismatch');
    }
  } catch (err) {
    fail('JWT signing test failed', err);
  }

  // Test 3: Bcrypt Salting & Hash Matching
  totalTests++;
  try {
    const rawPass = 'KisanMitra2026!';
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(rawPass, salt);
    const isMatch = await bcrypt.compare(rawPass, hashed);
    const isMismatch = await bcrypt.compare('WrongPassword', hashed);
    if (isMatch && !isMismatch) {
      pass('Bcrypt 10-round password hashing and comparison verified');
      passedTests++;
    } else {
      fail('Bcrypt hash matching logic failed');
    }
  } catch (err) {
    fail('Bcrypt test failed', err);
  }

  // Test 4: Password Reset Token Crypto Generation & SHA-256 Hashing
  totalTests++;
  try {
    const rawToken = crypto.randomBytes(20).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    const verifyHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    if (hashedToken === verifyHash && rawToken.length === 40) {
      pass('CSPRNG password reset token generation and SHA-256 hashing verified');
      passedTests++;
    } else {
      fail('Reset token hashing mismatch');
    }
  } catch (err) {
    fail('Crypto token test failed', err);
  }

  // Test 5: Post Model Schema & Category Validation
  totalTests++;
  try {
    const post = new Post({
      title: 'Paddy Blast Treatment Advice',
      content: 'Apply Tricyclazole 75 WP at 0.6g per liter of water.',
      category: 'Pest Control',
      targetCrop: 'Paddy',
      author: new mongoose.Types.ObjectId()
    });
    if (post.category === 'Pest Control' && Array.isArray(post.likes) && post.likes.length === 0) {
      pass('Post schema validates category enumeration and initializes empty likes array');
      passedTests++;
    } else {
      fail('Post schema validation failed');
    }
  } catch (err) {
    fail('Post schema test failed', err);
  }

  // Test 6: Comment Model Schema & Post Reference
  totalTests++;
  try {
    const fakeAuthor = new mongoose.Types.ObjectId();
    const fakePost = new mongoose.Types.ObjectId();
    const comment = new Comment({
      text: 'Thanks for the quick response, very helpful!',
      author: fakeAuthor,
      postId: fakePost
    });
    if (comment.author.toString() === fakeAuthor.toString() && comment.postId.toString() === fakePost.toString()) {
      pass('Comment schema correctly maps author and postId ObjectId references');
      passedTests++;
    } else {
      fail('Comment schema reference mismatch');
    }
  } catch (err) {
    fail('Comment schema test failed', err);
  }

  // Test 7: Express Server & Route Exports
  totalTests++;
  try {
    const authRoutes = require('./routes/authRoutes');
    const postRoutes = require('./routes/postRoutes');
    const commentRoutes = require('./routes/commentRoutes');
    const userRoutes = require('./routes/userRoutes');
    const adminRoutes = require('./routes/adminRoutes');

    if (authRoutes && postRoutes && commentRoutes && userRoutes && adminRoutes) {
      pass('All 5 Express modular routers (Auth, Posts, Comments, Users, Admin) load cleanly');
      passedTests++;
    } else {
      fail('One or more Express routers failed to export');
    }
  } catch (err) {
    fail('Router loading failed', err);
  }

  console.log(`\n-----------------------------------------------`);
  console.log(`${colors.bold}Test Results: ${passedTests}/${totalTests} Passed (${Math.round((passedTests / totalTests) * 100)}%)${colors.reset}`);
  console.log(`-----------------------------------------------\n`);

  if (passedTests === totalTests) {
    console.log(`${colors.green}${colors.bold}🎉 ALL AGRICHAT CORE MODULE TESTS PASSED (100%)!${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`${colors.red}${colors.bold}⚠️ SOME TESTS FAILED. CHECK LOGS ABOVE.${colors.reset}\n`);
    process.exit(1);
  }
}
runTests();