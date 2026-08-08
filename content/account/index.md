---
title: "Account"
aliases:
  - /papers/account/
layout: "wide"
---

<div id="papers-account-root" class="account-split">

<div class="account-branding-panel">
  <img src="/logo.png" alt="" class="account-branding-logo">
  <h1>Your BiOGuide account</h1>
  <p class="account-branding-tagline">One login for everything BiOGuide is building beyond the study notes.</p>
  <ul class="account-branding-points">
    <li><span class="account-branding-icon">🏆</span><div><strong>Leaderboard</strong><br>Save Timed Attempt results and see how you stack up, per round and overall.</div></li>
    <li><span class="account-branding-icon">🙂</span><div><strong>Profile</strong><br>Pick an avatar and share your country, education level, and a short bio.</div></li>
    <li><span class="account-branding-icon">📖</span><div><strong>Articles</strong><br>Full access to every article, not just the teaser.</div></li>
  </ul>
  <p class="account-branding-optional">Everything else on BiOGuide — practice questions, timed attempts, topic notes — still works exactly the same without an account.</p>
</div>

<div class="account-form-panel">

<section id="account-unconfigured" class="account-screen" hidden>
  <p>The login system isn't configured on this environment yet, so accounts aren't available here right now. Everything else on BiOGuide still works as usual.</p>
</section>

<section id="account-loading" class="account-screen">
  <p>Loading…</p>
</section>

<section id="account-logged-out" class="account-screen" hidden>
  <div class="account-tabs" role="tablist">
    <button type="button" class="account-tab active" data-tab="login" role="tab">Log In</button>
    <button type="button" class="account-tab" data-tab="signup" role="tab">Sign Up</button>
  </div>

  <form id="account-login-form" class="account-form">
    <label>Email<input type="email" name="email" required autocomplete="email"></label>
    <label>Password<input type="password" name="password" required autocomplete="current-password"></label>
    <button type="submit" class="papers-nav-btn papers-nav-next">Log In</button>
    <button type="button" id="account-forgot-btn" class="account-link-btn">Forgot password?</button>
    <div class="account-msg" id="account-login-msg"></div>
  </form>

  <form id="account-signup-form" class="account-form" hidden>
    <label>Display name<input type="text" name="displayName" required maxlength="40" placeholder="Shown on the leaderboard"></label>
    <label>Email<input type="email" name="email" required autocomplete="email"></label>
    <label>Password<input type="password" name="password" required minlength="6" autocomplete="new-password"></label>
    <button type="submit" class="papers-nav-btn papers-nav-next">Sign Up</button>
    <div class="account-msg" id="account-signup-msg"></div>
  </form>

  <form id="account-reset-form" class="account-form" hidden>
    <p>Enter your email and we'll send a password reset link.</p>
    <label>Email<input type="email" name="email" required autocomplete="email"></label>
    <button type="submit" class="papers-nav-btn papers-nav-next">Send Reset Link</button>
    <button type="button" id="account-reset-cancel-btn" class="account-link-btn">Back to log in</button>
    <div class="account-msg" id="account-reset-msg"></div>
  </form>
</section>

<section id="account-recovery" class="account-screen" hidden>
  <h2>Set a new password</h2>
  <form id="account-new-password-form" class="account-form">
    <label>New password<input type="password" name="password" required minlength="6" autocomplete="new-password"></label>
    <button type="submit" class="papers-nav-btn papers-nav-next">Update Password</button>
    <div class="account-msg" id="account-recovery-msg"></div>
  </form>
</section>

<section id="account-logged-in" class="account-screen" hidden>
  <p class="account-loggedin-greeting">Logged in as <strong id="account-display-name"></strong>.</p>

  <h3>Avatar</h3>
  <p class="account-hint">Pick a profile picture — shown on the leaderboard and in the navbar.</p>
  <div id="account-avatar-grid" class="account-avatar-grid"></div>
  <div class="account-msg" id="account-avatar-msg"></div>

  <h3>Profile</h3>
  <form id="account-profile-form" class="account-form">
    <label>Country
      <select name="country" id="account-country-select"></select>
    </label>
    <label>Education level
      <select name="educationLevel">
        <option value="">Prefer not to say</option>
        <option value="grade-8">Grade 8</option>
        <option value="grade-9">Grade 9</option>
        <option value="grade-10">Grade 10</option>
        <option value="grade-11">Grade 11</option>
        <option value="grade-12">Grade 12</option>
        <option value="undergraduate">Undergraduate</option>
        <option value="graduate">Graduate</option>
        <option value="other">Other</option>
      </select>
    </label>
    <label>About <span class="account-hint">(max 50 words, shown on your profile only)</span>
      <textarea name="about" id="account-about-input" rows="4" maxlength="400"></textarea>
      <span class="account-word-count" id="account-about-count">0 / 50 words</span>
    </label>
    <button type="submit" class="papers-nav-btn papers-nav-next">Save Profile</button>
    <div class="account-msg" id="account-profile-msg"></div>
  </form>

  <button type="button" id="account-signout-btn" class="papers-nav-btn account-signout-btn">Log Out</button>
</section>

</div>
</div>

<script src="/js/papers-account.js" defer></script>
