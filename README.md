# First install all Dependencies
    "Install_Dependencies":"npm install",

# Then Install Playwright browers
    "Install_Playwright_Browsers":"npx playwright install",

#  Then the Playwright UI Test- a Cucumber report will be generated once completed   
    "Test_UI": "npx cucumber-js",
#   Then run all API tests   
    "Test_ALL_API": "jest --config=jest.config.js",
#   Then run  Unmocked real api tests    
    "Test_API_Real": "npx jest API_Tests/__tests__/petfinder.real.test.js",
#   Then run mocked api tests    
    "Test_API_Mocked": "npx jest API_Tests/__tests__/petfinder.mock.test.js",

#   Then run K6 Performance Test
    "Test_API_K6":"k6 run API_Performances_Tests/k6/petfinder_performance.js"