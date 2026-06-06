// ─── Tracking Pixels Service (Snap & TikTok) ───────────────────────────────

// Helper to determine the price based on plan and selected addons
export const getPlanPriceVal = (planId, addons = []) => {
  const hasService = addons.includes('service');
  const hasProctor = addons.includes('proctor');

  let addonType = 'base';
  if (hasService && hasProctor) addonType = 'both';
  else if (hasService) addonType = 'service';
  else if (hasProctor) addonType = 'proctor';

  const pricingMatrix = {
    base: { day: 2.50, week: 10.00, month: 20.00, six_month: 40.00 },
    service: { day: 10.00, week: 35.00, month: 100.00, six_month: 250.00 },
    proctor: { day: 5.00, week: 17.50, month: 30.00, six_month: 60.00 },
    both: { day: 15.00, week: 42.50, month: 130.00, six_month: 310.00 }
  };

  return pricingMatrix[addonType]?.[planId] || 0.00;
};

// 1. Page View event
export const trackPageView = () => {
  // Snap Page View
  if (window.snaptr) {
    try {
      window.snaptr('track', 'PAGE_VIEW');
    } catch (e) {
      console.error('Snap Pixel Page View Error:', e);
    }
  }

  // TikTok Page View
  if (window.ttq) {
    try {
      window.ttq.page();
    } catch (e) {
      console.error('TikTok Pixel Page View Error:', e);
    }
  }
};

// 2. Complete Sign Up / Registration event
export const trackSignUp = (email) => {
  // Snap Sign Up
  if (window.snaptr) {
    try {
      window.snaptr('track', 'SIGN_UP', {
        user_email: email
      });
    } catch (e) {
      console.error('Snap Pixel Sign Up Error:', e);
    }
  }

  // TikTok Complete Registration
  if (window.ttq) {
    try {
      window.ttq.identify({
        email: email
      });
      window.ttq.track('CompleteRegistration', {
        email: email
      });
    } catch (e) {
      console.error('TikTok Pixel Sign Up Error:', e);
    }
  }
};

// 3. Initiate Checkout event
export const trackStartCheckout = (planId, addons = [], email = '') => {
  const price = getPlanPriceVal(planId, addons);

  // Snap Start Checkout
  if (window.snaptr) {
    try {
      window.snaptr('track', 'START_CHECKOUT', {
        price: price,
        currency: 'USD',
        user_email: email || undefined
      });
    } catch (e) {
      console.error('Snap Pixel Start Checkout Error:', e);
    }
  }

  // TikTok Initiate Checkout
  if (window.ttq) {
    try {
      if (email) {
        window.ttq.identify({ email });
      }
      window.ttq.track('InitiateCheckout', {
        value: price,
        currency: 'USD',
        email: email || undefined
      });
    } catch (e) {
      console.error('TikTok Pixel Start Checkout Error:', e);
    }
  }
};

// 4. Complete Purchase / Payment event
export const trackPurchase = (planId = 'week', addons = [], email = '', transactionId = '') => {
  const price = getPlanPriceVal(planId, addons);

  // Snap Purchase
  if (window.snaptr) {
    try {
      window.snaptr('track', 'PURCHASE', {
        price: price,
        currency: 'USD',
        user_email: email || undefined,
        transaction_id: transactionId || undefined
      });
    } catch (e) {
      console.error('Snap Pixel Purchase Error:', e);
    }
  }

  // TikTok Complete Payment
  if (window.ttq) {
    try {
      if (email) {
        window.ttq.identify({ email });
      }
      window.ttq.track('CompletePayment', {
        value: price,
        currency: 'USD',
        email: email || undefined
      });
    } catch (e) {
      console.error('TikTok Pixel Purchase Error:', e);
    }
  }
};
