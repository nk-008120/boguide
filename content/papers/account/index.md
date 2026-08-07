---
title: "Account"
---

Log in to save your Timed Attempt results to the leaderboard. This is entirely optional — every practice question and timed attempt on BiOrchive works exactly the same without an account.

<div id="papers-account-root" class="papers-account-root">

<section id="account-unconfigured" class="account-screen" hidden>
  <p>The login system isn't configured on this environment yet, so accounts aren't available here right now. Everything else on BiOrchive still works as usual.</p>
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
  <p>Logged in as <strong id="account-display-name"></strong>.</p>
  <p class="account-hint">Your display name is what appears on the leaderboard.</p>
  <button type="button" id="account-signout-btn" class="papers-nav-btn">Log Out</button>
</section>

</div>

<script src="/js/papers-account.js" defer></script>
