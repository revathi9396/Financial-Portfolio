exports.config = {
  framework: 'jasmine',
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['src/**/*.e2e-spec.ts'],
  capabilities: {
    browserName: 'chrome'
  },
  onPrepare: () => {
    require('ts-node').register({
      project: 'e2e/tsconfig.e2e.json'
    });
  },
  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  }
};