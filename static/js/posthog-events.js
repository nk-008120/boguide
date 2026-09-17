(function () {
  'use strict';

  function ph() {
    return (window.posthog && window.posthog.__loaded !== false) ? window.posthog : null;
  }

  function capture(name, props) {
    var p = ph();
    if (!p || !p.capture) return;
    p.capture(name, props || {});
  }

  function trackSignup() {
    capture('signup_completed');
  }

  function trackBioclashAttemptStarted(paperId) {
    capture('bioclash_attempt_started', { paper_id: paperId });
  }

  function trackBioclashAttemptSubmitted(paperId) {
    capture('bioclash_attempt_submitted', { paper_id: paperId });
  }

  function trackPaperAttemptSubmitted(olympiad, year, roundId, scorePct) {
    capture('paper_attempt_submitted', { olympiad: olympiad, year: year, round_id: roundId, score_pct: scorePct });
  }

  function trackContributionSubmitted(type) {
    capture('contribution_submitted', { type: type });
  }

  function trackDashboardRecommendationClicked(subjectLink) {
    capture('dashboard_recommendation_clicked', { subject_link: subjectLink || null });
  }

  window.PostHogEvents = {
    trackSignup: trackSignup,
    trackBioclashAttemptStarted: trackBioclashAttemptStarted,
    trackBioclashAttemptSubmitted: trackBioclashAttemptSubmitted,
    trackPaperAttemptSubmitted: trackPaperAttemptSubmitted,
    trackContributionSubmitted: trackContributionSubmitted,
    trackDashboardRecommendationClicked: trackDashboardRecommendationClicked
  };

  if (window.location.pathname.indexOf('/papers/contribute/') === 0) {
    capture('contribute_page_viewed');
  }
  if (window.location.pathname.indexOf('/dashboard/') === 0) {
    capture('dashboard_viewed');
  }

  if (window.PapersAuth) {
    window.PapersAuth.getSession().then(function (session) {
      if (session && session.user) {
        var p = ph();
        if (p && p.identify) p.identify(session.user.id);
      }
    });
    window.PapersAuth.onChange(function (session) {
      var p = ph();
      if (!p) return;
      if (session && session.user) {
        if (p.identify) p.identify(session.user.id);
      } else if (p.reset) {
        p.reset();
      }
    });
  }
})();
