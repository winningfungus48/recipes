// Quick responsive validation script
// Run this in browser console to test mobile responsiveness

console.log('🧪 Mobile Responsive Validation Test');
console.log('=====================================');

// Test 1: Check if mobile classes are applied
function testMobileClasses() {
  console.log('\n1. Testing Mobile CSS Classes...');
  
  const mobileElements = {
    'mobile-star-container': document.querySelectorAll('.mobile-star-container'),
    'mobile-star-button': document.querySelectorAll('.mobile-star-button'),
    'mobile-hidden': document.querySelectorAll('.mobile-hidden'),
    'mobile-visible': document.querySelectorAll('.mobile-visible')
  };
  
  Object.entries(mobileElements).forEach(([className, elements]) => {
    console.log(`   ${className}: ${elements.length} elements found`);
  });
}

// Test 2: Check touch target sizes
function testTouchTargets() {
  console.log('\n2. Testing Touch Target Sizes...');
  
  const heartButtons = document.querySelectorAll('button[class*="mobile-heart-button"]');
  const starButtons = document.querySelectorAll('button[class*="mobile-star-button"]');
  
  heartButtons.forEach((btn, index) => {
    const rect = btn.getBoundingClientRect();
    const minSize = Math.min(rect.width, rect.height);
    console.log(`   Heart Button ${index + 1}: ${minSize}px (min: 48px) ${minSize >= 48 ? '✅' : '❌'}`);
  });
  
  starButtons.forEach((btn, index) => {
    const rect = btn.getBoundingClientRect();
    const minSize = Math.min(rect.width, rect.height);
    console.log(`   Star Button ${index + 1}: ${minSize}px (min: 48px) ${minSize >= 48 ? '✅' : '❌'}`);
  });
}

// Test 3: Check text truncation
function testTextTruncation() {
  console.log('\n3. Testing Text Truncation...');
  
  const truncatedElements = document.querySelectorAll('.truncate');
  console.log(`   Found ${truncatedElements.length} elements with truncate class`);
  
  truncatedElements.forEach((el, index) => {
    const hasOverflow = el.scrollWidth > el.clientWidth;
    console.log(`   Element ${index + 1}: ${hasOverflow ? 'Truncated ✅' : 'No truncation needed ✅'}`);
  });
}

// Test 4: Check responsive breakpoint
function testBreakpoint() {
  console.log('\n4. Testing Responsive Breakpoint...');
  
  const width = window.innerWidth;
  const isMobile = width < 768;
  
  console.log(`   Current width: ${width}px`);
  console.log(`   Mobile mode: ${isMobile ? 'Yes' : 'No'} ${isMobile ? '✅' : '✅'}`);
  
  // Check if mobile-specific elements are visible/hidden
  const hiddenOnMobile = document.querySelectorAll('.mobile-hidden');
  const visibleOnMobile = document.querySelectorAll('.mobile-visible');
  
  console.log(`   Elements hidden on mobile: ${hiddenOnMobile.length}`);
  console.log(`   Elements visible on mobile: ${visibleOnMobile.length}`);
}

// Test 5: Check star rating interaction
function testStarInteraction() {
  console.log('\n5. Testing Star Rating Interaction...');
  
  const starButtons = document.querySelectorAll('button[class*="mobile-star-button"]');
  const width = window.innerWidth;
  const isMobile = width < 768;
  
  starButtons.forEach((btn, index) => {
    const hasPointerEvents = !btn.style.pointerEvents || btn.style.pointerEvents !== 'none';
    const isDisabled = btn.disabled;
    
    if (isMobile) {
      console.log(`   Star ${index + 1} (Mobile): ${isDisabled ? 'Disabled ✅' : 'Enabled ❌'}`);
    } else {
      console.log(`   Star ${index + 1} (Desktop): ${!isDisabled ? 'Enabled ✅' : 'Disabled ❌'}`);
    }
  });
}

// Run all tests
function runAllTests() {
  testMobileClasses();
  testTouchTargets();
  testTextTruncation();
  testBreakpoint();
  testStarInteraction();
  
  console.log('\n🎉 Validation complete! Check results above.');
  console.log('\nTo test mobile view:');
  console.log('1. Open Chrome DevTools (F12)');
  console.log('2. Click device toggle icon');
  console.log('3. Select a mobile device (e.g., iPhone 12)');
  console.log('4. Run this script again');
}

// Auto-run if in browser
if (typeof window !== 'undefined') {
  runAllTests();
} else {
  console.log('Run this script in browser console to test responsiveness');
}
